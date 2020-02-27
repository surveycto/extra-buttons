# Extra buttons (in alpha)

*This plug-in is currently being tested, but has so far worked well.*

![Category buttons](extras/extra-buttons.png)

## Description

Use this plug-in to add extra buttons to your text, integer, or decimal field. When a button is selected, the field will automatically advance. If there is already something in the text box when pressing a button, a warning message will confirm if you would like to replace what you already have. You can specify exactly what each button says, and what its value should be (for example, you can specify that when "I don't know" is selected, then the field has a value of -99). You can use the parameters to specify as many buttons as you would like.

The warning message is available in English, Spanish, French, Portuguese, Hindi, Urdu, Bangla, Amharic, and Burmese. The language will be determined by the form's currently selected language. If none of those languages are selected, then it will appear in English. You can use the language's English name or endonym, even if the endonym is in a non-Latin script. However, if you use a Latin script for the language, it must be all lowercase.


## Default SurveyCTO feature support

| Feature / Property | Support |
| --- | --- |
| Supported field type(s) | `text`, `integer`, `decimal`|
| Default values | No |
| Custom constraint message | Yes |
| Custom required message | Yes |
| Read only | Yes |
| media:image | Yes |
| media:audio | Yes |
| media:video | Yes |
| `number` appearance | Yes |
| `numbers_decimal` appearance | Yes |
| `numbers_phone` appearance | Yes |
| `show_formatted` appearance | No |

## How to use

**To use this plug-in as-is**, just download the [extrabuttons.fieldplugin.zip](extrabuttons.fieldplugin.zip) file from this repo, and attach it to your form.

To create your own field plug-in using this as a template, follow these steps:

1. Fork this repo
1. Make changes to the files in the `source` directory.

    * **Note:** be sure to update the `manifest.json` file as well.

1. Zip the updated contents of the `source` directory.
1. Rename the .zip file to *yourpluginname*.fieldplugin.zip (replace *yourpluginname* with the name you want to use for your plug-in).
1. You may then attach your new .fieldplugin.zip file to your form as normal.

## Parameters

There should be two parameters for each button you would like to include. The first of the two will be the name of the button, and the second will be the value applied to the field when the button is pressed. For example, if you would like an "I don't know" button with the value -99, and a "Refused" button with the value -88, then you can use this appearance:

    custom-extrabuttons(A="I don't know", B=-99, C="Refused", D=-88)

Be sure to update your *constraint* so it accepts the button values as values.

## More resources

* **Test form**  
You can find a form definition in this repo here: [extras/test-form](extras/test-form).

* **Developer documentation**  
More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)