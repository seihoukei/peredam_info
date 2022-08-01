export default class Messages {
    static success(data) {
        return {
            data,
            success: true,
        }
    }
    
    static failure(error) {
        return {
            error,
            success: false,
        }
    }
}
