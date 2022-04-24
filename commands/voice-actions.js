// calls User class
const User = require('./handle-voice-states/handle-user-voice'); // Class

// Functions
// const accountabilityEnter = require('./handle-voice-states/accountability-enter');
// const accountabilityExit = require('./handle-voice-states/accountability-exit');
const streaks = require('./handle-voice-states/streaks');

module.exports = class Action {
  constructor(oldState, newState) {
    // ===========================
    // GENERAL VARIABLES
    // ===========================
    // States
    this.oldState = oldState;
    this.newState = newState;
    this.person = newState.guild.client.users.cache.get(newState.id);

    // Channels
    this.newChannelID = newState.channelId;
    this.oldChannelID = oldState.channelId;
    this.grindChannelVC = '775468177844862986';
    this.streakChannel = newState.guild.channels.cache.get('795046289871994890');
    // this.accountabilityChannel = newState.guild.channels.cache.get('921966065108521004');

    // All purpose
    this.now = new Date();
    this.minute = 1000 * 60;
    this.filename = 'userData.json';

    // =============================
    // USER SPECIFIC
    // =============================
    // Initilize User
    this.User = new User(this.person.username, this.newState.id, this.now);
    this.user = this.User.initUser();
  }

  start() {
    this.handleEvents();
  }

  handleEvents() {
    // User actions
    const userEnters = this.newChannelID === this.grindChannelVC
      && this.oldChannelID !== this.grindChannelVC;
    const userExits = this.newChannelID !== this.grindChannelVC
      && this.oldChannelID === this.grindChannelVC;

    // Don't interact with bots or beef
    if (this.oldState.member.user.bot) return;
    // if (this.newState.id === '751885320936620162') return;

    // User enters
    if (userEnters) {
      this.handleUserEnter();
      this.saveUserData();
    }
    // User Exits
    if (userExits) {
      this.handleUserExit();
      this.saveUserData();
    }
  }

  handleUserEnter() {
    // General Updates
    this.user.inVoiceChannel = true;

    // Accountability
    // this.user = accountabilityEnter(this.user);

    // Streaks
    this.user = streaks(this.user, this.streakChannel, this.User); // closure
  }

  handleUserExit() {
    // General Updates
    this.user.inVoiceChannel = false;

    // Accountability
    // this.user = accountabilityExit(this.user, this.accountabilityChannel);
  }

  saveUserData() {
    // Save user data called from the User Class
    // Put outside if implementing more things, for now just call twice
    this.User.saveUserData(this.user);
  }
};
