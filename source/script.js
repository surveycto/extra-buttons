/* var fieldProperties = {
  "PARAMETERS": [
    {
      "key": "A",
      "value": 1
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
  "FIELDTYPE": 'integer',
  "APPEARANCE": 'show_formatted'
}
var input = document.querySelector('#field')
setFocus()
// bove for testing only */

/* global fieldProperties, setAnswer, goToNextField */

var input = document.querySelector('#field')
var formGroup = document.querySelector('.form-group')
var controlMessage = document.querySelector('.control-message')
var formattedSpan = document.querySelector('#formatted')
var buttonHolder = document.querySelector('#buttons')

var parameters = fieldProperties.PARAMETERS
var fieldType = fieldProperties.FIELDTYPE
var appearance = fieldProperties.APPEARANCE
var altValues = []

if (fieldType === 'integer') {
  input.inputmode = 'numeric'
  input.type = 'number'
} else if (fieldType === 'decimal') {
  input.inputmode = 'decimal'
  input.type = 'number'
} else if (fieldType === 'text') {
  if (appearance.includes('numbers_phone')) {
    input.inputmode = 'tel'
    input.type = 'tel'
  } else if (appearance.includes('numbers_decimal')) {
    input.inputmode = 'decimal'
    input.type = 'number'
  } else if (appearance.includes('numbers')) {
    input.inputmode = 'numeric'
    input.type = 'number'
  }
}

var numParam = parameters.length

if (numParam >= 4) {
  var buttonsDisp = ''
  var warningMessage
  var yesButton
  var noButton

  if (parameters[0].value == 1) {
    warningTemplate = 'Warning: This field already has a value of "${oldValue}". Are you sure you would like to replace this with "${replacementValue}"?'
  } else {
    warningTemplate = parameters[0].value

    // eplaces holder values with template literal syntax
    warningTemplate = warningTemplate.replace('oldValue', '${oldValue}')
    warningTemplate = warningTemplate.replace('replacementValue', '${replacementValue}')
  }

  if (parameters[1].value == 1) {
    yesButton = 'Yes'
  } else {
    yesButton = parameters[1].value
  }

  if (parameters[2].value == 1) {
    noButton = 'No'
  } else {
    noButton = parameters[2].value
  }

  for (let b = 3; b + 1 < numParam; b += 2) {
    let buttonName = parameters[b].value
    let buttonVal = parameters[b + 1].value
    let buttonHtml = '<button id="' + buttonName + '" class="altbutton button' + (((b + 1) / 2 % 2) + 1) + '" value="' + buttonVal + '" dir="auto">' + buttonName + '</button>'
    buttonsDisp += buttonHtml
    altValues.push(buttonVal)
  }
  buttonHolder.innerHTML = buttonsDisp
  var allButtons = document.querySelectorAll('#buttons button')

  for (let button of allButtons) {
    buttonFontAdjuster(button)
    if (!fieldProperties.READONLY) {
      button.addEventListener("click", function () { // Adds event listener to buttons
        const clicked = button.value
        const currentInput = input.value
        if ((currentInput === '') || (currentInput == null) || (altValues.indexOf(currentInput) !== -1)) {
          setAnswer(clicked)
          goToNextField()
        } else {
          dispWarning(clicked)
        }
      })
    }
  }

  function buttonFontAdjuster (button) { // djusts size of the text of the buttons in case the text is too long
    var fontSize = parseInt(window.getComputedStyle(button, null).getPropertyValue('font-size'))
    let stopper = 50
    while (button.scrollHeight > button.clientHeight) {
      fontSize--
      button.style.fontSize = fontSize + "px"
      stopper--
      if (stopper <= 0) {
        return
      }
    }
  }

  function dispWarning (clicked) { // isplays the warning when tapping a button when there is already content in the text box
    oldValue = input.value
    let altIndex = altValues.indexOf(parseInt(clicked))
    replacementValue = parameters[altIndex * 2 + 3].value

    let warningMessage = new Function("return `" + warningTemplate + "`")() // akes the string template, and turns it into an actual template.
    warningMessage += `<br><button id="yes" class="whitebutton" dir="auto">${yesButton}</button><button id="no" class="bluebutton" dir="auto">${noButton}</button>` // dds on the "Yes" and "No" buttons

    warning.innerHTML = warningMessage

    document.querySelector('#yes').addEventListener('click', function () {
      setAnswer(clicked)
      goToNextField()
    })

    document.querySelector('#no').addEventListener('click', function () {
      warning.innerHTML = null
    })
  }
}

function clearAnswer () {
  input.value = ''
  setAnswer('')
}

function setFocus () {
  input.focus()

  if (!fieldProperties.READONLY) {
    if (window.showSoftKeyboard) {
      window.showSoftKeyboard()
    }
  }
}

function cursorToEnd (el) { // oves cursor to end of text in text box (incondistent in non-text fields)
  if (typeof el.selectionStart === 'number') {
    el.selectionStart = el.selectionEnd = el.value.length
  } else if (typeof el.createTextRange !== 'undefined') {
    el.focus()
    var range = el.createTextRange()
    range.collapse(false)
    range.select()
  }
}

input.oninput = function () {
  formGroup.classList.remove('has-error')
  controlMessage.innerHTML = ''
  const currentAnswer = input.value

  if (appearance.includes('show_formatted')) {
    const ansString = currentAnswer.toString()
    const pointLoc = currentAnswer.indexOf('.')

    if (pointLoc === -1) {
      formattedSpan.innerHTML = ansString.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      const beforePoint = ansString.substring(0, pointLoc).replace(/\B(?=(\d{3})+(?!\d))/g, ',') // efore the decimal point

      // he part below adds commas to the numbers after the decimal point. Unfortunately, a lookbehind assersion breaks the JS in iOS right now, so this has been commented out for now.
      /* let midPoint = answer.substring(pointLoc + 1, pointLoc + 3) // he first two digits after the decimal point this is because the first two digits after the decimal point are the "tenths" and "hundredths", while after that is "thousandths"
      let afterPoint = answer.substring(pointLoc + 3, answer.length).replace(/\B(?<=(^(\d{3})+))/g, ",") // fter the first two digits after the decimal point
      let total = beforePoint
 
      if (midPoint != '') { // dds the decimal point only if it is needed
        total += '.' + midPoint
        if (afterPoint != '') { // dds the comma after "midPoint" and the rest only if they are needed
          total += ',' + afterPoint
        }
      } */
      const afterPoint = ansString.substring(pointLoc, ansString.length)
      const total = beforePoint + afterPoint

      formattedSpan.innerHTML = total
    }
  }

  setAnswer(currentAnswer)
}

function handleConstraintMessage (message) {
  formGroup.classList.add('has-error')
  controlMessage.innerHTML = message
  setFocus()
}

function handleRequiredMessage (message) {
  handleConstraintMessage(message)
}
