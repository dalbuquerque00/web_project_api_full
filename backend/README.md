

# Backend — web_project_around_auth

API RESTful para autenticação, cadastro e gerenciamento de usuários e cards, desenvolvida em Node.js, Express e MongoDB. Utiliza autenticação via JWT e segue boas práticas de segurança.

---

## **Como rodar localmente**

1. **Clone o repositório:**
   ```bash
   git clone SEU_REPO_AQUI
   cd web_project_around_auth/backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na pasta `backend/` com:
     ```
     PORT=3000
     MONGODB_URI=mongodb://127.0.0.1:27017/around_auth_db
     JWT_SECRET=sua_chave_secreta
     ```

4. **Inicie o servidor:**
   ```bash
   node app.js
   ```
   ou, para desenvolvimento com recarregamento automático:
   ```bash
   npx nodemon app.js
   ```

---

## **Principais Endpoints**

### **Autenticação**
- `POST /signup`  
  Cria um novo usuário  
  **Body:**  
  ```json
  {
    "name": "Nome",
    "about": "Sobre",
    "avatar": "URL do avatar",
    "email": "email@dominio.com",
    "password": "suasenha"
  }
  ```
- `POST /signin`  
  Autentica e retorna JWT  
  **Body:**  
  ```json
  {
    "email": "email@dominio.com",
    "password": "suasenha"
  }
  ```
  **Resposta:**  
  ```json
  {
    "token": "JWT_AQUI"
  }
  ```

### **Usuário**
- `GET /users/me`  
  Retorna dados do usuário autenticado (**header Authorization obrigatório**)

- `PATCH /users/me`  
  Atualiza perfil (name, about)

- `PATCH /users/me/avatar`  
  Atualiza avatar

### **Cards**
- `GET /cards`  
  Lista todos os cards

- `POST /cards`  
  Cria novo card

- `DELETE /cards/:cardId`  
  Remove card (somente se for o dono)

- `PUT /cards/:cardId/likes`  
  Dá like em um card

- `DELETE /cards/:cardId/likes`  
  Remove like de um card

---

## **Autorização**

- Rotas protegidas requerem header:
  ```
  Authorization: Bearer SEU_JWT_AQUI
  ```
- Apenas `/signup` e `/signin` são públicos.
- Permissões:
  - Só é possível editar/excluir o próprio perfil/card.

---

## **Scripts úteis**

- Iniciar em modo dev:  
  `npx nodemon app.js`
- Iniciar normalmente:  
  `node app.js`

---

## **Tecnologias usadas**
- Node.js, Express
- MongoDB, Mongoose
- bcryptjs, jsonwebtoken
- validator
- dotenv

---

## **Observações**
- Senha do usuário nunca é retornada.
- JWT expira em 7 dias.
- Validação robusta nos modelos.

---
