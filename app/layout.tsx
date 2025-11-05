import "./globals.css";
import type { ReactNode } from "react";
import { useFooterData } from "./hooks/useFooterData";
import Footer from "./components/footer";
 
export const metadata = {

  title: "Empleados Lite",

};
 
export default function RootLayout({ children }: { children: ReactNode }) {

  return (
<html lang="es">
<body>{children}</body>
<Footer/>
</html>

  );

}
 