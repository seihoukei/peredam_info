export function success (data) {
    return {
        data,
        success : true
    }
}

export function failure (error) {
    return {
        error,
        success : false,
    }
}
