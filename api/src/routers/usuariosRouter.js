const usuariosController = require('../controllers/usuariosController');
const auth = require('../middlewares/auth');
const authMiddleware = require('../middlewares/auth')
const roles = require('../middlewares/verifyRole')

module.exports = (app) => {
  app.get('/usuarios/:id', authMiddleware.verifyJWT, roles.verifyRoles, usuariosController.getUsuarioByID)
  app.get('/usuarios', authMiddleware.verifyJWT, roles.verifyRoles, usuariosController.getUsuarios)
  app.post('/usuarios/cadastrar', usuariosController.createUsuario);
  app.post('/usuarios/login', usuariosController.loginUsuario)
  app.patch('/usuarios/:id', authMiddleware.verifyJWT, usuariosController.updateUsuario)
  app.delete('/usuarios/:id', authMiddleware.verifyJWT, roles.verifyRoles, usuariosController.deleteUsuario)
}