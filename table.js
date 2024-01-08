const fs = require('node:fs');
const path = require('node:path');

const formatTimeRange = (startTime, endTime) => {
  const start = new Date(`1/1/1970 ${startTime}`);
  const end = new Date(`1/1/1970 ${endTime}`);

  // Check if both times are in the same AM/PM
  const sameAmPm = start.getHours() < 12 === end.getHours() < 12;

  // Format the start and end times
  const options = { hour: 'numeric', minute: '2-digit' };
  const locale = 'en-US';
  const startTimeFormatted = start.toLocaleTimeString(locale, options);
  const endTimeFormatted = end.toLocaleTimeString(locale, options);

  // Remove AM/PM from the start time if both are in the same AM/PM
  const finalStartTime = sameAmPm ? startTimeFormatted.replace(/ AM| PM/, '') : startTimeFormatted;

  return `${finalStartTime}-${endTimeFormatted}`;
};

const getLinkHtml = (href, content) => `<a href="${href}">${content}</a>`;
const getTableRow = (content) => `<tr>${content}</tr>`;
const getTableCell = (content) => `<td class="tc">${content}</td>`;

const toHtmlTable = ({ year, clinicInfo }) => {
  /*
  The end result should look similar to this:
  <tr>
    <td class="tc"><a href="/events/cleaning-sport-anchors">Two-Bolt Anchors: Cleaning & Lowering</a></td>
    <td class="tc">Sunday December 11, 6:00-8:00 PM</td>
    <td class="tc"><a href="https://www.trianglerockclub.com/morrisville/">TRC Morrisville</a></td>
  </tr>
  */

  const outputFile = `${year} Clinic Schedule for the webpage.txt`;
  const outputPath = './';
  const resolvedOuptutPath = path.resolve(path.join(outputFile, outputPath));

  // now that everything's in one place, build out the info for the table rows
  const tableHtml = clinicInfo.map((clinicKey) => ({
    location: getLinkHtml(clinicKey.location.url, clinicKey.location.name),
    date: `${clinicKey.dayOfWeek} ${clinicKey.date}, ${formatTimeRange(clinicKey.topic.time[clinicKey.dayOfWeek].start, clinicKey.topic.time[clinicKey.dayOfWeek].end)}`,
    topic: getLinkHtml(clinicKey.topic.path, clinicKey.topic.name)
  }))
    // with prepared info, build it into a table
    .map((clinicKey) => getTableRow([
      '', // this is a readability thing
      `  ${getTableCell(clinicKey.topic)}`,
      `  ${getTableCell(clinicKey.date)}`,
      `  ${getTableCell(clinicKey.location)}`,
      '' // another readability thing
    ].join('\n'))) // join the location, date, and topic together for the row
    .join('\n'); // join the rows together

  fs.writeFileSync(resolvedOuptutPath, tableHtml);
};

module.exports = {
  toHtmlTable
};

/*

The code block for the entire table is:

<div class='html-block' align='center'>
  <h2 style="font-size:36px">
    2024 Education Clinics
  </h2>
  <p>
    AAC Clinics are based upon the <a href='https://americanalpineclub.org/best-practices'>Know The Ropes</a> material published in the AAC publication "Accidents in North American Climbing". Join us to learn best practices - the clinics are free, and you don't need to be an AAC member to attend!
  </p>
  <style type='text/css'>
    .tbl  {border-collapse:collapse;border-spacing:0;}
    .tbl th {padding:10px 10px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
    .tbl td {padding:10px 10px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
    .tbl .tc {border-color:inherit;vertical-align:top}
  </style>
  <table class='tbl'>
    <tr>
      <th class='tc'>Clinic</th>
      <th class='tc'>Date & Time</th>
      <th class='tc'>Location</th>
    </tr>

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // output of the above code goes here
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  </table>
  <p>
  Clinic sign-up links will be available two weeks prior to the clinic date.
  </p>
  <P>
  We're always working with TRC to schedule clinics. Check back later for more clinic dates and locations.
  </P>
<p>For questions about clinics, send an email to <a href="mailto:AACTriangleEducation@americanalpineclub.org">AACTriangleEducation@americanalpineclub.org</a>
</p>
</div>

*/
