import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vastrika: {
          maroon: {
            50: '#FDF2F4',
            100: '#FBE8EB',
            200: '#F5C6CE',
            300: '#ECA0AE',
            400: '#DD5D75',
            500: '#B82344',
            600: '#9E1936',
            700: '#7E132B',
            800: '#641023',
            900: '#480B19',
            950: '#2F050F',
          },
          gold: {
            50: '#FCF9EE',
            100: '#FAF2D7',
            200: '#F3E4AB',
            300: '#EBD17A',
            400: '#DCB947',
            500: '#C59B27',
            600: '#AA7E1C',
            700: '#875F17',
            800: '#6E4C17',
            900: '#5C3E18',
            950: '#342008',
          },
          ivory: {
            50: '#FDFCFB',
            100: '#FAF8F5',
            200: '#F5F0E8',
            300: '#EDE4D6',
            400: '#E0D2BE',
            500: '#CEBCA3',
          },
          charcoal: {
            800: '#27272A',
            900: '#18181B',
            950: '#0F0F11',
          },
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 10px 30px -10px rgba(72, 11, 25, 0.08)',
        'luxury-lg': '0 20px 40px -15px rgba(72, 11, 25, 0.12)',
        'gold-glow': '0 0 25px rgba(197, 155, 39, 0.35)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #DCB947 0%, #C59B27 50%, #875F17 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #8E1632 0%, #641023 50%, #3B0713 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
