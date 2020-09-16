var messageContainer = document.querySelector('#messages')

function logger(message) {
  messageContainer.innerHTML += '<br>\n' + message
}

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

logger('vars declared')

if (fieldType === 'integer') {
  input.inputmode = 'numeric'
  input.type = 'number'
} else if (fieldType === 'decimal') {
  input.inputmode = 'decimal'
  input.type = 'number'
} else if (fieldType === 'text') {
  if (appearance.indexOf('numbers_phone') !== -1) {
    input.inputmode = 'tel'
    input.type = 'tel'
  } else if (appearance.indexOf('numbers_decimal') !== -1) {
    input.inputmode = 'decimal'
    input.type = 'number'
  } else if (appearance.indexOf('numbers') !== -1) {
    input.inputmode = 'numeric'
    input.type = 'number'
  }
}

logger('Appearance retrieved')

for (var buttonNumber = 1; buttonNumber <= 100; buttonNumber++) {
  var buttonLabel = getPluginParameter('button' + String(buttonNumber))
  var buttonValue = getPluginParameter('value' + String(buttonNumber))
  if ((buttonLabel != null) && (buttonValue != null)) {
    var buttonHtml = '<button id="' + buttonLabel + '" class="altbutton button' + (((buttonNumber + 1) / 2 % 2) + 1) + '" value="' + buttonValue + '" dir="auto">' + buttonLabel + '</button>'
    buttonsDisp += buttonHtml
    altValues.push(buttonValue)
  } else {
    break // Stop looking for buttons when number in parameter name is not found
  }
}

logger('Retrieved button info.')

buttonContainer.innerHTML = buttonsDisp
var allButtons = document.querySelectorAll('#buttons button')
var numButtons = allButtons.length

logger('There are ' + String(numButtons) + ' buttons.')

for (var b = 0; b < numButtons; b++) {
  var button = allButtons[b]
  buttonFontAdjuster(button)
  if (!fieldProperties.READONLY) {
    button.addEventListener('click', function () { // Adds event listener to buttons
      var clickedLabel = button.innerHTML
      var clickedValue = button.value
      var currentInput = input.value
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

logger('Populated buttons')

var yesButton = getPluginParameter('yes')
if (yesButton == null) {
  yesButton = 'Yes'
}

var noButton = getPluginParameter('no')
if (noButton == null) {
  noButton = 'No'
}

var warningMessage = getPluginParameter('warning')
if (warningMessage == null) {
  warningMessage = 'Warning: This field already has a value. Are you sure you would like to replace it?'
} else {
  warningContainer.querySelector('#warning-message').innerHTML = warningMessage
}
warningContainer.style.display = 'none'

logger('Other info in')

input.oninput = function () {
  logger('Input detected')
  formGroup.classList.remove('has-error')
  controlMessage.innerHTML = ''
  var currentAnswer = input.value

  logger('Stuff established')
  if (appearance.indexOf('show_formatted') !== -1) {
    var ansString = currentAnswer.toString()
    var pointLoc = currentAnswer.indexOf('.')

    if (pointLoc === -1) {
      formattedSpan.innerHTML = ansString.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      var beforePoint = ansString.substring(0, pointLoc).replace(/\B(?=(\d{3})+(?!\d))/g, ',') // efore the decimal point

      // The part below adds commas to the numbers after the decimal point. Unfortunately, a lookbehind assersion breaks the JS in iOS right now, so this has been commented out for now.
      /* var midPoint = answer.substring(pointLoc + 1, pointLoc + 3) // he first two digits after the decimal point this is because the first two digits after the decimal point are the "tenths" and "hundredths", while after that is "thousandths"
      var afterPoint = answer.substring(pointLoc + 3, answer.length).replace(/\B(?<=(^(\d{3})+))/g, ",") // fter the first two digits after the decimal point
      var total = beforePoint

      if (midPoint != '') { // dds the decimal point only if it is needed
        total += '.' + midPoint
        if (afterPoint != '') { // dds the comma after "midPoint" and the rest only if they are needed
          total += ',' + afterPoint
        }
      } */
      var afterPoint = ansString.substring(pointLoc, ansString.length)
      var total = beforePoint + afterPoint

      formattedSpan.innerHTML = total
    }
  }
  logger('About to set stuff')
  setMetaData('')
  setAnswer(currentAnswer)
  logger('Answer set')
}

function buttonFontAdjuster (button) { // djusts size of the text of the buttons in case the text is too long
  var fontSize = parseInt(window.getComputedStyle(button, null).getPropertyValue('font-size'))
  var stopper = 50
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
  warningContainer.style.display = ''

  document.querySelector('#yes').addEventListener('click', function () {
    setMetaData(clickedLabel)
    setAnswer(clickedValue)
    goToNextField()
  })

  document.querySelector('#no').addEventListener('click', function () {
    warningContainer.style.display = 'none'
  })
}
