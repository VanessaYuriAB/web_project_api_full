# 🗺️ Around — EUA Afora (Full Stack)

**Around (EUA Afora) Full Stack** é uma aplicação **full stack** composta por um
**front‑end em React** e um **back‑end em Node.js**, conectados por uma **API REST**
**protegida com autenticação JWT**.

Este projeto representa a **conclusão da arquitetura completa da aplicação**, integrando
autenticação, autorização, persistência de dados, tratamento de erros e **deploy em**
**ambiente cloud**, desenvolvido durante a **Sprint 18 (Autenticação Back-End)** do
bootcamp de Desenvolvimento Web Full‑Stack da **TripleTen**.

[![Deploy](https://img.shields.io/badge/Deploy-www.aroundtheusa.sevencomets.com-blue)](https://www.aroundtheusa.sevencomets.com/)

---

## 📌 Escopo do projeto

A aplicação full stack oferece:

- Registro e login de usuários com **JWT**
- Controle de acesso baseado em **autenticação**
- Edição de perfil e avatar
- Criação, exclusão e curtidas em cartões
- Persistência de dados em **MongoDB**
- **Proteção de rotas** no front‑end e no back‑end
- **Tratamento** centralizado **de erros**
- **Logging** de requisições e erros
- **Deploy** completo com **HTTPS**, domínio e recuperação automática do servidor
  (**PM2**)

---

## 🧩 Alinhamento com outros projetos

Este repositório é o resultado final da **evolução progressiva da aplicação Around**:

- [_Around — JavaScript Vanilla_](https://github.com/VanessaYuriAB/web_project_around)

  Interface inicial e manipulação de DOM

- [_Around — React_](https://github.com/VanessaYuriAB/web_project_around_react)

  Arquitetura baseada em componentes e estado declarativo

- [_Around — Back‑End (Express)_](https://github.com/VanessaYuriAB/web_project_around_express)

  API REST própria com MongoDB e regras de negócio

- [_Around — Auth (React)_](https://github.com/VanessaYuriAB/web_project_around_auth)

  Autenticação e autorização no front‑end com JWT

- Around — Full Stack (Sprint 18) ✅

  Integração completa entre front‑end e back‑end, segurança, deploy e infraestrutura

Essa abordagem reflete o ciclo real de desenvolvimento de uma aplicação **full stack em**
**produção**.

---

## 🧠 Principais conceitos aplicados

- Arquitetura **monorepo** (`frontend/` + `backend/`)
- Autenticação e autorização com **JWT**
- Middlewares de autenticação e validação
- Controle de permissões (ownership de recursos)
- Gerenciamento de estado no front‑end
- Validação de dados no servidor
- Tratamento centralizado de erros
- Logs de requisições e erros
- Deploy em **servidor Linux** na nuvem da **GCP**

---

## 🛠️ Tecnologias

**Front‑end**

- React
- Vite
- React Router
- JWT (client‑side)
- Fetch API
- CSS (BEM Flat)

**Back‑end**

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT
- bcryptjs
- Celebrate / Joi
- Validator
- Winston (logs)
- PM2

**Infraestrutura**

- Google Cloud
- NGINX (reverse proxy)
- HTTPS (Certbot)
- FreeDNS
- Linux server

---

## 🌐 Projeto online

- Aplicação: https://www.aroundtheusa.sevencomets.com

- API: https://api.aroundtheusa.sevencomets.com

---

## 📘 Documentação técnica

Este repositório possui um **README técnico** completo, contendo:

- Arquitetura detalhada
- Estrutura de pastas
- Exemplos de código
- Middlewares
- Validações
- Logs
- Configuração de NGINX e PM2
- Fluxo completo de autenticação

👉 Consulte o arquivo
[_README.technical.md_](https://github.com/VanessaYuriAB/web_project_api_full/blob/main/README.technical.md)
para detalhes aprofundados.

---

## 🎥 Demonstração

🎬 Vídeo demonstrativo da aplicação full stack, no Loom. Para assistir, clique
[aqui](https://www.loom.com/share/69ea8b81b2354f37b0c2bba50594c32b).

---

## 🚀 Próximos passos

- Testes automatizados (unitários e integração)
- Melhor tratamento de expiração de tokens no front‑end
- Feedback visual padronizado de erros
- Documentação dinâmica com Swagger
