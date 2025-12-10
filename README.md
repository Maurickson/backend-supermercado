🛒 Backend — API de Supermercado (Node.js + Express + MongoDB)

Este é o backend do sistema de Supermercado, desenvolvido com Node.js, Express, MongoDB e Mongoose.
A API gerencia produtos, promoções e usuários, com autenticação segura via JWT.

O projeto segue o padrão MVC (Models, Controllers e Routes) e utiliza middlewares para validação de token, tornando o backend modular, escalável e seguro.
📌 Funcionalidades
🛍 Produtos

Listar todos os produtos

Buscar produto por ID

Criar produto

Editar produto

Excluir produto

Aplicar promoções automaticamente (data, porcentagem e preço final)

Retornar preço final com desconto

👤 Usuários

Criar conta (registro)

Login com email e senha

Autenticação usando JWT

Acesso protegido a rotas privadas

Middleware de autenticação (auth-middleware.js)

Tokens seguros com tempo de expiração

🔐 Autenticação com JWT

O projeto possui sistema completo de autenticação:

✔ Registro

Usuário cria uma conta com:

{
"name": "João",
"cpf": "10203040501"
"email": "joao@mail.com",
"password": "123456"
}

✔ Login

Retorna um JWT válido:
{
"message": "Login efetuado com sucesso",
"token": "eyJh..."
}

✔ Middleware de Autenticação (auth-middleware.js)

Lê o token enviado no header

Valida o JWT

Bloqueia rotas privadas se o token for inválido

Injeta req.user com dados do usuário autenticado

Exemplo de uso:

router.get("/minha-conta", authMiddleware, controller.me);
🚀 Tecnologias utilizadas

Node.js

Express

MongoDB Atlas

Mongoose

JSON Web Token (JWT)

Bcrypt.js (hash de senhas)

Cors

Nodemon

Arquitetura MVC

📁 Estrutura do projeto
/backend-supermercado
│── /src
│ ├── /controllers
│ │ ├── productController.js
│ │ └── userController.js
│ ├── /middlewares
│ │ └── auth-middleware.js
│ ├── /models
│ │ ├── productModel.js
│ │ └── userModel.js
│ ├── /routes
│ │ ├── productRoutes.js
│ │ └── userRoutes.js
│ ├── server.js
│── package.json
│── .env
│── README.md

🔧 Configuração
1️⃣ Instalar dependências
npm install

2️⃣ Criar arquivo .env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=sua_chave_secreta

▶️ Rodar o servidor
Desenvolvimento
npm run dev

Produção
npm start

Servidor iniciará em:

http://localhost:5000

🔐 Exemplos de Rotas Protegidas
✔ Acessando uma rota protegida

Header necessário:

Authorization: Bearer SEU_TOKEN_AQUI

Exemplo:

GET /users/minha-conta

🧩 Próximas implementações

Refresh Token

Recuperação de senha via email

Sistema de carrinho de compras

Estoque automatizado

Painel admin para promoções

👨‍💻 Autor

Maurickson Xavier — Sistema de Supermercado
