
// for a given date and a number of days, returns the from those days ago, ex: for 25th returns 23th
exports.getDateXDaysAgo = (numOfDays, date = new Date()) => {
    const daysAgo = new Date(date.getTime());
    daysAgo.setDate(date.getDate() - numOfDays);
    return daysAgo;
}
