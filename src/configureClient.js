// Change tab title
const clientName = import.meta.env.VITE_CLIENT_NAME || "Acosta Repuestos";

document.title = clientName;

// Change favicon
const faviconLink = document.querySelector("link[rel='icon']");
if (faviconLink)
  faviconLink.href = import.meta.env.VITE_CLIENT_ICON_PATH || "/img/icon.png";

// Change theme color
document.documentElement.style.setProperty("--primary-app-color", import.meta.env.VITE_CLIENT_MAIN_COLOR || "#e94c63");
