# Software Engineering Homework 7

## Context
- I ran both the code and the jasmine tests through the VScode terminal
- I also made sure node.js, jasmine, supertest, http, ical, mysql, nodemailer, and other packages were in order before running

# Important changes from homework 6 to homework 7
- I added three new js files for the publisher and suscirber models
- There is a terminal bonder to print into the terminal and an email bonder to send the resposnes to a desired email from the publisher
- This is tied to the cancel method, and whenever it runs succesfully something is published 
- If you want to change the email go to hw6.js and line 24 "let sub3 = new MailBonder("pewdiepie285@gmail.com");" and change the email in quotes
- You will see the subscriber receiving in terminal and email 
- To test check the schema for pre inserted events in the table and use one of the confirmation codes to cancel, you will then see the subscribers output
- Example use this as "cancelCode" : "7U3L550LM3"
    - Should get this output:
        Just canceled
        Attendee: hello@sup.com
        Start Date: 20240215T070440
        Method: REQUEST
        Status: CONFIRMED
        Date Stamp: 20240215T070451
        Confirmation: 7U3L550LM3
- Also the cancel event gets stored in a another cancel table in the database which you can check by running "SELECT * FROM cancel_events" after successfully cancelling

## Setup for hw7.js code 
- To run the actual hw6.js code make sure you are in the lib folder (example:
     " C:\Users\aryas\Desktop\Rutgers 2021-2025\Spring 2024\Software Engineering\Homeworks\Homework 7\lib ")
IMPORTANT SETUP
- You can either run the calendar.sql file in the mysql workbench extension of VScode
    - My connection is specifically running in the MySQL shell VSCode extension on port 3306 on localhost, I just copied and pasted the calendar.sql code there and executed 
    - If you don't have this then you can run the code in actual mysql workbench
    - The code sets up the events table with some data, and the ability to update it
    - It creates a user with such permission to add, delete, and view so that you don't have to run with an admin access
- In the VScode terminal run "node hw6.js"
- Then to test just the code you can open up your postman app
- Start a new request 
    - From here you can test all four commands
    - Use GET for "/lookUp" and "/findNext"
    - Use POST for "/reserve" and "/exit"
    - Use PUT for "/cancel"

- Type in "localhost:8080" where your server is running
- Then to run the certain commands they depend on the arguments and such

- For "/"
    - Use GET
    - Type in "localhost:8080/"
    - It returns "Welcome to Patient Schedule Planner!" if it is properly sent

- For "/lookUp"
    - Use GET
    - Type in "localhost:8080/lookUp"
    - In the body select "x-www-form-urlencoded"
    - Here you will have one key, value pair
    - The parameter is, "patient", the value should be an email/phone number, and example is "hello@sup.com"
    - Finally send in the request
    - You will be prompted with either "Must use GET to run /lookUp", "Don't have required parameters to run lookUp", or a successful parse request looking something like this
        - "0 Date Start: Mon Feb 24 2025 00:00:00 GMT-0500 (Eastern Standard Time)
            Confirmation Code: JX0XKBMKAU"

- For "/findNext"
    - Use GET
    - Type in "localhost:8080/findNext"
    - In the body select "x-www-form-urlencoded"
    - Here you will have twp key, value pairs
    - The parameter is, "rangeFind", the value should be the number of wanted dates, and "numOfDays" should be a number of amount of days to search
    - Finally send in the request
    - You will be prompted with either "Must use GET to run /findNext", "Don't have required parameters to run findNext", or a successful parse request looking something like this
        - "0 Available Date: Wed Feb 21 2024 00:00:00 GMT-0500 (Eastern Standard Time)"

- For "/reserve"
    - Use POST
    - Type in "localhost:8080/reserve"
    - In the body select "x-www-form-urlencoded"
    - Here you will have two key, value pairs
    - The parameter is, "dateToReserve", the value should of DateTime format YYYYMMDDTHHMMSS, example "20250224T000000", and "attendeeToReserve" should be email or phone number of
        paitent, example "bye@sup.com"
    - Finally send in the request
    - You will be prompted with either "Must use POST to run /reserve", "Don't have required parameters to run reserve", or a successful parse request looking something like this
        - "Successfully added" or "Already added reservation"

- For "/cancel"
    - Use PUT
    - Type in "localhost:8080/cancel"
    - In the body select "x-www-form-urlencoded"
    - Here you will have one key, value pairs
    - The parameter is, "cancelCode", the value should be a 10 digit alpha-numeric code like this "ZBMQ8H66MQ"
    - Finally send in the request
    - You will be prompted with either "Must use PUT to run /cancel", "Don't have required parameters to run cancel", or a successful parse request looking something like this
        - "Successful Cancellation" or "Error during cancellation"

- For "/exit"
    - Use POST
    - Type in "localhost:8080/exit"
    - Finally send in the request
    - You will be prompted with either "Goodbye"
        - This will stop the server and database

- You will get your response in Postman
    - It will either be an error due to unsupported content type, error due to wrong format for selected content type, or it will succesfully parse and return a message request from the client
    - If it totally doesn't run then the server was not started or database wasn't started

## Setup for jasmine test cases
- For the jasmine test cases make sure to go back one folder from lib into homework6 (using cd ..) 
- (example: " C:\Users\aryas\Desktop\Rutgers 2021-2025\Spring 2024\Software Engineering\Homeworks\Homework 7 ")
- Then to run the cases just type in the terminal "npx jasmine"
- ALSO VERY IMPORTANT, make sure to rerun the database before testing the jasmine cases, to reset the table
- It should run 60 specs or test cases and 0 failures

## IMPORTANT
- In this testing, the "hw6.js" acts as your server, and you can send client requests through Postman
- The jasmine tests do the same and show all the different scenarios
- Code meanings:
    - 200 - successful
    - 400 - client error invalid path
    - 405 - client used wrong method header
    - 406 - client error not right parameters
    - 500 - server error