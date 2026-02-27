"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PagoRealizado() {

    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.replace('/')
        }, [3000])
    }, [])

    return <section className="checkOutSection">
        <div>
            <p>Tu pago se encuentra pendiente. Tu turno no será reservado hasta que el pago sea realizado con éxito.</p>
        </div>
    </section>
}