const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--color-surface-alt) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--color-muted) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-strong': 'rgb(var(--color-primary-strong) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        'secondary-strong': 'rgb(var(--color-secondary-strong) / <alpha-value>)',
        tertiary: 'rgb(var(--color-tertiary) / <alpha-value>)',
        'tertiary-strong': 'rgb(var(--color-tertiary-strong) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-display)', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'app-shell': 'linear-gradient(180deg, rgba(244,251,249,1) 0%, rgba(238,246,249,1) 100%)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        soft: 'var(--shadow-soft)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
