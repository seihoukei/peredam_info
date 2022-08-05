import "./app.css"
import App from "./App.svelte"
import appState from "stores/app-state.js"
import Address from "utility/address.js"
import modal from "stores/modal.js"

const app = new App({
    target: document.getElementById("app"),
})

window.onpopstate = ({state}) => {
    let isModalActive = false
    modal.subscribe((value) => isModalActive = value.isShown)()
    if (state) {
        if (isModalActive) {
            modal.backAction()
        } else
            appState.set(state)
    }
    Address.set(state, true)
}

export default app
