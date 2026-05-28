const jwt = require('jsonwebtoken')
const rolesService = require('../services/rolesSevice')
// usado para locais onde é necessário um administrador (delete usuário, produto, etc)
async function verifyRoles(req, res, next) {
  const authHeader = req.headers.authorization

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.AUTH_KEY)
    const { role_banco } = decoded

    const verificarRole = await rolesService.getRole(role_banco)
    
    if (!verificarRole) {
      return res.status(403).json({
        status: 'error',
        message: 'Role não existe.'
      })
    }
    
    const { acesso } = verificarRole
    
    if (acesso >= 2) {
      return res.status(403).json({
        status: 'error',
        message: `Você não tem acesso a este conteúdo`
      })
    }

    next()

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`,
    });
  }
}

module.exports = {
  verifyRoles
}