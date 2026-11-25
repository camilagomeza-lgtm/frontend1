import { useEffect, useState } from "react";
import { listAnime,favoriteAnimes, historyAnime } from "../api";
import type { GetAnime, PostAnime } from "../api";
import Pagination from "../components/Pagination";

export default function Animes() {
    //Se va a guardar a cada objeto anime dentro de animes
    const [animes, setAnimes] = useState<GetAnime[]>([]);
    //error y success guardan los mensajes de si salió bien o mal
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    //indica el número de página
    const [page, setPage] = useState(0);
    //cantidad de elementos por página
    //es variable normal porque nunca cambia
    const size = 5 

    //Cargar la lista 
    useEffect(() => {
        //conexión con backend
        async function cargar() {
            try {
                const data = await listAnime();
                setAnimes(data);
            } catch (er: any) {
                setError("No se pudieron cargar los animes")
            }
        }
        cargar();
    }, []);

    //Agregar a favoritos
    async function handleFavorite(animeId: number) {
        setError("");
        setSuccess("");
        try {
            await favoriteAnimes(animeId);
            const ids: number[] = JSON.parse(localStorage. getItem("favorites") || "[]");
            localStorage.setItem("favorites", JSON.stringify([...ids, animeId]));
            setSuccess("¡Se agregó a favoritos exitosamente!")
        } catch (er: any) {
            setError(er.response?.data?.error || "No se pudo agregar a favoritos")
        }
    }

    //Indicar si está viendo o no
    async function handleHistory(animeId:number, status:string) {
        setError("");
        setSuccess("");
        try {
            await historyAnime({animeId, status});
            const historial: PostAnime[] = JSON.parse(localStorage.getItem("history") || "[]");
            const nuevos = [...historial.filter((h) => h.animeId !== animeId), { animeId, status }];
            localStorage.setItem("history", JSON.stringify(nuevos));
            setSuccess(`Marcado como ${status}`)
        } catch (er: any) {
            setError(er.response?.data?.error || "No se pudo actualizar el historial")
        }
    }

    const elementos = animes.slice(page * size, page * size + size);
    const totalPages = Math.ceil(animes.length / size);

    return (
        <div className="max-w-2xl mx-auto mt-8 p-4">
            <h1 className="text-2xl font-bold mb-4">Animes</h1>
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}
            <ul className="flex flex-col gap-3">
                {elementos.map(
                    (elemento) => <li key = {elemento.id} className="border rounded p-4 flex justify-between items-center">
                        <div>
                            <p className="font-bold">{elemento.title}</p>
                            <p className="font-sm text-gray-500">{elemento.genre}</p>
                        </div>
                        <div>
                            <button onClick={() => handleFavorite(elemento.id)} className="bg-pink-500 text-white rounded px-3 py-1">Favorito</button>
                            <button onClick={() => handleHistory(elemento.id, "viendo")} className="bg-yellow-500 text-white rounded px-3 py-1">Viendo</button>
                            <button onClick={() => handleHistory(elemento.id, "visto")} className="bg-green-600 text-white px-3 py-1">Visto</button>
                        </div>
                    </li>)}
            </ul>
            <Pagination page={page} totalPages={totalPages} setPage={setPage}></Pagination>
        </div>
    )
}