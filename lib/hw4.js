//Code for hw4
//Start of code get all modules in order
//ical, mysql
const ical = require('node-ical');
const mysql = require("mysql2");

//Initalize all the needed connections, files, and variables for client-server 

let connection;
let connectionPool;

let events;
const confirmationCodesList = new Set();
const fixedHolidays = [
    new Date("2024-01-01"), //New Year's Day
    new Date("2024-07-04"), //Indpendence Day
    new Date("2024-12-25"), //Christmas Day
    new Date("2024-11-11"), //Veterans Day
    new Date("2024-06-19") //Juneteenth
  ];

//This function starts the database connection, and retrieves all the events before letting client requests occur
function startDatabase() {
    connection = mysql.createConnection({
        host: "localhost",
        user: "hw6Scheduler",
        password: "!Hi123Guy",
        database: "hw6db"
    });
    
    connectionPool = mysql.createPool({
        host: "localhost",
        user: "hw6Scheduler",
        password: "!Hi123Guy",
        database: "hw6db"
    });

    connection.connect(function(err) {
        if (err) throw err;
        connection.query("SELECT * FROM ical_events", function(err, rows, fields) {
            if (err) throw err;
            const eventsData = convertRowsToEventsData(rows);
            events = ical.parseICS(eventsData);

            for(const event of Object.values(events)) {                                    //Get the codes in the events right now
                confirmationCodesList.add(event.confirmation);
            }
        });
    });
}

//This function  closes the database when done
function closeDatabase() {
    connection.end(); 
}

//This function reparses events from the database for easier use when running functions like cancel, lookup, reserved, and findNext
async function reparseEventsFromDatabase() {
    await new Promise(resolve => {
        connection.query("SELECT * FROM ical_events", function(err, rows, fields) {
            if (err) throw err;
            const eventsData = convertRowsToEventsData(rows);
            events = ical.parseICS(eventsData);
            resolve();
        });
    });
   
}

// Function to convert rows from the database to iCalendar format
function convertRowsToEventsData(rows) {
    let eventsData = '';
    for (const row of rows) {
        eventsData += `
BEGIN:VEVENT
ATTENDEE:${row.attendee}
DTSTART:${row.dtstart}
METHOD:${row.method}
STATUS:${row.status}
DTSTAMP:${row.dtstamp}
CONFIRMATION:${row.confirmation}
END:VEVENT`;
    }
    return eventsData;
}

//The helper function to find next available date
async function findNextDateHelper(rangeFind, numOfDays) {
    await reparseEventsFromDatabase();
    let datesFound = [];
    const currentDate = new Date("Thu Feb 15 2024 00:00:00 GMT-0500 (Eastern Standard Time)");     //Instead of using now, to set a perma date so doesn't mess up testing
    if(rangeFind < 1 || rangeFind > 4) {
        console.debug("Invalid number for number of dates, try again.\n");
        return "Invalid number for number of dates (1-4), try again.\n";
    }
    if(numOfDays < 1 || numOfDays > 100) {
        console.debug("Invalid number for range, try again.\n");
        return "Invalid number for range (1-100), try again.\n";
    }
    for(let i = 0; i < numOfDays; i++) {
        const dateToCheck = new Date(currentDate);
        dateToCheck.setDate(currentDate.getDate() + i);
        if(!isEventOnDay(dateToCheck) && isHolidayWeekend(dateToCheck)) {
            datesFound.push(dateToCheck);
        }
        if(datesFound.length == rangeFind) {
            return datesFound;
        }
    }
    return datesFound;
}

//Function to check if a date is booked in the events already
function isEventOnDay(dateToCheck) {
    for (const event of Object.values(events)) {
        if (!(event.start === undefined)) {;
            if (event.start.getFullYear() === dateToCheck.getFullYear() && event.start.getMonth() === dateToCheck.getMonth() && event.start.getDate() === dateToCheck.getDate()) {
                return true;
            }
        }
    }
    return false;
}

//Function to check if attendee entered is valid for ical
function attendeeChecker(attendeeToReserve) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    if (!(emailRegex.test(attendeeToReserve))) {
        if(!(phoneRegex.test(attendeeToReserve))) {
            return false;
        }
    }
    return true;
}

//Function to check if date is valid in ical
function dateChecker(dateToReserve) {
    let newInputArg = dateToReserve.slice(0,4) + '-' + dateToReserve.slice(4,6) + "-" + dateToReserve.slice(6,11) + ":" + dateToReserve.slice(11,13) + ":" +  dateToReserve.slice(13,15);
    let outputDate = new Date(newInputArg);
    let today = new Date("Thu Feb 15 2024 00:00:00 GMT-0500 (Eastern Standard Time)");
    today.setHours(0, 0, 0, 0);
    if(outputDate.toString() === "Invalid Date") {
        return false;
    }
    if (outputDate < today) {
        console.debug("Selected date must be today or a future date.");
        return false;
    }
    for(const event of Object.values(events)) {
        if(!(event.start === undefined) && event.start.getDate() == outputDate.getDate() && event.start.getMonth() == outputDate.getMonth() && event.start.getFullYear() == outputDate.getFullYear()) {
            return false;
        }
    }
    return true;
}

//Function to check if date is a weekend or holiday
function isHolidayWeekend(dateToCheck) {
    if(!(dateToCheck instanceof Date)) {
        let newInputArg = dateToCheck.slice(0,4) + '-' + dateToCheck.slice(4,6) + "-" + dateToCheck.slice(6,11) + ":" + dateToCheck.slice(11,13) + ":" +  dateToCheck.slice(13,15);
        let outputDate = new Date(newInputArg);
        var dayOfTheWeek = outputDate.getDay();
        if(isDateInFixedHolidays(outputDate)) {
            console.debug("Date to reserve is a US holiday.");
            return false;
        }
    }
    else {
        dateToCheck.setHours(0, 0, 0, 0); // Set time to midnight
        if(isDateInFixedHolidays(dateToCheck)) {
            console.debug("Date to reserve is a US holiday.");
            return false;
        }
        var dayOfTheWeek = dateToCheck.getDay();
    }
    if(dayOfTheWeek == 6 || dayOfTheWeek == 0) {
        console.debug("Date to reserve is a weekend.");
        return false;
    } 
    return true;
}

//Helper function to check holiday in fixed array
function isDateInFixedHolidays(dateToCheck) {
    for(const holidays of fixedHolidays) {
        holidayDay = holidays.getDate() + 1;
        holidayMonth = holidays.getMonth();
        if(holidayDay == 32) {
            holidayDay = 1;
            holidayMonth = 0;
        }
        if(dateToCheck.getDate() == holidayDay && dateToCheck.getMonth() == holidayMonth) {
            return true;
        }
    }
    return false;
}

//Function to actually reserve the date into the file 
async function reserveDateHelper(dateToReserve, attendeeToReserve) {
    await reparseEventsFromDatabase();
    if(!dateChecker(dateToReserve)) {
        return "Invalid date (YYYYMMDDTTHHMMSS), date was already a scheduled event, or date was a not a future date.";
    }
    if(!isHolidayWeekend(dateToReserve)) {
        return "Date can not be a holiday or weekend.";
    }
    if(!attendeeChecker(attendeeToReserve)) {
        return "Patient must be a valid email or phone number.";
    }
    let generatedCode = generateConfirmationCode();
const newEventString = `
BEGIN:VEVENT
ATTENDEE:${attendeeToReserve}
DTSTART:${dateToReserve}
METHOD:REQUEST
STATUS:CONFIRMED
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, '')}
CONFIRMATION:${generatedCode}
END:VEVENT`;
    // Insert the new event into the database
    const success = await insertEventIntoDatabase(newEventString);
    if (success) {
        await reparseEventsFromDatabase();
        console.debug(generatedCode);
        return true;
    }
    return false;    
}

//Function to insert events into database
async function insertEventIntoDatabase(newEventString) {
    let connection;
    try {
        connection = await connectionPool.promise().getConnection(); 

        const insertQuery = "INSERT INTO ical_events (attendee, dtstart, method, status, dtstamp, confirmation) VALUES (?, ?, ?, ?, ?, ?)";
        const eventData = extractEventData(newEventString); 
        await connection.query(insertQuery, eventData);

        console.debug("Event inserted into the database");
        return true;
    } catch (error) {
        console.error("Error inserting event into the database:", error);
        return false;
    } finally {
        if (connection) {
            connection.release(); 
        }
    }
}

//Function that uses regular expressions to extract values from the newEventString
function extractEventData(newEventString) {
    const attendee = getValue(newEventString, 'ATTENDEE');
    const dtstart = getValue(newEventString, 'DTSTART');
    const method = getValue(newEventString, 'METHOD');
    const status = getValue(newEventString, 'STATUS');
    const dtstamp = getValue(newEventString, 'DTSTAMP');
    const confirmation = getValue(newEventString, 'CONFIRMATION');
    return [attendee, dtstart, method, status, dtstamp, confirmation];
}

// Helper function to extract a specific value from the newEventString
function getValue(newEventString, key) {
    const regex = new RegExp(`${key}:(.*?)\\n`);
    const match = newEventString.match(regex);
    return match ? match[1] : null;
}

//Function to help search for reservations, by checking attendee and events 
async function searchReservationsHelper(patient) {
    await reparseEventsFromDatabase();
    if(!attendeeChecker(patient)) {
        return "Patient must be a valid email or phone number.";
    }
    let reservationsFound = [];
    for(const event of Object.values(events)) {
        if(patient == event.attendee) {
            reservationsFound.push(event);
        }
    }
    return reservationsFound;
}

//Function to help cancel and delete event from ical database
//Now the function supports pub-sub architecture 
//It updates separate table of cancel events, and it pubishes to subscribers in terminal and email of cancelled events
async function cancelReservationHelper(cancelCode) {
    const cancelCodeRegex = /^[a-zA-Z0-9]{10}$/;
    if(!cancelCodeRegex.test(cancelCode)) {
       return "Invalid cancel code, must be a 10 digit alphanumeric code" 
    }
    return new Promise((resolve, reject) => {
        reparseEventsFromDatabase();

        connection.query("SELECT * FROM ical_events WHERE confirmation = ?", [cancelCode], function (selectErr, selectResult) {
            if (selectErr) {
              console.error("Error fetching event details:", selectErr);
            }        
            else if (selectResult.length === 0) {
              console.error("No event found with the given confirmation code:", cancelCode);
            }
            const eventDetails = selectResult[0];
            console.log(eventDetails);

            connection.query("DELETE FROM ical_events WHERE confirmation = ?", [cancelCode], function (deleteErr, deleteResult) {
                if (deleteErr) {
                    console.error(deleteErr);
                    console.debug("Unsuccessful Cancellation.");
                    reject("Unsuccessful Cancellation");
                } else if (deleteResult.affectedRows === 0) {
                    console.debug("Confirmation code not found. Unsuccessful Cancellation.");
                    reject("Confirmation code not found. Unsuccessful Cancellation.");
                } else {
                    console.debug("Successful Cancellation.");
    
                    connection.query("INSERT INTO cancel_events (attendee, dtstart, method, status, dtstamp, confirmation) VALUES (?, ?, ?, ?, ?, ?)",
                    [eventDetails.attendee, eventDetails.dtstart, eventDetails.method, 'CANCELED', eventDetails.dtstamp, eventDetails.confirmation],
                    function (insertErr, insertResult) {
                    if (insertErr) {
                        console.error("Error inserting cancelled event:", insertErr);
                    }
                    });
    
                    resolve(eventDetails);
                }
            });

        });

        

    });
}

//Function to generate unique confirmation code 
function generateConfirmationCode() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    do {
        code = '';
        for(let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            code += charset[randomIndex];
        }
    } while (confirmationCodesList.has(code));
    confirmationCodesList.add(code);
    return code;
}

// //Main start only for this file not jasmine from old hw4 code
// if (require.main === module) {
//     // If the script is run directly, execute startProgram
//     startProgram();
// }
module.exports = { findNextDateHelper, isEventOnDay, attendeeChecker, dateChecker, isHolidayWeekend, reserveDateHelper, searchReservationsHelper, cancelReservationHelper, generateConfirmationCode, startDatabase, closeDatabase};