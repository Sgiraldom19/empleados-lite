"use client";
import navData from "../_data/nav.json";

export interface NavLink {
  label: string;
  href: string;
}

export function useNav() {
  const { links } = navData;

  return {
    links: links as NavLink[],
  };
}
