export default class ScrollWindow {
    static toElement(element, dy = 100) {
        window.scrollBy({
            top: element.getBoundingClientRect().top - dy,
            behavior: "smooth",
        })
    }
    
    static to(y) {
        window.scrollTo({
            top: y,
            behavior: "smooth",
        })
    }
}
