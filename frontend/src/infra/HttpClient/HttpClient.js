// arquitetura Hexagonal

import { tokenService } from "../../services/auth/tokenService";
import nookies from 'nookies';

// Ports e Adapters
export async function HttpClient(fetchUrl, fetchOptions = {}) {
  const defaultHeaders = fetchOptions.headers || {}
  const options = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...defaultHeaders,
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

      const isServer = Boolean(fetchOptions?.ctx);
      const currentRefreshToken = fetchOptions?.ctx?.req?.cookies['REFRESH_TOKEN_NAME'];

      try {
        // tentar atualizar o token
        const refreshResponse = await HttpClient(
          "http://localhost:3000/api/refresh",
          {
            method: isServer ? "PUT" : "GET",
            body: isServer ? { refresh_token: currentRefreshToken } : undefined,
          }
        );

        const newAccessToken = refreshResponse.body.data.access_token;
        const newRefreshToken = refreshResponse.body.data.refresh_token;
  
        // guarda os tokens
        if(isServer.ok) {
          nookies.set(
            fetchOptions.ctx,
            'REFRESH_TOKEN_NAME',
            newRefreshToken,
            {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
            }
          );
        }
        
        // tentar rodar o refresh anterior
        tokenService.save(newAccessToken)
        const retryResponse = await HttpClient(fetchUrl, {
          ...options,
          refresh: false,
          headers: {
            'Authorization': `Bearer ${newAccessToken}`,
          }
        })

        return retryResponse
      } catch(error) {
        console.error(error)
        return reponse 
      }

      return retryResponse;
    });
}
