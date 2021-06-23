# Extra button

![Category buttons](extras/readme-images/extra-buttons.png)

|<img src="extras/readme-images/warning-message.png" width="100px">|
|:---:|
|Warning|

## Description

*There were recent updates to the field plug-in paramters. If you are already using an older version of this field plug-in (before 1.2.0), and you would like to use the newer version, you will have to update your parameters in the* appearance *property of your field(s). See [parameters](#parameters) below for more details.*

Use this field plug-in to add extra buttons to your *text*, *integer*, or *decimal* field. When a button is pressed, and the field value is currently blank, that button's value will be saved as the field value. If the field already has a value when pressing a button (other than the value of the pressed button), a warning message will confirm if you would like to replace what you already have.

You can specify exactly what each button says, and what its value should be (for example, you can specify that when "I don't know" is selected, then the field should have a value of -99). You can use the parameters to specify as many buttons as you would like. The label of the button selected will be stored in the metadata for that field.

The default warning message is:
>Warning: This field already has a value. Are you sure you would like to replace it?

However, it can be customized using the [parameters](#parameters).

This field plug-in also inherits functionality from the [baseline-text](https://github.com/surveycto/baseline-text), [baseline-integer](https://github.com/surveycto/baseline-integer), and [baseline-decimal](https://github.com/surveycto/baseline-decimal) field plug-ins.

[![Download now](extras/readme-images/download-button.png)](https://github.com/surveycto/extra-buttons/raw/master/extrabuttons.fieldplugin.zip)

### Features

* Add extra buttons to *text*, *integer*, and/or *decimal* field.
* Customize button value and text
* Add as many buttons as needed
* Warning if button pressed when field has a value

### Data format

If a button is not used, then the data will be whatever is in the text box. When a button is used (and confirmed if applicable), then the value of that button (as specified in the parameters) is set as the field value.

You can also retrieve the label of the button selected using the SurveyCTO plug-in-metadata() function.

## How to use

### Getting started

1. Download the [sample form](https://github.com/surveycto/extra-buttons/raw/master/extras/sample-form/Extra%20buttons.xlsx) from this repo and upload it to your SurveyCTO server.
1. Download the [extrabuttons.fieldplugin.zip](https://github.com/surveycto/extra-buttons/raw/master/extrabuttons.fieldplugin.zip) file from this repo, and attach it to the sample form on your SurveyCTO server.
1. Adjust the parameter if you would like to use a different unit (see below).

### Parameters

|**Name**|**Description**|
|---|---|
|`button#` (required)|See [button parameters](#button-parameters) below to learn more.|
|`value#` (required)|See [button parameters](#button-parameters) below to learn more.|
|`warning` (optional)|Used to customize the warning message that will appear when the enumerator presses a button when the field already has a value. The value of this parameter will be displayed instead of the default warning message.|
|`yes` (optional)|What will be displayed instead of "Yes" in the confirmation.|
|`no` (optional)|What will be displayed instead of "No" in the confirmation.|
|`autoadvance` (optional)|If this parameter has a value of `1`, then when a button is pressed, the field will auto-advance to the next field, similar to the "quick" *appearance* in *[select_one](https://docs.surveycto.com/02-designing-forms/01-core-concepts/03h.field-types-select-one.html)* fields. If the field already has a value other than the value of the button pressed, then it will first display the warning, and then if "Yes" is pressed, the field will auto-advance.|

##### Button parameters

For each extra button you would like to add, you will need a label, called "button", and a "value". For the parameter name, take the parameter name, and add the button number. For example, the parameter for the label of the first button will be `button1`, the parameter for the label of the second button will be `button2`, and so on. The parameter for the value for the first button will be `value1`, the parameter for the value of the second button will be `value2`, and so on. So, if you wanted one button with the label "I don't know" and a value of `-99`, and another button with a label of "Refused" and a value of -88, you would use this *appearance*:

    custom-extrabuttons(button1="I don't know", value1=-99, button2='Refused', value2=-88)

You can add as many or as few buttons as you'd like.

Be sure to update your *constraint* so it accepts the button values as values.

#### Example

Here is an example of what the *appearance* of a field using this field plug-in could look like:

    custom-extrabuttons(warning='Attention: ce champ a déjà une valeur. Etes-vous sûr de vouloir le remplacer?',
    yes='Oui',
    no='Non',
    button1="I don't know",
    value1=-99,
    button2='Refused',
    value2=-88)

There will be two buttons: When "I don't know" is pressed, the field will be given a value of -99, and when "Refused" is pressed, the field will be given a value of -88.

If the field already has a value, and a button is pressed, it will give the warning "Attention: ce champ a déjà une valeur. Etes-vous sûr de vouloir le remplacer?", and it will give the options "Oui" and "Non".

### Default SurveyCTO feature support

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

## More resources

* **Sample form**  
You can find a form definition in this repo here: [extras/sample-form](/extras/sample-form).

* **Developer documentation**  
More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)
