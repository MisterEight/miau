// Este arquivo existe apenas para satisfazer o Expo Router (que exige default export
// em todo arquivo dentro de app/). A lógica real está em context/auth.tsx (raiz).

export { AuthProvider, useAuth } from '../../context/auth';
export type { Role } from '../../context/auth';

// Default export obrigatório pelo Expo Router
export default function _AuthContextPlaceholder() {
  return null;
}
