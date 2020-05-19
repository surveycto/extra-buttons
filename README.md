# Extra button

![Category buttons](extras/extra-buttons.png)

|<img src="extras/warning-message.png" width="100px">|
|:---:|
|Warning|

## Description

*Note: There were recent updates to the field plug-in paramters. If you are already using an older version of this field plug-in (before 1.2.0), and you would like to use the newer version, you will have to update your parameters in the* appearance *property of your field(s). See **Parameters** below for more details.*

Use this field plug-in to add extra buttons to your text, integer, or decimal field. When a button is selected, the field will automatically advance. If there is already something in the text box when pressing a button, a warning message will confirm if you would like to replace what you already have. You can specify exactly what each button says, and what its value should be (for example, you can specify that when "I don't know" is selected, then the field has a value of -99). You can use the parameters to specify as many buttons as you would like.

The default warning message is:
>Warning: This field already has a value of "[old value]". Are you sure you would like to replace this with "[replacement]"?

However, it can be customized using the **Parameters** (see below).

This field plug-in also inherits functionality from the [baseline-text](https://github.com/surveycto/baseline-text), [baseline-integer](https://github.com/surveycto/baseline-integer), and [baseline-decimal](https://github.com/surveycto/baseline-decimal) field plug-ins.

[![Download now](extras/download-button.png)](https://github.com/surveycto/extra-buttons/raw/master/extrabuttons.fieldplugin.zip)

## Default SurveyCTO feature support

| Feature / Property | Support |
| --- | --- |
| Supported field type(s) | `text`, `integer`, `decimal`|
| Default values | Yes |
| Custom constraint message | Yes |
| Custom required message | Yes |
| Read only | Yes |
| media:image | Yes |
| media:audio | Yes |
| media:video | Yes |
| `number` appearance | Yes |
| `numbers_decimal` appearance | Yes |
| `numbers_phone` appearance | Yes |
| `show_formatted` appearance | Yes |

## How to use

**To use this field plug-in as-is:**

1. Download the [sample form](extras/sample-form) from this repo and upload it to your SurveyCTO server.
1. Download the [extrabuttons.fieldplugin.zip](https://github.com/surveycto/extra-buttons/raw/master/extrabuttons.fieldplugin.zip) file from this repo, and attach it to the sample form on your SurveyCTO server.
1. Adjust the parameter if you would like to use a different unit (see below).

## Parameters

For each extra button you would like to add, you will need a label, called "button", and a "value". For the parameter name, take the parameter name, and add the button number. For example, the parameter for the label of the first button will be `button1`, the parameter for the label of the second button will be `button2`, and so on. The parameter for the value for the first button will be `value1`, the parameter for the value of the second button will be `value2`, and so on. So, if you wanted one button with the label "I don't know" and a value of `-99`, and another button with a label of "Refused" and a value of -88, you would use this *appearance*:

    custom-extrabuttons(button1="I don't know", value1=-99, button2='Refused', value2=-88)

You can add as many or as few buttons as you'd like.

Be sure to update your *constraint* so it accepts the button values as values.

You can also customize the error message that appears when an enumerator selects a button when the field already has a value.

`warning`: What will be displayed instead of the default warning message.<br>
`yes`: What will be displayed instead of "Yes" in the confirmation.<br>
`no`: What will be displayed instead of "No" in the confirmation.

You can also add `oldValue` to the warning to show where the current value of the field will go, and `replacementValue` to show where the button label will go in the warning message.

    custom-extrabuttons(warning='Voulez-vous vraiment remplacer "oldValue" par "replacementValue"?',
    yes='Oui',
    no='Non',
    button1="I don't know",
    value1=-99,
    button2='Refused',
    value2=-88)

## More resources

* **Sample form**  
You can find a form definition in this repo here: [extras/sample-form](extras/sample-form).

* **Developer documentation**  
More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)
