const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const csvFile = '2023 Instructor Signup - 2023 Instructor Signup.csv';
const csvPath = './';
const resolvedInputPath = path.resolve(path.join(csvPath, csvFile));

const outputFile = '2023 Clinic Schedule for the webpage.txt';
const outputPath = './';
const resolvedOuptutPath = path.resolve(path.join(outputFile, outputPath));

const year = '2023';

const locations = {
  Morrisville: {
    name: 'TRC Morrisville',
    url: 'https://www.trianglerockclub.com/morrisville/'
  },
  Raleigh: {
    name: 'TRC Raleigh',
    url: 'https://www.trianglerockclub.com/raleigh/'
  },
  Durham: {
    name: 'TRC Durham',
    url: 'https://www.trianglerockclub.com/durham/'
  }
};

const clinics = {
  Rappelling: {
    name: 'Rappelling Best Practices',
    path: '/events/rappelling-best-practices',
    time: {
      Sunday: '6:00-8:00 PM',
      Monday: '7:00-8:30 PM'
    }
  },
  Knots: {
    name: 'Knots for Climbers',
    path: '/events/climbing-knots',
    time: {
      Monday: '7:00-8:45 PM'
    }
  },
  'Cleaning Anchors': {
    name: 'Two-Bolt Anchors: Cleaning & Lowering',
    path: '/events/cleaning-sport-anchors',
    time: {
      Sunday: '6:00-8:00 PM',
      Monday: '7:00-8:30 PM'
    }
  },
  '2 Bolt Anchors': {
    name: 'Two-Bolt Anchors: The Quad',
    path: '/events/setting-sport-anchors',
    time: {
      Monday: '7:00-8:30 PM'
    }
  },
  'Belay from Above': {
    name: 'Belaying From Above',
    path: '/events/belaying-from-above',
    time: {
      Monday: '7:00-9:00 PM'
    }
  }
};

/*
<tr>
  <td class="tc"><a href="/events/cleaning-sport-anchors">Two-Bolt Anchors: Cleaning & Lowering</a></td>
  <td class="tc">Sunday December 11, 6:00-8:00 PM</td>
  <td class="tc"><a href="https://www.trianglerockclub.com/morrisville/">TRC Morrisville</a></td>
</tr>
*/

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const getLinkHtml = (href, content) => `<a href="${href}">${content}</a>`;
const getTableRow = (content) => `<tr>${content}</tr>`;
const getTableCell = (content) => `<td class="tc">${content}</td>`;

const getDayOfWeek = (monthAndDay) => {
  const dateObj = new Date(`${monthAndDay}, ${year}`);
  return daysOfWeek[dateObj.getDay()];
};

(async () => {
  const scheduleJson = await csv({ noheader: true }).fromFile(resolvedInputPath);

  const clinicDates = scheduleJson[0];
  const clinicLocations = scheduleJson[1];
  const clinicTopics = scheduleJson[2];

  // csv-to-json makes column names "field1", "field2", etc "fieldN"
  const fields = Object.keys(clinicDates);
  const clinicKeys = [];
  fields.forEach((field) => clinicKeys.push({
    date: clinicDates[field],
    location: clinicLocations[field],
    topic: clinicTopics[field]
  }));

  const clinicInformation = clinicKeys
    // only keep information where date, location, and topic have data
    .filter((clinicKey) => clinicKey.date && clinicKey.location && clinicKey.topic)
    // get all the info pertaining to one clinic into the same object
    .map((clinicKey) => ({
      ...clinicKey, // "..." = spread syntax
      dayOfWeek: getDayOfWeek(clinicKey.date),
      location: locations[clinicKey.location],
      topic: clinics[clinicKey.topic]
    }))
    // now that everything's in one place, build out the info for the table rows
    .map((clinicKey) => ({
      location: getLinkHtml(clinicKey.location.url, clinicKey.location.name),
      date: `${clinicKey.dayOfWeek} ${clinicKey.date}, ${clinicKey.topic.time[clinicKey.dayOfWeek]}`,
      topic: getLinkHtml(clinicKey.topic.path, clinicKey.topic.name)
    }))
    // with prepared info, build it into a table
    .map((clinicKey) => getTableRow(['', // this is a readability thing
      getTableCell(clinicKey.topic),
      getTableCell(clinicKey.date),
      getTableCell(clinicKey.location), ''
    ].join('\n'))) // join the location, date, and topic together for the row
    .join('\n'); // join the rows together

  fs.writeFileSync(resolvedOuptutPath, clinicInformation);
})();
