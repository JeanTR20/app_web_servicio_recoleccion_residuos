/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    //"./src/*.html", "./src/*.css"
    "./src/**/*.{html, ts}",
  ],
  theme: {
    extend: {
      screens: {
        '2k': '2560px',
        'fhd+': '2048px',
        'fhd': '1920px', // Full HD
        '3xl': '1600px',
        '1xl': '1400px',
        'xlm': '1350px',
        'xls': '1170px',
        'xlg': '1080px',
        'xmd': '920px',
        'xs': '481px',
        'xsl': '420px',
        'xsm': '375px',
        'xss': '320px'
      }
    },
  },
  plugins: [
    '@tailwindcss/forms'
  ],
}

