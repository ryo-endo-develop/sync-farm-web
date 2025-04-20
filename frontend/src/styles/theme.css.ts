// src/styles/theme.css.ts
import { createTheme,createThemeContract } from '@vanilla-extract/css'

// --------------------------------------------------------------------------
// Contract (設計図)
// --------------------------------------------------------------------------
export const vars = createThemeContract({
  color: {
    primary: null,
    secondary: null,
    accent: null,
    background: null,
    surface: null,
    textPrimary: null,
    textSecondary: null,
    border: null,
    error: null,
    white: null,
    black: null
  },
  font: {
    body: null
  },
  fontSize: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    h1: null,
    h2: null,
    h3: null,
    h4: null
  },
  fontWeight: {
    normal: null,
    medium: null,
    semiBold: null,
    bold: null
  },
  lineHeight: {
    none: null,
    tight: null,
    snug: null,
    normal: null,
    relaxed: null,
    loose: null
  },
  space: {
    '0': null, // 0px
    '1': null, // 4px
    '2': null, // 8px
    '3': null, // 12px
    '4': null, // 16px
    '5': null, // 20px
    '6': null, // 24px
    '7': null, // 28px
    '8': null, // 32px
    '9': null, // 36px
    '10': null, // 40px
    '11': null, // 44px
    '12': null // 48px
    // Add more as needed
  },
  borderRadius: {
    none: null,
    sm: null,
    md: null,
    lg: null,
    full: null
  }
  // Add other design tokens like shadows, z-indices, etc. if needed
})

// --------------------------------------------------------------------------
// Base Theme (Light Theme)
// --------------------------------------------------------------------------
export const lightTheme = createTheme(vars, {
  color: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    accent: '#F5A623',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#212529',
    textSecondary: '#6C757D',
    border: '#DEE2E6',
    error: '#DC3545',
    white: '#FFFFFF',
    black: '#000000'
  },
  font: {
    body: '"Inter", sans-serif'
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    h1: '32px',
    h2: '24px',
    h3: '20px',
    h4: '16px'
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700'
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  space: {
    '0': '0px',
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '7': '28px',
    '8': '32px',
    '9': '36px',
    '10': '40px',
    '11': '44px',
    '12': '48px'
  },
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px'
  }
})

// TODO: Add darkTheme if needed
// export const darkTheme = createTheme(vars, { ... });

// --------------------------------------------------------------------------
// Global Variables (Not themed, e.g., breakpoints) - Optional
// --------------------------------------------------------------------------
export const breakpoints = {
  sp: 'screen and (max-width: 599px)',
  tablet: 'screen and (min-width: 600px) and (max-width: 1023px)',
  pc: 'screen and (min-width: 1024px)'
}

// Can be used directly in @media queries in .css.ts files
// Example: '@media': { [breakpoints.sp]: { ... } }
