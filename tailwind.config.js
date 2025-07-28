 /** @type {import('tailwindcss').Config} */
export default {
   content: ["./src/**/*.{html,js}"],
   theme: {
     extend: {
      colors: {
        'astro-bg': '#1e1e3f',
        'astro-accent': '#b17acc',
        'astro-highlight': '#56c9e9',
        'astro-light': '#f0ebf8',
      },
     },
   },
   plugins: [],
 }