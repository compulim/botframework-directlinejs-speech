# DirectLineJS for Direct Line Speech channel

[![Build Status](https://travis-ci.org/compulim/botframework-directlinejs-speech.svg?branch=master)](https://travis-ci.org/compulim/botframework-directlinejs-speech)

## Hosted demo

To try out the demo, navigate to https://compulim.github.io/botframework-directlinejs-speech/. It is connected to a bot codenamed "Waterbottle", at https://github.com/compulim/botframework-waterbottle.

## How to contribute

### Bumping Speech SDK version

1. Drop a `.tgz` file under `/external/` folder, same name
   - If you do need to modify the package name, don't modify `package.json` by hand, instead
      1. `npm uninstall microsoft-cognitiveservices-speech-sdk`
      1. `npm install external/your-package.tgz`
      1. Modify `/src/index.js` to reference it
1. Push a commit for it
1. Wait until Travis CI completely built it, https://travis-ci.org/compulim/botframework-directlinejs-speech
1. Try it out on demo at https://compulim.github.io/botframework-directlinejs-speech/
   - GitHub Pages limit to 10 releases per hours

### Modifying DirectLineJS source code

1. Clone the repository
1. `npm ci`
1. `npm start`
1. Start modifying `/src/index.js`
   - When you save the file, make sure Babel and Webpack compile successfully
1. Navigate to http://localhost:5000/

### Modifying the bot

Please submit a ticket to either repository and drop me a message.

The bot is part of a test harness. Modifying it may break a lot of tests.

### Using it in your own web app

```html
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <script src="https://github.com/compulim/botframework-directlinejs-speech/releases/download/dev/directlinespeech.js"></script>
    <script src="https://cdn.botframework.com/botframework-webchat/4.5.2/webchat.js"></script>
  </head>
  <body>
    <div id="webchat"></div>
    <script>
      window.WebChat.renderWebChat({
        directLine: new window.DirectLineSpeech.DirectLine({
          token: '...'
        })
      }, document.getElementById('webchat'));
    </script>
  </body>
</html>
```
