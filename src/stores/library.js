import {writable} from "svelte/store"
import Web from "../utility/web.js"

const library = writable({
    cities : {},
    providers : {},
})

export default library

const result = await Web.getJSONData("/data/library.json")

for (let [id, city] of Object.entries(result.cities)) {
    city.providers = {}
}

for (let [id, provider] of Object.entries(result.providers)) {
    result.cities[provider.city].providers[id] = provider
}

library.set(result)
