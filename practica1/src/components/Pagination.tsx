//Se generan dos botones y un texto
//Estructura del objeto de props
interface PaginationProps {
    page: number; //numero de página (página actual)
    totalPages: number; //cantidad total de páginas
    setPage: (page: number) => void; //se pasa la función setPag
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
    return (
        <div className= "flex gap-2 items-center mt-4">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="border rounded px-3 py-1 disabled:opacity-50">Anterior</button>
            <span>Página {page + 1} de {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="border rounded px-3 py-1 disabled:opacity-50">Siguiente</button>
        </div>
    )
}