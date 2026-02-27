"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PagoRechazado() {

    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.replace('/')
        }, [3000])
    }, [])

    return <section className="checkOutSection">
        <div>
            <p>Tu pago fue Rechazado, intentalo nuevamente. Tu turno no será reservado hasta que el pago sea realizado con éxito.</p>
        </div>
    </section>
}