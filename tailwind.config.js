module.exports = {
  content: ['./**/*.html', './**.html', './js/**.js'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'sans-serif'],
      serif: ['Georgia', 'Times New Roman'],
    },
    extend: {
      colors: {
        roman: {
          50: '#fef2f2',
          100: '#fde3e3',
          200: '#fccccc',
          300: '#f9a8a8',
          400: '#f47575',
          500: '#eb5555',
          600: '#d62c2c',
          700: '#b42121',
          800: '#951f1f',
          900: '#7c2020',
          950: '#430c0c',
        },
      },
    },
  },
  plugins: [],
};
