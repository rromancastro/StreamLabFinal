"use client";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { TextUpComponent } from "../components";
import { useInView } from "react-intersection-observer";
import { useAppContext } from "../context/AppContext";

export const SecondSection = () => {

    const {turneraSeleccionada} = useAppContext();

    //responsive
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 863);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [animationStep, setAnimationStep] = useState(0);
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    
    useEffect(() => {
        if (inView) {
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    setAnimationStep(i + 1);
                }, 500 * i);
                }
            }
    }, [inView]);

    //scroll
    const { scrollYProgress } = useScroll();
    const [progress, setProgress] = useState(0);
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setProgress(latest);
    });

//     useEffect(() => {
//     const unsubscribe = scrollYProgress.on("change", (latest) => {
//       console.log("Progreso global:", latest.toFixed(2));
//     });
//     return () => unsubscribe();
//   }, [scrollYProgress]);

    return <section style={{backgroundColor:  isMobile ? turneraSeleccionada === 'simple' ? progress >= 0.15 && progress <= 0.40 ? '#7B2CBF' : '#ffffff' : progress >= 0.18 && progress <= 0.42 ? '#7B2CBF' : '#ffffff' : progress >= 0.265 && progress <= 0.375 ? '#7B2CBF' : '#ffffff', transition: '.5s'}} ref={ref} id="secondSection">
                <p style={{ opacity: animationStep >=1 ? 1 : 0 }}>¿CÓMO FUNCIONA?</p>
                <div>
                    <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 2} textContent={"TURNOS DE"} />
                    <span style={{scale: animationStep >= 3 ? 1 : 0}}>2 HS</span>
                </div>
                <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 4} textContent={"DE LUNES A"} />
                <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 5} textContent={"SÁBADOS"} />
                <p style={{opacity: animationStep >=6 ? 1 : 0}}>Elegí un día y un horario que este disponible. Reservá, venís, grabas y listo! Tambíen<br />podes elegir entre nuestros combos si sos un streamer regular. Y si queres te ayudamos<br />con la producción, edición, hosting y otras cositas.</p>
            </section>
}