const db = require('../configs')
const errorReturn = 0

async function createRole(params) {
  const { nome, acesso } = params

  const sql = `
  INSERT INTO ROLES (
  NOME,
  ACESSO
  ) VALUES (
  $1,
  $2 
  ) RETURNING *
  `

  const resposta = await db.query(sql, [nome, acesso])
  return resposta.rows
}

async function getRole(id) {
  const sql = `
  SELECT NOME, ACESSO
  FROM ROLES
  WHERE ID = $1
  `

  const resposta = await db.query(sql, [id])

  if (resposta.rows[0] == undefined) {
    return errorReturn;
  }

  return resposta.rows[0]
}

async function deleteRole(params) {
  const { id } = params
  const sql = `
  DELETE FROM ROLES WHERE ID = $1
  `

  const resposta = await db.query(sql, [id])
  return resposta
}

module.exports = {
  createRole,
  getRole,
  deleteRole
}