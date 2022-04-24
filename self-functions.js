// Contains all the general-use functions that I make
// for the discord

module.exports = {
  now: new Date(),
  /**
   * Checks to see if a date is today or not.
   * @param {Date} date - the date to check
   * @returns {bool} - true if the date is within today
   */
  isThisDay(date) {
    return this.now.toDateString() === date.toDateString();
  },

  /**
   * Checks to see if a date is within this week
   * @param {Date} date - the date to check
   * @returns {bool} - true if the date is within this week
   */
  isThisWeek(date) {
    const weekDay = (this.now.getDay() + 6) % 7; // Make sure Sunday is 6, not 0
    const monthDay = this.now.getDate();
    let mondayThisWeek = monthDay - weekDay;

    const startOfThisWeek = new Date(Number(this.now));
    startOfThisWeek.setDate(mondayThisWeek);
    startOfThisWeek.setHours(0, 0, 0, 0);
    mondayThisWeek = startOfThisWeek.getDate(); // take into account negative numbers

    const startOfNextWeek = new Date(Number(startOfThisWeek));
    startOfNextWeek.setDate(mondayThisWeek + 7);

    return date >= startOfThisWeek && date < startOfNextWeek;
  },

  /**
   * Checks to see if a date is within this month
   * @param {Date} date - the date to check
   * @returns {bool} - true if the month is within this month
   */
  isThisMonth(date) {
    const currentMonth = this.now.getMonth();
    const currentYear = this.now.getFullYear();

    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  },

  /**
   * Checks to see if a date is within this season
   *
   * Each season consists of 4 months. The season months are static and do
   * not change. These are:
   * 1. January - April
   * 2. May - August
   * 3. September - December
   *
   * @param {Date} date - the date to check
   * @returns {bool} - true if the date is within this season
   * */
  isThisSeason(date) {
    const yearsMatch = !(this.now.getFullYear() - date.getFullYear());
    const oldMonthDay = date.getMonth();
    const newMonth = this.now.getMonth();

    const checkZone = (month) => {
      // Checks to see what zone the current month is in
      // Zone 1: January - April
      // Zone 2: May - August
      // Zone 3: September - December
      let zone;
      if (month >= 8) {
        zone = 3;
      } else if (month >= 4) {
        zone = 2;
      } else {
        zone = 1;
      }
      return zone;
    };

    // Compare the check zones
    return checkZone(oldMonthDay) === checkZone(newMonth) && yearsMatch;
  },
  /**
   * Returns an array of formatted hrs, mins and secs of a time difference in milliseconds
   * @param {Integer} timeDiff - amount of milliseconds
   * @returns {Array[sec, min, hrs, days]} - formatted milliseconds into hrs, mins, and seconds
   */
  getTimeDifference(timeDiff) {
    const hrs = Math.floor(timeDiff / (3600 * 1000));
    const min = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const sec = Math.floor((timeDiff % (1000 * 60)) / 1000);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return [sec, min, hrs, days];
  },
};
