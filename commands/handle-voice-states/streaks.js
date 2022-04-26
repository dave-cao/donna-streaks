const self = require('../../self-functions');

module.exports = (userInfo, streakChannel, USER) => {
  // user is an object containing the user info
  // streakChannel is a string Id of the streak channel
  // USER is a class in which you can save user data;
  const user = userInfo;
  const now = new Date();
  const streakDate = new Date(user.streakDate);
  const MINUTE = 60 * 1000;

  const timeDiff = now - streakDate;
  const timeArray = self.getTimeDifference(timeDiff);
  const daysBetween = timeArray[3];
  let isSameDay = self.isThisDay(streakDate);

  const oneDayMill = 24 * 60 * 60 * 1000;
  const yesterday = now - oneDayMill;

  if (!isSameDay || user.firstStreak) {
    // Implement streak freeze
    if (daysBetween > 1) {
      for (let i = daysBetween; i > 1; i -= 1) {
        // consume streak freezes for missed amount of days
        user.streakFreeze -= 1;
      }

      if (user.streakFreeze >= 0) {
        // if user has enough streak freezes, save streak
        streakChannel.send(
          `<@${user.ID}> You were about to lose your streak but your freeze saved the day!\nYou now have \`${user.streakFreeze}\` freeze(s) left!`,
        );
        // if user enters but doesn't make new streak, don't take all streaks freezes again.
        user.streakDate = new Date(yesterday);
      } else {
        // if user doesn't have enough streak freezes, reset streak
        streakChannel.send(
          `<@${user.userID}> You lost your ${user.streak} day streak! Try to gain it back!`,
        );
        user.streak = 0;
        user.streakFreeze = 0;
      }
    }
  }

  setTimeout(() => {
    // async function can save user data because of
    // closure
    isSameDay = self.isThisDay(new Date(user.streakDate));
    if (user.inVoiceChannel) {
      // Check again in case someone leaves and enters again (don't update twice)
      if (!isSameDay || user.firstStreak) {
        user.firstStreak = false;
        user.streak += 1;

        // Update max score
        if (user.streak > user.maxStreak) {
          user.maxStreak = user.streak;
        }

        // Update streak freeze
        if (!(user.streak % 7)) {
          user.streakFreeze += 1;
          streakChannel.send(
            `<@${user.userID}> Good work! You've maintained your streak for a week so you've been given a streak freeze!\n\`You have ${user.streakFreeze} streak freeze(s)\`\n-`,
          );
        }

        // Updated streak message
        streakChannel.send(
          `<@${user.userID}> Your **Donut Streak** has increased!\n\`Current Streak: ${user.streak}\`\n\`Max Streak: ${user.maxStreak}\`\n\nContinue making that dough!`,
        );

        // Update streak date
        user.streakDate = new Date();
      }
    }
    USER.saveUserData(user);
  }, 5000);

  return user;
};
