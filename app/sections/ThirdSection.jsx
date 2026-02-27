"use client";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { LuMapPin } from "react-icons/lu";
import { useInView } from "react-intersection-observer";
import { MdPlayArrow } from "react-icons/md";
import { VscCircleFilled } from "react-icons/vsc";

export const ThirdSection = () => {
    const { scrollYProgress } = useScroll();
    const [progress, setProgress] = useState(0);
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setProgress(latest);
    });

    const [animationStep, setAnimationStep] = useState(0);
    const { ref, inView } = useInView({
        threshold: 0.4,
        triggerOnce: true,
    });

    useEffect(() => {
        if (inView) {
            for (let i = 0; i < 16; i++) {
                setTimeout(() => {
                    setAnimationStep(i + 1);
                }, 300 * i);
            }
        }
    }, [inView]);

    // Dropdowns y timeouts
    const [drops, setDrops] = useState({
        drop1: false,
        drop2: false,
        drop3: false,
        drop4: false,
    });

    const closeTimeouts = useRef({
        drop1: null,
        drop2: null,
        drop3: null,
        drop4: null,
    });

    const handleMouseEnter = (key) => {
        if (closeTimeouts.current[key]) clearTimeout(closeTimeouts.current[key]);
    };

    const handleMouseLeave = (key) => {
        closeTimeouts.current[key] = setTimeout(() => {
            setDrops(prev => ({ ...prev, [key]: false }));
        }, 3000);
    };

    const toggleDrop = (key) => {
        if (closeTimeouts.current[key]) clearTimeout(closeTimeouts.current[key]);
        setDrops(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <motion.section
            ref={ref}
            id="thirdSection"
            style={{
                backgroundColor: progress >= 0.265 && progress <= 0.375 ? '#7B2CBF' : '#ffffff',
                transition: '.5s'
            }}
        >
            {/* Bloque 1 */}
            <div
                id="thirdSectionDiv1"
                onMouseEnter={() => handleMouseEnter('drop1')}
                onMouseLeave={() => handleMouseLeave('drop1')}
            >
                <div style={{ height: drops.drop1 ? '34px' : '50px' }} className="animationTextHorizontal">
                    <motion.p style={{ left: animationStep >= 2 ? 0 : '-450px', fontSize: drops.drop1 ? '24px' : '40px' }}>
                        EQUIPAMIENTO
                    </motion.p>
                </div>
                <div style={{ height: drops.drop1 ? '34px' : '50px' }} className="animationTextHorizontal">
                    <motion.p style={{ left: animationStep >= 3 ? 0 : '-450px', fontSize: drops.drop1 ? '24px' : '40px' }}>
                        PROFESIONAL
                    </motion.p>
                </div>
                <div style={{ height: drops.drop1 ? '300px' : '0' }} id="thirdSectionDiv1Content">
                    <p>En Stream Lab contamos con tecnología de última generación para que tu contenido se vea y suene increíble:</p>
                    <ul>
                        <li><span><VscCircleFilled size={8} />Cámaras PTZ 4K  BirdDog Max (x4): </span>imagen nítida en calidad broadcast.</li>
                        <li><span><VscCircleFilled size={8} />Switcher ATEM Mini Extreme  (Blackmagic): </span>para una realización en vivo fluida y dinámica.</li>
                        <li><span><VscCircleFilled size={8} />Luces Ulanzi VL-200Bi: </span>iluminación versátil y profesional para cada escena.</li>
                        <li><span><VscCircleFilled size={8} />Consola Zoom PodTrak P8 + micrófonos: </span>sonido cristalino, ideal para podcasts, entrevistas y streaming.</li>
                        <li><span><VscCircleFilled size={8} />Ulanzi deck D200 y consola de efectos AX01</span></li>
                    </ul>
                    <p>Todo listo para que solo tengas que venir, sentarte y crear.</p>
                </div>
                <p className="dropButton" style={{ opacity: animationStep >= 4 ? 1 : 0 }}>
                    Ver más <MdPlayArrow
                        style={{ rotate: drops.drop1 ? '-90deg' : '90deg' }}
                        className="dropButtonIcon"
                        onClick={() => toggleDrop('drop1')}
                    />
                </p>
            </div>

            {/* Bloque 2 */}
            <div
                id="thirdSectionDiv2"
                onMouseEnter={() => handleMouseEnter('drop2')}
                onMouseLeave={() => handleMouseLeave('drop2')}
            >
                <div style={{ height: drops.drop2 ? '34px' : '50px' }} className="animationTextHorizontal">
                    <motion.p style={{ right: animationStep >= 5 ? 0 : '-450px', fontSize: drops.drop2 ? '24px' : '40px' }}>
                        ASISTENCIA
                    </motion.p>
                </div>
                <div style={{ height: drops.drop2 ? '34px' : '50px' }} className="animationTextHorizontal">
                    <motion.p style={{ right: animationStep >= 6 ? 0 : '-450px', fontSize: drops.drop2 ? '24px' : '40px' }}>
                        TÉCNICA
                    </motion.p>
                </div>
                <div style={{ height: drops.drop2 ? '34px' : '50px' }} className="animationTextHorizontal">
                    <motion.p style={{ right: animationStep >= 7 ? 0 : '-450px', fontSize: drops.drop2 ? '24px' : '40px' }}>
                        INCLUIDA
                    </motion.p>
                </div>
                <p style={{
                    transition: '.5s',
                    height: drops.drop2 ? '120px' : '0',
                    overflow: 'hidden',
                    marginTop: '16px',
                    textAlign: 'end',
                    fontSize: '16px',
                    fontWeight: '300'
                }}>
                    El alquiler de la sala incluye un operador técnico para asistirte durante toda tu sesión para que vos no tengas que preocuparte por la transmisión, la imagen o el sonido. ¡Recomendamos enviar todo de antemano para que esté listo al momento de tu stream!
                </p>
                <p className="dropButton" style={{ opacity: animationStep >= 8 ? 1 : 0 }}>
                    Ver más <MdPlayArrow
                        style={{ rotate: drops.drop2 ? '-90deg' : '90deg' }}
                        className="dropButtonIcon"
                        onClick={() => toggleDrop('drop2')}
                    />
                </p>
            </div>

            {/* Bloque 3 */}
            <div
                id="thirdSectionDiv3"
                onMouseEnter={() => handleMouseEnter('drop3')}
                onMouseLeave={() => handleMouseLeave('drop3')}
            >
                <div style={{ height: drops.drop3 ? '34px' : '50px' }} className="animationTextHorizontal">
                    <motion.p style={{ left: animationStep >= 9 ? 0 : '-450px', fontSize: drops.drop3 ? '24px' : '40px' }}>
                        ENTREGA
                    </motion.p>
                </div>
                <div style={{ height: drops.drop3 ? '34px' : '50px' }} className="animationTextHorizontal">
                    <motion.p style={{ left: animationStep >= 10 ? 0 : '-450px', fontSize: drops.drop3 ? '24px' : '40px' }}>
                        DEL MATERIAL
                    </motion.p>
                </div>
                <div style={{ height: drops.drop3 ? '34px' : '50px' }} className="animationTextHorizontal">
                    <motion.p style={{ left: animationStep >= 11 ? 0 : '-450px', fontSize: drops.drop3 ? '24px' : '40px' }}>
                        EN EL DÍA
                    </motion.p>
                </div>
                <p style={{
                    transition: '.5s',
                    height: drops.drop3 ? '40px' : '0',
                    overflow: 'hidden',
                    marginTop: '16px',
                    fontSize: '16px',
                    fontWeight: '300'
                }}>
                    Ya sea que transmitas en vivo o grabes en diferido te enviamos el material en máxima calidad ese mismo día para que ya lo tengas disponible para vos!
                </p>
                <p className="dropButton" style={{ opacity: animationStep >= 12 ? 1 : 0 }}>
                    Ver más <MdPlayArrow
                        style={{ rotate: drops.drop3 ? '-90deg' : '90deg' }}
                        className="dropButtonIcon"
                        onClick={() => toggleDrop('drop3')}
                    />
                </p>
            </div>

            {/* Bloque 4 */}
            <div
                id="thirdSectionDiv4"
                onMouseEnter={() => handleMouseEnter('drop4')}
                onMouseLeave={() => handleMouseLeave('drop4')}
            >
                <div style={{ height: drops.drop4 ? '34px' : '50px' }} className="animationTextHorizontal">
                    <motion.p style={{ right: animationStep >= 13 ? 0 : '-450px', fontSize: drops.drop4 ? '24px' : '40px' }}>
                        UBICACIÓN
                    </motion.p>
                </div>
                <div style={{ height: drops.drop4 ? '34px' : '50px' }} className="animationTextHorizontal">
                    <motion.p style={{ right: animationStep >= 14 ? 0 : '-450px', fontSize: drops.drop4 ? '24px' : '40px' }}>
                        ACCESIBLE
                    </motion.p>
                </div>
                <p style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    transition: '.5s',
                    height: drops.drop4 ? '100px' : '0',
                    overflow: 'hidden',
                    marginTop: '16px',
                    fontSize: '16px',
                    fontWeight: '300',
                    textAlign: 'end'
                }}>
                    Estamos en Arévalo 1462, Palermo Hollywood.<br />Fijate como llegar acá!
                    <a
                        id="linkUbi"
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '8px' }}
                        target="_blank"
                        href="https://maps.app.goo.gl/7sK7rCdGXqH849Up9"
                    >
                        <LuMapPin height={22} width={18} />ABRIR EN MAPS
                    </a>
                </p>
                <p className="dropButton" style={{ opacity: animationStep >= 15 ? 1 : 0 }}>
                    Ver más <MdPlayArrow
                        style={{ rotate: drops.drop4 ? '-90deg' : '90deg' }}
                        className="dropButtonIcon"
                        onClick={() => toggleDrop('drop4')}
                    />
                </p>
            </div>

            <motion.p style={{ opacity: animationStep >= 1 ? 1 : 0, transition: '.5s' }} id="thirdSectionTitle">
                ¿QUE INCLUYEN?
            </motion.p>
        </motion.section>
    );
};
