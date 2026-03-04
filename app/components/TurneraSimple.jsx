"use client";
import { useEffect, useRef, useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { IoTriangleSharp } from "react-icons/io5";
import { crearPago, getAllReservas, subirReserva, verSalas } from "../helpers/apiCall";
import { useAppContext } from "../context/AppContext";

export const TurneraSimple = ({setTurnera}) => {

    const {setTurneraSeleccionada} = useAppContext();

    //fechas ocupadas
    const [reservas, setReservas] = useState([]);
    const [diasReservados, setDiasReservados] = useState([]);
    const [horariosReservados, setHorariosReservados] = useState([]);
    const puedeSerHoraInicio = (hora) => {
        const siguienteHora = hora + 1;
        if (!horarios.includes(siguienteHora)) return false;

        if (
            horariosReservados.includes(hora) ||
            horariosReservados.includes(siguienteHora)
        ) {
            return false;
        }

        if (generaSolapeConReservas(fechaSeleccionada, hora, hora + 2)) {
            return false;
        }

        return true;
        };


    // valor de la sala
    const [valorSala, setValorSala] = useState(0);
    const [external_reference, setExternal_reference] = useState('');

 
    useEffect(() => {
        verSalas()
            .then(data => {
            console.log("Datos recibidos:", data.data[0]);
            setValorSala(Number(data.data[0].precio_por_hora));
            })
            .catch(err => console.error("Error al obtener salas:", err));
    }, []);


    useEffect(() => {
        getAllReservas().then(data => setReservas(data.data.filter(reserva => reserva.estado !== 'pendiente')));
    }, []);
    

    useEffect(() => {
        setDiasReservados(reservas.map(reserva => reserva.fecha_inicio.slice(0, 10)));
    }, [reservas]);

    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const diaSeleccionado = fechaSeleccionada.getDate();
    const mesSeleccionado = fechaSeleccionada.getMonth();

    const [isHorarioDisponiblee, setIsHorarioDisponiblee] = useState(false);

    const [seleccionPaso, setSeleccionPaso] = useState("inicio");

    const [showCalendar, setShowCalendar] = useState(false);
    const [showHorarios, setShowHorarios] = useState(false);

    
    const [horaInicio, setHoraInicio] = useState(9);
    const [horaFin, setHoraFin] = useState(11);

    useEffect(() => {
        setShowCalendar(false);
    }, [fechaSeleccionada]);

    const getPrimeraHoraDisponible = (fecha) => {
        if (!fecha) return null;
        const ahora = new Date();
        const esHoy = fecha.toDateString() === ahora.toDateString();

        for (let h of horarios) {
            // hora pasada
            if (esHoy && h <= ahora.getHours()) continue;

            // necesita mínimo 2hs
            const finMinimo = h + 2;
            if (!horarios.includes(finMinimo - 1)) continue;

            // no pisa reservas
            if (generaSolapeConReservas(fecha, h, finMinimo)) continue;

            return h;
        }

        return null; // no hay horarios disponibles
    };

    // comprueba si existe al menos un turno disponible para la fecha indicada
    const hayHorariosDisponibles = (fecha) => {
        return getPrimeraHoraDisponible(fecha) !== null;
    };

    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTotal((horaFin - horaInicio) == 2 ? valorSala * 2 : valorSala * 2 + ((valorSala * 0.9) * ((horaFin - horaInicio - 2))));
    }, [valorSala, horaInicio, horaFin]);

    const handleHoraClick = (hora) => {
        if (seleccionPaso === "inicio") {
            setHoraInicio(hora);
            setHoraFin(hora + 2); // mínimo 2hs
            setSeleccionPaso("fin");
        } else {
            if (hora <= horaInicio) return; // evita menos de 2hs
            setHoraFin(hora + 1);
            setSeleccionPaso("inicio");
        }
    };

    const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ]
    useEffect(() => {
  setHoraInicio(9);
  setHoraFin(11);
  setSeleccionPaso("inicio");
}, [fechaSeleccionada]);

const generaSolapeConReservas = (fecha, inicio, fin) => {
  if (!fecha || fin <= inicio) return false;

  const fechaISO = fecha.toISOString().slice(0, 10);
  const startDT = new Date(`${fechaISO}T${inicio.toString().padStart(2,'0')}:00:00`);
  const endDT   = new Date(`${fechaISO}T${fin.toString().padStart(2,'0')}:00:00`);

  return reservas.some(r => {
    const rStart = new Date(r.fecha_inicio.replace(' ', 'T'));
    const rEnd   = new Date(r.fecha_fin.replace(' ', 'T'));
    return rStart < endDT && rEnd > startDT;
  });
};

// cada vez que cambia la fechaSeleccionada o llegan reservas
// recalculamos la primera hora disponible y además si la fecha
// seleccionada es hoy y no hay horarios (o ya pasaron las 18hs)
// nos adelantamos al siguiente día automáticamente.
useEffect(() => {
  const ahora = new Date();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const sel = new Date(fechaSeleccionada);
  sel.setHours(0, 0, 0, 0);

  // si estamos en el día actual y no queda ningún horario libre
  // o directamente ya son las 18 o más, saltamos a mañana
  if (sel.getTime() === hoy.getTime()) {
    const primeraHoy = getPrimeraHoraDisponible(fechaSeleccionada);
    if (primeraHoy === null || ahora.getHours() >= 18) {
      const manana = new Date(hoy);
      manana.setDate(manana.getDate() + 1);
      setFechaSeleccionada(manana);
      setCurrentMonth(manana);
      return; // volvemos a ejecutarnos con la nueva fecha
    }
  }

  const primera = getPrimeraHoraDisponible(fechaSeleccionada);

  if (primera !== null) {
    setHoraInicio(primera);
    setHoraFin(primera + 2);
    setSeleccionPaso("inicio");
  } else {
    // opcional: bloquear todo el día
    setHoraInicio(null);
    setHoraFin(null);
  }
}, [fechaSeleccionada, reservas]);


useEffect(() => {
  const fechaISO = fechaSeleccionada.toISOString().slice(0, 10);

  const reservasDelDia = reservas.filter(
    r => r.fecha_inicio.slice(0, 10) === fechaISO
  );

  const ocupadas = [];

  reservasDelDia.forEach(r => {
    const start = new Date(r.fecha_inicio.replace(' ', 'T')).getHours();
    const end   = new Date(r.fecha_fin.replace(' ', 'T')).getHours();

    for (let h = start; h < end; h++) {
      ocupadas.push(h);
    }
  });

  setHorariosReservados(ocupadas);
}, [fechaSeleccionada, reservas]);

    const horarios = [9,10,11,12,13,14,15,16,17,18,19];

    const isRangoDisponible = (fecha, inicio, fin) => {
    if (!fecha || inicio == null || fin == null) return false;
    if (fin <= inicio) return false;
    if (fin - inicio < 2) return false;

        const fechaISO = fecha.toISOString().slice(0, 10);
        const startDT = new Date(`${fechaISO}T${inicio.toString().padStart(2,'0')}:00:00`);
        const endDT   = new Date(`${fechaISO}T${fin.toString().padStart(2,'0')}:00:00`);

        const ahora = new Date();
        if (startDT < ahora) return false;

        return !reservas.some(r => {
            const rStart = new Date(r.fecha_inicio.replace(' ', 'T'));
            const rEnd   = new Date(r.fecha_fin.replace(' ', 'T'));
            return rStart < endDT && rEnd > startDT; // solapamiento real
        });
    };

    useEffect(() => {
        setIsHorarioDisponiblee(
            isRangoDisponible(fechaSeleccionada, horaInicio, horaFin)
        );
    }, [fechaSeleccionada, horaInicio, horaFin, reservas]);

    useEffect(() => {
    if (horaFin <= horaInicio || horaFin - horaInicio < 2) {
        setHoraFin(horaInicio + 2);
    }
    }, [horaInicio]);

    //controlar calendario
    const prevMonth = () => {
        setCurrentMonth(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
        );
    };

    const nextMonth = () => {
        setCurrentMonth(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
        );
    };

    //flow
    const [turneraStep, setTurneraStep] = useState(1);

    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const paymentBrickController = useRef(null);
    const [isPaymentReady, setIsPaymentReady] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [preferenceId, setPreferenceId] = useState(null);
    const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? "TEST-73f12ddd-3882-4d6a-a34a-887fb09119f1";
    const MP_SITE_ID = process.env.NEXT_PUBLIC_MP_SITE_ID ?? "MLA";
    const PAYMENT_BRICK_CONTAINER_ID = "paymentBrick_container";
    const HARDCODED_PREFERENCE_ID = "1111";
    

    useEffect(() => {
        if (turneraStep !== 5) {
            if (paymentBrickController.current) {
                paymentBrickController.current.unmount();
                paymentBrickController.current = null;
                window.paymentBrickController = null;
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

        const preferenceLooksPlaceholder = HARDCODED_PREFERENCE_ID === "1111" && preferenceId === HARDCODED_PREFERENCE_ID;

        if (!preferenceId) {
            //setPaymentError("Configura un preferenceId valido antes de continuar.");
            return;
        }

        if (preferenceLooksPlaceholder) {
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
                        amount: valorSala,
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
                    console.log("Submitting payment:", { selectedPaymentMethod, formData });

                    return new Promise((resolve, reject) => {
                        // Si ya había un brick montado, lo desmontamos para evitar errores de duplicado
                        if (window.paymentBrickController) {
                        window.paymentBrickController.unmount();
                        window.paymentBrickController = null;
                        }

                        const payload = {
                            ...formData,
                            selectedPaymentMethod: selectedPaymentMethod ?? 'mercadopago',
                            transactionAmount: total,      // 💥 fijo
                            transaction_amount: total,     // 💥 compatibilidad backend
                            titulo: 'Reserva Turno Simple',
                            email: formData?.email ?? formData?.payer?.email ?? userEmail,
                            reserva_id: external_reference,    // 💥 clave para vincular con la reserva
                            nombre: userName,
                            telefono: userPhone,
                        };

                        console.log("Payload final que se envía al backend:", payload);

                        crearPago('', 'POST', payload)
                        .then((response) => {
                            if (!response?.success) {
                            setPaymentError(response?.message ?? "Ocurrió un error al procesar el pago. Intentalo nuevamente.");
                            reject(new Error(response?.message ?? 'Pago rechazado'));
                            return;
                            }
                            console.log("✅ Pago procesado correctamente:", response);
                            setTurneraStep(1);
                            resolve();
                        })
                        .catch((error) => {
                            console.error("Error enviando pago:", error);
                            setPaymentError("Ocurrió un error al procesar el pago. Intentalo nuevamente.");
                            reject(error);
                        });
                    });
                },

                onError: (error) => {
                    console.error("Payment Brick error:", error);
                    setPaymentError("Ocurrio un error al procesar el pago. Intentalo nuevamente.");
                },
                onReady: () => {
                    setIsPaymentReady(true);
                },
                },
            });

                paymentBrickController.current = controller;
                window.paymentBrickController = controller;
            } catch (error) {
                console.error("Error creando el Payment Brick:", error);
                setPaymentError("No pudimos cargar el formulario de pago. Actualiza la pagina e intenta nuevamente.");
            }
        };

        renderBrick();

        return () => {
            if (paymentBrickController.current) {
                paymentBrickController.current.unmount();
                paymentBrickController.current = null;
                window.paymentBrickController = null;
            }
        };
    }, [turneraStep, preferenceId, MP_PUBLIC_KEY]);

    const verificarDatos = () => {
        if(userEmail === '' || userEmail.includes('@') === false || userEmail.includes('.') === false) {
            setErrorMessage('El eMail ingresado no es valido');
        } else if(userName.length < 3) {
            setErrorMessage('El nombre ingresado no es valido');
        } else if(userPhone.length < 10) {
            setErrorMessage('El teléfono ingresado no es valido');
        } else {
            setTurneraStep(4);
        }
    };



    const calendarRef = useRef(null);
    const horariosRef = useRef(null);
    const toggleCalendarRef = useRef(null);
    const toggleHorariosRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                toggleCalendarRef.current &&
                toggleCalendarRef.current.contains(event.target)
            ) {
                return;
            }
            if (
                toggleHorariosRef.current &&
                toggleHorariosRef.current.contains(event.target)
            ) {
                return;
            }

            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target)
            ) {
                setShowCalendar(false);
            }

            if (
                horariosRef.current &&
                !horariosRef.current.contains(event.target)
            ) {
                setShowHorarios(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    //SUBIR RESERVA
    const handleSubmitReserva = async () => {
        const fechaISO = fechaSeleccionada.toISOString().slice(0, 10);
        try {
            const reserva = await subirReserva('/reservas', 'POST', {
            action: 'crear_reserva',
            sala_id: 1,
            cliente_id: 1,
            titulo: 'Sesión de Streaming',
            descripcion: 'Stream de videojuegos',
            fecha_inicio: `${fechaISO} ${horaInicio}:00:00`,
            fecha_fin:    `${fechaISO} ${horaFin}:00:00`,
            tipo_stream: 'streaming',
            observaciones: 'ninguna',
            estado: 'pendiente',
            email: userEmail,
            precio_total: total,
            });

            if (reserva?.success && reserva.data?.reserva_id) {
            setPreferenceId(reserva.data.preference_id);
            setExternal_reference(reserva.data.reserva_id);
            setTurneraStep(5); // 👈 ahora sólo se avanza cuando la preferencia está lista
            } else {
            setPaymentError("No se pudo generar la reserva. Intentalo nuevamente.");
            }
        } catch (error) {
            console.error("Error creando la reserva:", error);
            setPaymentError("Hubo un error al crear la reserva. Intentalo nuevamente.");
        }
    };

    return (
        <div id="turneraContainer" style={{height: turneraStep === 5 ? '765px' : null, gap: turneraStep === 5 ? '8px' : null}}>
            {/* STEP 1 */}
            {turneraStep === 1 && <><h2 className="turneraH2">RESERVÁ<br />
                TU TURNO,<br />
                NO DUERMAS.
            </h2>
            <div className="turneraUtilities">
                <div className="selectersContainer">
                    <div className="fechaContainer">
                        <p className="fechaContainerLabel">Fecha</p>
                        <div ref={toggleCalendarRef} className="seleccionarFechaContainer">
                            <p>{diaSeleccionado}.{meses[mesSeleccionado].toUpperCase().slice(0, 3)}</p>
                            <IoTriangleSharp style={{rotate: showCalendar ? '0deg' : '180deg'}} onClick={()=>setShowCalendar(!showCalendar)} className="seleccionarFechaIcon" />
                        </div>
                    </div>

                    <div ref={toggleHorariosRef} className="turnossContainer">
                        <p className="turnossContainerLabel">Turnos</p>
                        <div>
                            <p>Desde: <span>{horaInicio}hs</span></p>
                        </div>
                        <div>
                            <p>Hasta: <span>{horaFin}hs</span></p>
                        </div>
                        <IoTriangleSharp style={{rotate: showHorarios ? '0deg' : '180deg'}} onClick={()=>setShowHorarios(!showHorarios)} className="seleccionarFechaIcon" />
                    </div>
                    <div className="turnosInfoMobile">
                        <div>
                            <p>Desde: <span>{horaInicio}hs</span></p>
                        </div>
                        <div>
                            <p>Hasta: <span>{horaFin}hs</span></p>
                        </div>
                    </div>
                </div>

                {showCalendar &&<div ref={calendarRef} className="calendarContainer">
                    <div className="calendarNav">
                        <IoTriangleSharp onClick={prevMonth} className="calendarRowsIcon" style={{rotate: '-90deg'}} size={35}/>
                        <p>
                            {currentMonth
                            .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                            .replace(' de ', ' ')
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </p>
                        <IoTriangleSharp onClick={nextMonth} className="calendarRowsIcon" style={{rotate: '90deg'}} size={35}/>
                    </div>
                    <Calendar
                        onChange={setFechaSeleccionada}
                        value={fechaSeleccionada}
                        showNavigation={false}
                        minDate={new Date()} 
                        activeStartDate={currentMonth}
                        tileDisabled={({ date: currentDate, view }) => {
                            if (view === "month") {
                                if (currentDate.getMonth() !== currentMonth.getMonth()) {
                                    return true;
                                }
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                // no permitimos días pasados
                                if (currentDate < today) return true;

                                // si el día no tiene ningún horario disponible lo deshabilitamos
                                if (!hayHorariosDisponibles(currentDate)) return true;

                                // particularmente el día actual se bloquea cuando ya son las 18hs
                                if (currentDate.getTime() === today.getTime()) {
                                    const ahora = new Date();
                                    if (ahora.getHours() >= 18) return true;
                                }
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
                            if (dateISO === fechaSeleccionada.toISOString().slice(0,10)) return 'rc-selected-day';
                            if (dateISO === today.toISOString().slice(0,10)) return 'rc-today-day';
                            return null;
                        }}
                    />
                </div>}

{
    showHorarios && <div ref={horariosRef} className="turnosContainer">
        {<>
        <p style={{alignSelf: 'flex-start'}}>Seleccioná el {seleccionPaso} de turno</p>
            <div>
                {horarios.map((h) => {
                    const selected =
                    horaInicio !== null &&
                    h >= horaInicio &&
                    h < horaFin;
                    const ocupada = horariosReservados.includes(h);
                    const generaSolape =
                    seleccionPaso === "fin" &&
                    generaSolapeConReservas(fechaSeleccionada, horaInicio, h);
                    const inicioInvalido =
                    seleccionPaso === "inicio" && !puedeSerHoraInicio(h);

                    const ahora = new Date();

                    const esHoy =
                    fechaSeleccionada.toDateString() === ahora.toDateString();

                    const horaPasada =
                    esHoy && h <= ahora.getHours();

                    return (
                    <div
                        key={h}
                        onClick={() => !ocupada && !generaSolape && !horaPasada && !inicioInvalido && handleHoraClick(h)}
                        style={{
                        cursor:
                            ocupada || generaSolape || horaPasada || inicioInvalido
                                ? "not-allowed"
                                : "pointer",

                        backgroundColor: ocupada ? '#5A189A99' : selected ? "#5A189A" : "transparent",
                        cursor: ocupada || generaSolape ? "not-allowed" : "pointer",
                        borderRadius: horaInicio === h ? "8px 0 0 8px " : horaFin -1 === h ? "0px 8px 8px 0px " : null
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
                                : "#FFFFFF",}}
                        >{h}</p>
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

                <div className="selectTipoTurno">
                    <div className="selectTurno">
                        <button><div style={{backgroundColor: '#e0aaffff'}}></div></button>
                        <p>
                            TURNO
                            <br />
                            SIMPLE
                        </p>
                    </div>
                    <div className="selectTurno">
                        <button><div onClick={()=>{setTurnera('mensual'); setTurneraSeleccionada('mensual')}} style={{backgroundColor: '#8c8c8cff'}}></div></button>
                        <p>
                            COMBO
                            <br />
                            MENSUAL
                        </p>
                    </div>
                </div>
                <button className="buttonReservar" onClick={()=>setTurneraStep(3)}>Reservar</button>
            </div></>}

            {/* STEP 3 */}
            {
                turneraStep === 3 && <>
                    <h2 className="turneraStep2Title">
                        CONFIRMAR
                        <br />
                        RESERVA
                    </h2>
                    <div className="turneraStep3Fecha">
                        <div className="turneraStep3FechaTurno">
                            <p>TURNO<br />SIMPLE</p>
                            <div className="turneraStep3FechaContainer">
                                <p>Mes <span>{meses[mesSeleccionado]}</span></p>
                                <p>Fecha <span>{diaSeleccionado}</span></p>
                                <p>Turno <span>{horaInicio}-{horaFin} hs</span></p>
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
                            <div className="turneraStep2Inputs turneraStep3Inputs" style={{borderLeft: '1px solid rgba(255, 255, 255, 0.2)'}}>
                                <p>eMail</p>
                                <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Tu eMail"/>
                            </div>
                        </div>
                    </div>
                    <p className="turneraStep3Total">TOTAL: ${total}</p>
                <p className="turneraErrorMessage">{errorMessage}</p>
                    <div className="turneraStep2Buttons">
                        <button onClick={() => setTurneraStep(1)}>Cancelar</button>
                        <button  onClick={() => verificarDatos()}>Continuar</button>
                    </div>
                </>
            }

            {/* STEP 4 */}
            {
                turneraStep === 4 && <>
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
                    <div className="turneraStep2Buttons">
                        <button onClick={() => setTurneraStep(3)}>Cancelar</button>
                        <button onClick={() => handleSubmitReserva()}>Pagar</button>
                    </div>
                </>
            }

            {/* STEP 5 */}
            {
                turneraStep === 5 && <>
                    <h2 className="turneraStep2Title">
                        PAGAR<br />
                        RESERVA
                    </h2>
                    <div className="turneraStep3FechaTurno">
                        <p>TURNO<br />SIMPLE</p>
                        <div className="turneraStep3FechaContainer">
                            <p>Mes <span>{meses[mesSeleccionado]}</span></p>
                            <p>Fecha <span>{diaSeleccionado}</span></p>
                            <p>Turno <span>{horaInicio}-{horaFin} hs</span></p>
                        </div>
                    </div>
                    <div className="turneraStep5UserData">
                        <p style={{borderRight: '1px solid rgba(255, 255, 255, 0.2)'}}>eMail <span>{userEmail}</span></p>
                        <p style={{}}>Nombre <span>{userName}</span></p>
                    </div>
                    <p className="turneraStep3Total" style={{bottom: '105px'}}>TOTAL: ${total}</p>
                    <div style={{ width: '100%', marginBottom: '-30px' }}>
                        {!isPaymentReady && !paymentError && (
                            <p style={{ textAlign: 'center', color: '#8C8C8C', position: 'absolute', bottom: '-40px' }}>Estamos cargando Mercado Pago...</p>
                        )}
                        {paymentError && (
                            <p className="turneraErrorMessage" style={{ position: 'absolute', bottom: '-40px' }}>{paymentError}</p>
                        )}
                        <div id={PAYMENT_BRICK_CONTAINER_ID} style={{ width: '100%', minHeight: '320px' }}></div>
                    </div>
                    <div className="turneraStep2Buttons">
                        <button onClick={() => setTurneraStep(4)}>Volver</button>
                    </div>
                </>
            }
        </div>
    )
}
