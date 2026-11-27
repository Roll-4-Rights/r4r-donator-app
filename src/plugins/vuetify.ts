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

// Keep the saved choice across reloads. Light stays the default for anyone who
// has never picked a theme. The name "dark" is important: Vuetify applies the
// .v-theme--dark class that the rest of the app uses as its dark-mode hook.
const savedTheme = localStorage.getItem('r4r-theme')

// https://vuetifyjs.com
export default createVuetify({
  theme: {
    defaultTheme: savedTheme === 'dark' ? 'dark' : 'myCustomTheme',
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

      // Phase-one "dark shell": dark chrome, with light content panels
      // handled separately in styles/main.scss so forms stay readable.
      dark: {
        dark: true,

        variables: {
          'high-emphasis-opacity': 1,
          'medium-emphasis-opacity': 0.85,
          'disabled-opacity': 0.55,
        },

        colors: {
          background: '#0F171A',
          surface: '#162024',
          primary: '#5AA9B8',
          secondary: '#5AA9B8',
        },
      },
    },
  },
})
