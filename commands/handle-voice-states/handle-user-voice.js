const fs = require('fs');

module.exports = class User {
  // Handles all user read and write
  constructor(username, userID, nowDate) {
    // General Variables
    this.username = username;
    this.userID = userID;
    this.now = nowDate;
    this.filename = 'userData.json';

    this.templateData = {
      // User Specific
      username: this.username,
      userID: this.userID,
      inVoiceChannel: true,

      // Streak Data
      streakDate: this.now,
      streak: 0,
      maxStreak: 0,
      streakFreeze: 0,
      firstStreak: true,
    };

    // Get array of users from JSON file
    this.arrayOfUsers = this.getArrayOfUsers();

    // Get the user who entered
    this.user = this.initUser();
  }

  getArrayOfUsers() {
    // Grabs user data from a file
    // If no file is found, then return empty array
    if (fs.existsSync(this.filename)) {
      const jsonString = fs.readFileSync(this.filename, 'utf8');
      const userData = JSON.parse(jsonString);
      return userData;
    }
    return [];
  }

  initUser() {
    // arrayOfUsers is an array of user objects from a JSON file
    // Initialize the user - meaning allow class usage of user
    const userArray = this.arrayOfUsers.filter(
      (userDatum) => userDatum.userID === this.userID,
    );

    // handles any missing data
    const user = this.handleMissingData(userArray);

    return user;
  }

  handleMissingData(userArray) {
    // Checks to see if the user exists, and if not, sets the default values
    // Checks to see if all users have all keys from template data, and if not
    // assign the default values to them

    // Destructure user (user = user[0])
    let [user] = userArray;

    // Check if user exists
    const userExists = userArray.length > 0;
    if (!userExists) {
      user = this.templateData;
    }

    // Check is user has all keys
    const templateKeys = Object.keys(this.templateData);
    templateKeys.forEach((templateValue) => {
      if (!Object.prototype.hasOwnProperty.call(user, templateValue)) {
        user[templateValue] = this.templateData[templateValue];
      }
    });

    return user;
  }

  saveUserData(newUser) {
    // Save user data to json file while changing user specific data in the
    // User array

    // Every time we save, we read file
    const arrayOfUsers = this.getArrayOfUsers();

    let userExists = false;
    arrayOfUsers.forEach((oldUser, index) => {
      if (oldUser.userID === newUser.userID) {
        arrayOfUsers[index] = newUser;
        userExists = true;
      }
    }, arrayOfUsers);

    // If user doesn't exist, then push information
    if (!userExists) {
      arrayOfUsers.push(newUser);
    }

    // Save data
    const finished = (error) => {
      if (error) {
        console.log(error);
      }
    };
    const jsonData = JSON.stringify(arrayOfUsers, null, 2);
    fs.writeFileSync(this.filename, jsonData, finished);
  }
};
