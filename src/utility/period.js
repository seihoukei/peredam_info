const MONTHS = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
]

function dayMonthString(date) {
    return `${date.getDate()} ${MONTHS[date.getMonth()]}`
}

export default class Period {
    static TYPES = {
        MONTHLY : 0,
    }
    
    constructor(description = "MONTHLY:1,31") {
        const [type, parameters] = description.split(":")
        const [first, last] = parameters.split(",")
        this.type = Period.TYPES[type]
        this.reverse = this.first > this.last
        this.first = +first
        this.last = +last
    }
    
    toString() {
        if (this.type === Period.TYPES.MONTHLY) {
            return `С ${this.first} по ${this.last} число каждого месяца`
        }
        return "Неизвестно"
    }
    
    next(from = 0) {
        if (this.type === Period.TYPES.MONTHLY) {
            const past = new Date(+from)
            const now = new Date()
        
            const first = new Date()
            first.setDate(this.first)
        
            const last = new Date()
            last.setDate(this.last)
            
            if (this.reverse)
                first.setMonth(first.getMonth() - 1)
        
            while (past >= first || now > last) {
                first.setMonth(first.getMonth() + 1)
                last.setMonth(last.getMonth() + 1)
            }
        
            return {first, last}
        }
    }
    
    nextString(from) {
        const {first, last} = this.next(from)
        const now = new Date()
        
        if (now > first)
            return `до ${dayMonthString(last)}`
        else
            return `с ${dayMonthString(first)} до ${dayMonthString(last)}`
    }
}
