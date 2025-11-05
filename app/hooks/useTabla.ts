import { useState } from "react";

export default function useTabla() {
  const [sort, setSort] = useState<string>("");
  const [dir, setDir] = useState<"asc" | "desc">("asc");

  function toggleSort(column: string) {
    if (sort === column) {
      setDir(dir === "asc" ? "desc" : "asc");
    } else {
      setSort(column);
      setDir("asc");
    }
  }

  return {
    sort,
    dir,
    toggleSort,
  };
}
