const TOKEN_KEY = '@App:token';

export type Role = 'GERENTE' | 'CAIXA' | 'TOSADOR' | 'VETERINARIO' | 'TUTOR';

/** Decodifica o payload de um JWT sem validar a assinatura (uso só de leitura). */
function decodePayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const authService = {
  // Salva o token
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Recupera o token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove o token (Logout)
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Verifica se está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Papel do usuário logado (claim "role" do JWT)
  getRole(): Role | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = decodePayload(token);
    const role = payload?.role;
    return typeof role === 'string' ? (role as Role) : null;
  },
};
