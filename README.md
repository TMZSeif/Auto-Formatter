# The Auto-Formatter

# Synopsis
This formatter is based on the Fury of a Shattered Mirror workskin yet the inbuilt functionality extends only to the classic DE system. So any of the unique formatting in FoaSM that doesn not exist in DE will not be present out of the box. You'll have to extend that functionality yourself.

Now this formatter was originally intended to be a place where you can copy your already written text into it and immediately get your fully CSS and HTML formatted text back. But technically you can write directly in here if you so wish. Nothing stopping you either way.

Note: This formatter uses Markdown to detect unique styling such as italics or bolding. If you're writing on another application make sure to copy your text as Markdown before pasting it here. If you're new to Markdown there's only really 2 big things you need to know. \*Any text between stars are italicised\* and \*\*Any text between 2 stars are bolded\*\* and if you want to place stars without making something italic or bold preface the star with a backslash \*like so\*

# Background
There are three different types of backgrounds supported. FELD, OBLIVION (all black) and BLANK (all white). Transitions between all three backgrounds are only possible if your starting background is FELD. And your starting background can be either FELD or OBLIVION but not BLANK.

So that means if you start with OBLIVION then you can only use OBLIVION for the rest of the content. If you start with FELD you can transition between all three of them no problem.

To use the OBLIVION background you must wrap the content between OBLIVION START and OBLIVION END like so.

```
OBLIVION START
Content goes here...
OBLIVION END
```

To use the FELD background you must wrap the content between FELD OVERLAY START and FELD OVERLAY END like so

```
FELD OVERLAY START
Content goes here...
FELD OVERLAY END
```

To transition between two different backgrounds simply wrap the content in "INITIAL BACKGROUND" "TARGET BACKGROUND" START and "INITIAL BACKGROUND" "TARGET BACKGROUND" END like so

```
FELD OVERLAY START
Transitions only work if you're starting from FELD
FELD OBLIVION START
Transitioning into Oblivion
FELD OBLIVION END
OBLIVION START
We are in Oblivion
OBLIVION END
OBLIVION BLANK START
Transitioning into blank
OBLIVION BLANK END
BLANK START
We are in Blank
BLANK END
BLANK FELD START
Transitioning into Feld
BLANK FELD END
We are in Feld
FELD OVERLAY END
```

Full transitions between all 3 backgrounds are supported. If you wish for a sharp change in background with no transition. Simply omit the transition keywords.

Warning: Before changing backgrounds. Make sure that the last line in your current background is dialogue. It cannot be a Thought, or an Item, or a dialogue tree. It must be a sentence.

# Disco Drones
To use Disco Drone mode, simply check the switch on the Format tab and it will automatically convert your stuff into Disco Drone format.

All the keywords for the backgrounds remain the same. So FELD OVERLAY START and FELD OVERLAY END as well as all the other keywords used for backgrounds will remain the same. This is intended for ease of use between switching from one format to the other.

Likewise, every other aspect of writing that is used for normal DE formatting will remain the exact same for Disco Drone formatting. You'll need to change nothing.

A new feature that comes exclusively with Disco Drone is PROCESSES. To initiate a PROCESS simply wrap text in START PROCESS and END PROCESS like so

```
START PROCESS
SOFTWARE INTERRUPT DETECTED
PROCESS TYPE: "Process type"
NAME: "Name"
END PROCESS
```

Note: Breakthrough Imminent will automatically start a PROCESS which you will then need to end. For example

```
Breakthrough Imminent: Thought
SOFTWARE INTERRUPT DETECTED
PROCESS TYPE: "Daemon"
NAME: "Thought"
END PROCESS
Insert your Thought description here
END THOUGHT
```

Warning: You may need to resave formatting changes in Custom Formatting if you switch to Disco Drone mode or vice versa.

# Skill Dialogue
When creating Skill dialogue, all Skill names must be fully capitalized.

This here is the guideline for how Skill dialogues should be formatted SKILL NAME - Text here. If the capitalized SKILL NAME is not the name of a pre-existing Skill then it is automatically the 'neutral' class and assumed to be a descriptor like DESCRIPTION - Hey look at me!

If you wish to add a check there must be a space between the Skill and the check like so SKILL [Medium:Success] - There's a space there.

Multi Skill dialogue work but you cannot add checks to them SKILL AND OTHER SKILL - This will be picked up fine but checks won't work here.

Multi line Skill dialogue will also work perfectly fine and functions as so.

```
SKILL - I have my line here.

And I continue talking in another paragraph.
```

# Dialogue Trees
Dialogue trees are created by making numbered lists like so.

```
1. Dialogue #1
2. Dialogue #2
3. Dialogue #3
```

To indicate that a particular dialogue was chosen and completed, italicise the dialogue like so

```
1. *This dialogue has been chosen*
2. This has not
3. *This also has been chosen*
```

To create a white check you must add a W to the end of the line. The W must be the last character of the line. To indicate a locked white check you also italicise the line. For money checks, you append an M to the end of the line, and italicise it if you wish to make it a locked money check. For red checks you append an R.

```
1. [Volition - Challenging 12] This is a white check. W
2. *[Interfacing - Easy 9] This is a locked white check. W*
3. [20$] This is a money check. M
4. *[20000$] This is a locked money check. M*
5. [Physical Instrument - Medium 11] This is a red check. R
```

Note: You must leave a blank line before and after the list.

# Check Results And Rolling
There are certain occasions when you'll need a line to be both centered and italicised. Such as when making modifiers to checks or what have you. In order to do this simply wrap a line in italics and it'll center it for you like so

```
*+5 This is a modifier that will be centered and italicised*
*-3 another one*
*This text will also be centered and italicised*
*Now playing: Music (Discorune reference)*
```

Now for big active check results such as CHECK SUCCESS or HEALED MORALE. They will have to be placed on their own line and be fully capitalized. You'll also need to take care of the spelling, if you don't spell them correctly they won't be picked up by the formatter. The following are the full list of supported Check results that exist out of the box

```
*+5 This is a modifier that will be centered and italicised*
*-3 another one*
						
CHECK SUCCESS (Simply writing this will automatically convert the line into the correct formatting)
CHECK FAILURE
CRITICAL SUCCESS
CRITICAL FAILURE
DAMAGED MORALE
MORALE CRITICAL
HEALED MORALE
DAMAGED HEALTH
HEALTH CRITICAL
HEALED HEALTH
INTELLECT RAISED
PHYSIQUE RAISED
PSYCHE RAISED
MOTORICS RAISED
MONEY GAINED
MONEY SPENT
```

Warning: If you write a fully capitalized Keyword from the above following in a normal paragraph. That entire paragraph will be formatted into a check result for example

```
INTERFACING - If I write CHECK SUCCESS. This entire line now will be formatted as a giant CHECK SUCCESS block and not a Skill dialogue.
```

# Tasks And Other Similarly Formatted Keyword
Tasks, Thoughts, Items and XP all have the same green formatting. And like the above Check Results, are formatted by detecting keywords such as New task: or Task updated:. The full list of keywords can be found here

```
New task: This task will be formatted in green as normal
Task updated:
Secret task complete:
Task complete:
Item gained:
Item lost:
Thought gained:
Breakthrough imminent:
```

Note: The ":" must be present or it won't be formatted correctly

Warning: For reasons that will be apparent in their relevant sections. You must add END ITEM or END THOUGHT on a new line immediately after Thought Gained, Breakthrough Imminent or Item gained if you won't be creating a full Item description or Thought description.

# Thought and Item Description
After a Thought gained: is added. Any fully capitalized line will be formatted as the Thought's name and will be formatted to be center aligned and bolded. Any normal paragraph will be formatted to be just center aligned and will act as the Thought's description. After adding "Temporary research bonus:" or "Permanent research bonus:" every line after that will be formatted to be a Skill bonus, Skill names in this will be automatically formatted with the correct color and do not need to be fully capitalized, for non-Skill bonuses you will have to manually bold words yourself. Typing "Research time:" will automatically break out of Bonus formatting. After finishing a Thought description you must add END THOUGHT on a new line afterwards before continuing to write normally. Here's an example to help clear things up

```
Thought gained: Anti-Object Task Force

ANTI-OBJECT TASK FORCE

Take a look at your hands. See how bruised they are? See those little scars? This is Exhibit A. 
The material world is holding you back. Containers, mailboxes, doors, chairs -- they are all your enemies. 
Always have been. Atoms themselves are in on the conspiracy, forming shapes and structures that you hate. 
You are energy stuck in a body. You are spirit trapped in matter. Break free! 
Beat up that lamp post! Let it know just how much objects \*suck\*.

Temporary research bonus:
-2 Pain Threshold: Hurts!

Research time: 2h 15m
END THOUGHT


Breakthrough imminent: Anti-Object Task Force

ANTI-OBJECT TASK FORCE

Behold: the Anti-Object Task Force has assembled. God's avenging angel, arrayed against the lower emanaof the Darkened One: 
shoe racks, tape recorders, motor carriages. And doors. So many doors. You're not just pounding it apieces. 
You're \*reforging\* the universe. From the anvil of the heavens to the worms below. Indulge in it. Be bold. 
Have an \*impact\* on the shape of Creation. Out of the furnace of your rage -- a new reality! Alsoshould trash your room \*again\*.

Permanent research bonus:
Attacking physical objects heals damage
+1 Pain Threshold
All FYS learning caps raised by 1
END THOUGHT
```

Pain Threshold and FYS will automatically be highlighted accordingly. The END THOUGHT Keyword must be added before you continue normal writing.

The same exact logic applies for Item descriptions except BONUS START needs to be prefaced before you write bonuses like so

```
Item gained: Ledger of Oblivion

Ledger of Oblivion

This is the ledger you found in the trash. It emits oblivion. 
A thin veneer of la-la-la, what I don't know can not hurt me covers its pages. 
You look at it and it makes you feel surprisingly solid, actually.

BONUS START
+1 Authority: Threw that shit away
+1 Suggestion: Mentally healthy power-move
-1 Inland Empire: Don't even care
END ITEM
```

Note: As said previously even if you don't place an Item or Thought description. END ITEM and END THOUGHT must still be appended at the end.