"use client";
import { useEffect, useRef, useState } from "react";
import { MdPlayArrow } from "react-icons/md";
import { useAppContext } from "../context/AppContext";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const FifthSection = () => {
    const {turneraSeleccionada} = useAppContext();

    const [article, setArticle] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef(null);

    const totalSlides = 12;

    const nextArticle = () => {
        setArticle((prev) => (prev === totalSlides ? 1 : prev + 1));
    };

    const prevArticle = () => {
        setArticle((prev) => (prev === 1 ? totalSlides : prev - 1));
    };

    useEffect(() => {
        if (!isHovered) {
            clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(nextArticle, 2500);
        return () => clearInterval(intervalRef.current);
    }, [isHovered]);

    const resetInterval = (callback) => {
        clearInterval(intervalRef.current);
        callback();
        if (isHovered) {
            intervalRef.current = setInterval(nextArticle, 2500);
        }
    };

     //responsive
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 863);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    //scroll
    const { scrollYProgress } = useScroll();
    const [progress, setProgress] = useState(0);
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setProgress(latest);
    });

    const {inView, ref} = useInView({
        threshold: 0.8,
    });

    useEffect(() => {
        if (inView) {
            setIsHovered(true);
        } else {
            setIsHovered(false);
        }
    }, [inView]);

    return <section ref={ref} style={{backgroundColor: isMobile ? turneraSeleccionada === 'simple' ? progress >= 0.15 && progress <= 0.40 ? '#7B2CBF' : '#ffffff' : progress >= 0.15 && progress <= 0.42 ? '#7B2CBF' : '#ffffff' : progress >= 0.265 && progress <= 0.375 ? '#7B2CBF' : '#ffffff', transition: '.5s'}} id="fifthSection">
            <h1>CONOCÉ TU<br />PRÓXIMO ESTUDIO</h1>
            <article style={{left: article === 1 ? '0%' : article <= 3 ? '-100%' : '100%', transition: article === 12 || article <= 2 ? '.5s' : '0s', zIndex: 100}} className="firstSectionArticle" id="firstSectionArticle1">
                <h2>CONOCÉ TU<br />
                    PRÓXIMO ESTUDIO
                </h2>
            </article>
            <article style={{left: article === 2 ? '0%' : article === 3 ? '-100%' : '100%', transition: article >= 1 && article <= 4 ? '.5s' : '0s'}} className="firstSectionArticle" id="firstSectionArticle2">
                <div className="fifthSectionCard">
                    <p>MICRÓFONOS<br />PROFESIONALES</p>
                </div>
            </article>
            <article style={{left: article === 3 ? '0%' : article === 4 ? '-100%' : '100%', transition: article >= 2 && article <= 5 ? '.5s' : '0s'}} className="firstSectionArticle" id="firstSectionArticle3">
                <div className="fifthSectionCard">
                    <p>MICRÓFONOS<br />PROFESIONALES</p>
                </div>
            </article>
            <article style={{left: article === 4 ? '0%' : article === 5 ? '-100%' : '100%', transition: article >= 3 && article <= 6 ? '.5s' : '0s'}} className="firstSectionArticle" id="firstSectionArticle4">
                <div className="fifthSectionCard">
                    <p>CÁMARAS 4K</p>
                </div>
            </article>
            <article style={{left: article === 5 ? '0%' : article === 6 ? '-100%' : '100%', transition: article >= 4 && article <= 7 ? '.5s' : '0s'}} className="firstSectionArticle" id="firstSectionArticle5">
                <div className="fifthSectionCard">
                    <p>CÁMARAS 4K</p>
                </div>
            </article>
            <article style={{left: article === 6 ? '0%' : article === 7 ? '-100%' : '100%', transition: article >= 5 && article <= 8 ? '.5s' : '0s'}} className="firstSectionArticle" id="firstSectionArticle6">
                <div className="fifthSectionCard">
                    <p>ILUMINACIÓN</p>
                </div>
            </article>
            <article style={{left: article === 7 ? '0%' : article === 8 ? '-100%' : '100%', transition: article >= 6 && article <= 9 ? '.5s' : '0s'}} className="firstSectionArticle" id="firstSectionArticle7">
                <div className="fifthSectionCard">
                    <p>ILUMINACIÓN</p>
                </div>
            </article>
            <article style={{left: article === 8 ? '0%' : article === 9 ? '-100%' : '100%', transition: article >= 7 && article <= 10 ? '.5s' : '0s'}} className="firstSectionArticle" id="firstSectionArticle8">
                <div className="fifthSectionCard">
                    <p>MONITOREO EN<br />TIEMPO REAL</p>
                </div>
            </article>
            <article style={{left: article === 9 ? '0%' : article === 10 ? '-100%' : '100%', transition: article >= 8 && article <= 11 ? '.5s' : '0s'}} className="firstSectionArticle" id="firstSectionArticle9">
                <div className="fifthSectionCard">
                    <p>MONITOREO EN<br />TIEMPO REAL</p>
                </div>
            </article>
            <article style={{left: article === 10 ? '0%' : article === 11 ? '-100%' : '100%', transition: article >= 9 && article <= 12 ? '.5s' : '0s'}} className="firstSectionArticle" id="firstSectionArticle10">
                <div className="fifthSectionCard">
                    <p>MONITOREO EN<br />TIEMPO REAL</p>
                </div>
            </article>
            <article style={{left: article === 11 ? '0%' : article === 12 ? '-100%' : '100%', transition: article >= 10 && article <= 13 ? '.5s' : '0s'}} className="firstSectionArticle" id="firstSectionArticle11">
                <div className="fifthSectionCard">
                    <p>MONITOREO EN<br />TIEMPO REAL</p>
                </div>
            </article>
            <article style={{left: article === 12 ? '0%' : article <= 2 ? '-100%' : '100%', transition: article >= 11 || article === 1 ? '.5s' : '0s'}} className="firstSectionArticle" id="firstSectionArticle12">
                <div className="fifthSectionCard">
                    <p>MONITOREO EN<br />TIEMPO REAL</p>
                </div>
            </article>

        {/* buttons */}
            <button
                onClick={() => resetInterval(prevArticle)}
                className="fifthSectionButton"
                id="fifthSectionButtonPrev"
            >
                <MdPlayArrow className="fifthSectionButtonIcon rotate-180" />
            </button>
            <button
                onClick={() => resetInterval(nextArticle)}
                className="fifthSectionButton"
                id="fifthSectionButtonNext"
            >
                <MdPlayArrow className="fifthSectionButtonIcon" />
            </button>
    </section>
}