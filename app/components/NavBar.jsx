'use client';
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export const NavBar = () => {

    const {scrollYProgress} = useScroll();
    const [isWhite, setIsWhite] = useState(false);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setIsWhite((latest >= 0.265 && latest < 0.375) || (latest >= 0.39 && latest < 0.48));
    });

    // menu
    const [dropMenu, setDropMenu] = useState(false);
    const closeTimeout = useRef(null);

    const handleDropMenu = (e) => {
        e.preventDefault();
        if (closeTimeout.current) clearTimeout(closeTimeout.current); 
        setDropMenu(true);
    };

    const handleMouseLeave = () => {
        closeTimeout.current = setTimeout(() => {
            setDropMenu(false);
        }, 2000);
    };

    const handleMouseEnter = () => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };

    // animacion logo
    const [positionTop1, setPositionTop1] = useState(0);
    const [positionTop2, setPositionTop2] = useState(38);

    const handClickLogo = () => {
        setPositionTop1(-38);
        setPositionTop2(0);
        setTimeout(() => {
            setPositionTop1(0);
            setPositionTop2(38);
        }, 1000);
    };

    
        //responsive
        const [isMobile, setIsMobile] = useState(false);
    
        useEffect(() => {
            const handleResize = () => setIsMobile(window.innerWidth < 863);
            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

    return (<nav>
        <a href="#firstSection" id="navLogo" onClick={handClickLogo}>
                <img src="/logo.png" alt="Logo" width={200} height={38} style={{top: positionTop1, filter: `invert(${isWhite ? '1' : '0'})`}} className="navLogoImage"
                />
                <img src="/logo.png" alt="Logo" width={200} height={38} style={{top: positionTop2, filter: `invert(${isWhite ? '1' : '0'})`}} className="navLogoImage"
                />
            </a>
            <div id="navMenu">
                <button id={isWhite ? "navMenuButton" : "navMenuButtonWhite"} onClick={handleDropMenu} style={{opacity: dropMenu ? 0 : 1, transition: '.3s', color: isWhite ? '#ffffff' : '#0A001A'}}>
                    MENÚ
                </button>
                <div id="navLinks" onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} style={{position: 'absolute', zIndex: 100, right: dropMenu ? 0 : -700, transition: 'opacity 0s, z-index 0s, right .5s'}}>
                    <motion.a href="#turneraContainer" className={isWhite ? 'navLinkWhite' : 'navLink'}>RESERVAS</motion.a>
                    <motion.a href="#thirdSection" className={isWhite ? 'navLinkWhite' : 'navLink'}>ESTUDIO</motion.a>
                    <motion.a href="#sixthSection" className={isWhite ? 'navLinkWhite' : 'navLink'}>NOSOTROS</motion.a>
                    <motion.a href="#eighthSection" className={isWhite ? 'navLinkWhite' : 'navLink'}>CONTACTO</motion.a>
                </div>
            </div>
        </nav>
    )
}
