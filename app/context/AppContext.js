"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [turneraSeleccionada, setTurneraSeleccionada] = useState('simple');

    return <AppContext.Provider value={{turneraSeleccionada, setTurneraSeleccionada}}>
        {children}
    </AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);