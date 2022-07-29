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

export default class Period {
    static TYPES = {
        MONTHLY : 0,
    }
    
    static dayMonthString(date) {
        const then = new Date(date)
        return `${then.getDate()} ${MONTHS[then.getMonth()]}`
    }
    
    static dayString(date) {
        const then = new Date(date)
        return `${then.getDate()}`
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
    
    getPeriodForDate(date = Date.now(), breakByLast = false) {
        if (this.type === Period.TYPES.MONTHLY) {
            const then = new Date(+date)
        
            const first = new Date(date)
            first.setDate(this.first)
            first.setHours(0, 0, 0, 0)
        
            const last = new Date(date)
            last.setDate(this.last + 1)
            last.setHours(0, 0, 0, 0)
            
            if (this.reverse)
                first.setMonth(first.getMonth() - 1)
        
            while (breakByLast && last < then || !breakByLast && first < then) {
                first.setMonth(first.getMonth() + 1)
                last.setMonth(last.getMonth() + 1)
            }
        
            return {first, last}
        }
    
    }
    
    analyze(then = new Date().setMonth(new Date().getMonth() - 2)) {
        if (this.type === Period.TYPES.MONTHLY) {
            const now = Date.now()
            
            const pastPeriodByFirst = this.getPeriodForDate(then)
            const currentPeriodByFirst = this.getPeriodForDate(now)
            const currentPeriodByLast = this.getPeriodForDate(now, true)
            
            const recent = currentPeriodByFirst.first.getMonth() === pastPeriodByFirst.first.getMonth()
            const inside = currentPeriodByFirst.first > currentPeriodByLast.first
            
            const {first, last} = currentPeriodByLast
            if (then > first) {
                first.setMonth(first.getMonth() + 1)
                last.setMonth(last.getMonth() + 1)
            }
            
            return {first, last, inside, recent}
        }
    }
    
    nextString(then = new Date().setMonth(new Date().getMonth() - 2)) {
        const {first, last} = this.analyze(then)
        const now = new Date()
        
        if (now > first)
            return `до ${Period.dayMonthString(last)}`
        else if (first.getMonth() !== last.getMonth())
            return `с ${Period.dayMonthString(first)} до ${Period.dayMonthString(last)}`
        else
            return `с ${Period.dayString(first)} до ${Period.dayMonthString(last)}`
    }
}
