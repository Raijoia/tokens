const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY';
import nookies from 'nookies';

const ONE_SECOND = 1;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_YEAR = ONE_DAY * 365;

export const tokenService = {
  save(acessToken, ctx = null) {
    globalThis?.localStorage.setItem(ACCESS_TOKEN_KEY, acessToken);
    globalThis?.sessionStorage.setItem(ACCESS_TOKEN_KEY, acessToken);
    nookies.set(ctx, ACCESS_TOKEN_KEY, acessToken, {
      maxAge: ONE_YEAR,
      path: '/',
    });
  },
  get(ctx = null) {
    const cookies = nookies.get(ctx);
    return cookies[ACCESS_TOKEN_KEY] || '';
    // return globalThis?.localStorage?.getItem(ACCESS_TOKEN_KEY);
    // return sessionStorage.setItem(ACCESS_TOKEN_KEY, acessToken);
  },
  delete(ctx = null) {
    globalThis?.localStorage?.removeItem(ACCESS_TOKEN_KEY, acessToken);
    globalThis?.sessionStorage?.removeItem(ACCESS_TOKEN_KEY, acessToken);
    nookies.destroy(ctx, ACCESS_TOKEN_KEY);
  },
};
