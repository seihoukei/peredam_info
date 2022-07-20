const LOGIN_FLY_DISTANCE = 300
const LOGIN_FLY_DURATION = 200

export const loginFlyLeft = {
    x : -LOGIN_FLY_DISTANCE,
    duration : LOGIN_FLY_DURATION,
}

export const loginFlyRight = {
    x : LOGIN_FLY_DISTANCE,
    duration : LOGIN_FLY_DURATION,
}

const DIALOG_FLY_DISTANCE = 500
const DIALOG_FLY_DURATION = 400

export const dialogFlyUp = {
    y : -DIALOG_FLY_DISTANCE,
    duration : DIALOG_FLY_DURATION
}

export const dialogFlyDown = {
    y : DIALOG_FLY_DISTANCE,
    duration : DIALOG_FLY_DURATION
}
