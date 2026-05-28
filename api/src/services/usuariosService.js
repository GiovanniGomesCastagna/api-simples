require('dotenv').config()
const db = require("../configs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaTokens = process.env.AUTH_KEY;

const adocicacao = 10;
const errorReturn = 0;


async function createUsuario(params) {
  const { nome, email, senha, role} = params;

  const senhaHash = await bcrypt.hash(senha, adocicacao);
  
  const sql = `
  INSERT INTO USUARIOS (
  NOME,
  EMAIL,
  SENHA,
  ROLE
  ) VALUES (
  $1,
  $2,
  $3,
  $4
  )
  `;

  const resposta = await db.query(sql, [nome, email, senhaHash, role]);
  return resposta;
}

async function getUsuarioByID(idUsuario) {
  const sql = `
  SELECT NOME, EMAIL, ROLE AS ROLE_BANCO
  FROM USUARIOS
  WHERE ID = $1
  `;

  const resposta = await db.query(sql, [idUsuario]);
  return resposta.rows;
}

async function getUsuarios() {
  const sql = `
  SELECT ID, NOME, EMAIL, ROLE
  FROM USUARIOS
  `
  const resposta = await db.query(sql)
  return resposta.rows
}

async function getUsuarioByEmail(emailUsuario) {
  const sql = `
    SELECT
    ID AS ID_BANCO,
    NOME AS NOME_BANCO,
    EMAIL AS EMAIL_BANCO,
    SENHA AS SENHA_BANCO,
    ROLE AS ROLE_BANCO
    FROM USUARIOS
    WHERE EMAIL = $1
    `;

  const resposta = await db.query(sql, [emailUsuario]);

  if (resposta.rows[0] == undefined) {
    return errorReturn;
  }

  return resposta.rows[0];
}

async function loginUsuario(params) {
  const { email, senha } = params;
  
  const pesquisaUsuarioPorEmail = await getUsuarioByEmail(email);
  if (pesquisaUsuarioPorEmail == 0) {
    return errorReturn;
  }

  const { id_banco, nome_banco, email_banco, senha_banco, role_banco } = pesquisaUsuarioPorEmail

  // Método de criptografia: HS256 - HMAC SHA256
  const senhaCorreta = bcrypt.compareSync(senha, senha_banco)

  if (!senhaCorreta) {
    return errorReturn;
  }

  const token = jwt.sign({
    id_banco,
    role_banco
  }, senhaTokens, {expiresIn: '1h'}) 

  return token;
}

async function updateUsuario(id, params) {
  const campos = []
  const binds = []
  let indiceBinds = 1
  
  const usuario = await getUsuarioByID(id)

  if (usuario.length == 0) {
    return errorReturn
  }
  
  if (Object.hasOwn(params, 'nome')) {
    campos.push(` nome = $${indiceBinds++} `)
    binds.push(params.nome)
  }

  if (Object.hasOwn(params, 'email')) {
    campos.push(` email = $${indiceBinds++} `)
    binds.push(params.email)
  }

  if (Object.hasOwn(params, 'senha')) {
    campos.push(` senha = $${indiceBinds++} `)
    const senhaHash = await bcrypt.hash(params.senha, adocicacao);
    binds.push(senhaHash)
  }

  if (Object.hasOwn(params, 'role')) {

    campos.push(` role = $${indiceBinds++} `)
    binds.push(params.role)
  }


  binds.push(id)
  const sql = `
  UPDATE USUARIOS
  SET ${campos.join(', ')}
  WHERE ID = $${indiceBinds++}
  RETURNING *;
  `

  const resposta = await db.query(sql, binds)
  return resposta.rows
}

async function deleteUsuario(id) {
  const sql = `
  DELETE FROM USUARIOS
  WHERE ID = $1
  `

  const resposta = await db.query(sql, [id])
  return resposta.rowCount
}

module.exports = {
  createUsuario,
  getUsuarios,
  getUsuarioByID,
  getUsuarioByEmail,
  loginUsuario, 
  updateUsuario,
  deleteUsuario
};
