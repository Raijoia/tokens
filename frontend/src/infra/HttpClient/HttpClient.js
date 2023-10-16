// arquitetura Hexagonal

import { tokenService } from "../../services/auth/tokenService";

// Ports e Adapters
export async function HttpClient(fetchUrl, fetchOptions) {
  const options = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
  };
  console.log(options)
  return fetch(fetchUrl, options)
    .then(async (respostaDoServidor) => {
      return {
        ok: respostaDoServidor.ok,
        status: respostaDoServidor.status,
        status: respostaDoServidor.statusText,
        body: await respostaDoServidor.json(),
      };
    })
    .then(async (response) => {
      if (!fetchOptions.refresh) return response;
      if (response.status !== 401) return response;

      // tentar atualizar o token
      const refreshResponse = await HttpClient("http://localhost:3000/api/refresh", {
        method: "GET",
      });
      const newAccessToken = refreshResponse.body.data.access_token;
      const newRefreshToken = refreshResponse.body.data.refresh_token;

      // guarda os tokens
      tokenService.save(newAccessToken)

      // tentar rodar o refresh anterior
      const retryResponse = await HttpClient(fetchUrl, {
        ...options,
        refresh: false,
        headers: {
          'Authorization': `Bearer ${newAccessToken}`,
        }
      })

      return retryResponse;
    });
}
