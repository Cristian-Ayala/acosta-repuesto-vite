export default async function isLoggedIn() {
  try {
    const settings = { method: 'GET', credentials: 'include' };
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}_session`,
      settings,
    );
    const response = await resp.json();
    window.console.log('response', response);
    if (response != null && response.userCtx?.name !== '') return true;
    return false;
  } catch (error) {
    window.console.error(error);
    return false;
  }
}
