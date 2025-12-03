const scheduleYear = '2026';
const aacTriangleDomain = 'https://aactriangle.org';
const eventsPath = '/events';

const locations = [
  {
    sheetValue: 'Morrisville',
    eventUrlPart: '/trc-morrisville',
    name: 'TRC Morrisville',
    url: 'https://www.trianglerockclub.com/morrisville/',
    address: '102 Pheasant Wood Ct, Morrisville, NC 27560'
  },
  {
    sheetValue: 'Raleigh',
    eventUrlPart: '/trc-raleigh',
    name: 'TRC Raleigh',
    url: 'https://www.trianglerockclub.com/raleigh/',
    address: '6022 Duraleigh Rd, Raleigh, NC 27612'
  },
  {
    sheetValue: 'Durham',
    eventUrlPart: '/trc-durham',
    name: 'TRC Durham',
    url: 'https://www.trianglerockclub.com/durham/',
    address: '1010 Martin Luther King Jr Pkwy Suite 400, Durham, NC 27713'
  },
  {
    sheetValue: 'Salvage Yard',
    eventUrlPart: '/trc-salvage-yard',
    name: 'TRC Salvage Yard',
    url: 'https://www.trianglerockclub.com/salvage-yard/',
    address: '2330 Salvage Yard Dr, Raleigh, NC 27604'
  },
  {
    sheetValue: 'Boulder Garden',
    eventUrlPart: '/boulder-garden',
    name: 'The Boulder Garden',
    url: 'https://www.thebouldergarden.com/',
    address: '328 Roney St, Durham, NC 27701'
  },
  {
    sheetValue: 'Ruckus',
    eventUrlPart: '/ruckus',
    name: 'Ruckus Climbing Gym',
    url: 'https://ruckusclimbinggym.com/',
    address: '5005 High Point Rd, Greensboro, NC 27407'
  }
];

const clinics = [
  {
    sheetValue: 'Rappelling',
    eventUrlPart: '/rappelling-best-practices',
    name: 'Rappelling Best Practices'
  },
  {
    sheetValue: 'Knots',
    eventUrlPart: '/climbing-knots',
    name: 'Knots for Climbers'
  },
  {
    sheetValue: 'Cleaning Anchors',
    eventUrlPart: '/cleaning-sport-anchors',
    name: 'Two-Bolt Anchors: Cleaning & Lowering'
  },
  {
    sheetValue: '2-Bolt Anchors',
    eventUrlPart: '/setting-sport-anchors',
    name: 'Two-Bolt Anchors: The Quad'
  },
  {
    sheetValue: 'Belay From Above',
    eventUrlPart: '/belaying-from-above',
    name: 'Belaying From Above'
  },
  {
    sheetValue: 'Universal Belay',
    eventUrlPart: '/universal-belay',
    name: 'Universal Belay'
  },
  {
    sheetValue: 'Self-Rescue',
    eventUrlPart: '/self-rescue-ground-school',
    name: 'Self-Rescue Basics'
  },
  {
    sheetValue: 'Trad Basics',
    eventUrlPart: '/trad-ground-school',
    name: 'Into to Trad Gear'
  }
];

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

module.exports = {
  scheduleYear,
  aacTriangleDomain,
  eventsPath,
  locations,
  clinics,
  daysOfWeek
};
