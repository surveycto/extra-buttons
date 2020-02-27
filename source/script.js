/*var fieldProperties = {
    "PARAMETERS": [
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
var buttonsDisp = "";
for (let b = 0; b < numParam; b += 2) {
    let buttonName = parameters[b].value;
    let buttonVal = parameters[b + 1].value;
    let buttonHtml = '<button id="' + buttonName + '" class="altbutton button' + ((b / 2 % 2) + 1) + '" value="' + buttonVal + '">' + buttonName + '</button>';
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
    let warningMessage = "";
    let altIndex = altValues.indexOf(parseInt(clicked));
    let changeToName = parameters[altIndex * 2].value;
    let yesButton = "";
    let noButton = "";

    if ((language == 'spanish') || (language == 'español') || (language == 'espanol')) {
        warningMessage = `Advertencia: este campo ya tiene un valor de "${input.value}". ¿Está seguro de que desea reemplazar esto con "${changeToName}"?`;
        yesButton = "Si";
        noButton = "No"
    }
    else if ((language == 'french') || (language == 'français') || (language == 'francais')) {
        warningMessage = `Avertissement: ce champ a déjà une valeur de "${input.value}". Voulez-vous vraiment remplacer ceci par "${changeToName}"?`;
        yesButton = "Oui";
        noButton = "Non"
    }
    else if ((language == 'portuguese') || (language == 'português') || (language == 'portugues')) {
        warningMessage = `Aviso: Este campo já possui o valor "${input.value}". Tem certeza de que deseja substituir isso por "${changeToName}"?`;
        yesButton = "Sim";
        noButton = "Não"
    }
    else if ((language == 'hindi') || (language == 'हिंदी')) {
        warningMessage = `चेतावनी: इस फ़ील्ड में पहले से "${input.value}" का मान है। क्या आप वाकई इसे "${changeToName}" से बदलना चाहेंगे?`;
        yesButton = "हाँ";
        noButton = "नहीं"
    }
    else if ((language == 'urdu') || (language == 'اردو')) {
        warningMessage = `انتباہ: اس فیلڈ میں پہلے ہی "${input.value}" کی قدر ہے۔ کیا آپ واقعی "${changeToName}" سے تبدیل کرنا چاہیں گے؟`;
        yesButton = "جی ہاں";
        noButton = "نہیں"
    }
    else if ((language == 'bangla') || (language == 'banla') || (language == 'bengali') || (language == 'বাংলা')) {
        warningMessage = `সতর্কতা: এই ক্ষেত্রটির ইতিমধ্যে "${input.value}" এর মান রয়েছে। আপনি কি এটিকে "${changeToName}" দিয়ে প্রতিস্থাপন করতে চান?`;
        yesButton = "হ্যাঁ";
        noButton = "না"
    }
    else if ((language == 'amharic') || (language == 'አማርኛ') || (language == 'amarinya')) {
        warningMessage = `ማስጠንቀቂያ-ይህ መስክ አስቀድሞ የ «${input.value}» እሴት አለው። እርግጠኛ ነዎት ይህንን በ «${changeToName}» መተካት ይፈልጋሉ?`;
        yesButton = "Yes";
        noButton = "No"
    }
    else if ((language == 'burmese') || (language == 'bamar') || (language == 'ဗမာ')) {
        warningMessage = `သတိပေးချက် - ဤကွက်လပ်တွင် "${input.value}" ၏တန်ဖိုးရှိပြီးဖြစ်သည်။ သင်ဤ "${changeToName}" နှင့်အစားထိုးလိုပါသလား။`;
        yesButton = "Yes";
        noButton = "No"
    }
    else {
        warningMessage = `Warning: This field already has a value of "${input.value}". Are you sure you would like to replace this with "${changeToName}"?`;
        yesButton = "Yes";
        noButton = "No"
    }

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

function handleConstraintMessage(message) {
    formGroup.classList.add('has-error');
    controlMessage.innerHTML = message;
    setFocus();
}

function handleRequiredMessage(message) {
    handleConstraintMessage(message)
}
