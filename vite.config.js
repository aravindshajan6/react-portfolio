import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({

  base:'/react-portfolio',

  plugins: [react()],
  server: {
    host: true,
    port: 8000
  }
})

// vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig(({ command }) => {
//   const config = {
//     plugins: [react()],
//     base: '/react-portfolio',
//     server: {
//               host: true,
//               port: 8000
//             }
//   }

//   if (command !== 'serve') {
//     config.base = '/portfolio'
//   }

//   return config
// })
