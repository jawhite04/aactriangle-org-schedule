const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { google } = require('googleapis');
const moment = require('moment-timezone');

const { JWT } = google.auth;
const tz = 'America/New_York';

const getGCalClient = async () => {
  const saKeyPath = path.resolve('./.env-sa-json');
  const saKeyString = fs.readFileSync(saKeyPath);
  const sa = JSON.parse(saKeyString);

  const scopes = ['https://www.googleapis.com/auth/calendar'];
  const jwtClient = new JWT(
    sa.client_email,
    null,
    sa.private_key,
    scopes
  );

  await jwtClient.authorize();
  const calendar = google.calendar({
    version: 'v3',
    auth: jwtClient
  });
  return calendar;
};

const sendToCalendar = async ({ year, clinicInfo, domain }) => {
  let gcal;
  try {
    gcal = await getGCalClient();
  } catch (e) {
    console.error('Failed to create Google Calendar client. No calendar events will be created.\n', e);
    return;
  }

  const candidateEvents = clinicInfo.map((clinic) => {
    const start = moment.tz(new Date(`${clinic.date}, ${year} ${clinic.topic.time[clinic.dayOfWeek].start}`), tz).format();
    const end = moment.tz(new Date(`${clinic.date}, ${year} ${clinic.topic.time[clinic.dayOfWeek].end}`), tz).format();

    return {
      summary: clinic.topic.name,
      location: clinic.location.address,
      description: `See clinic info and registration details at ${domain}${clinic.topic.path}`,
      start: {
        dateTime: start,
        timeZone: tz
      },
      end: {
        dateTime: end,
        timeZone: tz
      }
    };
  });

  const existingEvents = await gcal.events.list({
    calendarId: process.env.CALENDAR_ID,
    timeMin: new Date(`1/1/${year}`).toISOString(),
    timeMax: new Date(`12/31/${year}`).toISOString(),
    singleEvents: true
  });

  const newEvents = candidateEvents.filter((newEvent) => {
    const conflict = existingEvents.data.items
      .find((existingEvent) => newEvent.start.dateTime === existingEvent.start.dateTime && newEvent.end.dateTime === existingEvent.end.dateTime);
    if (conflict) {
      console.error('Cannot create event: an event with the same start & end time already exists.', {
        newEvent: {
          summary: newEvent.summary,
          startTime: newEvent.start.dateTime,
          endTime: newEvent.end.dateTime
        },
        conflict: {
          htmlLink: conflict.htmlLink,
          summary: conflict.summary,
          startTime: conflict.start.dateTime,
          endTime: conflict.end.dateTime
        }
      });
      return false;
    }
    return true;
  });

  console.log(`Creating ${newEvents.length} events...`);

  const createdEvents = await Promise.all(newEvents.map((newEvent) => gcal.events.insert({
    calendarId: process.env.CALENDAR_ID,
    resource: newEvent
  })));

  console.log(`Created ${createdEvents.length} events.`);
};

module.exports = {
  sendToCalendar
};
