import './app.css'
import App from './App.svelte'
import appState from "./stores/app-state.js"
import Address from "./utility/address.js"

const app = new App({
  target: document.getElementById('app')
})

window.onpopstate = ({state}) =>{
    if(state)
      appState.set(state)
    Address.set(state, true)
}

export default app
