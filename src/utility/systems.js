import Period from "./period.js"
import library from "../stores/library.js"

export default class Systems {
    static createDateMap(systems) {
        const dateMap = new Map()
        systems.map(system => dateMap.set(system, new Period(library.providers[system.provider].period).next(system.last?.date)))
        return dateMap
    }
    
    static createSortFunction(dateMap, now = Date.now()) {
        return (a, b) => {
            const aDate = dateMap.get(a)
            const bDate = dateMap.get(b)
            
            if (aDate.first < now && bDate.first < now)
                return aDate.last - bDate.last
            else if (aDate.first < now)
                return -1
            else if (bDate.first < now)
                return 1
            else
                return aDate.first - bDate.first || aDate.last - bDate.last
        }
    }
    
    static sortByDate(systems) {
        const dateMap = this.createDateMap(systems)
        const sortFunction = this.createSortFunction(dateMap)
        return systems.sort(sortFunction)
    }
}
