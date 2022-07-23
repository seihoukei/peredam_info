import Api from "./api.js"

let lastSync = ""

export default async function syncUser(token, user) {
    const data = JSON.stringify(user)
    if (lastSync === data)
        return
    lastSync = data
   
    return Api.saveUserData(token, user)
}
