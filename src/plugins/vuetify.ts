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

// https://vuetifyjs.com
export default createVuetify({
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          // Off-white/gray for the master app background wrapper
          background: '#1d1717', 
          
          // Crisp clean white for your main layout boxes
          surface: '#ffffff',    
          
          // Dark teal blue for the sidebar/navbar items
          primary: '#103948',   
          secondary: '#103948'
        },
      },
    },
  },
})
