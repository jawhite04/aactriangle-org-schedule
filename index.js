const path = require('node:path');
const csv = require('csvtojson');
const { toHtmlTable } = require('./table');

const year = '2024';

const csvFile = `${year} Instructor Signup - ${year} Instructor Signup.csv`;
const csvPath = './';
const resolvedInputPath = path.resolve(path.join(csvPath, csvFile));

const locations = {
  Morrisville: {
    name: 'TRC Morrisville',
    url: 'https://www.trianglerockclub.com/morrisville/',
    address: '102 Pheasant Wood Ct, Morrisville, NC 27560'
  },
  Raleigh: {
    name: 'TRC Raleigh',
    url: 'https://www.trianglerockclub.com/raleigh/',
    address: '6022 Duraleigh Rd, Raleigh, NC 27612'
  },
  Durham: {
    name: 'TRC Durham',
    url: 'https://www.trianglerockclub.com/durham/',
    address: '1010 Martin Luther King Jr Pkwy Suite 400, Durham, NC 27713'
  }
};

// the object key ("Rappelling", "Cleaning Anchors", etc) must **exactly** match the clinic name in the csv
const clinics = {
  Rappelling: {
    name: 'Rappelling Best Practices',
    path: '/events/rappelling-best-practices',
    time: {
      Sunday: {
        start: '6:00 PM',
        end: '8:00 PM'
      },
      Monday: {
        start: '7:00 PM',
        end: '8:30 PM'
      }
    }
  },
  Knots: {
    name: 'Knots for Climbers',
    path: '/events/climbing-knots',
    time: {
      Monday: {
        start: '7:00 PM',
        end: '8:45 PM'
      }
    }
  },
  'Cleaning Anchors': {
    name: 'Two-Bolt Anchors: Cleaning & Lowering',
    path: '/events/cleaning-sport-anchors',
    time: {
      Sunday: {
        start: '6:00 PM',
        end: '8:00 PM'
      },
      Monday: {
        start: '7:00 PM',
        end: '8:30 PM'
      }
    }
  },
  '2-Bolt Anchors': {
    name: 'Two-Bolt Anchors: The Quad',
    path: '/events/setting-sport-anchors',
    time: {
      Monday: {
        start: '7:00 PM',
        end: '8:30 PM'
      }
    }
  },
  'Belay From Above': {
    name: 'Belaying From Above',
    path: '/events/belaying-from-above',
    time: {
      Monday: {
        start: '7:00 PM',
        end: '9:00 PM'
      }
    }
  }
};

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

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

  const clinicInfo = clinicKeys
    // only keep information where date, location, and topic have data
    .filter((clinicKey) => clinicKey.date && clinicKey.location && clinicKey.topic)
    // get all the info pertaining to one clinic into the same object
    .map((clinicKey) => ({
      ...clinicKey, // "..." = spread syntax
      dayOfWeek: getDayOfWeek(clinicKey.date),
      location: locations[clinicKey.location],
      topic: clinics[clinicKey.topic]
    }));

  await toHtmlTable({ year, clinicInfo });
})();
