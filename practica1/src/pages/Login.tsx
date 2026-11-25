import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api"
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [form, setForm] = useState({email:"", password:""});
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    function handleChange (e: ChangeEvent<HTMLInputElement>) {
        setForm({...form, [e.target.name] : e.target.value});
    }

    function validar () {
        if (!form.email.trim()) return "El email es obligatorio";
        if (!form.email.includes("@")) return "El email no es válido";
        if (!form.password.trim()) return "La contraseña es obligatoria";
        return "";
    }

    async function handleSubmit (e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const msj = validar();
        if (msj) {
            setError(msj);
            return;
        }
        try {
            const data = await loginUser(form);
            login(data.token)
            navigate("/animes");
        } catch (er: any) {
            setError(er.response?.data?.error || "No se pudo iniciar sesión");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 flex flex-col gap-3 rounded-lg">
            <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
            {error && <p className="text-red-600">{error}</p>}
            <input className="border rounded p-2" name="email" placeholder="Email" value={form.email} onChange={handleChange}/>
            <input className="border rounded p-2" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} type="password"/>
            <button className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">Entrar</button>
        </form>
    )
}