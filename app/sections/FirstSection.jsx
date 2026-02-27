"use client";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { Header, TurneraMensual, TurneraSimple } from "../components"
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

export const FirstSection = () => {

    const {turneraSeleccionada} = useAppContext();

    const {scrollYProgress} = useScroll();
    const [progress, setProgress] = useState(0);
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setProgress(latest);
    });

    //responsive
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 863);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [turnera, setTurnera] = useState('simple');

    return <section style={{backgroundColor:  isMobile ? turneraSeleccionada === 'simple' ? progress >= 0.15 && progress <= 0.40 ? '#7B2CBF' : '#ffffff' : progress >= 0.18 && progress <= 0.42 ? '#7B2CBF' : '#ffffff' : progress >= 0.265 && progress <= 0.375 ? '#7B2CBF' : '#ffffff', transition: '.5s', height: isMobile ? turnera === 'mensual' ? '1300px' : null : null}} id="firstSection">
        <Header />
        {!isMobile ? <div className="sliderContainer">
            <div className="sliderTrack">
                <span className="sliderText">EXPERIMENTÁ EL STREAMING</span>
                <span className="sliderText">EXPERIMENTÁ EL STREAMING</span>
            </div>
        </div> : <div className="sliderContainer">
            <div className="sliderTrack">
                <span className="sliderText">EXPERIMENTÁ EL STREAMING</span>
                <span className="sliderText">EXPERIMENTÁ EL STREAMING</span>
            </div>
        </div>
        }
        {
            turnera === 'simple' ? <TurneraSimple setTurnera={setTurnera} /> : <TurneraMensual isMobile={isMobile} setTurnera={setTurnera} />
        }
    </section>
}