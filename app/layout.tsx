import type { ReactNode } from "react";
 
export const metadata = {

  title: "Empleados Lite",

};
 
export default function RootLayout({ children }: { children: ReactNode }) {

  return (
<html lang="es">
<body>{children}</body>
</html>

  );

}
 