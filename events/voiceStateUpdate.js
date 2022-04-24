// get Voice class from voice actions.js
const Voice = require('../commands/voice-actions');

module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  execute(oldState, newState) {
    // Initialize voice class
    const voice = new Voice(oldState, newState);
    voice.start();
  },
};
