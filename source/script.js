/* var fieldProperties = {
  METADATA: '',
  LABEL: 'This is a label',
  HINT: 'This is a hint',
  PARAMETERS: [
    {
      key: 'button1',
      value: "I don't know"
    },
    {
      key: 'value1',
      value: '1'
    },
    {
      key: 'button2',
      value: 'Refused'
    },
    {
      key: 'value2',
      value: '2'
    }
  ],
  FIELDTYPE: 'text',
  APPEARANCE: '',
  LANGUAGE: 'english'
}

function setAnswer (ans) {
  console.log('Set answer to: ' + ans)
}

function setMetaData (string) {
  fieldProperties.METADATA = string
}

function getMetaData () {
  return fieldProperties.METADATA
}

function getPluginParameter (param) {
  for (const p of fieldProperties.PARAMETERS) {
    const key = p.key
    if (key == param) {
      return p.value
    }
  }
}

function goToNextField () {
  console.log('Skipped to next field')
}

// document.body.classList.add('android-collect')
// Above for testing only */



/* global fieldProperties, setAnswer, goToNextField, getPluginParameter, setMetaData */

var input = document.querySelector('#field')
var formGroup = document.querySelector('.form-group')
var controlMessage = document.querySelector('.control-message')
var formattedSpan = document.querySelector('#formatted')
var buttonContainer = document.querySelector('#buttons')
var warningContainer = document.querySelector('#warning')

var fieldType = fieldProperties.FIELDTYPE
var appearance = fieldProperties.APPEARANCE
var altValues = []
var buttonsDisp = ''
var oldValue
var replacementValue

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

for (let buttonNumber = 1; buttonNumber <= 100; buttonNumber++) {
  const buttonLabel = getPluginParameter('button' + String(buttonNumber))
  const buttonValue = getPluginParameter('value' + String(buttonNumber))
  if ((buttonLabel != null) && (buttonValue != null)) {
    const buttonHtml = '<button id="' + buttonLabel + '" class="altbutton button' + (((buttonNumber + 1) / 2 % 2) + 1) + '" value="' + buttonValue + '" dir="auto">' + buttonLabel + '</button>'
    buttonsDisp += buttonHtml
    altValues.push(buttonValue)
  }
}

buttonContainer.innerHTML = buttonsDisp
var allButtons = document.querySelectorAll('#buttons button')
for (const button of allButtons) {
  buttonFontAdjuster(button)
  if (!fieldProperties.READONLY) {
    button.addEventListener('click', function () { // Adds event listener to buttons
      const clickedLabel = button.innerHTML
      const clickedValue = button.value
      const currentInput = input.value
      if ((currentInput === '') || (currentInput == null) || (altValues.indexOf(currentInput) !== -1)) {
        setMetaData(clickedLabel)
        setAnswer(clickedValue)
        goToNextField()
      } else {
        dispWarning(clickedLabel, clickedValue)
      }
    })
  }
}

var yesButton = getPluginParameter('yes')
if (yesButton == null) {
  yesButton = 'Yes'
}

var noButton = getPluginParameter('no')
if (noButton == null) {
  noButton = 'No'
}

var warningTemplate = getPluginParameter('warning')
if (warningTemplate == null) {
   warningTemplate = 'Warning: This field already has a value of "${oldValue}". Are you sure you would like to replace this with "${replacementValue}"?'
} else {
  warningTemplate = warningTemplate.replace('oldValue', '${oldValue}')
  warningTemplate = warningTemplate.replace('replacementValue', '${replacementValue}')
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

      // The part below adds commas to the numbers after the decimal point. Unfortunately, a lookbehind assersion breaks the JS in iOS right now, so this has been commented out for now.
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
  setMetaData('')
  setAnswer(currentAnswer)
}

function buttonFontAdjuster (button) { // djusts size of the text of the buttons in case the text is too long
  var fontSize = parseInt(window.getComputedStyle(button, null).getPropertyValue('font-size'))
  let stopper = 50
  while (button.scrollHeight > button.clientHeight) {
    fontSize--
    button.style.fontSize = fontSize + 'px'
    stopper--
    if (stopper <= 0) {
      return
    }
  }
}

function clearAnswer () {
  input.value = ''
  setMetaData('')
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

function handleConstraintMessage (message) {
  formGroup.classList.add('has-error')
  controlMessage.innerHTML = message
  setFocus()
}

function handleRequiredMessage (message) {
  handleConstraintMessage(message)
}

function dispWarning (clickedLabel, clickedValue) { // Displays the warning when tapping a button when there is already content in the text box
  oldValue = input.value
  replacementValue = clickedLabel

  let warningMessage = new Function('return `' + warningTemplate + '`')() // Takes the string template, and turns it into an actual template.
  warningMessage += `<br><button id="yes" class="whitebutton" dir="auto">${yesButton}</button><button id="no" class="bluebutton" dir="auto">${noButton}</button>` // Adds on the "Yes" and "No" buttons

  warningContainer.innerHTML = warningMessage

  document.querySelector('#yes').addEventListener('click', function () {
    setMetaData(clickedLabel)
    setAnswer(clickedValue)
    goToNextField()
  })

  document.querySelector('#no').addEventListener('click', function () {
    warningContainer.innerHTML = null
  })
}
