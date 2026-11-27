/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// The document class drives our CSS variables; the Vuetify theme drives all
// component tokens. Both stay in sync so forms and boxes go dark together.
const savedTheme = localStorage.getItem('r4r-theme')
const initialTheme = savedTheme === 'dark' ? 'r4rDark' : 'myCustomTheme'

if (typeof document !== 'undefined') {
  document.documentElement.classList.toggle('v-theme--dark', initialTheme === 'r4rDark')
}

// https://vuetifyjs.com
export default createVuetify({
  theme: {
    defaultTheme: initialTheme,
    themes: {
      myCustomTheme: {
        dark: false,

        // Theme-wide text emphasis variables
        variables: {
          'high-emphasis-opacity': 1,
          'medium-emphasis-opacity': 0.75,
          'disabled-opacity': 0.55,
        },

        colors: {
          // Off-white/gray for the master app background wrapper
          background: '#1d1717',

          // Crisp clean white for your main layout boxes
          surface: '#ffffff',

          // Dark teal blue for the sidebar/navbar items
          primary: '#103948',
          secondary: '#103948',
        },
      },

      // Dark form theme. Surfaces are dark and text tokens are light so inputs,
      // selects, chips, dialogs, and alerts stay readable together.
      r4rDark: {
        dark: true,

        variables: {
          'high-emphasis-opacity': 1,
          'medium-emphasis-opacity': 0.85,
          'disabled-opacity': 0.55,
        },

        colors: {
          background: '#0F171A',
          surface: '#162126',
          'surface-bright': '#1C292F',
          'surface-light': '#24333A',
          'surface-variant': '#1B272D',
          'on-surface-variant': '#C6D6DA',
          primary: '#7FCAD8',
          secondary: '#7FCAD8',
          error: '#FF8A80',
          info: '#64B5F6',
          success: '#A5D6A7',
          warning: '#FFB74D',
        },
      },
    },
  },
})
