"use client";
import { useState, useRef, useEffect } from "react";
import { LuMapPin } from "react-icons/lu";
import { RxCopy } from "react-icons/rx";
import { useInView } from "react-intersection-observer";
import { TextUpComponent } from "../components";

export const EighthSection = () => {
    // estados
    const [useWhatsapp, setUseWhatsapp] = useState(false);
    const [useMail, setUseMail] = useState(false);
    const [useRedes, setUseRedes] = useState(false);

    // refs para los timeouts
    const whatsappTimeout = useRef(null);
    const mailTimeout = useRef(null);
    const redesTimeout = useRef(null);

    // handlers genericos
    const handleEnter = (ref) => {
        if (ref.current) clearTimeout(ref.current);
    };

    const handleLeave = (ref, setState) => {
        ref.current = setTimeout(() => {
            setState(false);
        }, 2000);
    };

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
            for (let i = 0; i < 11; i++) {
                setTimeout(() => {
                    setAnimationStep(i + 1);
                }, 500 * i);
                }
            }
    }, [inView]);

    return <section ref={ref} id="eighthSection">
                <p id="eigthSectionTitle" style={{opacity: animationStep >= 1 ? 1 : 0}}>
                    ¿DUDAS, CONSULTAS O SUGERENCIAS?
                </p>
                <TextUpComponent fontSize={isMobile ? 30 : 50} active={animationStep >= 2} textContent={"PODÉS"} />
                <TextUpComponent fontSize={isMobile ? 30 : 50} active={animationStep >= 3} textContent={"CONTACTARNOS"} />
                <TextUpComponent fontSize={isMobile ? 30 : 50} active={animationStep >= 4} textContent={"A TRAVÉS DE"} />
                <TextUpComponent fontSize={isMobile ? 30 : 50} active={animationStep >= 5} textContent={"ESTOS MEDIOS"} />

                <div style={{opacity: animationStep >= 6 ? 1 : 0}} id="eighthSectionRedesContainer">
                    <div className="eighthSectionRed" onMouseEnter={() => handleEnter(whatsappTimeout)} onMouseLeave={() => handleLeave(whatsappTimeout, setUseWhatsapp)}>
                        <p style={{top: useWhatsapp ? '-24px' : 4}} onClick={() => setUseWhatsapp(true)}>WHATSAPP</p>
                        <p style={{top: useWhatsapp ? 0 : '33px'}}>+5491173586119 <RxCopy onClick={() => navigator.clipboard.writeText("+5491173586119")} width={24} height={24} className="copyIcon"/></p>
                    </div>
                    <div className="eighthSectionRed" onMouseEnter={() => handleEnter(mailTimeout)} onMouseLeave={() => handleLeave(mailTimeout, setUseMail)}>
                        <p style={{top: useMail ? '-24px' : 4}} onClick={() => setUseMail(true)}>MAIL</p>
                        <p style={{top: useMail ? 0 : '33px'}}>contacto.streamlab@gmail.com<RxCopy onClick={() => navigator.clipboard.writeText("contacto.streamlab@gmail.com")} width={24} height={24} className="copyIcon"/></p>
                    </div>
                    <div className="eighthSectionRed" onMouseEnter={() => handleEnter(redesTimeout)} onMouseLeave={() => handleLeave(redesTimeout, setUseRedes)}>
                        <p style={{top: useRedes ? '-24px' : 4}} onClick={() => setUseRedes(true)}>REDES</p>
                        <p style={{top: useRedes ? 0 : '33px', flexDirection: 'row'}}>
                            <a target="_blank" href="https://x.com/StreamLabArg">X</a>
                            <a target="_blank" href="https://www.instagram.com/stream__lab?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">IG</a>
                            <a target="_blank" href="https://www.linkedin.com/company/streamlabarg/">LI</a>
                        </p>
                    </div>
                </div>

                <TextUpComponent fontSize={isMobile ? 30 : 50} active={animationStep >= 7} textContent={"O"} />
                <TextUpComponent fontSize={isMobile ? 30 : 50} active={animationStep >= 8} textContent={"ENCONTRANOS"} />
                <TextUpComponent fontSize={isMobile ? 30 : 50} active={animationStep >= 9} textContent={"EN"} />

                <a target="_blank" href="https://maps.app.goo.gl/7sK7rCdGXqH849Up9" id="eigthSectionUbi" style={{opacity: animationStep >= 10 ? 1 : 0}}>
                    <LuMapPin color="#9D4EDD"/> Arévalo 1462, Palermo Hollywood.
                </a>
            </section>
}
