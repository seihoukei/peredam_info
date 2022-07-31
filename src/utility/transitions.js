export default class Transitions {
    static LOGIN_FLY_DISTANCE = 300
    static LOGIN_FLY_DURATION = 200
    static DIALOG_FLY_DISTANCE = 500
    static DIALOG_FLY_DURATION = 400
    
    static loginFlyLeft = {
        x: -this.LOGIN_FLY_DISTANCE,
        duration: this.LOGIN_FLY_DURATION,
    }
    
    static loginFlyRight = {
        x: this.LOGIN_FLY_DISTANCE,
        duration: this.LOGIN_FLY_DURATION,
    }
    
    static dialogFlyUp = {
        y: -this.DIALOG_FLY_DISTANCE,
        duration: this.DIALOG_FLY_DURATION,
    }
    
    static dialogFlyDown = {
        y: this.DIALOG_FLY_DISTANCE,
        duration: this.DIALOG_FLY_DURATION,
    }
    
    static fastFade = {
        duration: 100,
    }
    
}
