const db = require('../configs')
const errorReturn = 0;

async function createProduto(params) {
  const { marca, modelo, quantidade, preco } = params
  const sql = `
  INSERT INTO PRODUTOS(
  MARCA,
  MODELO,
  QUANTIDADE,
  PRECO
  ) VALUES (
  $1,
  $2,
  $3,
  $4 
  ) RETURNING MARCA, MODELO, QUANTIDADE, PRECO;
  `
  const resposta = await db.query(sql, [marca, modelo, quantidade, preco])
  return resposta.rows[0]
}

async function getProdutos() {
  const sql = `
  SELECT MARCA, MODELO, QUANTIDADE, PRECO, ATIVO
  FROM PRODUTOS
  `

  const resposta = await db.query(sql)
  return resposta.rows
}

async function getProdutoByID(id) {
  const sql = `
  SELECT MARCA, MODELO, QUANTIDADE, PRECO, ATIVO
  FROM PRODUTOS
  WHERE ID = $1
  `

  const resposta = await db.query(sql, [id])
  return resposta.rows
}

async function getProdutosByModelo(modelo) {
  const sql = `
  SELECT 
  MARCA, MODELO, QUANTIDADE, PRECO
  FROM PRODUTOS
  WHERE MODELO ILIKE $1
  `
  const resposta = await db.query(sql, [`%${modelo}%`])
  return resposta.rows
}

async function updateProduto(id, params) {
  const campos = []
  const binds = []
  let indiceBinds = 1
  
  const produto = await getProdutoByID(id)

  if (produto.length == 0) {
    return errorReturn
  }
  
  if (Object.hasOwn(params, 'marca')) {
    campos.push(` marca = $${indiceBinds++} `)
    binds.push(params.marca)
  }

  if (Object.hasOwn(params, 'modelo')) {
    campos.push(` modelo = $${indiceBinds++} `)
    binds.push(params.modelo)
  }

  if (Object.hasOwn(params, 'quantidade')) {
    campos.push(` quantidade = $${indiceBinds++} `)
    binds.push(params.quantidade)
  }

  if (Object.hasOwn(params, 'preco')) {
    campos.push(` preco = $${indiceBinds++} `)
    binds.push(params.preco)
  }

  binds.push(id)
  const sql = `
  UPDATE PRODUTOS
  SET ${campos.join(', ')}
  WHERE ID = $${indiceBinds++}
  RETURNING *;
  `

  const resposta = await db.query(sql, binds)
  return resposta.rows
}

async function changeStateProduto(id) {
  const produto = await getProdutoByID(id)
  
  if (produto.length == 0) {
    return errorReturn
  }

  const ativoOposto = !produto[0].ativo

  const sql = `
  UPDATE PRODUTOS
  SET ATIVO = $2
  WHERE ID = $1
  RETURNING *
  `

  const resposta = await db.query(sql, [id, ativoOposto])
  return resposta.rows
}

async function deleteProduto(id) {
  const sql = `
  DELETE FROM PRODUTOS WHERE ID = $1
  `
  const resposta = await db.query(sql, [id])
  return resposta.rowCount
}

module.exports = {
  createProduto,
  getProdutosByModelo,
  getProdutos,
  updateProduto,
  changeStateProduto,
  deleteProduto
}