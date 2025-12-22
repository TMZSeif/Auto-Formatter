let formatInput = document.getElementById("formatInput")
let formatOutput = document.getElementById("formatOutput")

formatInput.addEventListener("input", event => {
	let unformattedText = event.target.value
	let formattedText = marked.parse(unformattedText)
	formatOutput.value = formattedText
})