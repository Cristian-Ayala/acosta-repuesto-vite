// Create a custom fetch wrapper to include the JWT token in the headers
async function customFetch(url, optionsTmp = {}) {
  const token = localStorage.getItem("token");

  const options = { ...optionsTmp };
  if (token) {
    options.headers = {
      ...optionsTmp.headers,
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  try {
    // Usamos fetch con await
    const response = await fetch(url, options);
    const responseClone = response.clone();
    // Verificar si la respuesta no es exitosa (status >= 200 && status < 300)
    if (!response.ok) {
      const responseBody = await responseClone.json();
      return Promise.reject(responseBody.message);
    }

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default ({ app }) => {
  /* eslint-disable-next-line */
  app.config.globalProperties.$customFetch = customFetch;
};
