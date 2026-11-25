import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react"; 

//Describe las tres cosas que se comparten
interface AuthContextType {
    token: string | null; 
    login: (token: string) => void;
    logout: () => void;
}

//Se crea el contexto
const AuthContext = createContext<AuthContextType | null>(null);

//Se guarda el token en una variable de estado
export function AuthProvider ({children} : {children : ReactNode}) {
    const [token, setToken] = useState(localStorage.getItem("token"));

    function login (newToken:string) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }
    
    function logout() {
        localStorage.removeItem("token");
        setToken(null);
    }  

    return (
        <AuthContext.Provider value={{token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};

//Hook que usa cada componente para recibir esas tres propiedades
export function useAuth (){
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
}