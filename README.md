# calendar-to-timesheet
Tool for copying labelled bookings from your Google calendar week into a Replicon timesheet row.

This is a [Tampermonkey](https://www.tampermonkey.net/) script (browser extension) which adds a copy button to your [google calendar](https://calendar.google.com/calendar), and a paste button to each row in your [Replicon](https://eu3.replicon.com/) timsheet.\
Clicking the copy button gathers all the data about your calendar entries through the week, and sums them by their assigned labels for each day. Then in Replicon, you can click the paste button for a given timesheet row, select a calendar entry label, and those hours will be pasted in to that row.


<img src="https://github.com/martin-armstrong/calendar-to-timesheet/blob/main/google-copy-button.png?raw=true" alt="Google Calendar Copy Button" style="width:50%; height:auto;" />\
<img src="https://github.com/martin-armstrong/calendar-to-timesheet/blob/main/replicon-paste-buttons.png?raw=true" alt="Replicon timesheet Paste Buttons" style="width:50%; height:auto;" />\

### How to Install
Install [Tampermonkey](https://www.tampermonkey.net/) Chrome/Firefox browser extension.\
Right click [here](https://github.com/martin-armstrong/calendar-to-timesheet/raw/main/Calendar-To-Timesheet-Assistant.user.js) and select *open in new tab*, you should see a prompt to install the script into Tampermonkey.\
Visit your Google calendar and you should see the copy button added at the top next to the settings menu icon.\
Then right click your your Google calendar entries to add your labels e.g. "Project A", "Project B", "Training", "People Management", "Community Meetings".
