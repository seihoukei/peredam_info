import './units.css'
import './app.css'
import './utility/viewportLock.js'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

export default app
