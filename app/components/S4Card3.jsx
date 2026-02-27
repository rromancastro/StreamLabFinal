"use client";
import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { motion } from "framer-motion";

export const S4Card3 = ({x, y, opacity, rotate}) => {

    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.article style={{x, y, opacity, rotate}} onMouseEnter={() => setIsFlipped(!isFlipped)} onMouseLeave={() => setIsFlipped(!isFlipped)} id="s4card3" className="s4Card">
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                <div id="s4Card3Front" key="front">
                    <p>EXTRAS</p>
                </div>
                <div id="s4Card3Back" key="back">
                    <p id="s4Card3BackTitle">EXTRAS</p>
                    <p>
                        Pre producción<br />
                        Post producción<br />
                        Edición<br />
                        Hosting en spotify
                    </p>
                    <a target="_blank" href="https://wa.me/5491173586119?text=¡Hola!%20👋%20Quería%20consultarles%20sobre%20los%20servicios%20extra%20que%20ofrecen.%20¿Me%20podrían%20contar%20un%20poco%20más?">Consultar</a>
                </div>
            </ReactCardFlip>
        </motion.article>
    )
}

