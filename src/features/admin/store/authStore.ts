import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// FUTURE: Reemplazar esto por integración con API real y tokens JWT
const MOCK_CREDENTIALS = {
  username: 'admin_tini',
  password: 'cocinoIncreible!',
};

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (username, password) => {
        if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
          set({ isAuthenticated: true, user: { username } });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'tini-admin-auth', // Nombre de la key en localStorage
    }
  )
);
