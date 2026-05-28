const rolesService = require('../services/rolesSevice')

async function createRole (req, res) {
  if (!req.body.nome || !req.body.acesso) {
    return res.status(404).json({
      status: 'error',
      message: `Campos obrigatórios faltando. Preencha 'nome' e 'acesso' para prosseguir`
    })
  }

  try {
    const role = await rolesService.createRole(req.body)

    return res.status(201).json({
      status: 'ok',
      message: `Role Criada com sucesso.`,
      data: role
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`
    });
  }
}

async function getRole(req, res) {
  const { id } = req.query
  const role = await rolesService.getRole(id)

  if (role == 0) {
    return res.status(404).json({
      status: 'error',
      message: `Role não encontrada ou não existente`
    })
  }

  return res.status(200).json({role})
}

async function deleteRole(req, res) {
  const { id } = req.query
  
}

module.exports = {
  createRole,
  getRole,
  deleteRole
}