import { useEffect, useState } from 'react';

type Appearance = 'light' | 'dark' | 'system';

const updateTheme = (value: Appearance) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (value === 'system') {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    const systemTheme = mediaQueryList.matches ? 'dark' : 'light';

    document.documentElement.classList.toggle('dark', systemTheme === 'dark');
  } else {
    document.documentElement.classList.toggle('dark', value === 'dark');
  }
};

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') {
    return;
  }

  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = (): Appearance | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('appearance') as Appearance | null;
};

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('system');

    useEffect(() => {
        const savedAppearance = getStoredAppearance();
        const initialAppearance = savedAppearance || 'system';
        setAppearance(initialAppearance);
        // updateTheme(initialAppearance);

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (appearance === 'system') {
                updateTheme(e.matches ? 'dark' : 'light');
            }
        };

        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQueryList.addEventListener('change', handleSystemThemeChange);

        return () => {
            mediaQueryList.removeEventListener('change', handleSystemThemeChange);
        };
    }, [appearance]);

    const updateAppearance = (value: Appearance) => {
        setAppearance(value);
        localStorage.setItem('appearance', value);
        setCookie('appearance', value);
        updateTheme(value);
    };

    return {
        appearance,
        updateAppearance,
    };
}