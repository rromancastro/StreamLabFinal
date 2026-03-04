"use client";
import { useEffect, useRef, useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { IoTriangleSharp } from "react-icons/io5";
import { crearPago, getAllReservas, subirReserva, verSalas } from "../helpers/apiCall";
import { useAppContext } from "../context/AppContext";

export const TurneraMensual = ({ setTurnera, isMobile}) => {

    const {setTurneraSeleccionada} = useAppContext();

    //fechas ocupadas
    const [reservas, setReservas] = useState([]);
    const [diasReservados, setDiasReservados] = useState([]);
    const [horariosReservados, setHorariosReservados] = useState([[], [], [], []]); // 4 bloques
    // Registramos el precio del combo y los ids generados para consolidar la preferencia de pago.
    const [precioCombo, setPrecioCombo] = useState(0);
    const [reservasCreadas, setReservasCreadas] = useState([]);
    const [externalReference, setExternalReference] = useState('');

    useEffect(() => {
        getAllReservas().then(data => setReservas(data.data.filter(reserva => reserva.estado !== 'pendiente')));
    }, []);

    useEffect(() => {
        setDiasReservados(reservas.map(reserva => reserva.fecha_inicio.slice(0, 10)));
    }, [reservas]);

    // Traemos el precio vigente del combo mensual para usarlo en el resumen y el pago.
    useEffect(() => {
        verSalas()
            .then((data) => {
                const combo = Number(data?.data?.[0]?.precio_combo) || 0;
                setPrecioCombo(combo);
            })
            .catch((err) => {
                console.error("Error al obtener salas para combo mensual:", err);
            });
    }, []);

    const [fechaSeleccionada, setFechaSeleccionada] = useState([new Date(), new Date(), new Date(), new Date()]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [horarioSeleccionado, setHorarioSeleccionado] = useState([1, 1, 1, 1]);
    const [showCalendar, setShowCalendar] = useState([false, false, false, false]);
    const [showHorarios, setShowHorarios] = useState([false, false, false, false]);
    // Estados dedicados a la integracion con Mercado Pago (mismo patron que TurneraSimple).
    const paymentBrickController = useRef(null);
    const [isPaymentReady, setIsPaymentReady] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [preferenceId, setPreferenceId] = useState(null);
    const [isPreparingPayment, setIsPreparingPayment] = useState(false);
    const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? "APP_USR-c14c2245-05ab-47af-8fb9-f0682ceaf3e9";
    const MP_SITE_ID = process.env.NEXT_PUBLIC_MP_SITE_ID ?? "MLA";
    const PAYMENT_BRICK_CONTAINER_ID = "paymentBrick_container_mensual";
    const HARDCODED_PREFERENCE_ID = "1111";

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const horarios = [
        "09:00-11:00",
        "11:30-13:30",
        "14:00-16:00",
        "16:30-18:30",
        "19:00-21:00",
    ];


    const horas = Array.from({ length: 11 }, (_, i) => i + 9);
    const [bloques, setBloques] = useState([
        { inicio: null, fin: null, paso: "inicio" },
        { inicio: null, fin: null, paso: "inicio" },
        { inicio: null, fin: null, paso: "inicio" },
        { inicio: null, fin: null, paso: "inicio" },
    ]);

    const horasOcupadas = (fecha) => {
        const iso = fecha.toISOString().slice(0,10);
        return reservas
            .filter(r => r.fecha_inicio.slice(0,10) === iso)
            .flatMap(r => {
            const start = Number(r.fecha_inicio.slice(11,13));
            const end = r.fecha_fin
                ? Number(r.fecha_fin.slice(11,13))
                : start + 1;
            return Array.from({ length: end - start }, (_, i) => start + i);
            });
    };

    const puedeSerInicio = (fecha, hora) => {
        const ocupadas = horasOcupadas(fecha);
        if (ocupadas.includes(hora)) return false;
        if (ocupadas.includes(hora + 1)) return false;
        if (!horas.includes(hora + 1)) return false;

        const now = new Date();
        if (fecha.toISOString().slice(0,10) === now.toISOString().slice(0,10)) {
            if (hora <= now.getHours()) return false;
        }

        return true;
    };

    const primerInicioDisponible = (fecha) => {
        for (const h of horas) {
            if (puedeSerInicio(fecha, h)) {
                return h;
            }
        }
        return null;
    };

    // ------------------------------------------------------------------
    // helper para comprobar si un determinado slot está libre en una fecha
    const slotAvailableOnDate = (fecha, slot) => {
        const fechaISO = fecha.toISOString().slice(0,10);
        const [startStr, endStr] = slot.split('-'); // "11:30","13:30"
        const now = new Date();

        // si es hoy y ya pasaron las 18hs, consideramos que no hay ningún turno
        if (fechaISO === now.toISOString().slice(0,10) && now.getHours() >= 18) {
            return false;
        }

        // si es hoy y el inicio ya pasó, no está disponible
        if (fechaISO === now.toISOString().slice(0,10)) {
            const nowHHMM = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
            if (startStr <= nowHHMM) return false;
        }

        // comprobar solapamientos con reservas del día
        const reservasDelDia = reservas.filter(r => r.fecha_inicio.slice(0,10) === fechaISO);
        const startDT = new Date(`${fechaISO}T${startStr}:00`);
        const endDT = new Date(`${fechaISO}T${endStr}:00`);
        for (const r of reservasDelDia) {
            const rStart = new Date(r.fecha_inicio.replace(' ', 'T'));
            const rEnd = r.fecha_fin ? new Date(r.fecha_fin.replace(' ', 'T')) : new Date(rStart.getTime() + 60*60*1000);
            if (rStart < endDT && rEnd > startDT) return false;
        }
        return true;
    };

    // determina si existe al menos un horario libre para una fecha concreta
    const hayHorariosDisponibles = (fecha) => {
        if (!fecha) return false;
        for (const h of horarios) {
            if (slotAvailableOnDate(fecha, h)) return true;
        }
        return false;
    };

    const clickHora = (semana, hora) => {
        setBloques(prev => {
            const copy = [...prev];
            const b = copy[semana];

            if (b.paso === "inicio") {
            if (!puedeSerInicio(fechaSeleccionada[semana], hora)) return prev;
            copy[semana] = {
                inicio: hora,
                fin: hora + 2,
                paso: "fin"
            };
            return copy;
            }

            if (hora <= b.inicio) return prev;

            copy[semana] = {
            ...b,
            fin: hora + 1,
            paso: "inicio"
            };
            return copy;
        });
    };



    // costo final del paquete mensual 
    const [totalCombo, setTotalCombo] = useState(0);
    const horasTotales = bloques.reduce((acum, bloque) => acum + bloque.fin - bloque.inicio, 0);
    console.log(horasTotales);
    
    useEffect(() => {
        setTotalCombo(horasTotales > 8 ? precioCombo * 8 + ((precioCombo * 0.9) * (horasTotales - 8)) : precioCombo * horasTotales);
        
    }, [precioCombo, bloques]);
    

// ...existing code...
    useEffect(() => {
        const MAX_DAYS = 30;
        let attempts = 0;

        // Empezamos con la fecha[0] actual (puede haber sido modificada por el usuario)
        let base = new Date(fechaSeleccionada[0]);
        let baseChanged = false;

        // Si el primer día NO tiene ningún slot disponible, avanzamos solo el primer día hasta MAX_DAYS
        let firstHasSlot = false;
        attempts = 0;
        while (attempts < MAX_DAYS && !firstHasSlot) {
            for (const h of horarios) {
                if (slotAvailableOnDate(base, h)) { firstHasSlot = true; break; }
            }
            if (!firstHasSlot) {
                base.setDate(base.getDate() + 1);
                baseChanged = true;
            }
            attempts++;
        }

        // Si avanzamos base, construimos las 4 fechas relativas a la nueva base.
        // Si no avanzamos, respetamos las fechas que el usuario haya seleccionado (fechaSeleccionada).
        const candidateFechas = baseChanged
            ? [
                new Date(base),
                (() => { const d = new Date(base); d.setDate(d.getDate() + 7); return d; })(),
                (() => { const d = new Date(base); d.setDate(d.getDate() + 14); return d; })(),
                (() => { const d = new Date(base); d.setDate(d.getDate() + 21); return d; })()
              ]
            : [
                new Date(fechaSeleccionada[0]),
                new Date(fechaSeleccionada[1]),
                new Date(fechaSeleccionada[2]),
                new Date(fechaSeleccionada[3])
              ];

        // calcular horariosReservados para cada fecha (HH)
        const newHorarios = candidateFechas.map(fecha => {
            const fechaISO = fecha.toISOString().slice(0,10);
            const dia = reservas.filter(r => r.fecha_inicio.slice(0,10) === fechaISO);
            return dia.map(d => d.fecha_inicio.slice(11,13).padStart(2,'0'));
        });
        setHorariosReservados(newHorarios);

        // para cada semana, seleccionar primer horario disponible (no ocupado, no pasado)
        const nuevosHorariosSeleccionados = candidateFechas.map((fecha) => {
            for (let i = 0; i < horarios.length; i++) {
                const h = horarios[i];
                if (slotAvailableOnDate(fecha, h)) return i + 1;
            }
            return null;
        });
        setHorarioSeleccionado(nuevosHorariosSeleccionados);

        // si cambiamos la base, actualizamos las fechas en el estado (solo la primera y sus 3 siguientes)
        if (baseChanged) {
            setFechaSeleccionada(candidateFechas);
            setCurrentMonth(new Date(base)); // ensure calendar shows nueva base
        }

        setBloques(prev => {
  return candidateFechas.map((fecha, i) => {
    const inicio = primerInicioDisponible(fecha);

    if (inicio === null) {
      return { inicio: 8, fin: null, paso: "inicio" };
    }

    return {
      inicio,
      fin: inicio + 2,
      paso: "inicio"
    };
  });
});

    }, [fechaSeleccionada, reservas, diasReservados]);
// ...existing code...

    //controlar calendario
    const prevMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    //flow
    const [turneraStep, setTurneraStep] = useState(1);

    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const verificarDatos = () => {
        if (userEmail === '' || userEmail.includes('@') === false || userEmail.includes('.') === false) {
            setErrorMessage('El eMail ingresado no es válido');
        } else if (userName.length < 3) {
            setErrorMessage('El nombre ingresado no es válido');
        } else if (userPhone.length < 10) {
            setErrorMessage('El teléfono ingresado no es válido');
        } else {
            setTurneraStep(4);
        }
    }

    function obtenerSemana(fecha) {
        const f = new Date(fecha);
        const primerDiaDelAno = new Date(f.getFullYear(), 0, 1);
        const diasTranscurridos = Math.floor((f - primerDiaDelAno) / (24 * 60 * 60 * 1000));

        const numeroSemana = Math.ceil((diasTranscurridos + (primerDiaDelAno.getDay() + 7) % 7) / 7);

        return `${f.getFullYear()}-${numeroSemana}`;
    }

    //cerrar al hacer click afuera
    const calendarRef = useRef(null);
    const horariosRef = useRef(null);

    useEffect(() => {
    const handleClickOutside = (event) => {
        if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        !event.target.closest(".seleccionarFechaContainer")
        ) {
        setShowCalendar([false, false, false, false]);
        }

        if (
        horariosRef.current &&
        !horariosRef.current.contains(event.target) &&
        !event.target.closest(".seleccionarFechaContainer")
        ) {
        setShowHorarios([false, false, false, false]);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);


    //semanas correspondientes
    useEffect(() => {
        const fechaActual = fechaSeleccionada[0];
        let fecha2 = new Date(fechaActual);
        let fecha3 = new Date(fechaActual);
        let fecha4 = new Date(fechaActual);
        fecha2.setDate(fecha2.getDate() + 7);
        fecha3.setDate(fecha3.getDate() + 14);
        fecha4.setDate(fecha4.getDate() + 21);
        setFechaSeleccionada([fechaActual, fecha2, fecha3, fecha4]);
    }, [fechaSeleccionada[0]])

    const [showErrorToast, setShowErrorToast] = useState(false);

    const clearPagoMensualState = () => {
        setReservasCreadas([]);
        setPreferenceId(null);
        setExternalReference('');
        setIsPaymentReady(false);
        setPaymentError('');
        if (paymentBrickController.current) {
            paymentBrickController.current.unmount();
            paymentBrickController.current = null;
        }
        if (typeof window !== "undefined") {
            window.paymentBrickMensualController = null;
        }
    };

    // Creamos la reserva mensual en un único request y recibimos la preferencia lista para Mercado Pago.
    const handleSubmitReservas = async () => {
        if (!userEmail || !userName) {
            setPaymentError("Completa tus datos antes de continuar con el pago mensual.");
            setTurneraStep(2);
            return;
        }

        if (reservasCreadas.length === 4 && preferenceId) {
            setTurneraStep(5);
            return;
        }

        setPaymentError('');

        if (precioCombo <= 0) {
            setPaymentError("El precio del combo no está disponible, intenta nuevamente en unos segundos.");
            setIsPreparingPayment(false);
            return;
        }
        setIsPreparingPayment(true);

        try {
            const turnosPayload = fechaSeleccionada.map((fecha, index) => {
                 const { inicio, fin } = bloques[index];

  if (inicio === null || fin === null || fin - inicio < 2) {
    throw new Error("Cada semana debe tener mínimo 2 horas.");
  }

  const fechaISO = fecha.toISOString().slice(0, 10); 

                return {
                    fecha_inicio: `${fechaISO} ${inicio.toString().padStart(2, '0')}:00:00`,
                    fecha_fin: `${fechaISO} ${fin.toString().padStart(2, '0')}:00:00`,
                    titulo: 'Sesion de Streaming',
                    descripcion: 'Stream de videojuegos',
                    tipo_stream: 'streaming',
                    observaciones: 'ninguna',
                    estado: 'pendiente',
                    nombre: userName,
                    telefono: userPhone,
                    precio_total: totalCombo
                };
            });

            const response = await subirReserva('/reservas', 'POST', {
                action: 'crear_reserva_mensual',
                sala_id: 1,
                cliente_id: 1,
                email: userEmail,
                titulo: 'Sesion de Streaming',
                descripcion: 'Stream de videojuegos',
                tipo_stream: 'streaming',
                observaciones: 'Combo mensual',
                estado: 'pendiente',
                nombre: userName,
                telefono: userPhone,
                precio_por_turno: totalCombo,
                turnos: turnosPayload
            });

            if (!response?.success || !response?.data?.preference_id) {
                throw new Error(response?.message ?? "No se pudo preparar la preferencia del combo mensual.");
            }

            const ids = response?.data?.reservas ?? [];
            setReservasCreadas(ids);
            setPreferenceId(response.data.preference_id);
            setExternalReference(response.data.external_reference ?? ids.join('-'));
            setTurneraStep(5);
        } catch (error) {
            console.error("Error generando combo mensual:", error);
            setPaymentError(error?.message ?? "Ocurrio un error al preparar el pago mensual.");
        } finally {
            setIsPreparingPayment(false);
        }
    };

    // Montamos y desmontamos el Payment Brick cuando el paso 5 (pago) esta activo.
    useEffect(() => {
        if (turneraStep !== 5) {
            if (paymentBrickController.current) {
                paymentBrickController.current.unmount();
                paymentBrickController.current = null;
                window.paymentBrickMensualController = null;
            }
            setIsPaymentReady(false);
            return;
        }

        if (typeof window === "undefined") {
            return;
        }

        if (!window.MercadoPago) {
            setPaymentError("No pudimos cargar Mercado Pago. Refresca la pagina e intenta nuevamente.");
            return;
        }

        if (!MP_PUBLIC_KEY || MP_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
            setPaymentError("Configura la clave publica de Mercado Pago antes de continuar.");
            return;
        }

        if (!preferenceId) {
            // Esperamos a que la preferencia se genere via handleSubmitReservas.
            return;
        }

        if (HARDCODED_PREFERENCE_ID === "1111" && preferenceId === HARDCODED_PREFERENCE_ID) {
            console.warn("HARDCODED_PREFERENCE_ID usa un valor de prueba. Reemplazalo por un preferenceId real antes de salir a produccion.");
        }

        setPaymentError('');
        setIsPaymentReady(false);

        const mp = new window.MercadoPago(MP_PUBLIC_KEY, { locale: "es-AR", siteId: MP_SITE_ID });
        const bricksBuilder = mp.bricks();

        const renderBrick = async () => {
            try {
                const controller = await bricksBuilder.create("payment", PAYMENT_BRICK_CONTAINER_ID, {
                    initialization: {
                        amount: totalCombo,
                        preferenceId: preferenceId,
                    },
                    customization: {
                        visual: {
                            style: {
                                theme: "dark",
                            },
                        },
                        paymentMethods: {
                            mercadoPago: "all",
                        },
                    },
                    callbacks: {
                        onSubmit: ({ selectedPaymentMethod, formData }) => {
                            return new Promise((resolve, reject) => {
                                if (window.paymentBrickMensualController) {
                                    window.paymentBrickMensualController.unmount();
                                    window.paymentBrickMensualController = null;
                                }

                                const payload = {
                                    ...formData,
                                    selectedPaymentMethod: selectedPaymentMethod ?? 'mercadopago',
                                    transactionAmount: totalCombo,
                                    transaction_amount: totalCombo,
                                    titulo: 'Reserva Combo Mensual',
                                    email: formData?.email ?? formData?.payer?.email ?? userEmail,
                                    reserva_id: externalReference,
                                    reservas: reservasCreadas,
                                    tipo_turno: 'mensual',
                                    nombre: userName,
                                    telefono: userPhone,
                                };

                                crearPago('', 'POST', payload)
                                    .then((response) => {
                                        if (!response?.success) {
                                            setPaymentError(response?.message ?? "Ocurrio un error al procesar el pago. Intentalo nuevamente.");
                                            reject(new Error(response?.message ?? 'Pago rechazado'));
                                            return;
                                        }
                                        setTurneraStep(1);
                                        resolve();
                                    })
                                    .catch((error) => {
                                        console.error("Error enviando pago mensual:", error);
                                        setPaymentError("Ocurrio un error al procesar el pago. Intentalo nuevamente.");
                                        reject(error);
                                    });
                            });
                        },
                        onError: (error) => {
                            console.error("Payment Brick mensual error:", error);
                            setPaymentError("Ocurrio un error al procesar el pago. Intentalo nuevamente.");
                        },
                        onReady: () => {
                            setIsPaymentReady(true);
                        },
                    },
                });

                paymentBrickController.current = controller;
                window.paymentBrickMensualController = controller;
            } catch (error) {
                console.error("Error creando el Payment Brick mensual:", error);
                setPaymentError("No pudimos cargar el formulario de pago. Actualiza la pagina e intenta nuevamente.");
            }
        };

        renderBrick();

        return () => {
            if (paymentBrickController.current) {
                paymentBrickController.current.unmount();
                paymentBrickController.current = null;
                window.paymentBrickMensualController = null;
            }
        };
    }, [turneraStep, preferenceId, MP_PUBLIC_KEY, totalCombo, externalReference, reservasCreadas]);

    const resetMensualFlow = () => {
        clearPagoMensualState();
        setIsPreparingPayment(false);
        setTurneraStep(1);
    };

    return (
        <div style={{height: isMobile ? '735px' : null}} id="turneraContainer">
            {
                showErrorToast && <div onClick={() => setShowErrorToast(false)} id="errorToastContainer">
                    <p>Ups, sólo podés reservar 1 turno por semana.</p>
                </div>
            }
            {/* STEP 1 */}
            {turneraStep === 1 &&
                <>
                    <h2 className="turneraH2">RESERVÁ<br />TU TURNO,<br />NO DUERMAS.</h2>
                    <div className="turneraUtilities">
                        <div className="selectersContainer selectersContainerMensual">
                            {[0, 1, 2, 3].map(i => {
                                const diaSeleccionado1 = fechaSeleccionada[i].getDate();
                                const mesSeleccionado2 = fechaSeleccionada[i].getMonth();

                                return (<div className="fechaContainerMensual" key={i}>
                                    <p className="fechaContainerMensualLabel">SEMANA {i + 1}</p>
                                    <div className="fechaContainer">
                                        {/* Fecha */}
                                        <p className="fechaContainerLabel">Fecha</p>
                                        <div className="seleccionarFechaContainer">
                                            <p>{diaSeleccionado1}.{meses[mesSeleccionado2].toUpperCase().slice(0, 3)}</p>
                                            <IoTriangleSharp
                                                style={{ rotate: showCalendar[i] ? '0deg' : '180deg' }}
                                                onClick={() => {
                                                    const newShow = [...showCalendar];
                                                    newShow[i] = !newShow[i];
                                                    setShowCalendar(newShow);
                                                }}
                                                className="seleccionarFechaIcon"
                                            />
                                        </div>
                                    </div>

                                        {/* Turnos */}
                                    <div className="fechaContainer">
                                        <p className="fechaContainerLabel">Turnos</p>
                                        <div className="seleccionarFechaContainer">
                                            <p>{bloques[i].inicio}-{bloques[i].fin} hs</p>
                                            <IoTriangleSharp
                                                style={{ rotate: showHorarios[i] ? '0deg' : '180deg' }}
                                                onClick={() => {
                                                    const newShow = [...showHorarios];
                                                    newShow[i] = !newShow[i];
                                                    setShowHorarios(newShow);
                                                }}
                                                className="seleccionarFechaIcon"
                                            />
                                        </div>
                                    </div>

                                        {/* Calendario */}
                                        {showCalendar[i] &&
                                            <div ref={calendarRef} className="calendarContainer">
                                                <div className="calendarNav">
                                                    <IoTriangleSharp onClick={prevMonth} className="calendarRowsIcon" style={{ rotate: '-90deg' }} size={35} />
                                                    <p>
                                                        {currentMonth
                                                            .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                                                            .replace(' de ', ' ')
                                                            .replace(/^\w/, (c) => c.toUpperCase())}
                                                    </p>
                                                    <IoTriangleSharp onClick={nextMonth} className="calendarRowsIcon" style={{ rotate: '90deg' }} size={35} />
                                                </div>
                                                <Calendar
                                                    onChange={(date) => {
                                                        if (i !== 0) {
                                                            const nuevaSemana = obtenerSemana(date);

                                                            const hayConflicto = fechaSeleccionada.some((f, idx) => {
                                                                if (idx === i) return false;
                                                                return obtenerSemana(f) === nuevaSemana;
                                                            });

                                                            if (hayConflicto) {
                                                                setShowErrorToast(true)
                                                                return;
                                                            }
                                                        }
                                                        const nuevasFechas = [...fechaSeleccionada];
                                                        nuevasFechas[i] = date;
                                                        setFechaSeleccionada(nuevasFechas);
                                                    }}

                                                    value={fechaSeleccionada[i]}
                                                    showNavigation={false}
                                                    minDate={new Date()}
                                                    activeStartDate={currentMonth}
                                                    tileDisabled={({ date: currentDate, view }) => {
                                                        if (view === "month") {
                                                            // fuera del mes actual
                                                            if (currentDate.getMonth() !== currentMonth.getMonth()) return true;

                                                            const today = new Date();
                                                            today.setHours(0,0,0,0);

                                                            // no permitir días pasados
                                                            if (currentDate < today) return true;

                                                            // si el día no tiene ningún horario disponible, bloquearlo
                                                            if (!hayHorariosDisponibles(currentDate)) return true;

                                                            // para el día actual: a partir de las 18hs se bloquea
                                                            if (currentDate.getTime() === today.getTime()) {
                                                                if (new Date().getHours() >= 18) return true;
                                                            }
                                                            return false;
                                                        }
                                                        return false;
                                                    }}
                                                    tileClassName={({ date: currentDate, view }) => {
                                                        if (view !== "month") return null;
                                                        const today = new Date();
                                                        today.setHours(0,0,0,0);
                                                        const dateISO = currentDate.toISOString().slice(0,10);
                                                        if (currentDate.getMonth() !== currentMonth.getMonth()) return 'rc-other-month';
                                                        if (currentDate < today) return 'rc-past-day';
                                                        if (diasReservados.includes(dateISO)) return 'rc-reserved-day';
                                                        if (dateISO === fechaSeleccionada[i].toISOString().slice(0,10)) return 'rc-selected-day';
                                                        if (dateISO === today.toISOString().slice(0,10)) return 'rc-today-day';
                                                        return null;
                                                    }}
                                                />
                                            </div>
                                        }

                                        {/* Horarios desplegables */}
{showHorarios[i] &&
  <div className="turnosContainer">
    { <>
        <p style={{alignSelf: 'flex-start'}}>Seleccioná el {bloques[i].paso} de turno</p>
        <div>
    {horas.map((h) => {

      const bloque = bloques[i];

      const selected =
        bloque.inicio !== null &&
        h >= bloque.inicio &&
        h < bloque.fin;

      const ocupada = horasOcupadas(fechaSeleccionada[i]).includes(h);

      const inicioInvalido =
        bloque.paso === "inicio" &&
        !puedeSerInicio(fechaSeleccionada[i], h);

      const ahora = new Date();
      const esHoy =
        fechaSeleccionada[i].toDateString() === ahora.toDateString();

      const horaPasada =
        esHoy && h <= ahora.getHours();

      const disabled =
        ocupada || horaPasada || inicioInvalido;

      return (
        <div
          key={h}
          onClick={() => !disabled && clickHora(i, h)}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            backgroundColor: ocupada
              ? "#5A189A99"
              : selected
              ? "#5A189A"
              : "transparent",
            borderRadius:
              bloque.inicio === h
                ? "8px 0 0 8px"
                : bloque.fin - 1 === h
                ? "0px 8px 8px 0px"
                : null
          }}
        >
          <p
            style={{
              color: selected
                ? "#FFFFFF"
                : horaPasada
                ? "#555"
                : ocupada
                ? "#7B2CBF"
                : "#FFFFFF"
            }}
          >
            {h}
          </p>
        </div>
      );
    })}
    </div>
    <p id="p20hs">
                            20
                        </p>
            <p>El tiempo mínimo por turno es de <span>2hs</span>, podés agregar más tiempo si necesitas. Las horas que agregues tiene un <span>10% de descuento.</span> </p>

    </>}
  </div>
}

                                    </div>
                                )
                            })}
                        </div>

                        <div className="selectTipoTurno">
                            <div className="selectTurno">
                                <button><div onClick={() => {setTurnera('simple'); setTurneraSeleccionada('simple')}} style={{ backgroundColor: '#8c8c8cff' }}></div></button>
                                <p>
                                    TURNO
                                    <br />
                                    SIMPLE
                                </p>
                            </div>
                            <div className="selectTurno">
                                <button><div style={{ backgroundColor: '#e0aaffff' }}></div></button>
                                <p>
                                    COMBO
                                    <br />
                                    MENSUAL
                                </p>
                            </div>
                        </div>
                        <button className="buttonReservar" onClick={() => setTurneraStep(3)}>Reservar</button>
                    </div>
                </>
            }

            {/* STEP 2 */}
            {turneraStep === 2 && <>
                <h2 className="turneraStep2Title">
                    TUS
                    <br />
                    DATOS
                </h2>
                <div className="turneraStep2Inputs">
                    <p>eMail</p>
                    <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="tumail@ejemplo.com" />
                </div>
                <div className="turneraStep2Inputs">
                    <p>Nombre</p>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Tu nombre" />
                </div>
                <p className="turneraErrorMessage">{errorMessage}</p>
                <div className="turneraStep2Buttons">
                    <button onClick={() => setTurneraStep(1)}>Cancelar</button>
                    <button onClick={() => verificarDatos()}>Continuar</button>
                </div>
            </>}

            {/* STEP 3 */}
            {turneraStep === 3 && <>
                <h2 className="turneraStep2Title">
                    CONFIRMAR
                    <br />
                    RESERVA
                </h2>
                <div className="turneraStep3Fecha">
                    <div className="turneraStep3FechaTurnosContainer">
                        <p className="turneraStep3FechaTurnoLabel">COMBO<br />MENSUAL</p>
                        <div className="turneraStep3FechaTurnos">
                            {fechaSeleccionada.map((fecha, i) => (
                                <div key={i} className="turneraStep3FechaTurno">
                                    <div className="turneraStep3FechaContainer">
                                            <p>Mes <span>{meses[fecha.getMonth()]}</span></p>
                                            <p>Fecha <span>{fecha.getDate()}</span></p>
                                            <p>Turno <span>{bloques[i].inicio}-{bloques[i].fin} hs</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="turneraStep2Inputs">
                            <p>Nombre</p>
                            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Tu nombre"/>
                        </div>
                        <div className="turneraStep3UserData">
                            <div className="turneraStep2Inputs turneraStep3Inputs">
                                <p>Teléfono</p>
                                <input type="number" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="Tu teléfono"/>
                            </div>
                            <div className="turneraStep2Inputs turneraStep3Inputs" style={{borderLeft: '1px solid rgba(255, 255, 255, 0.27)'}}>
                                <p>eMail</p>
                                <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Tu eMail"/>
                            </div>
                        </div>
                </div>
                <p className="turneraStep3Total">TOTAL: ${totalCombo.toLocaleString("es-AR")}</p>
                <p className="turneraErrorMessage">{errorMessage}</p>
                <div className="turneraStep2Buttons">
                    <button onClick={() => setTurneraStep(1)}>Cancelar</button>
                    <button onClick={() => verificarDatos()}>Continuar</button>
                </div>
            </>}

            {/* STEP 4 */}
            {turneraStep === 4 && <>
                <h2 className="turneraStep2Title">
                    METODO <br />
                    DE PAGO
                </h2>
                <div className="turneraStep4MetodoPago">
                    <img src="/turnera/mercadoPagoLogo.png" alt="mercado pago" className="turneraStep4LogoMp" width={24} height={16} />
                    <p>Mercado Pago</p>
                    <div className="turneraStep4SelectContainer">
                        <div className="turneraStep4SelectFill"></div>
                    </div>
                </div>
                {paymentError && (
                    <p className="turneraErrorMessage" style={{ marginTop: '16px' }}>{paymentError}</p>
                )}
                <div className="turneraStep2Buttons">
                    <button onClick={() => { clearPagoMensualState(); setIsPreparingPayment(false); setTurneraStep(3); }}>Cancelar</button>
                    <button onClick={handleSubmitReservas} disabled={isPreparingPayment}>
                        {isPreparingPayment ? "Preparando pago..." : "Pagar"}
                    </button>
                </div>
            </>}

            {/* STEP 5 */}
            {turneraStep === 5 && <>
                <h2 className="turneraStep2Title">
                    PAGAR<br />
                    RESERVA
                </h2>
                <div className="turneraStep3FechaTurnosContainer">
                    <p className="turneraStep3FechaTurnoLabel">COMBO<br />MENSUAL</p>
                    <div className="turneraStep3FechaTurnos">
                        {fechaSeleccionada.map((fecha, i) => (
                            <div key={i} className="turneraStep3FechaTurno">
                                <div className="turneraStep3FechaContainer">
                                    <p>Mes <span>{meses[fecha.getMonth()]}</span></p>
                                    <p>Fecha <span>{fecha.getDate()}</span></p>
                                    <p>Turno <span>{horarios[horarioSeleccionado[i] - 1]}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="turneraStep3UserData">
                    <p>eMail <span>{userEmail}</span></p>
                    <p>Nombre <span>{userName}</span></p>
                </div>
                <p className="turneraStep3Total">TOTAL: ${totalCombo.toLocaleString("es-AR")}</p>
                <div style={{ width: '100%', marginTop: '24px' }}>
                    {!isPaymentReady && !paymentError && (
                        <p style={{ textAlign: 'center', color: '#8C8C8C', marginBottom: '16px' }}>Estamos cargando Mercado Pago...</p>
                    )}
                    {paymentError && (
                        <p className="turneraErrorMessage" style={{ marginBottom: '16px' }}>{paymentError}</p>
                    )}
                    <div id={PAYMENT_BRICK_CONTAINER_ID} style={{ width: '100%', minHeight: '320px' }}></div>
                </div>
                <div className="turneraStep2Buttons">
                    <button onClick={() => { clearPagoMensualState(); setTurneraStep(4); }}>Volver</button>
                </div>
            </>}
        </div>
    )
}
