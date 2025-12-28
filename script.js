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
const customAtt = document.getElementById("customAttribute")

// All the stuff that can be changed and need to be kept track of
let ATTRIBUTES = {
	"INTELLECT": ["LOGIC", "ENCYCLOPEDIA", "RHETORIC", "VISUAL CALCULUS", "CONCEPTUALIZATION", "DRAMA", "INTELLECT", "INT"],
	"PSYCHE": ["VOLITION", "EMPATHY", "AUTHORITY", "ESPRIT DE CORPS", "SUGGESTION", "INLAND EMPIRE", "PSYCHE", "PSY"],
	"PHYSIQUE": ["PHYSICAL INSTRUMENT", "ENDURANCE", "ELECTROCHEMISTRY", "SHIVERS", "PAIN THRESHOLD",
		"HALF LIGHT", "PHYSIQUE", "FYS"],
	"MOTORICS": ["REACTION SPEED", "HAND/EYE COORDINATION", "PERCEPTION", "PERCEPTION (SIGHT)", "PERCEPTION (SMELL)", "PERCEPTION (HEARING)", "PERCEPTION (TOUCH)", "PERCEPTION (TASTE)", "SAVOIR FAIRE",
		"COMPOSURE", "INTERFACING", "MOTORICS", "MOT"]
}
let ATTRIBUTECOLORS = {
	"int": "#5cc1d7",
	"psy": "#7556cf",
	"fys": "#cb476a",
	"mot": "#e3b734",
	"you": "#c3d2db"
}
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
if (localStorage.getItem("ATTRIBUTES")) {
	ATTRIBUTES = JSON.parse(localStorage.getItem("ATTRIBUTES"))
	YOU = localStorage.getItem("YOU").toUpperCase()
}
// look at all these mAgIc nUmBeRs ooooo spoooky
if (localStorage.getItem("ATTRIBUTECOLORS")) {
	ATTRIBUTECOLORS = JSON.parse(localStorage.getItem("ATTRIBUTECOLORS"))
	for (const [att, color] of Object.entries(ATTRIBUTECOLORS)) {
		if (att !== "you") {
			formatStylesheet.insertRule(`#workskin .${att} {
			color: ${color};
			font-weight: bold
			}`, formatStylesheet.cssRules.length)
		}
		else {
			formatStylesheet.insertRule(`#workskin .${att} {
			color: ${color};
			}`, formatStylesheet.cssRules.length)
		}
	}
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
	for (const att of Object.values(ATTRIBUTES)) {
		if (att.includes(skill.replace(/\s*\[.*?\]\s*/g, "").trim())) {
			return [att.at(-1).toLowerCase()]
		}
	}
	for (const item of skills) {
		for (const att of Object.values(ATTRIBUTES)) {
			if (att.includes(item.replace(/\s*\[.*?\]\s*/g, "").trim())) {
				types.push(att.at(-1).toLowerCase())
			}
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
	for (const att of Object.values(ATTRIBUTES)) {
		att.forEach((skill) => {
			if (newLine.toUpperCase().indexOf(skill) !== -1 && done === false) {
				if (skill === att.at(-1) || skill === att.at(-2)) {
					if (new RegExp(`\\b${att.at(-1)}\\b`, "gi").test(newLine.replace(/[^a-zA-Z ]/g, "")) || new RegExp(`\\b${att.at(-2)}\\b`, "gi").test(newLine.replace(/[^a-zA-Z ]/g, ""))) {
						let words = newLine.slice(0, -4).split(" ")
						let i = 0
						for (const word of words) {
							if (word.replace(/[^a-zA-Z ]/g, "").toUpperCase() === att.at(-1) || word.replace(/[^a-zA-Z ]/g, "").toUpperCase() === att.at(-2)) {
								done = true
								words[i] = `<span class='${att.at(-1).toLowerCase()}'>${word.replace(/[^a-zA-Z ]/g, "")}</span>${word.replace(/[a-zA-Z ]/g, "")}`
							}
							i++
						}
						newLine = words.join(" ") + "<br>"
					}
					return
				}
				done = true
				newLine = newLine.slice(0, newLine.toUpperCase().indexOf(skill)) + `<span class='${att.at(-1).toLowerCase()}'>` + newLine.slice(newLine.toUpperCase().indexOf(skill), newLine.toUpperCase().indexOf(skill) + skill.length) + "</span>" + newLine.slice(newLine.toUpperCase().indexOf(skill) + skill.length)
			}
		})
	}

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

const deleteAttribute = (event) => {
	delete ATTRIBUTECOLORS[ATTRIBUTES[event.target.id.slice(0, -3)].at(-1).toLowerCase()]
	delete ATTRIBUTES[event.target.id.slice(0, -3)]
	localStorage.setItem("ATTRIBUTES", JSON.stringify(ATTRIBUTES))
	localStorage.setItem("ATTRIBUTECOLORS", JSON.stringify(ATTRIBUTECOLORS))
	customButton.dispatchEvent(new Event("click", { bubbles: true }))
	formatInput.dispatchEvent(new Event("input", { bubbles: true }))
	const alertPlaceholder = document.getElementById("alertPlaceholder")
	alertPlaceholder.classList.remove('visually-hidden');
	setTimeout(function () {
		alertPlaceholder.classList.add('show');
	}, 100);
}

customButton.addEventListener("click", () => {
	const Skills = document.getElementById("atts")
	Skills.innerHTML = ""
	for (const [name, att] of Object.entries(ATTRIBUTES)) {
		const div = document.createElement("div")
		const label = document.createElement("label")
		const divInput = document.createElement("div")
		const colorPicker = document.createElement("input")
		const skill = document.createElement("input")
		const helpText = document.createElement("div")
		const del = document.createElement("button")
		del.type = "button"
		del.className = "btn btn-danger"
		del.innerText = "Delete"
		del.id = name+"del"
		del.onclick = deleteAttribute
		div.className = "mb-3 d-flex flex-column"
		label.setAttribute("for", name)
		label.className = "form-label text-light"
		label.innerText = name
		div.appendChild(label)
		divInput.className = "d-flex"
		colorPicker.setAttribute("required", "true")
		colorPicker.setAttribute("name", name + "color")
		colorPicker.setAttribute("type", "color")
		colorPicker.className = "form-control form-control-color"
		colorPicker.id = name + "color"
		colorPicker.value = ATTRIBUTECOLORS[ATTRIBUTES[name].at(-1).toLowerCase()]
		divInput.appendChild(colorPicker)
		skill.setAttribute("required", "true")
		skill.setAttribute("name", name)
		skill.setAttribute("type", "text")
		skill.setAttribute("aria-describedby", name + "help")
		skill.className = "form-control"
		skill.id = name
		skill.value = [...ATTRIBUTES[name]].slice(0, -2).join(", ")
		divInput.appendChild(skill)
		divInput.appendChild(del)
		div.appendChild(divInput)
		helpText.id = name + "help"
		helpText.className = "form-text"
		helpText.innerText = 'Each Skill name must be separated by commas like so "SKILL, SKILL, SKILL". Skills like PERCEPTION will need all of their variants to be added as well'
		div.appendChild(helpText)
		Skills.appendChild(div)
	}
	const div = document.createElement("div")
	const label = document.createElement("label")
	const divInput = document.createElement("div")
	const colorPicker = document.createElement("input")
	const skill = document.createElement("input")
	div.className = "mb-3 d-flex flex-column"
	label.setAttribute("for", "YOU")
	label.className = "form-label text-light"
	label.innerText = "YOU"
	div.appendChild(label)
	divInput.className = "d-flex"
	colorPicker.setAttribute("required", "true")
	colorPicker.setAttribute("name", "YOUcolor")
	colorPicker.setAttribute("type", "color")
	colorPicker.className = "form-control form-control-color"
	colorPicker.id = "YOUcolor"
	colorPicker.value = ATTRIBUTECOLORS["you"]
	divInput.appendChild(colorPicker)
	skill.setAttribute("required", "true")
	skill.setAttribute("name", "YOU")
	skill.setAttribute("type", "text")
	skill.className = "form-control"
	skill.id = "YOU"
	skill.value = YOU
	divInput.appendChild(skill)
	div.appendChild(divInput)
	Skills.appendChild(div)
})

customSkills.addEventListener("submit", (event) => {
	event.preventDefault()
	// Yandere simulator ahh switch case
	const formData = new FormData(customSkills)
	for (const attribute of formData) {
		for (const [name, att] of Object.entries(ATTRIBUTES)) {
			if (attribute[0] === name) {
				ATTRIBUTES[name] = attribute[1].split(",")
				ATTRIBUTES[name].forEach((value, idx, arr) => { arr[idx] = value.trim() })
				ATTRIBUTES[name].push(att.at(-2), att.at(-1))
			}
			else if (attribute[0] === "YOU") {
				YOU = attribute[1].trim()
			}
			else if (attribute[0] === name + "color") {
				ATTRIBUTECOLORS[att.at(-1).toLowerCase()] = attribute[1]
				formatStylesheet.insertRule(`#workskin .${att.at(-1).toLowerCase()} {
					color: ${attribute[1]};
					font-weight: bold
				}`, formatStylesheet.cssRules.length)
			}
			else if (attribute[0] === "YOUcolor") {
				ATTRIBUTECOLORS["you"] = attribute[1]
				formatStylesheet.insertRule(`#workskin .you {
					color: ${attribute[1]};
				}`, formatStylesheet.cssRules.length)
			}
		}
	}

	formatInput.dispatchEvent(new Event("input", { bubbles: true }))
	const alertPlaceholder = document.getElementById("alertPlaceholder")
	alertPlaceholder.classList.remove('visually-hidden');
	setTimeout(function () {
		alertPlaceholder.classList.add('show');
	}, 100);
	localStorage.setItem("ATTRIBUTES", JSON.stringify(ATTRIBUTES))
	localStorage.setItem("ATTRIBUTECOLORS", JSON.stringify(ATTRIBUTECOLORS))
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
	localStorage.removeItem("ATTRIBUTES")
	localStorage.removeItem("ATTRIBUTECOLORS")
	localStorage.removeItem("YOU")
	ATTRIBUTES = {
		"INTELLECT": ["LOGIC", "ENCYCLOPEDIA", "RHETORIC", "VISUAL CALCULUS", "CONCEPTUALIZATION", "DRAMA", "INTELLECT", "INT"],
		"PSYCHE": ["VOLITION", "EMPATHY", "AUTHORITY", "ESPRIT DE CORPS", "SUGGESTION", "INLAND EMPIRE", "PSYCHE", "PSY"],
		"PHYSIQUE": ["PHYSICAL INSTRUMENT", "ENDURANCE", "ELECTROCHEMISTRY", "SHIVERS", "PAIN THRESHOLD",
			"HALF LIGHT", "PHYSIQUE", "FYS"],
		"MOTORICS": ["REACTION SPEED", "HAND/EYE COORDINATION", "PERCEPTION", "PERCEPTION (SIGHT)", "PERCEPTION (SMELL)", "PERCEPTION (HEARING)", "PERCEPTION (TOUCH)", "PERCEPTION (TASTE)", "SAVOIR FAIRE",
			"COMPOSURE", "INTERFACING", "MOTORICS", "MOT"]
	}
	ATTRIBUTECOLORS = {
		"int": "#5cc1d7",
		"psy": "#7556cf",
		"fys": "#cb476a",
		"mot": "#e3b734",
		"you": "#c3d2db"
	}
	YOU = "YOU"
	customButton.dispatchEvent(new Event("click", { bubbles: true }))
	for (const [att, color] of Object.entries(ATTRIBUTECOLORS)) {
		formatStylesheet.insertRule(`#workskin .${att} {
			color: ${color};
			font-weight: bold
			}`, formatStylesheet.cssRules.length)
	}
	formatInput.dispatchEvent(new Event("input", { bubbles: true }))
})

// The way this is done makes me wanna hurl but I suppose
// that's what I get for daring to f#ck with the CSSOM. Also f#ck you Chrome.
// you know what you did.
customChecks.addEventListener("submit", (event) => {
	event.preventDefault()

	const formData = new FormData(customChecks)
	let data = []
	for (const attribute of formData) {
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

customAtt.addEventListener("submit", (event) => {
	event.preventDefault()

	const formData = new FormData(customAtt)
	let data = []
	for (const attribute of formData) {
		data.push(attribute)
	}

	ATTRIBUTECOLORS[data[2][1].toLowerCase()] = data[0][1]
	ATTRIBUTES[data[1][1].toUpperCase()] = [data[1][1].toUpperCase(), data[2][1].toUpperCase()]
	localStorage.setItem("ATTRIBUTES", JSON.stringify(ATTRIBUTES))
	localStorage.setItem("ATTRIBUTECOLORS", JSON.stringify(ATTRIBUTECOLORS))
	customButton.dispatchEvent(new Event("click", { bubbles: true }))
	const alertPlaceholder = document.getElementById("alertPlaceholder")
	alertPlaceholder.classList.remove('visually-hidden');
	setTimeout(function () {
		alertPlaceholder.classList.add('show');
	}, 100);
})