"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { MdOutlineWatchLater } from "react-icons/md";
import { verSalas } from "../helpers/apiCall";

export const S4Card1 = ({x, y, opacity, rotate}) => {

    const [isFlipped, setIsFlipped] = useState(false);

    const [valorSala, setValorSala] = useState(0);
    useEffect(() => {
        verSalas()
            .then(data => {
            console.log("Datos recibidos:", data.data[0]);
            setValorSala(Number(data.data[0].precio_por_hora));
            })
            .catch(err => console.error("Error al obtener salas:", err));
    }, []);

    return (
        <motion.article style={{x, y, opacity, rotate}} onMouseEnter={() => setIsFlipped(!isFlipped)} onMouseLeave={() => setIsFlipped(!isFlipped)} className="s4Card">
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                <div id="s4Card1Front" key="front">
                    <p>TURNO
                        <br />
                    SIMPLE</p>
                </div>
                <div id="s4Card1Back" key="back">
                    <p id="s4Card1BackTitle">TURNO
                        <br />
                    SIMPLE</p>

                    <div id="s4Card1BackInfo">
                        <p><MdOutlineWatchLater width={18} height={18}/> 2hs</p>
                        <p>1 Turno
                            <br />
                           Lunes a Sábado
                        </p>
                        <p>Precio: <span>${valorSala.toLocaleString("es-AR")}</span></p>
                    </div>

                    <a href="#turneraContainer">Reservar</a>
                </div>
            </ReactCardFlip>
        </motion.article>
    )
}