export default function fillTemplate(template = "", values) {
    return template.replace(/\<.*?\>/g, match => values[match.slice(1, -1)])
}
