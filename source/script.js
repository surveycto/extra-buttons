var fieldProperties = {
    "PARAMETERS": [
        {
            "key": "A",
            "value": 'Overwrite oldValue with "replacementValue"'
        },
        {
            "key": "A",
            "value": "Yes"
        },
        {
            "key": "A",
            "value": "No"
        },
        {
            "key": "A",
            "value": "I don't know"
        },
        {
            "key": "B",
            "value": -99
        },
        {
            "key": "C",
            "value": "Refused"
        },
        {
            "key": "D",
            "value": -88
        },
        {
            "key": "E",
            "value": "I don't understand"
        },
        {
            "key": "F",
            "value": -77
        }
    ],
    "LANGUAGE": 'hindi',
    "FIELDTYPE": 'text',
    "APPEARANCE": ''
}
var input = document.querySelector('#field');
setFocus()
//Above for testing only */

var input = document.querySelector('#field');
var formGroup = document.querySelector('.form-group');
var controlMessage = document.querySelector('.control-message');
var buttonHolder = document.querySelector('#buttons');

var parameters = fieldProperties.PARAMETERS;
var language = fieldProperties.LANGUAGE;
var altValues = [];
var fieldType = fieldProperties.FIELDTYPE;
var appearance = fieldProperties.APPEARANCE;

if (fieldType == 'integer') {
    input.inputmode = 'numeric';
    input.type = 'number';
}
else if (fieldType == 'decimal') {
    input.inputmode = 'decimal';
    input.type = 'number';
}
else if (fieldType == 'text') {
    if (appearance.includes('numbers_phone')) {
        input.inputmode = 'tel';
        input.type = 'tel';
    }
    else if (appearance.includes('numbers_decimal')) {
        input.inputmode = 'decimal';
        input.type = 'number';
    }
    else if (appearance.includes('numbers')) {
        input.inputmode = 'numeric';
        input.type = 'number';
    }
}

var numParam = parameters.length;

if (numParam >= 4) {
    var buttonsDisp = "";
    var warningMessage;
    var yesButton;
    var noButton;

    if (parameters[0] == 1) {
        warningTemplate = 'Warning: This field already has a value of "${oldValue}". Are you sure you would like to replace this with "${replacementValue}"?';
    }
    else{
        warningTemplate = parameters[0].value;
        warningTemplate = warningTemplate.replace('oldValue', '${oldValue}');
        warningTemplate = warningTemplate.replace('replacementValue', '${replacementValue}');
    }

    if (parameters[1] == 1) {
        yesButton = "Yes";
    }
    else{
        yesButton = parameters[1].value;
    }

    if (parameters[2] == 1) {
        noButton = "No";
    }
    else{
        noButton = parameters[2].value;
    }



    for (let b = 3; b + 1 < numParam; b += 2) {
        let buttonName = parameters[b].value;
        let buttonVal = parameters[b + 1].value;
        let buttonHtml = '<button id="' + buttonName + '" class="altbutton button' + (((b + 1)/2 % 2) + 1) + '" value="' + buttonVal + '">' + buttonName + '</button>';
        buttonsDisp += buttonHtml;
        altValues.push(buttonVal);
    }
    buttonHolder.innerHTML = buttonsDisp;
    var allButtons = document.querySelectorAll('#buttons button');

    for (let button of allButtons) {
        buttonFontAdjuster(button);
        if (!fieldProperties.READONLY) {
            button.addEventListener("click", function () {
                let clicked = button.value;
                let currentInput = input.value;
                if ((currentInput == '') || (currentInput == null) || (altValues.indexOf(currentInput) != -1)) {
                    setAnswer(clicked);
                    goToNextField();
                }
                else {
                    dispWarning(clicked);
                }
            });
        }
    }

    function buttonFontAdjuster(button) {
        var fontSize = parseInt(window.getComputedStyle(button, null).getPropertyValue('font-size'));
        let stopper = 50;
        while (button.scrollHeight > button.clientHeight) {
            fontSize--;
            button.style.fontSize = fontSize + "px";
            stopper--;
            if (stopper <= 0) {
                return;
            }
        }
    }

    function dispWarning(clicked) {
        oldValue = input.value;
        let altIndex = altValues.indexOf(parseInt(clicked));
        replacementValue = parameters[altIndex * 2 + 3].value;

        let warningMessage = new Function("return `" + warningTemplate + "`")();
        warningMessage += `<br><button id="yes" class="whitebutton">${yesButton}</button><button id="no" class="bluebutton">${noButton}</button>`

        warning.innerHTML = warningMessage;

        document.querySelector('#yes').addEventListener('click', function () {
            setAnswer(clicked);
            goToNextField();
        });

        document.querySelector('#no').addEventListener('click', function () {
            warning.innerHTML = null;
        });
    }
}

function clearAnswer() {
    input.value = '';
    setAnswer();
}

function setFocus() {
    input.focus();

    if (!fieldProperties.READONLY) {
        if (window.showSoftKeyboard) {
            window.showSoftKeyboard();
        }
        /*if (typeof input.selectionStart == "number") {
            input.selectionStart = input.selectionEnd = input.value.length;
        }*/
    }
}

function cursorToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    }
    else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

input.oninput = function () {
    formGroup.classList.remove('has-error');
    controlMessage.innerHTML = "";
    let answer = input.value;
    setAnswer(answer);
}



function handleConstraintMessage(message) {
    formGroup.classList.add('has-error');
    controlMessage.innerHTML = message;
    setFocus();
}

function handleRequiredMessage(message) {
    handleConstraintMessage(message)
}
