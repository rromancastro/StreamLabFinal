"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export const SeventhSection = () => {

    const {scrollYProgress} = useScroll();

    const rotacion1 = useTransform(scrollYProgress, [0.76, 0.83], [12, 0]);
    const rotacion2 = useTransform(scrollYProgress, [0.76, 0.83], [12, 0]);
        //responsive

    return <section id="seventhSection">
        <motion.div style={{rotate: rotacion1}} className="sliderContainer2">
            <div className="sliderTrack2">
                <span className="sliderText2">EXPERIMENTÁ EL STREAMING</span>
                <span className="sliderText2">EXPERIMENTÁ EL STREAMING</span>
            </div>
        </motion.div>
        <motion.div style={{rotate: rotacion2}} className="sliderContainer3">
            <div className="sliderTrack3">
                <span className="sliderText3">EXPERIMENTÁ EL STREAMING</span>
                <span className="sliderText3">EXPERIMENTÁ EL STREAMING</span>
            </div>
        </motion.div>
    </section>
}