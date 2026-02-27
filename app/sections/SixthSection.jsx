"use client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { TextUpComponent } from "../components";
import { FaLinkedin } from "react-icons/fa";

export const SixthSection = () => {

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
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    setAnimationStep(i + 1);
                }, 500 * i);
                }
            }
    }, [inView]);
    return <section ref={ref} id="sixthSection">
            <p id="sixthSectionTitle" style={{opacity: animationStep >= 1 ? 1 : 0 }}>¿QUIENES SOMOS?</p>
            <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 2} textContent={"CREATIVOS"} />
            <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 3} textContent={"PRODUCTORES"} />
            <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 4} textContent={"LOCUTORES"} />
            <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 5} textContent={"STREAMERS"} />
            <TextUpComponent fontSize={isMobile ? 30 : 72} active={animationStep >= 6} textContent={"CURIOSOS"} />

            <img className="sixtSectionImg2" src={"/sixthSection/img2.png"} alt="Imagen 1" style={{transform: isMobile ? animationStep >= 7 ? 'translateX(50px)' : 'translateX(0px)' : animationStep >= 7 ? 'translateX(140px)' : 'translateX(0px)', top: isMobile ? animationStep >= 7 ? '330px' : '100vh' : animationStep >= 7 ? '518px' : '100vh', opacity: animationStep >= 7 ? 1 : 0, zIndex: '2'}} />
            <img className="sixtSectionImg2" src={"/sixthSection/img1.png"} alt="Imagen 1" style={{transform: isMobile ? animationStep >= 7 ? 'translateX(-50px)' : 'translateX(0px)' : animationStep >= 7 ? 'translateX(-140px)' : 'translateX(0px)',top: isMobile ? animationStep >= 7 ? '330px' : '100vh' : animationStep >= 7 ? '510px' : '100vh', opacity: animationStep >= 7 ? 1 : 0, zIndex: '1'}} />
 
            <div id="sixthSectionLineaVioleta" style={{left: animationStep >= 8 ? 0 : '-100%' }}></div>
            <div id="sixthSectionLineaVioleta2" style={{left: animationStep >= 8 ? 0 : '-100%' }}></div>

            <p id="sixthSectionFinalText">
                <span style={{opacity: animationStep >= 9 ? 1 : 0 }}>
                    <a target="_blank" href="https://www.linkedin.com/in/mariano-eugenio-simonetta-6768204b/">Mariano Simonetta<FaLinkedin /></a>
                    Cofundador y Director de Stream Lab. Profesional del mundo audiovisual con más de quince años de experiencia en tecnología de medios, producción y streaming. Desde SVC (Sistemas de Video Comunicación) impulso la conexión entre innovación tecnológica y creatividad, acompañando a creadores, marcas y productoras a profesionalizar sus contenidos.
                    Apasionado por el futuro de la comunicación, lidero proyectos que integran storytelling, herramientas de última generación y una comunidad de creadores que piensan en grande.
                </span>
                <span style={{opacity: animationStep >= 9 ? 1 : 0 }}>
                    <a target="_blank" href="https://www.linkedin.com/in/marinalammertyn/">Marina Lammertyn<FaLinkedin /></a>
                    Cofundadora y Manager de Stream Lab. Licenciada en Comunicación, productora y locutora integral, con años de experiencia en el mundo del podcasting y los medios digitales. Fanática del streaming y de las nuevas formas de contar historias, me apasiona crear espacios donde las ideas se transformen en contenido profesional y auténtico.
                </span>
</p>
        </section>
}