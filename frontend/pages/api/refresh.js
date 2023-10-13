import nookies from 'nookies';
import { HttpClient } from '../../src/infra/HttpClient/HttpClient';
import { tokenService } from '../../src/services/auth/tokenService';

const REFRESH_TOKEN_NAME =  'REFRESH_TOKEN_NAME'

const controllers = {
  async storeRefreshToken(req, res) {
    const ctx = { req, res }
    nookies.set(ctx, REFRESH_TOKEN_NAME, req.body.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
    });
    res.json({
      data: {
        message: 'Stored with sucess!'
      }
    })
  },
  async regenerateTokens(req, res) {
    const ctx = { req, res };
    const cookies = nookies.get(ctx);
    const refresh_token = cookies[REFRESH_TOKEN_NAME]

    const refreshResponse = await HttpClient(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`,
      {
        method: "POST",
        body: {
          refresh_token,
        },
      }
    );

    if(refreshResponse.ok) {
      nookies.set(
        ctx,
        REFRESH_TOKEN_NAME,
        refreshResponse.body.data.refresh_token,
        {
          httpOnly: true,
          sameSite: "lax",
        }
      );

      tokenService.save(refreshResponse.body.data.refresh_token, ctx);

      res.json({
        refreshResponse
      })
    } else {
      res.json({
        status: 401,
        message: 'Não autorizado'
      })
    }
  }
}

const controllerBy = {
  POST: controllers.storeRefreshToken,
  GET: controllers.regenerateTokens,
}

export default function handler(req, res) {
  if(controllerBy[req.method]) return controllerBy[req.method](req, res)

  res.status(404).json({
    status: 404,
    message: 'Not found'
  })
}
