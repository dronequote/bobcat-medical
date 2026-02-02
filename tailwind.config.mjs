/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'bobcat': {
          50: '#e6f4f4',
          100: '#b3dddd',
          200: '#80c7c7',
          300: '#4db0b0',
          400: '#26a0a0',
          500: '#0d8f8f',
          600: '#0b7676',
          700: '#085c5c',
          800: '#064343',
          900: '#032929',
        },
        'coral': {
          50: '#fef3f0',
          100: '#fde0d9',
          200: '#fbccc0',
          300: '#f8b5a5',
          400: '#f6a38f',
          500: '#f38d72',
          600: '#e87555',
          700: '#d35d3d',
          800: '#b94829',
          900: '#943a21',
        },
        'warm': {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
