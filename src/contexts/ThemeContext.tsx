import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Theme types
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    border: string;
    shadow: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    danger: string;
    success: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    fast: string;
    normal: string;
    slow: string;
  };
}

// Dark theme
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    accent: '#ffd700',
    background: '#0f0f23',
    surface: '#1e1e3f',
    text: '#ffffff',
    textSecondary: '#b0b3b8',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    border: '#374151',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d2d5f 100%)',
    secondary: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    accent: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    danger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  animations: {
    fast: '0.15s ease-out',
    normal: '0.3s ease-out',
    slow: '0.5s ease-out',
  },
};

// Light theme
export const lightTheme: Theme = {
  ...darkTheme,
  name: 'light',
  colors: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    accent: '#d97706',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#2563eb',
    border: '#e5e7eb',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
    secondary: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    accent: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    danger: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    success: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  },
};

// Gaming theme (special theme for gaming mode)
export const gamingTheme: Theme = {
  ...darkTheme,
  name: 'gaming',
  colors: {
    primary: '#0d0d21',
    secondary: '#1a1a3a',
    accent: '#00ff88',
    background: '#000012',
    surface: '#151537',
    text: '#ffffff',
    textSecondary: '#a0a0c0',
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff3366',
    info: '#0099ff',
    border: '#333366',
    shadow: 'rgba(0, 255, 136, 0.3)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #000012 0%, #0d0d21 50%, #1a1a3a 100%)',
    secondary: 'linear-gradient(135deg, #0d0d21 0%, #1a1a3a 100%)',
    accent: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
    danger: 'linear-gradient(135deg, #ff3366 0%, #cc0044 100%)',
    success: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
  },
};

// Available themes
export const themes = {
  dark: darkTheme,
  light: lightTheme,
  gaming: gamingTheme,
};

export type ThemeName = keyof typeof themes;

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  isGaming: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Get system theme preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

// Get initial theme
const getInitialTheme = (): ThemeName => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme') as ThemeName;
    if (saved && themes[saved]) {
      return saved;
    }
    return getSystemTheme();
  }
  return 'dark';
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(getInitialTheme);
  const theme = themes[themeName];

  // Set theme
  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    localStorage.setItem('theme', newThemeName);
    
    // Update CSS custom properties
    updateCSSVariables(themes[newThemeName]);
    
    // Update meta theme-color
    updateMetaThemeColor(themes[newThemeName]);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = themeName === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Update CSS custom properties
  const updateCSSVariables = (theme: Theme) => {
    const root = document.documentElement;
    
    // Colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Gradients
    Object.entries(theme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });
    
    // Spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    
    // Shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
    
    // Typography
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    
    // Breakpoints
    Object.entries(theme.breakpoints).forEach(([key, value]) => {
      root.style.setProperty(`--breakpoint-${key}`, value);
    });
    
    // Animations
    Object.entries(theme.animations).forEach(([key, value]) => {
      root.style.setProperty(`--animation-${key}`, value);
    });
  };

  // Update meta theme-color for mobile browsers
  const updateMetaThemeColor = (theme: Theme) => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.colors.primary);
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('theme');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables(theme);
    updateMetaThemeColor(theme);
    
    // Add theme class to body
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .trim();
    document.body.classList.add(`theme-${themeName}`);
    
    // Update root background
    document.documentElement.style.background = theme.gradients.primary;
  }, [theme, themeName]);

  // Initialize CSS variables on mount
  useEffect(() => {
    updateCSSVariables(theme);
    updateMetaThemeColor(theme);
  }, []);

  const value: ThemeContextType = {
    theme,
    themeName,
    setTheme,
    toggleTheme,
    isDark: themeName === 'dark',
    isLight: themeName === 'light',
    isGaming: themeName === 'gaming',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Utility functions for theme usage
export const getThemeValue = (path: string, theme: Theme): any => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme);
};

export const createResponsiveValue = <T>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}): T[] => {
  return [
    values.mobile,
    values.tablet,
    values.desktop,
    values.wide,
  ].filter(Boolean) as T[];
};

// Export default theme for styled-components
export const defaultTheme = darkTheme;