import { useEffect, useState } from "react";
import { listAnime, deleteFavoriteAnime } from "../api";
import type { GetAnime } from "../api";
import Pagination from "../components/Pagination";

export default function Favorites() {
    const [animes, setAnimes] = useState<GetAnime[]>([]);
    const [ids, setIds] = useState<number[]>(JSON.parse(localStorage.getItem("favorites") || "[]"));
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [page, setPage]= useState(0);
    const size = 5;

    useEffect(() => {
        async function cargar() {
            try {
                const data = await listAnime();
                setAnimes(data);
            } catch (er: any) {
                setError("No se pudieron cargar los animes");
            }
        }
        cargar();
    },[])

    async function handleRemove(animeId: number) {
        setError("");
        setSuccess("");
        try {
            await deleteFavoriteAnime(animeId);
            const nuevos = ids.filter((id) => id !== animeId);
            setIds(nuevos);
            localStorage.setItem("favorites", JSON.stringify(nuevos))
            setSuccess("Quitado de favoritos")
        } catch (er: any) {
            setError(er.response?.data?.console.error || "No se pudo quitar de favoritos");
        }
    }

    const favoritos = animes.filter((anime) => ids.includes(anime.id));
    const elementos = favoritos.slice(page * size, page * size + size);
    const totalPages = Math.ceil(favoritos.length/size);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Favoritos</h1>
            {error && <p className="text-red-600"> {error}</p>}
            {success && <p className="text-green-600">{success}</p>}
            {favoritos.length == 0 && <p className="text-red-600">No tienes favoritos</p>}
            <ul className="flex flex-col gap-3">
                {elementos.map(
                    (elemento) => <li key= {elemento.id} className="border rounded p-4 flex justify-between items-center">
                        <div>
                            <p className="font-bold">{elemento.title}</p>
                            <p className="text-sm text-gray-500">{elemento.genre}</p>
                        </div>
                        <button onClick={() => handleRemove(elemento.id)}>Remover</button>
                    </li>
                )}
            </ul>
            <Pagination page={page} totalPages={totalPages} setPage={setPage}/>
        </div>
    )
}