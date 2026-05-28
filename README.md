Documentação de Rotas da API
AUTENTICAÇÃO
A API utiliza autenticação via JWT no header Authorization.
Formato:
Authorization: Bearer SEU_TOKEN
Rotas protegidas utilizam o middleware verifyJWT.
Algumas rotas também exigem verifyRoles para acesso
administrativo.
==================================================
ROTAS DE USUÁRIOS
==================================================
Cadastro de Usuário
POST /usuarios/cadastrar
- Autenticação: Não necessária
Body obrigatório:
{
"email": "usuario@email.com",
"senha": "123456"
}
Body opcional:
{
"nome": "João",
"role": "2"
}
Observações:
- Caso nome não seja enviado, o email será utilizado.
- Caso role não seja enviado, será definido como "2".
- O email não pode estar já cadastrado.
Respostas possíveis:

201 - Usuário criado
{
"status": "ok",
"message": "Usuário cadastrado com sucesso."
}

400 - Campos obrigatórios faltando
409 - Email já cadastrado
—————————————————————————
Login
POST /usuarios/login
- Autenticação: Não necessária
Body obrigatório:
{
"email": "usuario@email.com",
"senha": "123456"
}
Respostas possíveis:
201 - Login realizado
{
"status": "Successful login",
"tokenLogin": "JWT_TOKEN"
}

400 - Campos faltando
401 - Credenciais inválidas
—————————————————————————
Buscar todos os usuários

GET /usuarios
- Autenticação: Necessária
- Permissão: Administrador
Body: Não possui.
Respostas possíveis:
200 - Lista retornada:
{
"usuarios": []
}

401 - Token inválido ou ausente
403 - Sem permissão
—————————————————————————
Buscar usuário por ID
GET /usuarios/:id
- Autenticação: Necessária
- Permissão: Administrador
Body: Não possui.
Respostas possíveis:
200 - Usuário encontrado
404 - Usuário inexistente
401 - Token inválido ou ausente
403 - Sem permissão
—————————————————————————
Atualizar usuário
PATCH /usuarios/:id
- Autenticação: Necessária

Body opcional:
{
"nome": "Novo Nome",
"email": "novo@email.com",
"senha": "123456",
"confirmarSenha": "123456",
"role": "1"
}
Observações:
- Usuários comuns só podem alterar o próprio usuário.
- Usuários comuns não podem alterar role.
- Se enviar senha, confirmarSenha também deve ser enviado.
Respostas possíveis:
204 - Usuário atualizado
400 - Dados inválidos
401 - Token inválido
403 - Sem permissão
404 - Usuário não encontrado
409 - Email já cadastrado
—————————————————————————
Deletar usuário
DELETE /usuarios/:id
- Autenticação: Necessária
- Permissão: Administrador
Parâmetros
id, do tipo 'number'
Body: Não possui.
Respostas possíveis:

200 - Usuário removido
400 - ID inválido
404 - Usuário não encontrado
401 - Token inválido
403 - Sem permissão

==================================================
ROTAS DE PRODUTOS
==================================================
Cadastrar produto
POST /produtos
- Autenticação: Necessária
Body obrigatório:
{
"marca": "Fender",
"modelo": "Stratocaster",
"quantidade": 10,
"preco": 5999.90
}
Validações:
- preco deve ser maior que zero.
Respostas possíveis:
201 - Produto criado:
{
"status": "ok",
"message": "Produto criado com sucesso.",
"data": {}
}

400 - Campos inválidos

401 - Token inválido

—————————————————————————
Buscar todos os produtos
GET /produtos
- Autenticação: Necessária
Body: Não possui.
Respostas possíveis:
200 - Lista retornada:
{
"produtos": []
}
401 - Token inválido
—————————————————————————
Buscar produto por ID
GET /produtos/search?modelo=
- Autenticação: Necessária
Exemplo:
GET /produtos/search?modelo=stratocaster
Body: Não possui.
Respostas possíveis:
200 - Produto encontrado:
{
"status": "ok",
"data": {}
}
404 - Produto não encontrado

401 - Token inválido
—————————————————————————
Atualizar produto
PATCH /produtos/:id
- Autenticação: Necessária
- Permissão: Administrador
Body opcional:
{
"marca": "Ibanez",
"modelo": "RG550",
"quantidade": 20,
"preco": 4999.90
}
Respostas possíveis:
200 - Produto atualizado
400 - Dados inválidos
401 - Token inválido
403 - Sem permissão
404 - Produto não encontrado
—————————————————————————
Alterar estado do produto (Ativo ou Inativo)
PATCH /produtos/mudarEstado/:id
- Autenticação: Necessária
- Permissão: Administrador
Respostas possíveis:
200 - Estado alterado
400 - ID inválido

404 - Produto não encontrado
401 - Token inválido
403 - Sem permissão
—————————————————————————
Deletar produto
DELETE /produtos/:id
- Autenticação: Necessária
- Permissão: Administrador

Body: Não possui.
Respostas possíveis:
200 - Produto removido
400 - ID inválido
404 - Produto não encontrado
401 - Token inválido
403 - Sem permissão
