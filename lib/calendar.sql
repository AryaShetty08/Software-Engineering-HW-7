-- This is the database for hw6, where all the events will be scheduled for the patient database 
drop database `hw6db`;

CREATE DATABASE IF NOT EXISTS `hw6db`;

drop user if EXISTS "hw6Scheduler"@"localhost";
CREATE user "hw6Scheduler"@"localhost" identified by "!Hi123Guy";
grant select, insert, update, delete on hw6db.* to "hw6Scheduler"@"localhost";
USE `hw6db`;

-- This is the table for the events, holds all the ical values 
CREATE TABLE ical_events (
  attendee VARCHAR(100) NOT NULL,
  dtstart CHAR(15) NOT NULL,
  method VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  dtstamp CHAR(15) NOT NULL,
  confirmation CHAR(10) NOT NULL PRIMARY KEY
);

-- HOMEWORK 7 Update
-- This is the table for the cancelled events, holds all the ical values 
CREATE TABLE cancel_events (
  attendee VARCHAR(100) NOT NULL,
  dtstart CHAR(15) NOT NULL,
  method VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  dtstamp CHAR(15) NOT NULL,
  confirmation CHAR(10) NOT NULL PRIMARY KEY
);

-- Test data to insert into table
insert into ical_events(attendee, dtstart, method, status, dtstamp, confirmation)
values
("hello@sup.com", "20240215T070440", "REQUEST", "CONFIRMED", "20240215T070451", "7U3L550LM3"),
("hello@sup.com", "20240216T050000", "REQUEST", "CONFIRMED", "20240216T224604", "7Y2GKZVV8C"),
("hello@sup.com", "20240219T000000", "REQUEST", "CONFIRMED", "20240215T072305", "5F9M1HIW5V"),
("bye@sup.com", "20240220T050000", "REQUEST", "CONFIRMED", "20240216T225236", "O4FOQFUB8F");