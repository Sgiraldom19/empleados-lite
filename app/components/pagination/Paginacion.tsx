type Props = {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}

export default function Paginacion({page, totalPages, onChange}: Props) {
    return (
        <div className="flex gap-2 justify-center mt-3">
        <button
          className="px-3 py-1 shadow-lg rounded-lg bg-[#5A9690]"
          disabled={page <= 1}
          onClick={() => onChange(1)}
        >
          «
        </button>
        <button
          className="px-3 py-1 shadow-lg rounded-lg bg-[#5A9690]"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          ‹
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          className="px-3 py-1 shadow-lg rounded-lg bg-[#5A9690]"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          ›
        </button>
        <button
          className="px-3 py-1 shadow-lg rounded-lg bg-[#5A9690]"
          disabled={page >= totalPages}
          onClick={() => onChange(totalPages)}
        >
          »
        </button>
      </div>
    )
}