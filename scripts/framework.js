var framework = {};
framework.weekDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
/**
 * Erzeugt einen Zeit-String
 * @param {Date} time Die Zeit
 * @return {string}
 */
framework.getTimeString = function (time) {
    return time.getHours() + ":" + framework.firstZero(time.getMinutes());
};

/**
 * Erzeugt einen Datums-String
 * @param {Date} date Das Datum
 * @returns {String}
 */
framework.getDateString = function (date) {
    return framework.firstZero(date.getDate()) + "." + framework.firstZero(date.getMonth()) + "." + date.getFullYear();
};

/**
 * Erzeugt einen Datums-Zeit-String
 * @param {Date} datetime Das Datum
 * @return {string}
 */
framework.getDateTimeString = function (datetime) {
    return framework.getDateString(datetime) + " um " + framework.getTimeString(datetime);
};
/**
 * Gibt den Namen des Wochentags zurück
 * @param {number} day Nullbasierter Wochentag
 * @returns {String}
 */
framework.getWeekDayString = function (day) {
    return framework.weekDays[day];
};

/**
 * Konvertiert eine Zahl in einen String und füllt auf 2 Stellen auf
 * @param {number} number
 * @returns {*}
 */
framework.firstZero = function (number) {
    number = number.toString();
    return (number.length > 1 ? number : "0" + number);
};