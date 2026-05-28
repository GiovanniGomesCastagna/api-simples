const usuariosRouter = require('./usuariosRouter')
const produtosRouter = require('./produtosRouter')

module.exports = (app) => {
  usuariosRouter(app);
  produtosRouter(app);
}