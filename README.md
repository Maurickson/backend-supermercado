# 🛒 Backend — API de Supermercado com Inteligência Artificial

Este é o backend do sistema de E-commerce, desenvolvido com Node.js, Express, MongoDB e integrado ao **Google Gemini AI** e **ChromaDB**.
A API gerencia produtos, promoções e usuários, e agora conta com um **Assistente Inteligente (RAG)** que atua como um "Chat do Mercado" capaz de sugerir compras personalizadas baseadas no orçamento do cliente e no estoque.

## 📌 Funcionalidades

### 🤖 Assistente de Inteligência Artificial (RAG)
- **Chat do Mercado:** Recebe perguntas em linguagem natural (ex: "Quero fazer um café da manhã para 4 pessoas gastando até R$50").
- **Busca Semântica:** Utiliza o banco de dados vetorial **ChromaDB** para buscar os produtos mais relevantes em milissegundos.
- **Raciocínio com Gemini:** Integração com o Google Gemini Flash para processar o estoque recuperado, calcular preços, quantidades e formatar um JSON estruturado com recomendações.

### 🛍 Produtos
- CRUD Completo (Listar, Buscar, Criar, Editar, Excluir).
- Aplicar promoções automaticamente (data, porcentagem e preço final).
- Scripts automáticos (`scripts/seed_products.js` e `scripts/seed_vectors.js`) para popular o banco de dados e sincronizar o ChromaDB.

### 👤 Usuários e Segurança
- Autenticação com JWT e senhas criptografadas com Bcrypt.
- Middleware de segurança protegendo rotas privadas (`auth-middleware.js`).

## 🚀 Tecnologias Utilizadas

- **Node.js & Express**
- **MongoDB Atlas & Mongoose**
- **Google Generative AI (Gemini Flash)**
- **ChromaDB** (via Docker)
- **JSON Web Token (JWT) & Bcrypt.js**
- **Arquitetura MVC Modular**

## 📁 Estrutura do projeto

```
/backend-supermercado
│── /scripts
│   ├── seed_products.js    # Popula o MongoDB com produtos variados
│   └── seed_vectors.js     # Sincroniza os produtos do MongoDB para o ChromaDB
│── /src
│   ├── /controllers        # Controladores de Produtos, Usuários e do Chatbot
│   ├── /middlewares        # Autenticação JWT
│   ├── /models             # Mongoose Schemas
│   ├── /routers            # Rotas da API (/api/shopping, /api/product, etc)
│   ├── /services
│   │   ├── chroma.js       # Comunicação com Banco Vetorial
│   │   ├── llm.js          # Comunicação com a API do Gemini
│   │   └── mongodb.js      # Gerenciamento da conexão com o Banco
│── server.js               # Ponto de entrada do Backend
│── package.json
│── .env
│── .gitignore
│── README.md
```

## 🔧 Configuração e Instalação

1️⃣ **Instalar dependências**
```bash
npm install
```

2️⃣ **Configurar o `.env`**
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
```env
PORT=3001
DB_CONNECTION_STRING=SuaStringDeConexaoMongo
JWT_SECRET=SuaChaveSecreta
GEMINI_API_KEY=SuaChaveGeradaNoGoogleAIStudio
```

3️⃣ **Iniciar o Banco Vetorial (ChromaDB)**
Tenha o Docker rodando na sua máquina e execute:
```bash
docker run -d -p 8000:8000 --name chromadb chromadb/chroma
```

4️⃣ **Sincronizar Banco de Dados**
Para criar produtos fictícios e enviá-los para o banco vetorial, rode:
```bash
node scripts/seed_products.js
node scripts/seed_vectors.js
```

5️⃣ **Rodar o Servidor**
```bash
npm run dev
```
O servidor iniciará em `http://localhost:3001`.

## 🔐 Como Testar a Inteligência Artificial

Com o servidor rodando, faça um **POST** para a rota `/api/shopping/ask` passando a pergunta no Body:

**Body:**
```json
{
  "question": "Quero um café da manhã gastando até 50 reais."
}
```

**Resposta da IA (Exemplo JSON gerado automaticamente com itens do banco):**
```json
{
  "mensagem": "Vi que você quer fazer um café da manhã! ...",
  "itensSugeridos": [
    {
      "id": "6677abc123...",
      "nome": "Café Pilão",
      "quantidade": 1,
      "precoUnitario": 18.9,
      "precoTotalItem": 18.9
    }
  ],
  "totalEstimado": 44.60
}
```

## 👨‍💻 Autor
Maurickson Xavier — Sistema de Supermercado Inteligente
