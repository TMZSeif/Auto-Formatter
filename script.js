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
let CHECKS = {
	"CHECK SUCCESS": "success", "CRITICAL SUCCESS": "success", "CHECK FAILURE": "fail", "CRITICAL FAILURE": "fail",
	"MORALE DAMAGED": "moraledmg", "MORALE CRITICAL": "moraledmg",
	"HEALED MORALE": "moraleheal", "HEALTH DAMAGED": "healthdmg", "HEALTH CRITICAL": "healthdmg",
	"HEALED HEALTH": "healthheal", "INTELLECT RAISED": "moraleheal", "PHYSIQUE RAISED": "healthheal",
	"PSYCHE RAISED": "moraledmg",
	"MOTORICS RAISED": "moneygained", "MONEY GAINED": "moneygained", "MONEY SPENT": "moneygained"
}
let KEYWORDS = ["New task:", "Task complete:", "Task updated:", "Item gained:", "Item lost:", "Thought gained:",
	"BREAKTHROUGH IMMINENT:"]

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
	return [newLine, oldSkill]
}

const checkSkillNames = (skill) => {
	const skills = skill.split(" ")
	let types = []
	for (const item of skills) {
		if (INTELLECT.includes(item)) {
			types.push("int") 
		}
		if (PSYCHE.includes(item)) {
			types.push("psy")
		}
		if (PHYSIQUE.includes(item)) {
			types.push("fys")
		}
		if (MOTORICS.includes(item)) {
			types.push("mot")
		}
	}
	if (skill === "YOU") {
		return ["you"]
	}
	if (types.length === 0) {
		return ["neutral"]
	}
	return types
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
	else if (line.trim().at(-1) === "M") {
		let newLine = `<li class='dialogue-check'><span class='moneycheck${locked}'>` + line.slice(0, -2) + "</span></li>"
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

const checkChecks = (line) => {
	for (const [keyword, value] of Object.entries(CHECKS)) {
		if (line.toUpperCase().includes(keyword.toUpperCase())) {
			console.log(true)
			return value
		}
	}
	return false
}

const checkKeywords = (line) => {
	for (const keyword of KEYWORDS) {
		if (line.toUpperCase().includes(keyword.toUpperCase())) {
			return keyword
		}
	}
	return false
}

formatInput.addEventListener("input", event => {
	const unformattedText = event.target.value
	formatOutput.value = ""
	const textList = marked.parse(unformattedText).split("\n")
	let newLine = "";
	let lastestSkill = "";
	let dialogueTree = false
	let thought = false
	let bonus = false
	let item = false
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
		else if (line.includes("<em>")) {
			lastestSkill = ""
			newLine = "<p align='center'><em>" + cleanLine + "</em></p>"
			formatOutput.value += newLine + "\n"
		}
		else if (checkChecks(cleanLine) && cleanLine === cleanLine.toUpperCase()) {
			newLine = `<p align='center'><span class='${checkChecks(cleanLine)}'>` + cleanLine + "</span></p>"
			formatOutput.value += newLine + "\n"
		}
		else if (checkKeywords(cleanLine) || (cleanLine.includes("xp") && cleanLine.length < 10)) {
			lastestSkill = ""
			if (checkKeywords(cleanLine) === "Thought gained:" || checkKeywords(cleanLine) === "BREAKTHROUGH IMMINENT:") {
				thought = true
			}
			if (checkKeywords(cleanLine) === "Item gained:") {
				item = true
			}
			newLine = "<p class='task'>" + cleanLine + "</p>"
			formatOutput.value += newLine + "\n"
		}
		else if (thought) {
			if (cleanLine === "END THOUGHT") {
				bonus = false
				thought = false
				if (formatOutput.value.slice(-5, -1) === "<br>") {
					console.log(formatOutput.value.slice(-5, -1))
					formatOutput.value = formatOutput.value.slice(0, -1)
					formatOutput.value += "</p>\n"
				}
			}
			else if (bonus) {
				if (cleanLine.includes("Research time:")) {
					formatOutput.value = formatOutput.value.slice(0, -5)
					newLine = "\n<p align='center'>" + cleanLine + "</p>"
					formatOutput.value += newLine + "\n"
					bonus = false
				}
				else {
					newLine = line + "<br>"
					if (INTELLECT.includes(newLine.split(" ")[1].split(":")[0].toUpperCase()) || 
					PSYCHE.includes(newLine.split(" ")[1].split(":")[0].toUpperCase()) || 
					PHYSIQUE.includes(newLine.split(" ")[1].split(":")[0].toUpperCase()) || 
					MOTORICS.includes(newLine.split(" ")[1].split(":")[0].toUpperCase())) {
						newLine = newLine.replace(newLine.split(":")[0].split("").filter(char => /^[A-Za-z\s]+$/.test(char)).join("").trim(), `<span class='${checkSkillNames(newLine.split(" ")[1].split(":")[0].toUpperCase())[0]}'>` + newLine.split(":")[0].split("").filter(char => /^[A-Za-z\s]+$/.test(char)).join("").trim() + "</span>")
						console.log()
					}
					
					formatOutput.value += newLine + "\n"
				}
			}
			else if (firstWord === firstWord.toUpperCase() && firstWord.length > 1) {
				newLine = "<p align='center'><span class='neutral'>" + cleanLine + "</span></p>"
				formatOutput.value += newLine + "\n"
			}
			else if (cleanLine === "Temporary research bonus:" || cleanLine === "Permanent research bonus:") {
				newLine = "<p align='center'>" + cleanLine + "<br>"
				formatOutput.value += newLine + "\n"
				bonus = true
			}
			else if (checkKeywords(cleanLine) !== "Thought gained:" && checkKeywords(cleanLine) !== "BREAKTHROUGH IMMINENT:") {
				newLine = "<p align='center'>" + cleanLine + "</p>"
				formatOutput.value += newLine + "\n"
			}
		}
		else if (item) {
			if (cleanLine === "END ITEM") {
				bonus = false
				item = false
				if (formatOutput.value.slice(-5, -1) === "<br>") {
					console.log(formatOutput.value.slice(-5, -1))
					formatOutput.value = formatOutput.value.slice(0, -1)
					formatOutput.value += "</p>\n"
				}
			}
			else if (bonus) {
				newLine = line + "<br>"
				if (INTELLECT.includes(newLine.split(" ")[1].split(":")[0].toUpperCase()) || 
				PSYCHE.includes(newLine.split(" ")[1].split(":")[0].toUpperCase()) || 
				PHYSIQUE.includes(newLine.split(" ")[1].split(":")[0].toUpperCase()) || 
				MOTORICS.includes(newLine.split(" ")[1].split(":")[0].toUpperCase())) {
					newLine = newLine.replace(newLine.split(":")[0].split("").filter(char => /^[A-Za-z\s]+$/.test(char)).join("").trim(), `<span class='${checkSkillNames(newLine.split(" ")[1].split(":")[0].toUpperCase())[0]}'>` + newLine.split(":")[0].split("").filter(char => /^[A-Za-z\s]+$/.test(char)).join("").trim() + "</span>")
					console.log()
				}
				
				formatOutput.value += newLine + "\n"
			}
			else if (cleanLine === "BONUS START") {
				newLine = "<p align='center'>"
				formatOutput.value += newLine
				bonus = true
			}
			else if (checkKeywords(cleanLine) !== "Item gained:") {
				newLine = "<p align='center'>" + cleanLine + "</p>"
				formatOutput.value += newLine + "\n"
			}
		}
		else if (firstWord === firstWord.toUpperCase() && firstWord.length > 1) {
			const types = checkSkillNames(cleanLine.split(" - ")[0])
			if (types.length === 1) {
				[newLine, lastestSkill] = createSkillDialogue(types[0], cleanLine)
				formatOutput.value += newLine + "\n"
			}
			else {
				[newLine, lastestSkill] = createSkillDialogue("neutral", cleanLine)
				let skill = "<p>"
				for (let word of cleanLine.split(" - ")[0].split(" ")) {
					skill += `<span class='${checkSkillNames(word)[0]}'>` + word + "</span>"
				}
				newLine = newLine.split(" - ").slice(1).join(" - ")
				formatOutput.value += skill + " - " + newLine + "\n"
			}
		}
		else if (firstWord.length >= 1) {
			newLine = `<p class='indent'><span class='hide'>${lastestSkill} - </span>` + cleanLine + "</p>"
			formatOutput.value += newLine + "\n"
		}
	}
})

copyButton.addEventListener("click", async () => {
	await navigator.clipboard.writeText(formatOutput.value)
})