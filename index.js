const path = require('node:path');
const csv = require('csvtojson');
const { toHtmlTable } = require('./table');
// const { sendToCalendar } = require('./gcal');
const constants = require('./constants');

const csvFile = `${constants.scheduleYear} Instructor Signup - ${constants.scheduleYear} Instructor Signup.csv`;
const csvPath = './';
const resolvedInputPath = path.resolve(path.join(csvPath, csvFile));

const getDayOfWeek = (monthAndDay) => {
  const dateObj = new Date(`${monthAndDay}, ${constants.scheduleYear}`);
  return constants.daysOfWeek[dateObj.getDay()];
};

const getFormattedDate = (monthAndDay) => {
  const dateOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  const dateObj = new Date(`${monthAndDay} ${constants.scheduleYear}`);
  return dateObj.toLocaleDateString('en-US', dateOptions);
};

(async () => {
  const scheduleJson = await csv({ noheader: true }).fromFile(resolvedInputPath);

  const clinicDates = scheduleJson[0];
  const clinicLocations = scheduleJson[1];
  const clinicTopics = scheduleJson[2];
  const clinicTimes = scheduleJson[3];

  // csv-to-json makes column names "field1", "field2", etc "fieldN"
  const fields = Object.keys(clinicDates);
  const clinicKeys = fields
    // get dates['field1'], locations['field1'], etc into one object
    .map((field) => ({
      date: getFormattedDate(clinicDates[field]),
      location: clinicLocations[field],
      topic: clinicTopics[field],
      time: clinicTimes[field]
    }))
    // only keep information where date, location, and topic have data
    .filter((clinicKey) => clinicKey.date && clinicKey.location && clinicKey.topic);

  const clinicInfo = clinicKeys
    // get all the info pertaining to one clinic into the same object
    .map((clinicKey) => {
      const location = constants.locations.find((l) => l.sheetValue === clinicKey.location);
      const topic = constants.clinics.find((c) => c.sheetValue === clinicKey.topic);
      const eventPageRelativePath = `${constants.eventsPath}${location.eventUrlPart}${topic.eventUrlPart}`;
      return {
        ...clinicKey,
        dayOfWeek: getDayOfWeek(clinicKey.date),
        location,
        topic,
        eventPageRelativePath
      };
    });

  toHtmlTable({ year: constants.scheduleYear, clinicInfo });
  // await sendToCalendar({ year: constants.scheduleYear, clinicInfo, domain: constants.aacTriangleDomain });
})();
