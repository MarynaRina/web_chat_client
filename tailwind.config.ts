import { type Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bgBase: "#1a202c", // Ваш колір
        text: "#e2e8f0",
        edit: "#63b3ed",
      },
    },
  },
  plugins: [],
}

export default config