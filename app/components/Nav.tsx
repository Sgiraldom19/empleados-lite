"use client";

import Link from "next/link";
import { useNav } from "../hooks/useNav";

export default function Nav() {
  const { links } = useNav();

  return (
    <nav className="flex items-center justify-between bg-gray-100 px-6 py-4">
      <div className="font-bold text-lg">Mi Sitio</div>

      <ul className="flex gap-6">
        {links.map((link, index) => (
          <li key={`${link.label}-${index}`}>
            <Link
              href="#"
              className="text-gray-700 hover:text-blue-500 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
