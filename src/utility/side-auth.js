import Api from "utility/api.js"

export default class SideAuth {
    static getVkLoginUrl() {
        const state = {
            url : Api.apiUrl(`auth/vk`),
            search : window.location.search
        }
        
        return `https://oauth.vk.com/authorize
            ?client_id=51413821
            &display=page
            &redirect_uri=${window.location.origin}/auth/vk.html
            &scope=email
            &state=${btoa(JSON.stringify(state))}
            &response_type=code
            &v=5.131
            &lang=ru
        `.split(/[ \t\n]/).join("")
    }
    
    static getVkAttachUrl() {
        return `https://oauth.vk.com/authorize
            ?client_id=51413821
            &display=popup
            &redirect_uri=${window.location.origin}/auth/attach.html
            &response_type=token
            &v=5.131
            &lang=ru
        `.split(/[ \t\n]/).join("")
    }
    
    static getGoogleLoginUrl() {
        const state = {
            url: Api.apiUrl(`auth/google`),
            search: window.location.search
        }
        
        return `https://accounts.google.com/o/oauth2/v2/auth
            ?client_id=689057572164-bp6kpaeqhogqpnu8usqp6oq68l2ho0cu.apps.googleusercontent.com
            &redirect_uri=${window.location.origin}/auth/google.html
            &state=${btoa(JSON.stringify(state))}
            &response_type=code
            &scope=openid%20profile%20email
            &lang=ru
        `.split(/[ \t\n]/).join("")
    }
}
