import {writable} from "svelte/store"
import Web from "../utility/web.js"

const library = {
    cities : {},
    providers : {},
}

export default library
export const isLibraryReady = writable(false)

const result = await Web.getJSONData("/data/library.json")

Object.assign(library, result)

for (let [id, city] of Object.entries(library.cities)) {
    city.providers = {}
}

for (let [id, provider] of Object.entries(library.providers)) {
    library.cities[provider.city].providers[id] = provider
}

isLibraryReady.set(true)
