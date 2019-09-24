# DirectLineJS for Direct Line Speech channel

## Hosted demo

To try out the demo, navigate to https://compulim.github.io/botframework-directlinejs-speech/.

## How to use

> This is for development only.

```html
<script src="https://github.com/compulim/botframework-directlinejs-speech/releases/download/dev/directlinespeech.js"></script>
<script src="https://cdn.botframework.com/botframework-webchat/4.5.2/webchat.js"></script>
<script>
  window.WebChat.renderWebChat({
    directLine: new window.DirectLineSpeech.DirectLine({
      token: '...'
    })
  }, document.getElementById('webchat'));
</script>
```

## How to contribute

```sh
npm start
```

Then navigate to (http://localhost:5000/).
