const TOKEN_KEY = '@App:token';

export type Role = 'GERENTE' | 'CAIXA' | 'TOSADOR' | 'VETERINARIO' | 'TUTOR';


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
  

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  

  getRole(): Role | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = decodePayload(token);
    const role = payload?.role;
    return typeof role === 'string' ? (role as Role) : null;
  },
};
