export function success (data) {
    return {
        data,
        success : true
    }
}

export function failure (data) {
    return {
        data,
        success : false,
    }
}
