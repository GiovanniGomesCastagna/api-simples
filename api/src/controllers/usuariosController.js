const usuariosService = require("../services/usuariosService");
const jwt = require("jsonwebtoken");

async function createUsuario(req, res) {
  try {
    if (
      !Object.hasOwn(req.body, "email") ||
      !Object.hasOwn(req.body, "senha")
    ) {
      return res.status(400).json({
        status: "error",
        message: `Campos obrigatórios faltando. Preencha 'email' e 'senha' para prosseguir.`,
      });
    }

    const verificarEmailExistente = await usuariosService.getUsuarioByEmail(
      req.body.email,
    );

    if (verificarEmailExistente != 0) {
      return res.status(409).json({
        status: "error",
        message: `Email já está cadastrado. Favor inserir outro e-mail.`,
      });
    }

    if (!Object.hasOwn(req.body, "nome")) {
      req.body.nome = req.body.email;
    }

    if (!Object.hasOwn(req.body, "role")) {
      req.body.role = "2";
    }

    const cadastroUsuario = await usuariosService.createUsuario(req.body);

    return res.status(201).json({
      status: "ok",
      message: `Usuário cadastrado com sucesso.`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`,
    });
  }
}

async function getUsuarios(req, res) {
  const usuarios = await usuariosService.getUsuarios()

  return res.status(200).json({usuarios})
}

async function getUsuarioByID(req, res) {
  try {
    const id = req.params.id
    const resultado = await usuariosService.getUsuarioByID(id);

    if (resultado == 0) {
      return res.status(404).json({
        status: "not found",
        message: `Usuário não existente.`,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`,
    });
  }
}

async function loginUsuario(req, res) {
  try {
    if (
      !Object.hasOwn(req.body, "email") ||
      !Object.hasOwn(req.body, "senha")
    ) {
      return res.status(400).json({
        status: "User error",
        message: `Estão faltando informações. Favor preencher os campos obrigatórios: email e senha.`,
      });
    }

    const tokenLogin = await usuariosService.loginUsuario(req.body);

    if (tokenLogin == 0) {
      return res.status(401).json({
        status: "User error",
        message: `Credenciais incorretas. Tente novamente ou cadastre-se.`,
      });
    }

    return res.status(201).json({
      status: "Successful login",
      tokenLogin,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`,
    });
  }
}

async function updateUsuario(req, res) {
  const id = req.params.id;
  const authHeader = req.headers.authorization;

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (req.body.email) {
    const verificarEmailExistente = await usuariosService.getUsuarioByEmail(
      req.body.email,
    );
    if (verificarEmailExistente.length > 0) {
      return res.status(409).json({
        status: "error",
        message: `Email já está cadastrado. Favor inserir outro e-mail.`,
      });
    }
  }

  if (req.body.senha && req.body.confirmarSenha) {
    if (req.body.senha !== req.body.confirmarSenha) {
      return res.status(401).json({
        status: "error",
        message: `As senhas precisam ser iguais.`,
      });
    }
  } else if (req.body.senha && !req.body.confirmarSenha) {
    return res.status(400).json({
      status: "error",
      message: `Você precisa preencher o campo 'confirmarSenha' para alterar a senha.`,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_KEY);
    const { role_banco, id_banco } = decoded;

    //verifica se o usuário (não admin) está alterando o próprio usuário
    if (role_banco >= 2 && Number(id) !== Number(id_banco)) {
      return res.status(403).json({
        status: "error",
        message: `Você não tem permissão para alterar dados de outro usuário.`,
      });
    }

    if (role_banco >= 2 && Object.hasOwn(req.body, "role")) {
      return res.status(403).json({
        status: "error",
        message: `Você não pode alterar sua role.`,
      });
    }

    if (
      Object.hasOwn(req.body, "acesso") &&
      typeof req.body.acesso !== "number"
    ) {
      return res.status(400).json({
        status: "error",
        message: `Campo acesso inválido. Valor deve ser um número.`,
      });
    }

    const atualizarUsuario = await usuariosService.updateUsuario(id, req.body);

    if (atualizarUsuario == 0) {
      return res.status(404).json({
        status: "error",
        message: `Usuário não encontrado ou inexistente.`,
      });
    }

    return res.status(204).json({
      status: "ok",
      message: `Usuário atualizado com sucesso.`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`,
    });
  }
}

async function deleteUsuario(req, res) {
  const id = req.params.id;

  if (id <= 0) {
    return res.status(400).json({
      status: "error",
      message: `Insira um ID maior que zero`,
    });
  }

  try {
    const usuarioDeletado = await usuariosService.deleteUsuario(id);
    if (usuarioDeletado == 0) {
      return res.status(404).json({
        status: 'error',
        message: `Usuário não encontrado ou inexistente.`
      })
    }
    return res.status(200).json({
      status: "ok",
      message: `Usuário deletado com sucesso`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`,
    });
  }
}

module.exports = {
  createUsuario,
  getUsuarios,
  getUsuarioByID,
  loginUsuario,
  updateUsuario,
  deleteUsuario
};
