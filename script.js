const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, {
	trigger: 'focus'
}))

// List of bullsh#t HTML stuff to import
const formatInput = document.getElementById("formatInput")
const formatOutput = document.getElementById("formatOutput")
const copyButton = document.getElementById("copyBtn")
const previewButton = document.getElementById("preview-tab")
const preview = document.getElementById("previewInsert")
const customButton = document.getElementById("custom-tab")
const customSkills = document.getElementById("customSkills")
const closeAlert = document.getElementById("closeAlert")
const formatStylesheet = document.styleSheets[2]
const resetSkillsButton = document.getElementById("resetSkills")
const customChecks = document.getElementById("customChecks")
const resetChecks = document.getElementById("resetChecks")

// All the stuff that can be changed and need to be kept track of
let INTELLECT = ["LOGIC", "ENCYCLOPEDIA", "RHETORIC", "VISUAL CALCULUS", "CONCEPTUALIZATION", "DRAMA", "INTELLECT", "INT"]
let PSYCHE = ["VOLITION", "EMPATHY", "AUTHORITY", "ESPRIT DE CORPS", "SUGGESTION", "INLAND EMPIRE", "PSYCHE", "PSY"]
let PHYSIQUE = ["PHYSICAL INSTRUMENT", "ENDURANCE", "ELECTROCHEMISTRY", "SHIVERS", "PAIN THRESHOLD",
	"HALF LIGHT", "PHYSIQUE", "FYS"]
let MOTORICS = ["REACTION SPEED", "HAND/EYE COORDINATION", "PERCEPTION", "PERCEPTION (SIGHT)", "PERCEPTION (SMELL)", "PERCEPTION (HEARING)", "PERCEPTION (TOUCH)", "PERCEPTION (TASTE)", "SAVOIR FAIRE",
	"COMPOSURE", "INTERFACING", "MOTORICS", "MOT"]
let YOU = "YOU"
let CHECKS = {
	"CHECK SUCCESS": "success", "CRITICAL SUCCESS": "success", "CHECK FAILURE": "fail", "CRITICAL FAILURE": "fail",
	"DAMAGED MORALE": "moraledmg", "MORALE CRITICAL": "moraledmg",
	"HEALED MORALE": "moraleheal", "DAMAGED HEALTH": "healthdmg", "HEALTH CRITICAL": "healthdmg",
	"HEALED HEALTH": "healthheal", "INTELLECT RAISED": "moraleheal", "PHYSIQUE RAISED": "healthheal",
	"PSYCHE RAISED": "moraledmg",
	"MOTORICS RAISED": "moneygained", "MONEY GAINED": "moneygained", "MONEY SPENT": "moneygained"
}
let KEYWORDS = ["New task:", "Task complete:", "Task updated:", "Item gained:", "Item lost:", "Thought gained:",
	"BREAKTHROUGH IMMINENT:"]

// ugly looking conditional for updating custom stuff based on cached data
if (localStorage.getItem("INT")) {
	INTELLECT = localStorage.getItem("INT").toUpperCase().split(",")
	PSYCHE = localStorage.getItem("PSY").toUpperCase().split(",")
	PHYSIQUE = localStorage.getItem("FYS").toUpperCase().split(",")
	MOTORICS = localStorage.getItem("MOT").toUpperCase().split(",")
	YOU = localStorage.getItem("YOU").toUpperCase()
}
// look at all these mAgIc nUmBeRs ooooo spoooky
if (localStorage.getItem("INTcolor")) {
	formatStylesheet.cssRules[27].style.color = localStorage.getItem("YOUcolor")
	formatStylesheet.cssRules[28].style.color = localStorage.getItem("INTcolor")
	formatStylesheet.cssRules[29].style.color = localStorage.getItem("PSYcolor")
	formatStylesheet.cssRules[30].style.color = localStorage.getItem("FYScolor")
	formatStylesheet.cssRules[31].style.color = localStorage.getItem("MOTcolor")
}

if (localStorage.getItem("checks")) {
	for (const [name, colors] of Object.entries(JSON.parse(localStorage.getItem("checks")))) {
		CHECKS[name.toUpperCase().trim()] = name.toLowerCase().trim()
		formatStylesheet.insertRule(`#workskin .${name.toLowerCase().trim()} {
			color: ${colors[0]};
  background-color: ${colors[1]};
  padding: 0.5%;
  padding-left: 54px;
  padding-right: 54px;
  text-indent: 0em;
  text-align: center;
  text-transform: uppercase;
		}`, formatStylesheet.cssRules.length)
	}
}

//List of helper functions
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
	const skills = skill.split(" AND ")
	let types = []
	console.log(skill.split("[")[0].trim())
	if (INTELLECT.includes(skill.replace(/\s*\[.*?\]\s*/g, "").trim())) {
		return ["int"]
	}
	if (PSYCHE.includes(skill.replace(/\s*\[.*?\]\s*/g, "").trim())) {
		return ["psy"]
	}
	if (PHYSIQUE.includes(skill.replace(/\s*\[.*?\]\s*/g, "").trim())) {
		return ["fys"]
	}
	if (MOTORICS.includes(skill.replace(/\s*\[.*?\]\s*/g, "").trim())) {
		return ["mot"]
	}
	for (const item of skills) {
		if (INTELLECT.includes(item.replace(/\s*\[.*?\]\s*/g, "").trim())) {
			types.push("int")
		}
		else if (PSYCHE.includes(item.replace(/\s*\[.*?\]\s*/g, "").trim())) {
			types.push("psy")
		}
		else if (PHYSIQUE.includes(item.replace(/\s*\[.*?\]\s*/g, "").trim())) {
			types.push("fys")
		}
		else if (MOTORICS.includes(item.replace(/\s*\[.*?\]\s*/g, "").trim())) {
			types.push("mot")
		}
		else {
			types.push("neutral")
		}
	}
	if (skill === YOU) {
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

const replaceSkillBonuses = (newLine) => {
	let done = false
	INTELLECT.forEach((skill) => {
		if (newLine.toUpperCase().indexOf(skill) !== -1 && done === false) {
			if (skill === "INT" || skill === "INTELLECT") {
				if (/\bINT\b/gi.test(newLine) || /\bINTELLECT\b/gi.test(newLine)) {
					let words = newLine.slice(0, -4).split(" ")
					let i = 0
					for (const word of words) {
						if (word.toUpperCase() === "INT" || word.toUpperCase() === "INTELLECT") {
							done = true
							words[i] = `<span class='int'>${word}</span>`
						}
						i++
					}
					newLine = words.join(" ") + "<br>"
				}
				return
			}
			done = true
			newLine = newLine.slice(0, newLine.toUpperCase().indexOf(skill)) + "<span class='int'>" + newLine.slice(newLine.toUpperCase().indexOf(skill), newLine.toUpperCase().indexOf(skill) + skill.length) + "</span>" + newLine.slice(newLine.toUpperCase().indexOf(skill) + skill.length)
		}
	})
	PSYCHE.forEach((skill) => {
		if (newLine.toUpperCase().indexOf(skill) !== -1 && done === false) {
			if (skill === "PSY" || skill === "PSYCHE") {
				if (/\bPSY\b/gi.test(newLine) || /\bPSYCHE\b/gi.test(newLine)) {
					let words = newLine.slice(0, -4).split(" ")
					let i = 0
					for (const word of words) {
						if (word.toUpperCase() === "PSY" || word.toUpperCase() === "PSYCHE") {
							done = true
							words[i] = `<span class='psy'>${word}</span>`
						}
						i++
					}
					newLine = words.join(" ") + "<br>"
				}
				return
			}
			done = true
			newLine = newLine.slice(0, newLine.toUpperCase().indexOf(skill)) + "<span class='psy'>" + newLine.slice(newLine.toUpperCase().indexOf(skill), newLine.toUpperCase().indexOf(skill) + skill.length) + "</span>" + newLine.slice(newLine.toUpperCase().indexOf(skill) + skill.length)
		}
	})
	PHYSIQUE.forEach((skill) => {
		if (newLine.toUpperCase().indexOf(skill) !== -1 && done === false) {
			if (skill === "FYS" || skill === "PHYSIQUE") {
				if (/\bFYS\b/gi.test(newLine) || /\bPHYSIQUE\b/gi.test(newLine)) {
					let words = newLine.slice(0, -4).split(" ")
					let i = 0
					for (const word of words) {
						if (word.toUpperCase() === "FYS" || word.toUpperCase() === "PHYSIQUE") {
							done = true
							words[i] = `<span class='fys'>${word}</span>`
						}
						i++
					}
					newLine = words.join(" ") + "<br>"
				}
				return
			}
			done = true
			newLine = newLine.slice(0, newLine.toUpperCase().indexOf(skill)) + "<span class='fys'>" + newLine.slice(newLine.toUpperCase().indexOf(skill), newLine.toUpperCase().indexOf(skill) + skill.length) + "</span>" + newLine.slice(newLine.toUpperCase().indexOf(skill) + skill.length)
		}
	})
	MOTORICS.forEach((skill) => {
		if (newLine.toUpperCase().indexOf(skill) !== -1 && done === false) {
			if (skill === "MOT" || skill === "MOTORICS") {
				if (/\bMOT\b/gi.test(newLine) || /\bMOTORICS\b/gi.test(newLine)) {
					let words = newLine.slice(0, -4).split(" ")
					let i = 0
					for (const word of words) {
						if (word.toUpperCase() === "MOT" || word.toUpperCase() === "MOTORICS") {
							done = true
							words[i] = `<span class='mot'>${word}</span>`
						}
						i++
					}
					newLine = words.join(" ") + "<br>"
				}
				return
			}
			done = true
			newLine = newLine.slice(0, newLine.toUpperCase().indexOf(skill)) + "<span class='mot'>" + newLine.slice(newLine.toUpperCase().indexOf(skill), newLine.toUpperCase().indexOf(skill) + skill.length) + "</span>" + newLine.slice(newLine.toUpperCase().indexOf(skill) + skill.length)
		}
	})
	return newLine
}

// Main formatting event loop
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
		// These next two are ugly as b#lls but I have neither the care nor the motivation to make it better
		else if (thought) {
			if (cleanLine === "END THOUGHT") {
				bonus = false
				thought = false
				if (formatOutput.value.slice(-5, -1) === "<br>") {
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
					newLine = replaceSkillBonuses(newLine)
					formatOutput.value += newLine + "\n"
				}
			}
			else if (firstWord === firstWord.toUpperCase() && firstWord.length > 1) {
				newLine = "<p align='center'><span class='neutral'>" + cleanLine + "</span></p>"
				formatOutput.value += newLine + "\n"
			}
			else if (cleanLine.toUpperCase() === "TEMPORARY RESEARCH BONUS:" || cleanLine.toUpperCase() === "PERMANENT RESEARCH BONUS:") {
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
					formatOutput.value = formatOutput.value.slice(0, -1)
					formatOutput.value += "</p>\n"
				}
			}
			else if (bonus) {
				newLine = line + "<br>"
				newLine = replaceSkillBonuses(newLine)
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
		else if (checkChecks(cleanLine) && cleanLine === cleanLine.toUpperCase()) {
			newLine = `<p align='center'><span class='${checkChecks(cleanLine)}'>` + cleanLine + "</span></p>"
			formatOutput.value += newLine + "\n"
		}
		else if (checkKeywords(cleanLine) || (cleanLine.toLowerCase().includes("xp") && cleanLine.length < 10)) {
			lastestSkill = ""
			if (checkKeywords(cleanLine).toUpperCase() === "THOUGHT GAINED:" || checkKeywords(cleanLine) === "BREAKTHROUGH IMMINENT:") {
				thought = true
			}
			if (checkKeywords(cleanLine).toUpperCase() === "ITEM GAINED:") {
				item = true
			}
			newLine = "<p class='task'>" + cleanLine + "</p>"
			formatOutput.value += newLine + "\n"
		}
		else if (firstWord === firstWord.toUpperCase() && firstWord.replace(/[^a-zA-Z]/g, '').length > 1) {
			const types = checkSkillNames(cleanLine.split(" - ")[0])
			if (types.length === 1) {
				[newLine, lastestSkill] = createSkillDialogue(types[0], cleanLine)
				formatOutput.value += newLine + "\n"
			}
			else {
				[newLine, lastestSkill] = createSkillDialogue("neutral", cleanLine)
				let skill = "<p>"
				for (let word of cleanLine.split(" - ")[0].split(" AND ")) {
					let check = ""
					if (word.split("[").length !== 1) {
						check = word.split("[")[1].split("]")[0]
						check = `<span class='check'>[${check}]</span>`
					}
					skill += `<span class='${checkSkillNames(word)[0]}'>` + word.split("[")[0] + "</span>" + check + "<span class='neutral'> AND </span>"
				}
				newLine = newLine.split(" - ").slice(1).join(" - ")
				formatOutput.value += skill.slice(0, -34) + " - " + newLine + "\n"
			}
		}
		else if (firstWord.length >= 1) {
			newLine = `<p class='indent'><span class='hide'>${lastestSkill} - </span>` + cleanLine + "</p>"
			formatOutput.value += newLine + "\n"
		}
	}
})

// Button events
copyButton.addEventListener("click", async () => {
	await navigator.clipboard.writeText(formatOutput.value)
})

previewButton.addEventListener("click", () => {
	preview.innerHTML = formatOutput.value
})

customButton.addEventListener("click", () => {
	const INT = document.getElementById("INT")
	const PSY = document.getElementById("PSY")
	const FYS = document.getElementById("FYS")
	const MOT = document.getElementById("MOT")
	const you = document.getElementById("YOU")
	const INTcolor = document.getElementById("INTcolor")
	const PSYcolor = document.getElementById("PSYcolor")
	const FYScolor = document.getElementById("FYScolor")
	const MOTcolor = document.getElementById("MOTcolor")
	const YOUcolor = document.getElementById("YOUcolor")
	if (localStorage.getItem("INTcolor")) {
		INTcolor.value = localStorage.getItem("INTcolor")
		PSYcolor.value = localStorage.getItem("PSYcolor")
		FYScolor.value = localStorage.getItem("FYScolor")
		MOTcolor.value = localStorage.getItem("MOTcolor")
		YOUcolor.value = localStorage.getItem("YOUcolor")
	}
	else {
		INTcolor.value = "#5cc1d7"
		PSYcolor.value = "#7556cf"
		FYScolor.value = "#cb476a"
		MOTcolor.value = "#e3b734"
		YOUcolor.value = "#c3d2db"
	}
	INT.value = [...INTELLECT].slice(0, -2).join(", ")
	PSY.value = [...PSYCHE].slice(0, -2).join(", ")
	FYS.value = [...PHYSIQUE].slice(0, -2).join(", ")
	MOT.value = [...MOTORICS].slice(0, -2).join(", ")
	you.value = YOU
})

customSkills.addEventListener("submit", (event) => {
	event.preventDefault()
	// Yandere simulator ahh switch case
	const formData = new FormData(customSkills)
	for (const attribute of formData) {
		switch (attribute[0]) {
			case "INT":
				INTELLECT = attribute[1].split(",")
				INTELLECT.forEach((value, idx, arr) => { arr[idx] = value.trim() })
				INTELLECT.push("INTELLECT", "INT")
				break
			case "PSY":
				PSYCHE = attribute[1].split(",")
				PSYCHE.forEach((value, idx, arr) => { arr[idx] = value.trim() })
				PSYCHE.push("PSYCHE", "PSY")
				break
			case "FYS":
				PHYSIQUE = attribute[1].split(",")
				PHYSIQUE.forEach((value, idx, arr) => { arr[idx] = value.trim() })
				PHYSIQUE.push("PHYSIQUE", "FYS")
				break
			case "MOT":
				MOTORICS = attribute[1].split(",")
				MOTORICS.forEach((value, idx, arr) => { arr[idx] = value.trim() })
				MOTORICS.push("MOTORICS", "MOT")
				break
			case "YOU":
				YOU = attribute[1].trim()
				break
			case "YOUcolor":
				localStorage.setItem("YOUcolor", attribute[1])
				formatStylesheet.cssRules[27].style.color = attribute[1]
				break
			case "INTcolor":
				localStorage.setItem("INTcolor", attribute[1])
				formatStylesheet.cssRules[28].style.color = attribute[1]
				break
			case "PSYcolor":
				localStorage.setItem("PSYcolor", attribute[1])
				formatStylesheet.cssRules[29].style.color = attribute[1]
				break
			case "FYScolor":
				localStorage.setItem("FYScolor", attribute[1])
				formatStylesheet.cssRules[30].style.color = attribute[1]
				break
			case "MOTcolor":
				localStorage.setItem("MOTcolor", attribute[1])
				formatStylesheet.cssRules[31].style.color = attribute[1]
				break
		}
	}

	formatInput.dispatchEvent(new Event("input", { bubbles: true }))
	const alertPlaceholder = document.getElementById("alertPlaceholder")
	alertPlaceholder.classList.remove('visually-hidden');
	setTimeout(function () {
		alertPlaceholder.classList.add('show');
	}, 100);
	localStorage.setItem("INT", INTELLECT)
	localStorage.setItem("PSY", PSYCHE)
	localStorage.setItem("FYS", PHYSIQUE)
	localStorage.setItem("MOT", MOTORICS)
	localStorage.setItem("YOU", YOU)
})

closeAlert.addEventListener("click", () => {
	const alertPlaceholder = document.getElementById("alertPlaceholder")
	setTimeout(function () {
		alertPlaceholder.classList.remove('show');
	}, 100);
	setTimeout(function () {
		alertPlaceholder.classList.add('visually-hidden');
	}, 500);
})

// Big ol' red button that deletes everything. Press on occasion if one is bored
resetSkillsButton.addEventListener("click", () => {
	localStorage.removeItem("INT")
	localStorage.removeItem("PSY")
	localStorage.removeItem("FYS")
	localStorage.removeItem("MOT")
	localStorage.removeItem("YOU")
	localStorage.removeItem("YOUcolor")
	localStorage.removeItem("INTcolor")
	localStorage.removeItem("PSYcolor")
	localStorage.removeItem("FYScolor")
	localStorage.removeItem("MOTcolor")
	INTELLECT = ["LOGIC", "ENCYCLOPEDIA", "RHETORIC", "VISUAL CALCULUS", "CONCEPTUALIZATION", "DRAMA", "INTELLECT", "INT"]
	PSYCHE = ["VOLITION", "EMPATHY", "AUTHORITY", "ESPRIT DE CORPS", "SUGGESTION", "INLAND EMPIRE", "PSYCHE", "PSY"]
	PHYSIQUE = ["PHYSICAL INSTRUMENT", "ENDURANCE", "ELECTROCHEMISTRY", "SHIVERS", "PAIN THRESHOLD",
		"HALF LIGHT", "PHYSIQUE", "FYS"]
	MOTORICS = ["REACTION SPEED", "HAND/EYE COORDINATION", "PERCEPTION", "PERCEPTION (SIGHT)", "PERCEPTION (SMELL)", "PERCEPTION (HEARING)", "PERCEPTION (TOUCH)", "PERCEPTION (TASTE)", "SAVOIR FAIRE",
		"COMPOSURE", "INTERFACING", "MOTORICS", "MOT"]
	YOU = "YOU"
	const INT = document.getElementById("INT")
	const PSY = document.getElementById("PSY")
	const FYS = document.getElementById("FYS")
	const MOT = document.getElementById("MOT")
	const you = document.getElementById("YOU")
	const INTcolor = document.getElementById("INTcolor")
	const PSYcolor = document.getElementById("PSYcolor")
	const FYScolor = document.getElementById("FYScolor")
	const MOTcolor = document.getElementById("MOTcolor")
	const YOUcolor = document.getElementById("YOUcolor")
	you.value = YOU
	INT.value = [...INTELLECT].slice(0, -2).join(", ")
	PSY.value = [...PSYCHE].slice(0, -2).join(", ")
	FYS.value = [...PHYSIQUE].slice(0, -2).join(", ")
	MOT.value = [...MOTORICS].slice(0, -2).join(", ")
	YOUcolor.value = "#c3d2db"
	INTcolor.value = "#5cc1d7"
	PSYcolor.value = "#7556cf"
	FYScolor.value = "#cb476a"
	MOTcolor.value = "#e3b734"
	formatStylesheet.cssRules[27].style.color = "#c3d2db"
	formatStylesheet.cssRules[28].style.color = "#5cc1d7"
	formatStylesheet.cssRules[29].style.color = "#7556cf"
	formatStylesheet.cssRules[30].style.color = "#cb476a"
	formatStylesheet.cssRules[31].style.color = "#e3b734"
	formatInput.dispatchEvent(new Event("input", { bubbles: true }))
})

// The way this is done makes me wanna hurl but I suppose
// that's what I get for daring to f#ck with the CSSOM. Also f#ck you Chrome.
// you know what you did.
customChecks.addEventListener("submit", (event) => {
	event.preventDefault()

	const formData = new FormData(customChecks)
	let data = []
	for (attribute of formData) {
		data.push(attribute)
	}
	CHECKS[data[0][1].toUpperCase().trim()] = data[0][1].replace(" ", "").replace(/[^a-zA-Z]/g, '').toLowerCase().trim()
	formatStylesheet.insertRule(`#workskin .${data[0][1].replace(" ", "").replace(/[^a-zA-Z]/g, '').toLowerCase().trim()} {
			color: ${data[1][1]};
  background-color: ${data[2][1]};
  padding: 0.5%;
  padding-left: 54px;
  padding-right: 54px;
  text-indent: 0em;
  text-align: center;
  text-transform: uppercase;
		}`, formatStylesheet.cssRules.length)
	if (localStorage.getItem("checks")) {
		let newObject = JSON.parse(localStorage.getItem("checks"))
		newObject[data[0][1]] = [data[1][1], data[2][1]]
		localStorage.setItem("checks", JSON.stringify(newObject))
	}
	else {
		let newObject = {}
		newObject[data[0][1]] = [data[1][1], data[2][1]]
		localStorage.setItem("checks", JSON.stringify(newObject))
	}
	formatInput.dispatchEvent(new Event("input", { bubbles: true }))
	const alertPlaceholder = document.getElementById("alertPlaceholder")
	alertPlaceholder.classList.remove('visually-hidden');
	setTimeout(function () {
		alertPlaceholder.classList.add('show');
	}, 100);
})

// Red button that deletes everything numero dos
resetChecks.addEventListener("click", () => {
	localStorage.removeItem("checks")
	CHECKS = {
		"CHECK SUCCESS": "success", "CRITICAL SUCCESS": "success", "CHECK FAILURE": "fail", "CRITICAL FAILURE": "fail",
		"DAMAGED MORALE": "moraledmg", "MORALE CRITICAL": "moraledmg",
		"HEALED MORALE": "moraleheal", "DAMAGED HEALTH": "healthdmg", "HEALTH CRITICAL": "healthdmg",
		"HEALED HEALTH": "healthheal", "INTELLECT RAISED": "moraleheal", "PHYSIQUE RAISED": "healthheal",
		"PSYCHE RAISED": "moraledmg",
		"MOTORICS RAISED": "moneygained", "MONEY GAINED": "moneygained", "MONEY SPENT": "moneygained"
	}
	formatInput.dispatchEvent(new Event("input", { bubbles: true }))
})