export const ACCENT_THEMES = {
  indigo: { label: 'Indigo', primary: '#6366f1', secondary: '#22d3ee' },
  emerald: { label: 'Emerald', primary: '#10b981', secondary: '#34d399' },
  rose: { label: 'Rose', primary: '#f43f5e', secondary: '#fb7185' },
  amber: { label: 'Amber', primary: '#f59e0b', secondary: '#fbbf24' },
  violet: { label: 'Violet', primary: '#8b5cf6', secondary: '#c4b5fd' },
};

export function applyAccentTheme(themeKey) {
  const theme = ACCENT_THEMES[themeKey] || ACCENT_THEMES.indigo;
  const root = document.documentElement.style;

  root.setProperty('--color-accent-indigo', theme.primary);
  root.setProperty('--color-accent-cyan', theme.secondary);
  root.setProperty('--color-accent-gradient', `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`);
  root.setProperty('--color-border-accent', `${theme.primary}59`);
  root.setProperty('--shadow-glow', `0 0 40px ${theme.primary}26`);
}

export function applyCompactMode(enabled) {
  const root = document.documentElement.style;
  root.setProperty('--topbar-height', enabled ? '60px' : '72px');
  document.documentElement.classList.toggle('compact-mode', Boolean(enabled));
}
