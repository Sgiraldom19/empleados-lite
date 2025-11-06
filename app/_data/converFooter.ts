import jsonData from "./footer.json";
import datosjson from "./nav.json"

// Aquí convertimos el JSON en una constante
export const FOOTER_INFO = {
  company: jsonData.company,
  links: jsonData.links,
  social: jsonData.social,
};
export const NAV_INFO = {
    links: datosjson.links,
};
