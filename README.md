# Miau News — Atividade de Desenvolvimento Mobile

Aplicativo de notícias desenvolvido com React Native, Expo e TypeScript.

---

## Entrega 3 — Persistência Local (SQLite + Drizzle)

### Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Emulador Android/iOS ou app **Expo Go** no celular

### Como executar

```bash
cd AtividadeMobile
npm install
npx expo start
```

Escaneie o QR Code com o app **Expo Go** (Android) ou com a câmera (iOS).

### Tecnologias

- React Native + Expo 54
- Expo Router (navegação por arquivos)
- expo-sqlite 16 + Drizzle ORM (persistência local)
- TypeScript

### Entidade persistida

Tabela `noticia` no banco SQLite local (`miau.db`):

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
