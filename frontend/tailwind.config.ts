/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs personnalisées basées sur les points de design
        brand: {
          DEFAULT: '#866CEE',
          50: '#F4F1FE',
          100: '#E9E3FD',
          200: '#D6CAFB',
          300: '#BBA7F7',
          400: '#9B7AF1',
          500: '#866CEE',
          600: '#6B4BE3',
          700: '#5A39D0',
          800: '#4A2FA8',
          900: '#3F2A8A',
        },
        token: {
          DEFAULT: '#FFB541',
          50: '#FFF8ED',
          100: '#FFEED4',
          200: '#FFDAA8',
          300: '#FFC071',
          400: '#FF9D38',
          500: '#FFB541',
          600: '#F59E0B',
          700: '#D97706',
          800: '#B45309',
          900: '#92400E',
        },
        // Couleurs presque blanches/noires pour un look plus doux
        'almost-white': '#FAFAFD',
        'almost-black': '#202020',
        // Variantes pour la cohérence
        background: {
          DEFAULT: '#FAFAFD',
          dark: '#202020',
        },
        foreground: {
          DEFAULT: '#202020',
          light: '#FAFAFD',
        },
      },
      fontFamily: {
        // Polices personnalisées
        rubik: ['Rubik', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        // Tailles personnalisées si nécessaire
        display: ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        title: ['2.5rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
