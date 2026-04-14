import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'autor' | 'leitor' | 'editor' | 'admin' | null;

export type Conta = {
  nome: string;
  email: string;
  senha: string;
  uf: string;
  role: Role;
};

const CONTAS_DEMO: Conta[] = [
  { nome: 'Ana Souza', email: 'ana@miau.com', senha: '123456', uf: 'SP', role: 'autor' },
  { nome: 'Bruno Lima', email: 'bruno@miau.com', senha: '123456', uf: 'RJ', role: 'autor' },
  { nome: 'Carla Nunes', email: 'carla@miau.com', senha: '123456', uf: 'MG', role: 'leitor' },
  { nome: 'Elisa Ramos', email: 'elisa@miau.com', senha: '123456', uf: 'PR', role: 'editor' },
  { nome: 'Admin', email: 'admin@miau.com', senha: '123456', uf: 'SP', role: 'admin' },
];

const NOME_DEMO: Record<string, string> = {
  leitor: 'Leitor Demo',
  autor: 'Ana Souza',
  editor: 'Elisa Ramos',
  admin: 'Super Admin',
};

type AuthContextType = {
  role: Role;
  nomeLogado: string | null;
  login: (role: Role) => void;
  loginComCredenciais: (email: string, senha: string) => { ok: boolean; erro?: string };
  logout: () => void;
  cadastrar: (nome: string, email: string, senha: string, uf: string) => { ok: boolean; erro?: string };
};

const AuthContext = createContext<AuthContextType>({
  role: null,
  nomeLogado: null,
  login: () => {},
  loginComCredenciais: () => ({ ok: false }),
  logout: () => {},
  cadastrar: () => ({ ok: false }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [nomeLogado, setNomeLogado] = useState<string | null>(null);
  const [contas, setContas] = useState<Conta[]>(CONTAS_DEMO);

  function login(r: Role) {
    setRole(r);
    setNomeLogado(NOME_DEMO[r as string] ?? 'Usuário');
  }

  function loginComCredenciais(email: string, senha: string) {
    const conta = contas.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.senha === senha
    );
    if (!conta) return { ok: false, erro: 'E-mail ou senha incorretos.' };
    setRole(conta.role);
    setNomeLogado(conta.nome);
    return { ok: true };
  }

  function logout() {
    setRole(null);
    setNomeLogado(null);
  }

  function cadastrar(nome: string, email: string, senha: string, uf: string) {
    const jaExiste = contas.some((c) => c.email.toLowerCase() === email.toLowerCase());
    if (jaExiste) return { ok: false, erro: 'Este e-mail já está cadastrado.' };
    const nova: Conta = { nome, email, senha, uf, role: 'leitor' };
    setContas((prev) => [...prev, nova]);
    return { ok: true };
  }

  return (
    <AuthContext.Provider value={{ role, nomeLogado, login, loginComCredenciais, logout, cadastrar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
