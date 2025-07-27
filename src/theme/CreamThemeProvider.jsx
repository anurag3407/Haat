import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

export const theme = {
  colors: {
    background: '#FFF4E6',
    primary: '#FFE5B4',
    secondary: '#FFDAB9',
    accent: '#DCC6A0',
    surface: '#F9F6F1',
    text: '#2C1810', // Much darker for better contrast
    textLight: '#4A3426', // Darker than before
    textMuted: '#6B4E37', // Darker brown for better readability
    success: '#4CAF50',
    warning: '#F59E42',
    error: '#F44336',
    info: '#2196F3',
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(44, 24, 16, 0.4)', // Updated to match new text color
  },
  gradients: {
    primary: 'linear-gradient(135deg, #FFF4E6 0%, #FFE5B4 50%, #FFDAB9 100%)',
    secondary: 'linear-gradient(135deg, #F9F6F1 0%, #DCC6A0 100%)',
    card: 'linear-gradient(145deg, #FFFFFF 0%, #F9F6F1 100%)',
    glass: 'linear-gradient(145deg, rgba(255, 244, 230, 0.9) 0%, rgba(249, 246, 241, 0.7) 100%)',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xlarge: '24px',
    round: '50%',
  },
  shadows: {
    soft: '0 4px 20px 0 rgba(220, 198, 160, 0.15)',
    medium: '0 8px 32px 0 rgba(220, 198, 160, 0.18)',
    large: '0 12px 40px 0 rgba(220, 198, 160, 0.22)',
    glow: '0 0 20px rgba(255, 229, 180, 0.4)',
    inner: 'inset 0 2px 4px 0 rgba(220, 198, 160, 0.1)',
  },
  fontFamily: {
    primary: "'Poppins', 'Inter', system-ui, -apple-system, sans-serif",
    secondary: "'Inter', system-ui, sans-serif",
    mono: "'Fira Code', 'Monaco', monospace",
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
    '4xl': '4rem',
    '5xl': '5rem',
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  transitions: {
    fast: '0.15s ease-out',
    normal: '0.2s ease-out',
    slow: '0.3s ease-out',
    spring: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
};

export const GlobalStyle = createGlobalStyle`
  /* Import Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

  /* CSS Reset and Base Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    background: ${({ theme }) => theme.gradients.primary};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fontFamily.primary};
    font-weight: ${({ theme }) => theme.fontWeight.normal};
    line-height: 1.6;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    padding-top: 80px; /* Account for fixed navbar */
    position: relative;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    line-height: 1.2;
    margin-bottom: 0.5em;
    color: ${({ theme }) => theme.colors.text};
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSize['4xl']};
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSize['3xl']};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSize['2xl']};
  }

  h4 {
    font-size: ${({ theme }) => theme.fontSize.xl};
  }

  h5 {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }

  h6 {
    font-size: ${({ theme }) => theme.fontSize.base};
  }

  p {
    margin-bottom: 1em;
    color: ${({ theme }) => theme.colors.textLight};
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.text};
      text-decoration: underline;
    }
  }

  /* Form Elements */
  input, textarea, select {
    font-family: inherit;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    padding: 0;
    margin: 0;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.accent};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
      background: ${({ theme }) => theme.colors.text};
    }
  }

  /* Selection */
  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
  }

  /* Focus styles */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }

  /* Utility Classes */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      padding: 0 ${({ theme }) => theme.spacing.md};
    }
  }

  .glass-effect {
    background: ${({ theme }) => theme.gradients.glass};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .text-gradient {
    background: ${({ theme }) => theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .shadow-soft {
    box-shadow: ${({ theme }) => theme.shadows.soft};
  }

  .shadow-medium {
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  .shadow-large {
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  .glow {
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }

  /* Animation keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0,0,0);
    }
    40%, 43% {
      transform: translate3d(0, -10px, 0);
    }
    70% {
      transform: translate3d(0, -5px, 0);
    }
    90% {
      transform: translate3d(0, -2px, 0);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }

  .animate-slideIn {
    animation: slideIn 0.5s ease-out;
  }

  .animate-bounce {
    animation: bounce 1s infinite;
  }

  .animate-pulse {
    animation: pulse 2s infinite;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  /* Responsive utilities */
  .mobile-only {
    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      display: none !important;
    }
  }

  .desktop-only {
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      display: none !important;
    }
  }

  /* Loading states */
  .loading {
    pointer-events: none;
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Transitions for smooth interactions */
  .transition-all {
    transition: all ${({ theme }) => theme.transitions.normal};
  }

  .transition-colors {
    transition: color ${({ theme }) => theme.transitions.fast}, 
                background-color ${({ theme }) => theme.transitions.fast}, 
                border-color ${({ theme }) => theme.transitions.fast};
  }

  .transition-transform {
    transition: transform ${({ theme }) => theme.transitions.normal};
  }

  .transition-opacity {
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }

  /* Hover effects */
  .hover-lift {
    transition: ${({ theme }) => theme.transitions.normal};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.large};
    }
  }

  .hover-glow {
    transition: ${({ theme }) => theme.transitions.normal};
    
    &:hover {
      box-shadow: ${({ theme }) => theme.shadows.glow};
    }
  }
`;

export default function CreamThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
