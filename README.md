## Access Token:
- **Pra que serve?**
    - Pegar qualquer tipo de informação do usuário
    - Atulizar, Inserir e Deletar

- **Duração**
    - Dura pouco tempo/ mínimo possível
- **Risco se ele vazar**
    - Quanto maior o tempo de vida dele, maior o estrago que quem tiver o token pode fazer

## Refresh Token
- **Pra que serve?**
    - Literalmente, para não precisar pedir a senha e o usuário para gerar um novo access_token
- **Duração**
    - Duração longa
    - O refresh token a nivel de backend ta associado ao usuário de alguma forma
- **Risco se ele vazar**
    - Se ele vazar o usuário novo pode gerar token infinitos, tanto access_token como o refresh_token
    - Precisa ter alguma forma de invalidar o refresh tokens
