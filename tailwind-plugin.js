import plugin from 'tailwindcss/plugin'

export default plugin(function({ addComponents, theme }) {
  const components = {
    '.btn': {
      '@apply px-4 py-2 rounded-md transition duration-150 ease-in-out': {},
    },
    '.btn-primary': {
      '@apply btn bg-primary-500 text-white hover:bg-primary-600': {},
    },
    '.btn-secondary': {
      '@apply btn bg-secondary-500 text-white hover:bg-secondary-600': {},
    },
    '.input': {
      '@apply w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500': {},
    },
    '.card': {
      '@apply bg-white shadow-md rounded-lg p-6': {},
    },
    '.form-label': {
      '@apply block text-sm font-medium text-gray-700 mb-1': {},
    },
    '.responsive-container': {
      '@apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8': {},
    },
    '.responsive-grid': {
      '@apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6': {},
    },
    '.animate-fade-in': {
      'animation': 'fadeIn 0.3s ease-in-out',
    },
  }

  addComponents(components)
})