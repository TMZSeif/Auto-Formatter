let formatInput = document.getElementById("formatInput")
let formatOutput = document.getElementById("formatOutput")
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

formatInput.addEventListener("input", event => {
	let unformattedText = event.target.value
	formatOutput.value = ""
	let formattedText = marked.parse(unformattedText)
	const textList = formattedText.split("\n")
	let newLine = "";
	let lastestSkill = "";
	for (const line of textList) {
		const tempDiv = document.createElement("div")
		tempDiv.innerHTML = line
		const cleanLine = tempDiv.textContent
		const firstWord = cleanLine.split(" ")[0]
		if (firstWord === firstWord.toUpperCase() && firstWord.length > 1) {
			if (INTELLECT.includes(firstWord)) {
				[newLine, lastestSkill] = createSkillDialogue("int", cleanLine)
				formatOutput.value += newLine + "\n"
			}
			if (PSYCHE.includes(firstWord)) {
				[newLine, lastestSkill] = createSkillDialogue("psy", cleanLine)
				formatOutput.value += newLine + "\n"
			}
			if (PHYSIQUE.includes(firstWord)) {
				[newLine, lastestSkill] = createSkillDialogue("fys", cleanLine)
				formatOutput.value += newLine + "\n"
			}
			if (MOTORICS.includes(firstWord)) {
				console.log("TESTING")
				let [newLine, lastestSkill] = createSkillDialogue("mot", cleanLine)
				console.log(newLine)
				formatOutput.value += newLine + "\n"
			}
		}
	}
})