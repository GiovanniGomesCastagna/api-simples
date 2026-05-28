const authentication = require('../middlewares/auth')
const roles = require('../middlewares/verifyRole')
const produtosController = require('../controllers/produtosController')

module.exports = (app) => {
  app.post('/produtos', authentication.verifyJWT, produtosController.createProduto)
  app.get('/produtos/search', authentication.verifyJWT, produtosController.getProdutosByModelo)
  app.get('/produtos', authentication.verifyJWT, produtosController.getProdutos)
  app.patch('/produtos/mudarEstado/:id', authentication.verifyJWT, roles.verifyRoles, produtosController.changeStateProduto)
  app.delete('/produtos/:id', authentication.verifyJWT, roles.verifyRoles, produtosController.deleteProduto)
  app.patch('/produtos/:id', authentication.verifyJWT, roles.verifyRoles, produtosController.updateProduto)
}