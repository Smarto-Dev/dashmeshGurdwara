/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const youtubedl = require('youtube-dl-exec');

// Fill in your requirements here:
var VIDEO_URL = '',
  VIDEO_TITLE = "Dashmesh Sikh Gurduwara Jee Live",
  VIDEO_SUBTITLE = "Dashmesh Sikh Gurduwara Jee",
  TITLE = 'Dashmesh Sikh Gurduwara Jee',
  TEXT = `streams a video.`,
  YOUTUBE_LINK = 'https://www.youtube.com/watch?v=hHVlXaBxL-o';

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  async handle(handlerInput) {
    await dashmeshLink(YOUTUBE_LINK);
    const speakOutput = 'Welcome to Dashmesh Sikh Gurduwara Jee. You can say, Play Video, to watch live stream Video! Thanks.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const PlayVideoIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PlayVideoIntent');
  },
  handle(handlerInput) {
    //if (this.event.context.System.device.SupportedInterfaces.VideoApp) {
    let responseBuilder = handlerInput.responseBuilder;
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['VideoApp']) {

      handlerInput.responseBuilder
        .addDirective({
          "type": "VideoApp.Launch",
          "version": "1.0",
          "videoItem": {
            "source": VIDEO_URL,
            "metadata": {
              "title": TITLE,
              "subtitle": VIDEO_SUBTITLE
            }
          }

        })
        .speak(TEXT)
    } else {
      handlerInput.responseBuilder
        .speak("The video cannot be played on your device. To watch this video, try launching this skill from an echo show device.");
    }
    return handlerInput.responseBuilder

      .getResponse();

  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'This skill just plays Dashmesh Sikh Gurduwara Jee live stream video when it is started. It does not have any additional functionality.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const AboutIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AboutIntent';
  },
  handle(handlerInput) {
    const speechText = 'This is a video app starter template.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

async function dashmeshLink(liveLink){
    await  youtubedl(liveLink, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
        referer: liveLink
      })
      .then((result) => {
        VIDEO_URL = result.formats[4].manifest_url
        console.log(`~~~~~~~~ VIDEO_URL: ${VIDEO_URL}`)
      })
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayVideoIntentHandler,
    AboutIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
