import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout()
        navigate("/login")
    }

    return (
        <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
            <span className="font-bold">SparkyRoll</span>
            <div className="flex gap-4 items-center">
                {token ? (
                    <>
                        <Link to="/animes">Animes</Link>
                        <Link to="/favorites">Favoritos</Link>
                        <Link to="/history">Historial</Link>
                        <button onClick={handleLogout} className="bg-red-500 rounded px-3 py-1">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Registro</Link>
                    </>
                )}
            </div>
        </nav>
    )
}