
_**DOCUMENTAÇÃO DE ROTAS DA API**_


AUTENTICAÇÃO</br>
A API utiliza autenticação via JWT no header Authorization.</br>
Formato: Authorization: Bearer SEU_TOKEN</br>
Rotas protegidas utilizam o middleware verifyJWT.</br>
Algumas rotas também exigem verifyRoles para acesso
administrativo.


**_ROTAS DE USUÁRIOS_**


Cadastro de Usuário</br>
POST /usuarios/cadastrar</br>
Autenticação: Não necessária</br>
Body obrigatório:</br>
>{</br>
>&nbsp;&nbsp;&nbsp;&nbsp;"nome": "Usuario",</br>
>&nbsp;&nbsp;&nbsp;&nbsp;"email": "usuario@email.com",</br>
>&nbsp;&nbsp;&nbsp;&nbsp;"senha": "123456",</br>
>&nbsp;&nbsp;&nbsp;&nbsp;"role": 1</br>
>}</br>
</br>
Parâmetros opcionais: nome, senha</br>

Observações:</br>
- Caso nome não seja enviado, o email será utilizado.</br>
- Caso role não seja enviado, será definido como "2".</br>
- O email não pode estar já cadastrado.</br>
Respostas possíveis:</br>
</br>
201 - Usuário criado:</br>
>{</br>
>&nbsp;&nbsp;&nbsp;&nbsp;"status": "ok",</br>
>&nbsp;&nbsp;&nbsp;&nbsp;"message": "Usuário cadastrado com sucesso."</br>
>}</br>
</br>
400 - Campos obrigatórios faltando</br>
409 - Email já cadastrado</br>
—————————————————————————</br>
Login</br>
POST /usuarios/login</br>
Autenticação: Não necessária</br>
Body obrigatório:</br>
>{</br>
>&nbsp;&nbsp;&nbsp;&nbsp;"email": "usuario@email.com",</br>
>&nbsp;&nbsp;&nbsp;&nbsp;"senha": "123456"</br>
>}</br>
Respostas possíveis:</br>
201 - Login realizado</br>
{</br>
&nbsp;&nbsp;&nbsp;&nbsp;"status": "Successful login",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"tokenLogin": "JWT_TOKEN"</br>
}</br>
</br>
400 - Campos faltando</br>
401 - Credenciais inválidas</br>
—————————————————————————</br>
Buscar todos os usuários</br>
</br>
GET /usuarios</br>
Autenticação: Necessária</br>
Permissão: Administrador</br>
Body: Não possui.</br>
Respostas possíveis:</br>
200 - Lista retornada:</br>
{</br>
&nbsp;&nbsp;&nbsp;&nbsp;"usuarios": []</br>
}</br>
</br>
401 - Token inválido ou ausente</br>
403 - Sem permissão</br>
—————————————————————————</br>
Buscar usuário por ID</br>
GET /usuarios/:id</br>
- Autenticação: Necessária</br>
- Permissão: Administrador</br>
Body: Não possui.</br>
Respostas possíveis:</br>
200 - Usuário encontrado</br>
404 - Usuário inexistente</br>
401 - Token inválido ou ausente</br>
403 - Sem permissão</br>
—————————————————————————</br>
Atualizar usuário</br>
PATCH /usuarios/:id</br>
Autenticação: Necessária</br>
</br>
Body opcional:</br>
{</br>
&nbsp;&nbsp;&nbsp;&nbsp;"nome": "Novo Nome",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"email": "novo@email.com",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"senha": "123456",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"confirmarSenha": "123456",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"role": "1"</br>
}</br>
Observações:</br>
- Usuários comuns só podem alterar o próprio usuário.</br>
- Usuários comuns não podem alterar role.</br>
- Se enviar senha, confirmarSenha também deve ser enviado.</br>
Respostas possíveis:</br>
204 - Usuário atualizado</br>
400 - Dados inválidos</br>
401 - Token inválido</br>
403 - Sem permissão</br>
404 - Usuário não encontrado</br>
409 - Email já cadastrado</br>
—————————————————————————</br>
Deletar usuário</br>
DELETE /usuarios/:id</br>
- Autenticação: Necessária</br>
- Permissão: Administrador</br>
Parâmetros</br>
id, do tipo 'number'</br>
Body: Não possui.</br>
Respostas possíveis:</br>
</br>
200 - Usuário removido</br>
400 - ID inválido</br>
404 - Usuário não encontrado</br>
401 - Token inválido</br>
403 - Sem permissão</br>
</br>

_**ROTAS DE PRODUTOS**_ </br>
</br>
Cadastrar produto</br>
POST /produtos</br>
- Autenticação: Necessária</br>
Body obrigatório:</br>
{</br>
&nbsp;&nbsp;&nbsp;&nbsp;"marca": "Fender",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"modelo": "Stratocaster",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"quantidade": 10,</br>
&nbsp;&nbsp;&nbsp;&nbsp;"preco": 5999.90</br>
}</br>
Validações:</br>
- preco deve ser maior que zero.</br>
Respostas possíveis:</br>
201 - Produto criado:</br>
{</br>
&nbsp;&nbsp;&nbsp;&nbsp;"status": "ok",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"message": "Produto criado com sucesso.",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"data": {}</br>
}</br>
</br>
400 - Campos inválidos</br>
</br>
401 - Token inválido</br>
</br>
—————————————————————————</br>
Buscar todos os produtos</br>
GET /produtos</br>
Autenticação: Necessária</br>
Body: Não possui.</br>
Respostas possíveis:</br>
200 - Lista retornada:</br>
{</br>
"produtos": []</br>
}</br>
401 - Token inválido</br>
—————————————————————————</br>
Buscar produto por ID</br>
GET /produtos/search?modelo=</br>
Autenticação: Necessária</br>
Exemplo:</br>
GET /produtos/search?modelo=stratocaster</br>
Body: Não possui.</br>
Respostas possíveis:</br>
200 - Produto encontrado:</br>
{</br>
&nbsp;&nbsp;&nbsp;&nbsp;"status": "ok",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"data": {}</br>
}</br>
404 - Produto não encontrado</br>
</br>
401 - Token inválido</br>
—————————————————————————</br>
Atualizar produto</br>
PATCH /produtos/:id</br>
Autenticação: Necessária</br>
Permissão: Administrador</br>
Body opcional:</br>
{</br>
&nbsp;&nbsp;&nbsp;&nbsp;"marca": "Ibanez",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"modelo": "RG550",</br>
&nbsp;&nbsp;&nbsp;&nbsp;"quantidade": 20,</br>
&nbsp;&nbsp;&nbsp;&nbsp;"preco": 4999.90</br>
}</br>
Respostas possíveis:</br>
200 - Produto atualizado</br>
400 - Dados inválidos</br>
401 - Token inválido</br>
403 - Sem permissão</br>
404 - Produto não encontrado</br>
—————————————————————————</br>
Alterar estado do produto (Ativo ou Inativo)</br>
PATCH /produtos/mudarEstado/:id</br>
Autenticação: Necessária</br>
Permissão: Administrador</br>
Respostas possíveis:</br>
200 - Estado alterado</br>
400 - ID inválido</br>
</br>
404 - Produto não encontrado</br>
401 - Token inválido</br>
403 - Sem permissão</br>
—————————————————————————</br>
Deletar produto</br>
DELETE /produtos/:id</br>
Autenticação: Necessária</br>
Permissão: Administrador</br>
</br>
Body: Não possui.</br>
Respostas possíveis:</br>
200 - Produto removido</br>
400 - ID inválido</br>
404 - Produto não encontrado</br>
401 - Token inválido</br>
403 - Sem permissão</br>
