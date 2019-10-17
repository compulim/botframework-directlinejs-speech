require('dotenv/config');
require('global-agent/bootstrap');

// TODO: Use package instead of bundle
window.WebSpeechCognitiveServices = require('../../public/web-speech-cognitive-services.development');
