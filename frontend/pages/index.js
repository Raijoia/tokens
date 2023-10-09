import { useState } from 'react';
import { useRouter } from 'next/router';

export default function HomeScreen() {
  const router = useRouter();
  const [values, setValues] = useState({
    usuario: 'Raí',
    senha: 'safepassword',
  })  

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
        event.preventDefault();

        router.push('/auth-page-ssr');
        router.push("/auth-page-static");
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
