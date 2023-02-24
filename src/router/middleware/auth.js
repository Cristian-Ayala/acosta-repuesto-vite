function getUserOrgDivision(userName) {
  if (userName == null) return;
  if (localStorage.getItem("org_division") != null) return;
  const settings = { method: "POST", credentials: "include" };
  settings.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  settings.body = JSON.stringify({ selector: { name: userName }, fields: ["organization_unit"] });
  fetch(
    `${import.meta.env.VITE_BACKEND_URL}users/_find`,
    settings,
  )
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("org_division", data.docs[0].organization_unit);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default async function isLoggedIn() {
  try {
    const settings = { method: "GET", credentials: "include" };
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}_session`,
      settings,
    );
    const response = await resp.json();
    localStorage.setItem("user_name", response.userCtx?.name || null);
    localStorage.setItem("role", response.userCtx?.roles[0] || null);
    getUserOrgDivision(response.userCtx?.name);
    if (response != null && response.userCtx?.name != null && response.userCtx?.name.trim() !== "") return true;
    return false;
  } catch (error) {
    window.console.error(error);
    return false;
  }
}
