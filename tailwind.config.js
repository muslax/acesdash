module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
    backgroundColor: ['responsive', 'hover', 'group-hover', 'focus', 'active', 'checked'],
    backgroundOpacity: ['hover', 'focus', 'active'],
    margin: ['responsive', 'hover', 'focus'],
    padding: ['responsive', 'hover', 'focus'],
    borderColor: ['hover', 'focus', 'active'],
    textColor: ['responsive', 'hover', 'focus', 'active'],
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
