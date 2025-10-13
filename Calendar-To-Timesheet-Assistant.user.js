// ==UserScript==
// @name         Calendar-To-Timesheet-Assistant
// @namespace    http://capgemini.com/calendar-to-timesheet
// @version      0.2
// @description  Tool for copying google calendar labelled bookings throughout your week into a Replicon timesheet row
// @author       Martin Armstrong
// @match        https://calendar.google.com/calendar/u/0/r/week
// @match        https://calendar.google.com/calendar/u/0/r/week/*/*/*
// @match        https://calendar.google.com/calendar/u/0/r
// @match        https://eu3.replicon.com/*/my/timesheet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @updateURL     https://github.com/martin-armstrong/calendar-to-timesheet/raw/main/Calendar-To-Timesheet-Assistant.user.js
// @downloadURL   https://github.com/martin-armstrong/calendar-to-timesheet/raw/main/Calendar-To-Timesheet-Assistant.user.js
// ==/UserScript==


(function() {
    'use strict';

    const WorkingHoursInFullDay = 7.5;

    const htmlPolicy = trustedTypes.createPolicy("htmlPolicy", {
        createHTML: (string) => string,
    });

    const timesheetJsonLabel = "Timesheet Data";


    const googleCalendar = {
      text : {
          Button : "Copy"
      },
      style : `
        .ctt-copy-button {
          margin-left: 12px;
          width:24px;
          height:24px;
          background-repeat:no-repeat;
          background-image: url("data:image/png;base64,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")
        }
        .ctt-copy-button:hover {
          cursor:pointer;
          background-color:#f1f3f4;
        }
        .ctt-popup {
        }
      `,
      selector : {
          ButtonToCopy : "div.pw6cBb",
          CalendarEntryTexts: "div[role='button'] > div.XuJrye"
      },
      init : function() {
        console.debug(`googleCalendar.init()`);
        googleCalendar.addStyle();
        googleCalendar.addButton();
      },
      addStyle: function() {
        console.debug(`googleCalendar.addStyle()`);
        let style = document.createElement("style")
        style.innerText = googleCalendar.style;
        document.querySelector("head").appendChild(style);
      },
      addButton: function() {
       //clone existing button
          console.debug(`googleCalendar.addButton()`);
          let buttonToClone = document.querySelector(googleCalendar.selector.ButtonToCopy);
          let copyButton = buttonToClone.cloneNode();
          //copyButton.innerHTML = htmlPolicy.createHTML(googleCalendar.text.Button);
          copyButton.className = "ctt-copy-button";
          copyButton.addEventListener("click", googleCalendar.clickHandler);
          buttonToClone.insertAdjacentElement("afterend", copyButton);
      },
      clickHandler: function() {
          console.debug(`googleCalendar.clickHandler()`);
          let entries = googleCalendar.extractCalendarEntryData();
          googleCalendar.copyDataToClipboard(entries);
      },
      extractCalendarEntryData: function() {
        console.debug(`googleCalendar.extractCalendarEntryData()`);
        let labelledEntries = googleCalendar.findGoogleCalendarEntriesContaining("colour:"); //"colour: ###" is used to indicate a label applied
        if(labelledEntries.length==0) {
          alert("No labelled calendar entries found");
        }
        labelledEntries.map(entry=>console.debug(`Found labelled entry:"${entry}"`));
        let labelledEntryObjects = labelledEntries.map((entry)=>googleCalendar.parseCalendarEntry(entry));
        let outOfOfficeEntries = googleCalendar.findGoogleCalendarEntriesContaining("out of office");
        let outOfOfficeEntryObjects = outOfOfficeEntries.map((entry)=>googleCalendar.parseCalendarEntry(entry));
          outOfOfficeEntryObjects.map(entry=>console.debug(`Found OoO timespan:${entry.timespan} "${entry.fullEntry}"`));
        let consolidatedEntriesPerDay = (labelledEntryObjects.concat(outOfOfficeEntryObjects)).reduce((acc, nextEntry)=>{
             let existingEntry = acc.find(_=>_.label==nextEntry.label && _.dateStr==nextEntry.dateStr);
             if(existingEntry && nextEntry.timespan>0) {
               existingEntry.fullEntry = existingEntry.fullEntry + " // " + nextEntry.fullEntry;
               existingEntry.timespan = existingEntry.timespan + nextEntry.timespan;
             } else if(nextEntry.timespan>0) {
               acc.push(nextEntry);
             }
             return acc;
        }, []);
        let hoursBookedEachDayByLabel = consolidatedEntriesPerDay.reduce((acc, nextEntry)=>{
            let entriesForLabel = acc[nextEntry.label] ? acc[nextEntry.label] : [];
            entriesForLabel.push({date:nextEntry.dateStr, hours:nextEntry.timespan});
            acc[nextEntry.label] = entriesForLabel;
            return acc;
        }, {});
        console.debug(`Hours booked each day by label..\n${JSON.stringify(hoursBookedEachDayByLabel)}`);
        return hoursBookedEachDayByLabel;
      },
      copyDataToClipboard: function(entries) {
        console.debug(`googleCalendar.copyDataToClipboard()`);
        if(Object.keys(entries).length>0) {
            let entriesByDate = googleCalendar.getEntriesByDate(entries);
            entries["label"] = timesheetJsonLabel;
            let json = JSON.stringify(entries);
            let jsonWithLineBreaks = json
             .replaceAll("],","],\n")
             .replaceAll("},","},\n")
             .replaceAll("[{","[\n{")
             .replaceAll("}]","}\n]")
            navigator.clipboard.writeText(jsonWithLineBreaks);
            googleCalendar.showAlertOfCopiedEntries(entriesByDate);
        }
      },
      getEntriesByDate: function(entries) {
           let entriesByDate = Object.keys(entries).reduce((entriesByDate, entryName)=>{
               let entryDates = entries[entryName];
               entryDates.forEach((dateHours)=>{
                   entriesByDate[dateHours.date] = entriesByDate[dateHours.date] || [];
                   entriesByDate[dateHours.date].push({name:entryName, hours:dateHours.hours});
               });
               return entriesByDate;
           }, {});

          console.log(entriesByDate);
          return entriesByDate;
      },
      showAlertOfCopiedEntries: function(entriesByDate) {
          const detailLines = Object.keys(entriesByDate).map((dateString) => {
              return dateString + " - " + entriesByDate[dateString].reduce((line, namedHours)=>{
                return line + ` ${namedHours.name}:${namedHours.hours}`
              }, "");
          });
          const detailBlock = detailLines.reduce((block, line)=>{return block + line + "\n"}, "Labelled bookings copied to clipboard..\n");
          console.log(detailBlock);

          const totalHoursLines = Object.keys(entriesByDate).map((dateString) => {
              return dateString + " - " + entriesByDate[dateString].reduce((hoursForDay, namedHours)=>{
                return hoursForDay + namedHours.hours
              }, 0) + " hours";
          }).sort();
          const totalHoursBlock = totalHoursLines.reduce((block, line)=>{return block + line + "\n"}, "");
          alert(`Labelled bookings copied to clipboard..\n${totalHoursBlock}`)
      },
      parseTimeToHours:function(str) { //e.g. "3:30pm" -> 15.5
          let isTimeWithMinutes = str.match(/([\d]+):([\d]+).+/);
          if(isTimeWithMinutes) {
              let hours = Number(str.match(/([\d]+):.+/)[1]);
              let minutesStr = str.match(/.+:([\d]+).+/)[1];
              let minuteFractionsOfHour = [
                  {m:"00", f:0},
                  {m:"05", f:0.083},
                  {m:"10", f:0.166},
                  {m:"15", f:0.25},
                  {m:"20", f:0.333},
                  {m:"25", f:0.416},
                  {m:"30", f:0.5},
                  {m:"35", f:0.585},
                  {m:"40", f:0.666},
                  {m:"45", f:0.75},
                  {m:"50", f:0.833},
                  {m:"55", f:0.916}
              ]
              let maybeFoundEntry = minuteFractionsOfHour.find(_=>_.m==minutesStr)
              let foundMinutes = maybeFoundEntry ? maybeFoundEntry.f : 0;
              let add12HoursForPM = (str.indexOf("pm")>-1 && hours<12) ? 12 : 0;
              let timeInHours = add12HoursForPM + hours + foundMinutes;
              console.debug(`googleCalendar.parseTimeToHours("${str}") -> ${timeInHours}`);
              return timeInHours;
          } else {
            let hoursWithoutMinutes = Number(str.match(/([\d]+).+/)[1]);
            let add12HoursForPM = (str.indexOf("pm")>-1 && hoursWithoutMinutes<12) ? 12 : 0;
            let timeInHours = hoursWithoutMinutes + add12HoursForPM;
            console.debug(`googleCalendar.parseTimeToHours("${str}") -> ${timeInHours}`);
            return timeInHours;
          }

      },
      parseTimeSpan:function(str) { //e.g. "11:30am to 12:00pm" => 0.5
          let daySpan = str.match(/([\d]+ [\w]+ [\d]{4}) at ([\d:apm]+) to ([\d]+ [\w]+ [\d]{4}) at ([\d:apm]+)/); // 21 December 2023 at 12am to 22 December 2023 at 12am

          if(daySpan) {
              let hours = 0; //initially defaulting to 0 hours if calendar entry spanning multiple days
              let [startDateStr, startTime, endDate, endTime] = daySpan.toSpliced(0, 1); //chop full match entry off the front
              let startDate = new Date(startDateStr);
              endDate = new Date(endDate);
              if(endDate.getDate()===1 || (endDate.getDate() - startDate.getDate() === 1)) {
                if(startTime === "12am" && endTime==="12am") {
                    hours = WorkingHoursInFullDay;
                }
              }
              console.debug(`googleCalendar.parseTimeSpan("${str}") -> ${hours}`);
              return {dateStr:startDateStr, hours:hours};
          } else {
              let startTimeStr = str.match(/([^ ]+).+/)[1];
              let endTimeStr = str.match(/.+ to ([^ ].+)/)[1];
              let timespan = googleCalendar.parseTimeToHours(endTimeStr) - googleCalendar.parseTimeToHours(startTimeStr);
              console.debug(`googleCalendar.parseTimeSpan("${str}") -> ${timespan}`);
              return {dateStr:null, hours:timespan};
          }
      },
      parseCalendarEntry:function(entry) {
          let dateStr = entry.match(/.+, ([^,]+)/)[1];
          let isOutOfOffice = entry.match(/.*out of office.*/i)
          let label = entry.match(/.+, colour: ([^,]+)/i);
          label = label ? label[1] : (isOutOfOffice ? "out of office" : "");
          let timespanStr = entry.match(/([^,]+),.+/)[1];
          let timespan = googleCalendar.parseTimeSpan(timespanStr).hours;
          dateStr = timespan.dateStr ? timespan.dateStr : dateStr;
          return {
              fullEntry: entry,
              dateStr: dateStr,
              date: new Date(dateStr),
              label: label,
              timespan: timespan
          }
      },
     //returns array of google calendar entry text
      findGoogleCalendarEntries: function() {
        return (Array.from(document.querySelectorAll(googleCalendar.selector.CalendarEntryTexts))).map((n)=>n.innerText);
      },
      findGoogleCalendarEntriesContaining: function(text) {
        return googleCalendar.findGoogleCalendarEntries().filter((v)=>v.indexOf(text)>-1);
      }
    }



    const repliconTimesheet = {
      style : `
        .cttPasteIcon {
          display: inline-block;
          width: 24px;
          height: 24px;
          padding-right: 4px;
          margin: 4px 0px 0px 0px;
          background-repeat:no-repeat;
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAkElEQVR4nO2UQQ6CMBBF30LP7NKwqoC3KF7CuJPbeAZaN10QAnSotaUJP/nJLGbmJX/Sgkxn4A58nFvgREQ1wABoZwPUIYvsivWor/P07hNg3OKHq6MD7AYfALJHZJdgkoEeuAn8DgVUyHQtAmBmHmNUgJrkroqLKPkN+PcN8kfk05AC8AIuAj9DAT99dtH1Bc0xK9heNZWnAAAAAElFTkSuQmCC")
        }
        .cttPopup {
          display: block;
          position: absolute;
          min-width: 100px;
          min-height: 100px;
          border: 1px solid black;
          background-color: white;
          text-align: left;
          padding: 4px;
          z-index: 10;
          box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
        }
        .cttPopupLink {
          color:blue;
          display: block;
          cursor:pointer;
          margin: 5px;
        }
      `,
      selector: {
        OpenTimesheetStatus: "ul.headingDetails > li > span.statusOpen",
        MainBodyContainer: "#mainBodyContainer",
        AddNewTimeline: "a#add-new-timeline",
        FirstDayTD: "tbody > tr > td.day.firstDay",
        TextInputBoxes:"input.duration"
      },
      init : function() {
        //if page ready continue, otherwise wait and try again
        if(document.querySelector(repliconTimesheet.selector.AddNewTimeline) && document.querySelector(repliconTimesheet.selector.FirstDayTD)) {
          console.debug(`repliconTimesheet.init() - page ready, extending the UI..`);
          if(document.querySelector(repliconTimesheet.selector.OpenTimesheetStatus)) {
              repliconTimesheet.addStyle();
              repliconTimesheet.addButtons();
              //repliconTimesheet.addNewTimelineListener();

              const config = {
                  childList: true, // listen for added/removed child nodes
                  attributes: false, // listen for attribute changes
                  subtree: true, // include all descendants
                  characterData: false // listen for text content changes
              };
              const changeListener = function(mutationsList, observer) {
                  console.debug(`init domChangeListener`);
                  window.setTimeout(repliconTimesheet.addButtons, 100); //add new paste buttons if required after table changes
              };
              const observer = new MutationObserver(changeListener);

              // Start observing
              const dataGridElement = document.querySelector(repliconTimesheet.selector.MainBodyContainer);
              observer.observe(dataGridElement, config);
          } else {
              console.debug(`repliconTimesheet.init() - not updating page, the timesheet is not open for edit`);
          }
        } else {
          console.debug(`repliconTimesheet.init() - page not ready, trying again..`);
          window.setTimeout(repliconTimesheet.init, 100);
        }
      },
      addStyle: function() {
        console.debug(`repliconTimesheet.addStyle()`);
        let style = document.createElement("style")
        style.innerText = repliconTimesheet.style;
        document.querySelector("head").appendChild(style);
      },

      rowPasteButtonHandler: function(evt) {
          console.debug(`repliconTimesheet.rowPasteButtonHandler()`);

          evt.preventDefault();
          if(!repliconTimesheet.closePopupIfOpen()) {
              let buttonClicked = evt.target;
              navigator.clipboard
                  .readText()
                  .then((clipboardText) => repliconTimesheet.showPopup(buttonClicked, clipboardText));
          }
          return false;
      },

      addButtons: function(){
          console.debug(`repliconTimesheet.addButtons()`);
          const firstDayTDs = document.querySelectorAll(repliconTimesheet.selector.FirstDayTD);
          if(!firstDayTDs || firstDayTDs.length==0) {
            throw "No first day entry boxes found"
          }
          firstDayTDs.forEach((firstDayTD)=>{
            const rowClass = firstDayTD.parentNode.className;
            const rowPasteButtonID = `${rowClass}-paste-button`;
            //exclude header and footer rows and add button to a row if not already added
            if(rowClass.length!=0 && rowClass.indexOf("actionRow")==-1 && !document.getElementById(rowPasteButtonID)) {
              firstDayTD.style.width = "95px"; //give a bit more room to fit the paste button in
              console.debug(`repliconTimesheet.addNewTimelineListener() Adding row paste button with ID ${rowPasteButtonID}`);
              const rowPasteButton = document.createElement("p")
              rowPasteButton.id = rowPasteButtonID;
              rowPasteButton.className = "cttPasteIcon";
              rowPasteButton.addEventListener("click", repliconTimesheet.rowPasteButtonHandler);
              firstDayTD.firstChild.before(rowPasteButton);
            }
          })
      },

      addNewTimelineListener: function() {
        console.debug(`repliconTimesheet.addNewTimelineListener() Added`);
        const addNewTimelineAnchor = document.querySelector(repliconTimesheet.selector.AddNewTimeline)
        addNewTimelineAnchor.addEventListener("click", ()=>{window.setTimeout(repliconTimesheet.addButtons, 100)}); //allow time to render new row first
      },

      closePopupIfOpen: function() {
          console.debug(`repliconTimesheet.closePopupIfOpen()`);
          let popupDiv = document.getElementById("cttPopup");
          if(popupDiv) {
            popupDiv.parentNode.removeChild(popupDiv);
            document.removeEventListener("scroll", repliconTimesheet.closePopupIfOpen);
            console.debug(`repliconTimesheet.closePopupIfOpen() closed popup and stopped listening for scroll events`);
            return true; //popup closed
          } else {
            return false; //already closed
          }
      },

      showPopup: function(buttonClicked, clipboardText) {
          console.debug(`repliconTimesheet.showPopup() with clipboard text: ${clipboardText}`);
          let popupDiv = document.createElement("div");
          popupDiv.className = "cttPopup";
          let buttonRect = buttonClicked.getBoundingClientRect();
          popupDiv.id = "cttPopup";
          popupDiv.style.position = "fixed";
          popupDiv.style.left = `${buttonRect.x + 30}px`;
          popupDiv.style.top = `${buttonRect.y - 30}px`;

          let timesheetEntries = repliconTimesheet.parseClipboardText(clipboardText);

          if(timesheetEntries) {
              let rowToPasteTo = buttonClicked.parentNode.parentNode;
              let linksAddedCount = repliconTimesheet.addLinksIntoPopup(popupDiv, rowToPasteTo, timesheetEntries);
              if(linksAddedCount==0) {
                  popupDiv.innerText = "No calendar bookings for these dates";
              }
          } else {
              popupDiv.innerText = "Missing/invalid calendar data";
          }
          buttonClicked.parentNode.appendChild(popupDiv);

          console.debug(`repliconTimesheet.showPopup() listening for scroll events, to trigger closePopupIfOpen`);
          document.addEventListener("scroll", repliconTimesheet.closePopupIfOpen);
      },

      addLinksIntoPopup: function(popupDiv, rowToPasteTo, timesheetEntries) {
          console.debug(`repliconTimesheet.addLinksIntoPopup()`);
          const textInputsByDay = repliconTimesheet.findTextInputsByDay(rowToPasteTo);
          const includedKeys = Object.keys(timesheetEntries).filter((key)=>{
              if(repliconTimesheet.isApplicableToRow(timesheetEntries[key], Object.keys(textInputsByDay))) {
                  let div = document.createElement("div");
                  div.innerText = key;
                  div.className = "cttPopupLink";
                  div.addEventListener("click", ()=>{
                      console.debug(`Pasting in data for "${key}"`);
                      repliconTimesheet.clearTextInputsInRow(rowToPasteTo);
                      repliconTimesheet.pasteIntoRow(textInputsByDay, timesheetEntries[key]);
                  });
                  console.debug(`Adding link for "${key}"`);
                  popupDiv.appendChild(div);
                  return true;
              } else {
                console.debug(`Entry "${key}" not applicable for selected week`);
                return false;
              }
          });
          return includedKeys.length;
      },

      findTextInputsByDay: function(rowToSearchIn) {
          console.debug(`repliconTimesheet.findTextInputsByDay()`);
          let textInputs = rowToSearchIn.querySelectorAll(repliconTimesheet.selector.TextInputBoxes);
          let textInputsByDay = {};
          for(let i=0; i<textInputs.length; i++) {
              let day = textInputs[i].getAttribute("aria-label").trim().match(/.* (.+)/)[1]
              textInputsByDay[day] = textInputs[i];
          }
          return textInputsByDay;
      },

      isApplicableToRow: function(daysWithHoursBooked, daysInRow) {
          let daysBooked = daysWithHoursBooked.map((obj)=>String(obj.day));
          console.debug(`repliconTimesheet.isApplicableToRow(booked:${daysBooked}, week:${daysInRow})`);
          let value = daysBooked.map((dayBooked)=>daysInRow.includes(dayBooked)).includes(true);
          console.debug(`repliconTimesheet.isApplicableToRow(booked:${daysBooked}, week:${daysInRow}):${value}`);
          return value;
      },

      clearTextInputsInRow: function(rowToSearchIn) {
          let textInputsInRow = repliconTimesheet.findTextInputsByDay(rowToSearchIn);
          Object.keys(textInputsInRow).forEach((key)=>{
              textInputsInRow[key].value = "";
          });
      },

     pasteIntoRow: function(textInputsByDay, daysWithHoursBooked) {
          daysWithHoursBooked.forEach((dayWithHours)=>{
              let day = String(dayWithHours.day);
              if(textInputsByDay.hasOwnProperty(day)) {
                  textInputsByDay[day].focus();
                  textInputsByDay[day].value = dayWithHours.hours;
                  //textInputsByDay[day].dispatchEvent(new Event('input', { bubbles: true }));
                  const changeEvent = new Event('change', {
                      bubbles: true,
                      cancelable: true,
                  });
                  textInputsByDay[day].dispatchEvent(changeEvent);
                  textInputsByDay[day].blur();
              }
          });
          repliconTimesheet.closePopupIfOpen();

      },

      parseClipboardText: function(clipboardText) {
          console.debug(`repliconTimesheet.parseClipboardText()`);
          try {
              const clipboardTextMinusLineBreaks = clipboardText.replaceAll("\n","");
              const json = JSON.parse(clipboardTextMinusLineBreaks);
              const newJson = {};
              if(json.label!=timesheetJsonLabel) throw "label not found";
              for(let prop in json) {
                if(Object.hasOwn(json, prop) && prop!="label") {
                  if(json[prop] instanceof Array) {
                      newJson[prop] = json[prop].map((entry)=>{
                          if(Object.hasOwn(entry, "date") ) {
                              return {
                                  day : Number(entry.date.substring(0,2).trim()),
                                  hours : entry.hours || 0
                              }
                          } else {
                              throw `"${prop}" value is not an array`;
                          }
                      });
                  } else {
                    throw `"${prop}" has no date property`;
                  }
                }
              }
              return newJson;
          }
          catch(e){
            console.error(`Invalid clipboard text. ${e.message}`);
            alert(`Invalid clipboard text. ${e.message}`);
            return null;
          }
      }

    }



    function isGoogleCalendarWeekView() {
        const isGoogleCalendar = window.location.href.indexOf("calendar.google.com/calendar/u/0/r/week")>-1 || window.location.href == "https://calendar.google.com/calendar/u/0/r";
        console.debug(`isGoogleCalendarWeekView: ${isGoogleCalendar}`);
        return isGoogleCalendar;
    }

    function isRepliconTimesheetView() {
        const isReplicon = window.location.href.indexOf("eu3.replicon.com/Capgemini/my/timesheet/")>-1
        console.debug(`isRepliconTimesheetView: ${isReplicon}`);
        return isReplicon;
    }

    function init() {
      if(isGoogleCalendarWeekView()) {
          googleCalendar.init();
      } else if(isRepliconTimesheetView()) {
          repliconTimesheet.init();
      }
    }

    init();

})();