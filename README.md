# Miau News - Atividade de Desenvolvimento Mobile

Aplicativo de notícias desenvolvido com React Native, Expo e TypeScript.

---

## Entrega 4 - API REST + Axios

### Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Emulador Android/iOS ou app **Expo Go** no celular

### Como executar

**1. Iniciar a API (em um terminal):**

```bash
cd api
npm install
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

**2. Iniciar o app mobile (em outro terminal):**

```bash
cd AtividadeMobile
npm install
npx expo start
```

> Se usar dispositivo físico, edite `AtividadeMobile/context/api.ts` e troque
> `localhost` pelo IP da sua máquina na rede local (ex: `192.168.0.10`).

### Endpoints da API

| Método | Rota            | Ação              |
|--------|-----------------|-------------------|
| GET    | /noticias       | Listar todas      |
| GET    | /noticias/:id   | Buscar por id     |
| POST   | /noticias       | Criar             |
| PUT    | /noticias/:id   | Atualizar         |
| DELETE | /noticias/:id   | Deletar           |

### Tecnologias

**API:** TypeScript, Express, better-sqlite3, Drizzle ORM

**Mobile:** React Native, Expo 54, Expo Router, Axios, TypeScript

### Entidade

Tabela `noticia`:

| Campo       | Tipo    |
|-------------|---------|
| id          | INTEGER (PK) |
| titulo      | TEXT    |
| resumo      | TEXT    |
| autor       | TEXT    |
| data        | TEXT    |
| tag         | TEXT    |
| uf          | TEXT    |
| leituras    | INTEGER |
| comentarios | INTEGER |
| publicada   | INTEGER (0/1) |
