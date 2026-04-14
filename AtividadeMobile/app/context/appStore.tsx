// Este arquivo existe apenas para satisfazer o Expo Router (que exige default export
// em todo arquivo dentro de app/). A lógica real está em context/appStore.tsx (raiz).

export { AppStoreProvider, useAppStore } from '../../context/appStore';
export type { Noticia, Comentario, Tag } from '../../context/appStore';

// Default export obrigatório pelo Expo Router
export default function _AppStoreContextPlaceholder() {
  return null;
}
