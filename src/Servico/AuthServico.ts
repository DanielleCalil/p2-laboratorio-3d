import { buscarUsuarioPorEmailRepositorio } from "../Repositorio/AuthRepositorio";
import { gerarToken, verificarSenha } from "../Utils/criptografia";
import { ErroApi } from "../Utils/erroApi";

const loginServico = async (usuario: unknown, senha: unknown) => {
  if (
    typeof usuario !== "string" ||
    usuario.trim().length > 191 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.trim()) ||
    typeof senha !== "string" ||
    senha.length === 0 ||
    senha.length > 128
  ) {
    throw new ErroApi(400, "Informe o e-mail em usuario e uma senha válida.");
  }

  const usuarioEncontrado = await buscarUsuarioPorEmailRepositorio(
    usuario.trim().toLowerCase(),
  );
  if (
    !usuarioEncontrado ||
    !(await verificarSenha(senha, usuarioEncontrado.senha))
  ) {
    throw new ErroApi(401, "Usuário ou senha inválidos.");
  }

  return {
    idUsuario: usuarioEncontrado.id,
    token: gerarToken(usuarioEncontrado.id),
  };
};

export { loginServico };
