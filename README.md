# The Auto-Formatter (THIS README IS OLD AND WILL BE UPDATED ONCE THE PROGRAM IS COMPLETE)

First of all this is a python script so you'll need to have it installed on your computer.
The file sent to you will be called "auto_format.py" *in the same folder as the python file you should create a file called "text.html"*

Steps:
1. Copy all of the chapter content from the doc and paste it into this website https://text-html.com/
2. After pasting, you'll need to give the text a brief lookthrough and delete any excess blanklines and whitespaces, as well as select all the lists with bullets in the middle and turn them into numbered lists. (For some reason, italicised lists are automatically converted to bullet points for some reason which is why it needs to be manually changed
3. After doing all that, on the right side of the screen there should be a textbox with the HTML version of the text you pasted. Copy that and paste it into "text.html"
4. Run the command "python ./auto_format.py" and there should be a new file created called "new.html" with all the formatted code.
5. That formatted code should be ready to go *but you will need to add the feld-start, feld-body and feld-end stuff by hand first*

Limitations:
1. It cannot do Music Players
2. It cannot do Thoughts or Item Descriptions
3. It cannot do Multi-Skill lines (eg. EMPATHY AND HALF-LIGHT - ...)
4. W, R, T and M *must* be added to the end of the sentence during a check for it to be formatted correctly. W for white, R red, T tension and M money checks