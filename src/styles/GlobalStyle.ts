import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* Reset and base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *::before,
  *::after {
    box-sizing: inherit;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily};
    background: ${props => props.theme.gradients.primary};
    color: ${props => props.theme.colors.text};
    line-height: ${props => props.theme.typography.lineHeight.normal};
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
    position: relative;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    line-height: ${props => props.theme.typography.lineHeight.tight};
    margin: 0;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: ${props => props.theme.typography.fontWeight.bold};
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.25rem;
  }

  h6 {
    font-size: 1.125rem;
  }

  p {
    margin: 0;
    line-height: ${props => props.theme.typography.lineHeight.relaxed};
  }

  a {
    color: ${props => props.theme.colors.accent};
    text-decoration: none;
    transition: color ${props => props.theme.animations.fast};

    &:hover {
      opacity: 0.8;
    }

    &:focus {
      outline: 2px solid ${props => props.theme.colors.accent};
      outline-offset: 2px;
    }
  }

  /* Lists */
  ul, ol {
    list-style: none;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: transparent;
    transition: all ${props => props.theme.animations.fast};

    &:focus {
      outline: 2px solid ${props => props.theme.colors.accent};
      outline-offset: 2px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Form elements */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
    
    &:focus {
      outline: 2px solid ${props => props.theme.colors.accent};
      outline-offset: 2px;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
    border-radius: ${props => props.theme.borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.accent};
    border-radius: ${props => props.theme.borderRadius.sm};
    
    &:hover {
      background: ${props => props.theme.colors.accent}dd;
    }
  }

  ::-webkit-scrollbar-corner {
    background: ${props => props.theme.colors.surface};
  }

  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${props => props.theme.colors.accent} ${props => props.theme.colors.surface};
  }

  /* Selection */
  ::selection {
    background: ${props => props.theme.colors.accent}33;
    color: ${props => props.theme.colors.text};
  }

  ::-moz-selection {
    background: ${props => props.theme.colors.accent}33;
    color: ${props => props.theme.colors.text};
  }

  /* Platform-specific styles */
  .platform-ios {
    /* iOS safe area adjustments */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    
    /* Disable text size adjustment on iOS */
    -webkit-text-size-adjust: 100%;
    
    /* Improve touch scrolling */
    -webkit-overflow-scrolling: touch;
  }

  .platform-android {
    /* Android-specific adjustments */
    overscroll-behavior: contain;
    
    /* Disable text selection on Android for better gaming experience */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .platform-electron {
    /* Electron-specific adjustments */
    -webkit-app-region: no-drag;
    user-select: none;
    
    /* Improve performance */
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .platform-web {
    /* Web-specific optimizations */
    will-change: auto;
  }

  /* Focus management for accessibility */
  .js-focus-visible :focus:not(.focus-visible) {
    outline: none;
  }

  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    * {
      text-shadow: none !important;
      box-shadow: none !important;
    }
  }

  /* Dark mode media query fallback */
  @media (prefers-color-scheme: dark) {
    :root {
      color-scheme: dark;
    }
  }

  @media (prefers-color-scheme: light) {
    :root {
      color-scheme: light;
    }
  }

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
    
    body {
      /* Disable zoom on mobile */
      touch-action: manipulation;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.75rem;
    }
    
    h3 {
      font-size: 1.5rem;
    }
  }

  /* Tablet adjustments */
  @media (min-width: 769px) and (max-width: 1024px) {
    html {
      font-size: 15px;
    }
  }

  /* Loading states */
  .loading {
    pointer-events: none;
    opacity: 0.7;
  }

  /* Error states */
  .error {
    color: ${props => props.theme.colors.error};
  }

  /* Success states */
  .success {
    color: ${props => props.theme.colors.success};
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .no-scroll {
    overflow: hidden;
  }

  .visually-hidden {
    position: absolute !important;
    clip: rect(1px, 1px, 1px, 1px) !important;
    padding: 0 !important;
    border: 0 !important;
    height: 1px !important;
    width: 1px !important;
    overflow: hidden !important;
  }

  /* Gaming mode adjustments */
  .theme-gaming {
    /* Enhanced visual effects for gaming */
    * {
      text-shadow: 0 0 10px ${props => props.theme.colors.accent}33;
    }
    
    /* Neon glow effects */
    .glow {
      box-shadow: 0 0 20px ${props => props.theme.colors.accent}66;
    }
    
    /* Enhanced contrast for gaming */
    ::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 5px ${props => props.theme.colors.accent};
    }
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    a,
    a:visited {
      text-decoration: underline;
    }
    
    a[href]:after {
      content: " (" attr(href) ")";
    }
    
    abbr[title]:after {
      content: " (" attr(title) ")";
    }
    
    .no-print,
    nav,
    footer {
      display: none !important;
    }
  }
`;