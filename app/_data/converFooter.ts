import jsonData from "./footer.json";
import datosjson from "./nav.json"

// Aquí extraemos la informacion del doc json y lo guardamos en la variable correspondiente
export const FOOTER_INFO = {
  company: jsonData.company,
  links: jsonData.links,
  social: jsonData.social,
};
export const NAV_INFO = {
    links: datosjson.links,
};
