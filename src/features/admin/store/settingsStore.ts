import { create } from 'zustand';
import type { AppSettings } from '../../../types/settings';
import { getSettings, saveSettings } from '../../../services/settingsService';

interface SettingsState {
  settings: AppSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  loadSettings: () => Promise<void>;
  updateSettings: (settings: AppSettings) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: false,
  isSaving: false,
  error: null,
  
  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getSettings();
      set({ settings: data, isLoading: false });
    } catch (error) {
       set({ error: 'Error al cargar configuraciones', isLoading: false });
    }
  },

  updateSettings: async (settings: AppSettings) => {
    set({ isSaving: true, error: null });
    try {
      await saveSettings(settings);
      set({ settings, isSaving: false });
    } catch (error) {
       set({ error: 'Error al guardar configuraciones', isSaving: false });
       throw error;
    }
  }
}));
