"use client";
import { useFooterData } from "../hooks/useFooterData";
import Link from "next/link";

export default function Footer() {
  const { company, links, social } = useFooterData();

  return (
    <footer className="bg-gray-200 py-6 mt-10">
      <div className="max-w-5xl mx-auto text-center space-y-3">

        <nav className="flex justify-center gap-4 text-sm">
          {links.map((link) => (
            <Link key={link.url} href={link.url} className="text-gray-700 hover:underline">
              {link.text}
            </Link>
          ))}
        </nav>

        <div className="flex justify-center gap-4 text-xs text-gray-600">
          {social.map((item) => (
            <a key={item.platform} href={item.url} target="_blank" className="hover:underline">
              {item.platform}
            </a>
          ))}
        </div>

        <p className="text-gray-600 text-xs"> 
           {new Date().getFullYear()} {company}
        </p>
      </div>
    </footer>
  );
}