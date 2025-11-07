"use client";

import { useEffect, useMemo, useState } from "react";
 
export interface UsePaginationOptions {

  initialPage?: number;

  initialPageSize?: number;

}
 
export default function usePagination(opts: UsePaginationOptions = {}) {

  const { initialPage = 1, initialPageSize = 10 } = opts;
 
  const [page, _setPage] = useState(Math.max(1, initialPage));

  const [pageSize, _setPageSize] = useState(Math.max(1, initialPageSize));

  const [total, setTotal] = useState(0);
 
  const totalPages = useMemo(

    () => Math.max(1, Math.ceil(total / pageSize)),

    [total, pageSize]

  );
 
  useEffect(() => {

    if (page > totalPages) _setPage(totalPages);

    if (page < 1) _setPage(1);

  }, [page, totalPages]);
 
  const setPage = (p: number) => {

    const clamped = Number.isFinite(p) ? Math.max(1, Math.min(p, totalPages)) : 1;

    _setPage(clamped);

  };
 
  const setPageSize = (s: number) => {

    const size = Number.isFinite(s) ? Math.max(1, Math.floor(s)) : 10;

    _setPageSize(size);

    _setPage(1); // cada que cambiamos la cantidad de registros , volvemos a la pag 1

  };
 
  const offset = (page - 1) * pageSize;

  const limit = pageSize;
 
  return {

    page,

    pageSize,

    total,

    totalPages,

    setPage,

    setPageSize,

    setTotal,

    offset,

    limit,

  };

}

 