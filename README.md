# DirectLineJS for Direct Line Speech channel

[![Build Status](https://travis-ci.org/compulim/botframework-directlinejs-speech.svg?branch=master)](https://travis-ci.org/compulim/botframework-directlinejs-speech)

## Hosted demo

To try out the demo, navigate to https://compulim.github.io/botframework-directlinejs-speech/?s=DIRECT_LINE_SECRET&sr=SPEECH_SERVICES_REGION&ss=SPEECH_SERVICES_SUBSCRIPTION_KEY.

The demo page is connected to a bot codenamed "Waterbottle", source code at [compulim/botframework-waterbottle](https://github.com/compulim/botframework-waterbottle).

The build drops can be found on [this release page](https://github.com/compulim/botframework-directlinejs-speech/releases/tag/dev):

- `botframework-directlinejs-speech-*.tgz` is the tarball as if we would publish it
- [`botframework-directlinejs-speech.tgz`](https://github.com/compulim/botframework-directlinejs-speech/releases/download/dev/botframework-directlinejs-speech.tgz) is the latest tarball
- `directlinespeech-*.js` is the bundle to be used in browser, under `window.DirectLineSpeech`
- [`directlinespeech.js`](https://github.com/compulim/botframework-directlinejs-speech/releases/download/dev/directlinespeech.js) is the latest bundle

## How to contribute

This repository has [Travis CI configured for CI/CD](https://travis-ci.org/compulim/botframework-directlinejs-speech). When a commit is pushed, it will automatically deploy to the demo page. It should complete the whole process within 5 minutes.

### Bumping Speech SDK version

1. Drop a tarball under `/external/` folder
1. Push a commit
1. Wait until Travis CI completely built it
   - Build status at https://travis-ci.org/compulim/botframework-directlinejs-speech
1. Try out the demo at https://compulim.github.io/botframework-directlinejs-speech/

> Note: GitHub Pages limit to 10 deployments per hour

#### Updating Speech SDK package name

If you do need to modify the package name, don't modify `package.json` by hand, do the followings instead:

1. `npm uninstall microsoft-cognitiveservices-speech-sdk`
1. `npm install external/your-new-package.tgz`
1. You may need to modify `/src/index.js` to reference the new package


### Modifying DirectLineJS source code

1. Clone the repository
1. `npm ci`
1. `npm start`
1. Start modifying `/src/index.js`
   - When you save the file, make sure Babel and Webpack both compile successfully
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

## Questions

### How can I use Direct Line token as the credentials?
