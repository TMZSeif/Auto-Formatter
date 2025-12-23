const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, {
	trigger: 'focus'
}))

const formatInput = document.getElementById("formatInput")
const formatOutput = document.getElementById("formatOutput")
const copyButton = document.getElementById("copyBtn")
let INTELLECT = ["LOGIC", "ENCYCLOPEDIA", "RHETORIC", "VISUAL CALCULUS", "VISUAL", "CONCEPTUALIZATION", "DRAMA"]
let PSYCHE = ["VOLITION", "EMPATHY", "AUTHORITY", "ESPRIT DE CORPS", "ESPRIT", "SUGGESTION", "INLAND EMPIRE", "INLAND"]
let PHYSIQUE = ["PHYSICAL INSTRUMENT", "PHYSICAL", "ENDURANCE", "ELECTROCHEMISTRY", "SHIVERS", "PAIN THRESHOLD", "PAIN",
			 "HALF LIGHT", "HALF"]
let MOTORICS = ["REACTION SPEED", "REACTION", "HAND/EYE COORDINATION", "HAND/EYE", "PERCEPTION", "SAVOIR FAIRE", "SAVOIR",
			 "COMPOSURE", "INTERFACING"]

const createSkillDialogue = (type, line) => {
	const skillCheck = line.split(" - ")[0]
	const text = line.split(" - ").splice(1).join(" - ")
	let oldSkill = null
	let skill;
	let check = "";
	if (skillCheck.split("[").length !== 1) {
		skill = skillCheck.split("[")[0]
		check = skillCheck.split("[")[1]
	} else {
		skill = skillCheck
		check = ""
	}
	if (type === "you") {
		oldSkill = skill
		skill = "<p class='you'><span class='neutral'>" + skill + "</span>"
	} else {
		oldSkill = skill
		skill = `<p><span class='${type}'>` + skill + "</span>"
	}
	if (check) {
		check = "<span class='check'>[" + check + "</span>"
	}
	const newLine = skill + check + " - " + text + "</p>"
	return [ newLine, oldSkill ]
}

const checkSkillNames = (firstWord) => {
	if (INTELLECT.includes(firstWord)) {
		return "int"
	}
	if (PSYCHE.includes(firstWord)) {
		return "psy"
	}
	if (PHYSIQUE.includes(firstWord)) {
		return "fys"
	}
	if (MOTORICS.includes(firstWord)) {
		return "mot"
	}
	if (firstWord === "YOU") {
		return "you"
	}
}

const handleDialogueTrees = (chosen, line) => {
	let locked = ""
	if (chosen) {
		locked = "-locked"
	}
	if (line.trim().at(-1) === "W") {
		let newLine = `<li class='dialogue-check'><span class='whitecheck${locked}'>` + line.slice(0, -2) + "</span></li>"
		return newLine
	}
	else if (line.trim().at(-1) === "R") {
		let newLine = "<li class='dialogue-check'><span class='redcheck'>" + line.slice(0, -2) + "</span></li>"
		return newLine
	}
	else {
		if (chosen) {
			locked = "-fin"
		}
		let newLine = `<li class='dialogue${locked}'>` + line + "</li>"
		return newLine
	}
}

formatInput.addEventListener("input", event => {
	const unformattedText = event.target.value
	formatOutput.value = ""
	const textList = marked.parse(unformattedText).split("\n")
	let newLine = "";
	let lastestSkill = "";
	let dialogueTree = false
	for (const line of textList) {
		const tempDiv = document.createElement("div")
		tempDiv.innerHTML = line
		const cleanLine = tempDiv.textContent
		const firstWord = cleanLine.split(" ")[0]
		if (line.trim() === "<ol>") {
			dialogueTree = true
			lastestSkill = ""
			formatOutput.value += line + "\n"
		}
		else if (line.trim() === "</ol>") {
			dialogueTree = false
			formatOutput.value += line + "\n"
		}
		else if (dialogueTree && firstWord.length >= 1) {
			newLine = handleDialogueTrees(line.includes("<em>"), cleanLine)
			formatOutput.value += newLine + "\n"
		}
		else if (firstWord === firstWord.toUpperCase() && firstWord.length > 1) {
			const type = checkSkillNames(firstWord)
			if (type) {
				[newLine, lastestSkill] = createSkillDialogue(type, cleanLine)
				formatOutput.value += newLine + "\n"
			}
		}
	}
})

copyButton.addEventListener("click", async () => {
	await navigator.clipboard.writeText(formatOutput.value)
})