//para guardar los datos en variables de estado
import { useState } from "react";
//tipos de eventos
import type { ChangeEvent, FormEvent } from "react";
//para cambiar de página
import { useNavigate } from "react-router-dom";
//conexión con el backend
import { registerUser } from "../api";

export default function Register () {
    //Definición de variables 
    const [form, setForm] = useState({email: "", password: "", name: ""})
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    //sirve para mandar al usuario a otra página
    const navigate = useNavigate();

    //Función que va a ir modificando de poco a poco y se mostrará en pantalla
    function handleChange (e: ChangeEvent<HTMLInputElement>) {
        setForm({...form, [e.target.name]: e.target.value});
    }

    //Para validar las indicaciones del backend (primera validación)
    function validar (): string {
        // se lee "si no hay ..."
        if (!form.name.trim()) return "El nombre es obligatorio";
        if (!form.email.trim()) return "El email es obligatorio";
        if (!form.email.includes("@")) return "El email no es válido";
        if (!form.password.trim()) return "La contraseña es obligatoria";
        return "";
    }

    async function handleSubmit ( e:FormEvent<HTMLFormElement> ) {
        e.preventDefault();
        //Se usa para borrar los mensajes del intento anterior
        //Solo para verse el mensaje del intento actual
        setError(""); 
        setSuccess("");
        const msj = validar();
        //Si cuenta con un valor diferente al vacío
        if (msj) {
            setError(msj)
            return;
        }
        try {
            await registerUser(form);
            setSuccess("Registro exitoso, ¡puedes iniciar sesión!")
            //Se manda al usuario al login
            setTimeout(() => navigate("/login"), 1500)
        } catch (er: any){
            //Se busca mostrar el mensaje del backend
            setError(er.response?.error || "No se pudo completar el registro")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 flex flex-col gap-3 rounded-lg">
            <h1 className="text-2xl font-bold">Registro</h1>
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}
            <input className="border rounded p-2" name="email" placeholder="Email" value={form.email} onChange={handleChange}/>
            <input className="border rounded p-2" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} type="password"/>
            <input className="border rounded p-2" name="name" placeholder="Nombre" value={form.name} onChange={handleChange}/>
            <button className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">Registrarme</button>
        </form>
    )
}


