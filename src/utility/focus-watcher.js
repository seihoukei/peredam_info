import ScrollWindow from "./scroll-window.js"

export default class FocusWatcher {
    static elements = []
    static timeout = null

    static addElement(element, priority = 0) {
        this.elements.push({
            element, priority
        })
    }
    
    static removeElement(element) {
        this.elements = this.elements.filter(x => x.element !== element)
    }
    
    static focus(scrollTo = true) {
        if (this.timeout)
            clearTimeout(this.timeout)
        
        this.timeout = setTimeout(() => {
            this.timeout = null
            
            this.elements.sort((a, b) => a.priority - b.priority)
            const element = this.elements[0]?.element
            if (!element)
                return
            
            element.focus()
    
            if (scrollTo)
                ScrollWindow.toElement(element, 200)
        }, 300)
    }
    
    static focusNext(after, scrollTo = true) {
        let element
        for (let i = 1; i < this.elements.length; i++) {
            if (this.elements[i-1].element === after) {
                element = this.elements[i].element
                break
            }
        }
        if (!element)
            return false
        
        element.focus()
      
        if (scrollTo)
            ScrollWindow.toElement(element, 100)
        
        return true
    }
}
