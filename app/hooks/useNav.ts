"use client";
import { NAV_INFO } from "../_data/converFooter";
import {NavLink} from "../_types/ui";

export function useNav() {
  const { links } = NAV_INFO;

  return {
    links: links as NavLink[],
  };
}
