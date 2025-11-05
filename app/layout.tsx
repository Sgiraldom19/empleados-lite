import "./globals.css";
import type { ReactNode } from "react";
import Nav from "./components/Nav";
 
export const metadata = {

  title: "Empleados Lite",

};
 
export default function RootLayout({ children }: { children: ReactNode }) {

  return (
<html lang="es">
<body>
  <Nav />
  {children}
</body>
</html>

  );

}
 