"use client";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { S4Card1, S4Card2, S4Card3, TextUpComponent } from "../components";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useAppContext } from "../context/AppContext";

export const FourthSection = () => {

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
            for (let i = 0; i < 7; i++) {
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

    return <section ref={ref} id="fourthSection" style={{backgroundColor: isMobile ? turneraSeleccionada === 'simple' ? progress >= 0.15 && progress <= 0.40 ? '#7B2CBF' : '#ffffff' : progress >= 0.15 && progress <= 0.42 ? '#7B2CBF' : '#ffffff' : progress >= 0.265 && progress <= 0.375 ? '#7B2CBF' : '#ffffff', transition: '.5s'}}>
            <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 1} textContent={"RESERVÁ"} />
            <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 2} textContent={"TU TURNO"} />
            <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 3} textContent={"TU COMBO, O"} />
            <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 4} textContent={"LO QUE QUIERAS."} />
            {isMobile ? <div id="cardsContainerMobile">
                <S4Card1 y={0} x={0} opacity={animationStep >= 5 ? 1 : 0} rotate={0}/>
                <S4Card2 y={0} x={animationStep >= 6 ? 0 : -260} opacity={animationStep >= 5 ? 1 : 0} />
                <S4Card3 y={0} x={animationStep >= 6 ? 0 : -520} opacity={animationStep >= 5 ? 1 : 0} rotate={0}/>
            </div> : <>
            <S4Card3 y={animationStep >= 5 ? 370 : 1000} x={animationStep >= 5 ? 230 : 0} opacity={animationStep >= 5 ? 1 : 0} rotate={animationStep >= 5 ? 11 : 0}/>
            <S4Card2 y={animationStep >= 5 ? 345 : 1000} x={animationStep >= 5 ? 0 : 0} opacity={animationStep >= 5 ? 1 : 0} />
            <S4Card1 y={animationStep >= 5 ? 370 : 1000} x={animationStep >= 5 ? -230 : 0} opacity={animationStep >= 5 ? 1 : 0} rotate={animationStep >= 5 ? -11 : 0}/></>}
        </section>
}