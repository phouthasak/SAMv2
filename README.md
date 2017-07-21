# SAMv2
Smart Assistant Mirror Version 2

## Project Description
SAMv2 is a customizable smart mirror that combines that power of a
microcomputer with an everyday household mirror. Using two-way mirror technology, SAM can
display a dashboard interface through a reflective mirror, presenting users with useful
information and widgets such as weather info, calendar appointments, and more. It features a
user-friendly configuration system, as well as Wi-Fi connectivity for always up-to- date
information.

## How to Install
Install <a href="https://nodejs.org/en/" target="_blank">node.js</a>
Clone this repository.
Then navigate to the directory holding the server.js file.
Execute command: node server.js

## Widgets
* news
* outfit of the day (ootd)
* stocks
* clock (today)
* weather
* horoscope
* Voice support
* AI

## To Extend Voice Support
To add extra features to the voice support, refer to the file <a href="https://github.com/jmaruiz/smartmirror/blob/master/widgets/voice/voice.js" target="_blank">/widgets/voice/voice.js</a>. The current speech-to-text
technology is through <a href="https://www.talater.com/annyang/" target="_blank">Annyang</a>. The current text-to-speech technology is <a href="https://responsivevoice.org/" target="_blank">ResponsiveVoice.js</a>.

## AI
The current AI system is API.AI

## How To Add Custom Built Widgets
To add your very own widget, simply add a folder with your widget's name in the <a href="https://github.com/jmaruiz/smartmirror/tree/master/widgets" target="_blank">/widgets directory</a>.
In that folder, you will place your js file that will control your widget.
While making your controller js file, keep in mind that the module wrapper's name and the module value within
<a href="https://github.com/jmaruiz/smartmirror/blob/master/config.json" target="_blank">config.json</a> file must match in order of the application to render your widget properly. If you widget requires
to utilize any external APIs, this can be done within the <a href="https://github.com/jmaruiz/smartmirror/blob/master/server.js" target="_blank">server.js</a> file. Refer to the given examples within the file.

## License
SAM is released under the [MIT license](license.md)