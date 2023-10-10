import { useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../src/services/auth/authService';

export default function HomeScreen() {
  const router = useRouter();
  const [values, setValues] = useState({
    usuario: "omariosouto",
    senha: "safepassword",
  });  

  function handleChange(event) {
    const fieldValue = event.target.value;
    const fieldName = event.target.name;
    setValues((currentValues) => {
      return {
        ...currentValues,
        [fieldName]: fieldValue,
      }
    })
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(event) => {
        // onSubmit => controler (pega dados de um usuário e passa para um serviço)
        // uthService => serviço
        event.preventDefault();

        authService.login({
          username: values.usuario,
          password: values.senha,
        })
        .then (() => {
          router.push('/auth-page-ssr');
          // router.push("/auth-page-static");
        })
        .catch((error) => {
          alert("usuário ou senha inválidos");
          console.log(error)
        })

      }}>
        <input
          placeholder="Usuário"
          name="usuario"
          defaultValue="omariosouto"
          value={values.usuario}
          onChange={handleChange}
        />
        <input
          placeholder="Senha"
          name="senha"
          type="password"
          defaultValue="safepassword"
          value={values.senha}
          onChange={handleChange}
        />
        {/* <pre>
          {JSON.stringify(values, null, 2)}
        </pre> */}
        <div>
          <button>Entrar</button>
        </div>
      </form>
    </div>
  );
}
