const produtosService = require("../services/produtosService");

async function createProduto(req, res) {
  try {
    if (
      !Object.hasOwn(req.body, "marca") ||
      !Object.hasOwn(req.body, "modelo") ||
      !Object.hasOwn(req.body, "quantidade") ||
      !Object.hasOwn(req.body, "preco")
    ) {
      return res.status(400).json({
        status: "error",
        message: `Preencha todos os campos obrigatórios para criar um produto. Campos: marca, modelo, quantidade e preco`,
      });
    }

    if (req.body.preco <= 0) {
      return res.status(400).json({
        status: "error",
        message: `Preço do produto deve ser maior que zero.`,
      });
    }

    const produto = await produtosService.createProduto(req.body);
    return res.status(201).json({
      status: "ok",
      message: `Produto criado com sucesso.`,
      data: produto,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`,
    });
  }
}

async function getProdutos(req, res) {
  const produtos = await produtosService.getProdutos()

  return res.status(200).json({produtos})
}

async function getProdutosByModelo(req, res) {
  try {
    const { modelo } = req.query;
    const resposta = await produtosService.getProdutosByModelo(modelo);

    if (!resposta) {
      return res.status(404).json({
        status: "error",
        message: `Produto não encontrado ou não existente.`,
      });
    }

    return res.status(200).json({
      status: "ok",
      data: resposta,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`,
    });
  }
}

async function changeStateProduto(req, res) {
  const id = req.params.id;

  if (id <= 0) {
    return res.status(400).json({
      status: "error",
      message: `Insira um ID maior que zero`,
    });
  }

  try {
    const produtoAlterado = await produtosService.changeStateProduto(id);

    if (produtoAlterado == 0) {
      return res.status(404).json({
        status: "error",
        message: `Produto não encontrado ou não existente.`,
      });
    }

    return res.status(200).json({
      status: "ok",
      message: `Produto alterado com sucesso`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`,
    });
  }
}

async function deleteProduto(req, res) {
  const id = req.params.id;

  if (id <= 0) {
    return res.status(400).json({
      status: "error",
      message: `Insira um ID maior que zero`,
    });
  }

  try {
    const produtoDeletado = await produtosService.deleteProduto(id);
    if (produtoDeletado == 0) {
      return res.status(404).json({
        status: 'error',
        message: `Produto não encontrado ou inexistente.`
      })
    }
    return res.status(200).json({
      status: "ok",
      message: `Produto deletado com sucesso`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`,
    });
  }
}

async function updateProduto(req, res) {
  const id = req.params.id;
  if (
    !Object.hasOwn(req.body, 'marca') &&
    !Object.hasOwn(req.body, 'modelo') &&
    !Object.hasOwn(req.body, 'quantidade') &&
    !Object.hasOwn(req.body, 'preco')
  ) {
    return res.status(400).json({
      status: "error",
      message: `Atualização de produto precisa de pelo menos um campo alterado. Campos disponíveis: marca, modelo, quantidade, preco`,
    });
  }

  if (Object.hasOwn(req.body, 'quantidade') && typeof req.body.quantidade !== 'number') {
    return res.status(400).json({
      status: 'error',
      message: `Campo quantidade inválido. Valor deve ser um número.`
    })
  }

  if (Object.hasOwn(req.body, 'preco') && typeof req.body.preco !== 'number') {
    return res.status(400).json({
      status: 'error',
      message: `Campo preço inválido. Valor deve ser um número.`
    })
  }

  try {
    const produto = await produtosService.updateProduto(id, req.body);

    if (produto == 0) {
      return res.status(404).json({
        status: "error",
        message: `Produto não encontrado, informe outro produto para atualizar`,
      });
    }

    return res.status(200).json({
      status: "ok",
      message: `Produto atualizado com sucesso.`,
      data: produto,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error. Error: ${error.message}`,
    });
  }
}

module.exports = {
  createProduto,
  getProdutosByModelo,
  getProdutos,
  updateProduto,
  changeStateProduto,
  deleteProduto,
};
