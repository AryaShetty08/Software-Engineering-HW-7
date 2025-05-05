//Code for hw4
//Start of code get all modules in order
const http = require("http"); // web server module
const querystr = require('querystring'); // parse and format URL query strings
const url = require("url");
const { Publisher } = require('./Publisher.js');
const { TerminalBonder } = require('./hw7terminalBonder.js');
const { MailBonder } = require('./hw7mailBonder.js');

//import all needed methods from hw4.js
const { findNextDateHelper, reserveDateHelper, searchReservationsHelper, cancelReservationHelper, startProgram, startDatabase, closeDatabase } = require('./hw4');
const { parse, resolve } = require('path');

//Call startdatabase to make sure events are readable
startDatabase();
const port = 8080;
let status = "200";

//Create new publisher and subscribers here
//Change email to see response if you need
let pub1 = new Publisher();
let sub1 = new TerminalBonder();
let sub2 = new TerminalBonder();
let sub3 = new MailBonder("pewdiepie285@gmail.com"); //HERE can change email to receive resposne 
sub1.bind(pub1, x => x); // pub1 to sub1
sub2.bind(pub1, x => x); // pub1 to sub2
sub3.bind(pub1, x => x); // pub1 to sub3

//Function to start the server to accept client requests and send out server responses
function applicationServer(request, response) {
    let requestMethod = request.method;
    const entireUrl = url.parse(request.url, true);                                      //Get the path 
    let contentType = request.headers["content-type"];  
    if (!checkURLPath(entireUrl.pathname)) {                                             //Make sure the path is a valid request
        response.writeHead(400, { "Content-Type": "text/plain" } );
        response.end("Invalid Request, must use /findNext, /lookUp, /reserve, /cancel, /exit, /");
    }
    else {     
    let body = "";                                                                       //Parse the request 
    request.on("data", (chunk) => {
        body += chunk;
    });
    request.on("end", () => {                                                            //Attempt to parse the content types only accept url for possible front end development later
        if(contentType === "application/x-www-form-urlencoded") {
            let parsedMessage = (querystr.decode(body));
            let parsedArray = Object.entries(parsedMessage);
            runCommand(entireUrl.pathname, parsedArray, requestMethod)                   //Attempt to run requested command
        .then(output => {
            console.log(status);
            response.writeHead(status, { "Content-Type": "text/plain" });
            if(output == "Goodbye") {
                response.end(output);
                webServer.close((err) => {                                               //Close the server
                    if (err) {
                        console.error("Error while closing the server:", err);
                        response.writeHead(500, { "Content-Type": "text/plain" });
                        response.end("Internal Server Error");
                        process.exit(1);                                                 //Error
                    } else {
                        console.log("Server closed successfully");
                        process.exit(0);                                                 //Exit with success code
                    }
                });

            }
            else {
                response.end(output);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            response.writeHead(500, { "Content-Type": "text/plain" });
            //closeDatabase();
            response.end(error.message || "Internal Server Error");
        });
        
        }
        else {                                                                           //URL format for input arguments of the old commands of hw4
            response.writeHead(400,{ "Content-Type": "text/plain" });
            //closeDatabase();
            response.end('Must input arguments to commands in URL format');
        }
    });

    }
}

//Function to make sure the path has one of the available client requests
function checkURLPath(path) {
    let allowwedURL = ["/findNext","/reserve","/lookUp","/cancel","/exit","/"];
    if(allowwedURL.includes(path)) {
        return true;
    }
    return false;
}

//Function that takes in the arguments from the url, the path which specifies the command, and what kind of request it was
//It returns the homework 4 outputs of each function 
async function runCommand(userInput, userParameters, requestMethod) {
   if (userInput == "/findNext") {
    if (requestMethod === 'GET') {                                                       //Checks to make sure right request method
        if(!argumentCheckerFN(userParameters)) {                                         //Checks the arguments always 
            status = "406"; 
            return "Don't have required parameters to run findNext, which are (int) rangeFind and (int) numOfDays"
        }
        let rangeFind = userParameters.find(([key, value]) => key === "rangeFind")?.[1];
        let numOfDays = userParameters.find(([key, value]) => key === "numOfDays")?.[1];
        let datesFound = await findNextDateHelper(rangeFind, numOfDays);                       //Where it calls the homework 4 function
        if (datesFound == "Invalid number for number of dates (1-4), try again.\n" || datesFound == "Invalid number for range (1-100), try again.\n") {
            status = "406"; 
            return datesFound;
        }
        let resultOutput = "";
            for(let i = 0; i < datesFound.length; i++) {
                if(datesFound[i] != undefined) {
                    resultOutput = resultOutput + i + " Available Date: " + (datesFound[i]) + "\n";
                }
            }
            status = "200"; 
            return resultOutput;                                                         //Returns the result 
    }
    else {
        status = "405"; 
        return "Must use GET to run /findNext";
    }
   }
   else if (userInput == "/reserve") {
    if (requestMethod === 'POST') { 
        if(!argumentCheckerRD(userParameters)) {
            status = "406"; 
            return "Don't have required parameters to run reserveDate, which are dateToReserve (YYYYMMDDTHHMMSS) and attendeeToReserve (email/phone number)"
        }
        let dateToReserve = userParameters.find(([key, value]) => key === "dateToReserve")?.[1];
        let attendeeToReserve = userParameters.find(([key, value]) => key === "attendeeToReserve")?.[1];
    
        try {
            const reservationResult = await reserveDateHelper(dateToReserve, attendeeToReserve);
            if(reservationResult == "Invalid date (YYYYMMDDTTHHMMSS), date was already a scheduled event, or date was a not a future date." || reservationResult == "Date can not be a holiday or weekend." || reservationResult == "Patient must be a valid email or phone number.") {
                status = "406"; 
                return reservationResult;
            }
            if(reservationResult === true) {
                status = "200"; 
                return "Successfully added reservation";
            }
                status = "200"; 
                return "Already added reservation";
        } catch (error) {
            console.error("Error:", error);
            status = "406"; 
            return "Error during reservation";
        }
    }
    else {
        status = "405"; 
        return "Must use POST to run /reserve";
    }
   }
   else if (userInput == "/lookUp") {
    if (requestMethod === 'GET') { 
        if(!argumentCheckerSR(userParameters)) {
            status = "406"; 
            return "Don't have required parameters to run lookUp, which is patient (email/phone number)"
        }
        let patient = userParameters.find(([key, value]) => key === "patient")?.[1];
        let result = await searchReservationsHelper(patient);
        if(result == "Patient must be a valid email or phone number.") {
            status = "406"; 
            return result;
        }
        else if(result.length < 1) {
            status = "200"; 
            return "No reservations found.";
        }
        let resultOutput = "";
        if(!(result === undefined || result.length == 0)) {
            for(let i = 0; i < result.length; i++) {
                if(result[i].start != undefined) {
                    resultOutput = resultOutput + i + " Date Start: " + (result[i].start) + "\n  Confirmation Code: " + (result[i].confirmation) + "\n";
                }
            }
        }
            status = "200"; 
            return resultOutput;
    }
    else {
       status = "405"; 
       return "Must use GET to run /lookUp";
    }
   }
   else if (userInput == "/cancel") {
    if (requestMethod === 'PUT') { 
        if(!argumentCheckerCR(userParameters)) {
            status = "406"; 
            return "Don't have required parameters to run cancel"
        }
            let cancelCode = userParameters.find(([key, value]) => key === "cancelCode")?.[1];
            try {
                const cancellationResult = await cancelReservationHelper(cancelCode);
                if(cancellationResult == "Invalid cancel code, must be a 10 digit alphanumeric code") {
                    status = "406"; 
                    return cancellationResult;
                }
                status = "200"; 
                //added publish code after cancel here 
                const tempOutput = `Attendee: ${cancellationResult.attendee}\nStart Date: ${cancellationResult.dtstart}\nMethod: ${cancellationResult.method}\nStatus: ${cancellationResult.status}\nDate Stamp: ${cancellationResult.dtstamp}\nConfirmation: ${cancellationResult.confirmation}`;
                pub1.publish("Just canceled \n" + tempOutput + "\n");
                return "Successful Cancellation";
            } catch (error) {
                console.error("Error:", error);
                status = "406"; 
                return "Error during cancellation";
            }
    }
    else {
        status = "405"; 
        return "Must use PUT to run /cancel";
    }
   }
   else if (userInput == "/exit") {
    if (requestMethod === 'POST') { 
        closeDatabase();
        status = "200"; 
        return "Goodbye";
    }
    else {
        status = "405"; 
        return "Must use POST to run /exit";
    }
   }
   else if (userInput == "/") {
    if (requestMethod === 'GET') { 
        status = "200";
        return "Welcome to Patient Schedule Planner!";
    }
    else {
        status = "405"; 
        return "Must use GET to run /";
    }
   }  
}

//Function to check the arguments of /findNext
function argumentCheckerFN(userParameters) {
    if (userParameters.some(([key, value]) => key === "rangeFind") && userParameters.some(([key, value]) => key === "numOfDays")) {
        return true;
    }
    return false;
}

//Function to check the arguments of /reserve
function argumentCheckerRD(userParameters) {
    if (userParameters.some(([key, value]) => key === "dateToReserve") && userParameters.some(([key, value]) => key === "attendeeToReserve")) {
        return true;
    }
    return false;
}

//Function to check the arguments of /lookUp
function argumentCheckerSR(userParameters) {
    if (userParameters.some(([key, value]) => key === "patient")) {
        return true;
    }
    return false;
}

//Function to check the arguments of /cancel
function argumentCheckerCR(userParameters) {
    if (userParameters.some(([key, value]) => key === "cancelCode")) {
        return true;
    }
    return false;
}

//Create and listen to server
const webServer = http.createServer(applicationServer);
console.debug("Started Server on " + port);
webServer.listen(port);

//Export for testing 
module.exports = webServer;