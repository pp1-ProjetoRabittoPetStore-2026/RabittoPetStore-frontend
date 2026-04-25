const TOKEN_KEY = '@App:token';

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
};
