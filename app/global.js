
window.codemirrorit = function(id) {
    let referenceNode = document.getElementById(id)
    let newTextareaNode = document.createElement("textarea")
    newTextareaNode.id = id.concat("Code")
    newTextareaNode.value = referenceNode.innerHTML
    referenceNode.parentNode.insertBefore(newTextareaNode,
        referenceNode.nextSibling)
    CodeMirror.fromTextArea(
        newTextareaNode, {
            mode:  "xml",
            fixedGutters: false,
            lineNumbers: true,
            readOnly: true,
            viewportMargin: Infinity
        })
}
