import { useEffect, useState } from "react";
import { listAnime, historyAnime, deleteHistoryAnime } from "../api";
import type { GetAnime, PostAnime } from "../api";
import Pagination from "../components/Pagination";

export default function History() {
  const [animes, setAnimes] = useState<GetAnime[]>([]);
  const [historial, setHistorial] = useState<PostAnime[]>(JSON.parse(localStorage.getItem("history") || "[]"));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(0);
  const size = 5;

  useEffect(() => {
    async function cargar() {
      try {
        const data = await listAnime();
        setAnimes(data);
      } catch (err: any) {
        setError("No se pudieron cargar los animes");
      }
    }
    cargar();
  }, []);


  async function handleStatus (animeId: number, status: string) {
    setError("");
    setSuccess("");

    try {
        await historyAnime({animeId, status});
        const sinEste = historial.filter((item) => item.animeId !== animeId);
        const nuevos = [...sinEste, { animeId, status }];
        setHistorial(nuevos);
        localStorage.setItem("history", JSON.stringify(nuevos));
        setSuccess(`Marcado como ${status}`);
    } catch (er: any) {
        setError(er.response?.data?.error || "No se pudo actualizar el historial");
    }};
  async function handleRemove (animeId: number) {
    setError("");
    setSuccess("");
    try {
      await deleteHistoryAnime(animeId);
      const nuevos = historial.filter((item) => item.animeId !== animeId);
      setHistorial(nuevos);
      localStorage.setItem("history", JSON.stringify(nuevos));
      setSuccess("Quitado del historial");
    } catch (err: any) {
      setError(err.response?.data?.error || "No se pudo quitar del historial");
    }
  }
  function buscarAnime(animeId:number) {
    return animes.find((anime) => anime.id == animeId); }

  const elementos = historial.slice(page * size, page * size + size);
  const totalPages = Math.ceil(historial.length / size);   
    return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Historial</h1>
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      {historial.length === 0 && <p className="text-red-600">Tu historial está vacío</p>}
      <ul className="flex flex-col gap-3">
        {elementos.map((elemento) => (
          <li key={elemento.animeId} className="border rounded p-4 flex justify-between items-center">
            <div>
              <p className="font-bold">{buscarAnime(elemento.animeId)?.title}</p>
              <p className="text-sm text-gray-500">Estado: {elemento.status}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleStatus(elemento.animeId, "viendo")} className="bg-yellow-500 text-white rounded px-3 py-1">Viendo</button>
              <button onClick={() => handleStatus(elemento.animeId, "visto")} className="bg-green-600 text-white rounded px-3 py-1">Visto</button>
              <button onClick={() => handleRemove(elemento.animeId)} className="bg-red-500 text-white rounded px-3 py-1">Quitar</button>
            </div>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

   