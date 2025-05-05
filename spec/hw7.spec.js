//Test cases for hw6 functions here using supertest for client-server
const { Publisher } = require('../lib/Publisher.js');
const { TerminalBonder } = require('../lib/hw7terminalBonder.js');
const { MailBonder } = require('../lib/hw7mailBonder.js');

const request = require('supertest');
const app = require('../lib/hw6');
const Mail = require('nodemailer/lib/mailer/index.js');


describe('test /findNext of the runCommand function ', () => {

    it('should return a fail, not required parameters (1)', (done) => {
   
        const formData = { username: "john_doe", password: "secretpassword" };
        const expectedResponse = "Don't have required parameters to run findNext, which are (int) rangeFind and (int) numOfDays";
        
        request(app)
           .get("/findNext")
           .send(formData)
           .set("Content-Type", "application/x-www-form-urlencoded")
           .expect("Content-Type", "text/plain")
           .expect(406)
           .end((err, res) => {
             if(err) return done.fail(err);
             expect(res.text).toBeDefined();
             expect(res.text).toBe(expectedResponse);
             done();
           });
    });

it('should return a fail, not required parameters (2)', (done) => {
   
  const formData = { rangeFind: "2", password: "secretpassword" };
  const expectedResponse = "Don't have required parameters to run findNext, which are (int) rangeFind and (int) numOfDays";
  
  request(app)
     .get("/findNext")
     .send(formData)
     .set("Content-Type", "application/x-www-form-urlencoded")
     .expect("Content-Type", "text/plain")
     .expect(406)
     .end((err, res) => {
       if(err) return done.fail(err);
       expect(res.text).toBeDefined();
       expect(res.text).toBe(expectedResponse);
       done();
     });
});

it('should return a fail, not required parameters (3)', (done) => {
   
  const formData = { hello: "2", numOfDays: "10" };
  const expectedResponse = "Don't have required parameters to run findNext, which are (int) rangeFind and (int) numOfDays";
  
  request(app)
     .get("/findNext")
     .send(formData)
     .set("Content-Type", "application/x-www-form-urlencoded")
     .expect("Content-Type", "text/plain")
     .expect(406)
     .end((err, res) => {
       if(err) return done.fail(err);
       expect(res.text).toBeDefined();
       expect(res.text).toBe(expectedResponse);
       done();
     });
});

it('should return a fail, not required rangeFind range (4)', (done) => {
   
  const formData = { rangeFind: "5", numOfDays: "10" };
  const expectedResponse = "Invalid number for number of dates (1-4), try again.\n";
  
  request(app)
     .get("/findNext")
     .send(formData)
     .set("Content-Type", "application/x-www-form-urlencoded")
     .expect("Content-Type", "text/plain")
     .expect(406)
     .end((err, res) => {
       if(err) return done.fail(err);
       expect(res.text).toBeDefined();
       expect(res.text).toBe(expectedResponse);
       done();
     });
});

it('should return a fail, not required rangeFind range (5)', (done) => {
   
  const formData = { rangeFind: "0", numOfDays: "10" };
  const expectedResponse = "Invalid number for number of dates (1-4), try again.\n";
  
  request(app)
     .get("/findNext")
     .send(formData)
     .set("Content-Type", "application/x-www-form-urlencoded")
     .expect("Content-Type", "text/plain")
     .expect(406)
     .end((err, res) => {
       if(err) return done.fail(err);
       expect(res.text).toBeDefined();
       expect(res.text).toBe(expectedResponse);
       done();
     });
});

it('should return a fail, not required numOfDays range (6)', (done) => {
   
  const formData = { rangeFind: "2", numOfDays: "1000" };
  const expectedResponse = "Invalid number for range (1-100), try again.\n";
  
  request(app)
     .get("/findNext")
     .send(formData)
     .set("Content-Type", "application/x-www-form-urlencoded")
     .expect("Content-Type", "text/plain")
     .expect(406)
     .end((err, res) => {
       if(err) return done.fail(err);
       expect(res.text).toBeDefined();
       expect(res.text).toBe(expectedResponse);
       done();
     });
});

it('should return a fail, not required numOfDays range (7)', (done) => {
   
  const formData = { rangeFind: "2", numOfDays: "0" };
  const expectedResponse = "Invalid number for range (1-100), try again.\n";
  
  request(app)
     .get("/findNext")
     .send(formData)
     .set("Content-Type", "application/x-www-form-urlencoded")
     .expect("Content-Type", "text/plain")
     .expect(406)
     .end((err, res) => {
       if(err) return done.fail(err);
       expect(res.text).toBeDefined();
       expect(res.text).toBe(expectedResponse);
       done();
     });
});


it('should return available dates (8)', (done) => {
   
  const formData = { rangeFind: "1", numOfDays: "10" };
  const expectedResponse = "Available Date:";
  
  request(app)
     .get("/findNext")
     .send(formData)
     .set("Content-Type", "application/x-www-form-urlencoded")
     .expect("Content-Type", "text/plain")
     .expect(200)
     .end((err, res) => {
       if(err) return done.fail(err);
       expect(res.text).toBeDefined();
       expect(res.text).toContain(expectedResponse);
       done();
     });
});

it('should return available dates (9)', async () => {
  const formData = { rangeFind: "2", numOfDays: "10" };
  const expectedResponse = "Available Date:";

  try {
      const response = await request(app)
          .get("/findNext")
          .send(formData)
          .set("Content-Type", "application/x-www-form-urlencoded");

      console.log('Response Status:', response.status);
      console.log('Response Body:', response.text);

      expect(response.status).toBe(200);
      expect(response.text).toContain(expectedResponse);
  } catch (error) {
      console.error('Test Error:', error);
      fail(error); 
  }
});

it('should return available dates (10)', async () => {
  const formData = { rangeFind: "3", numOfDays: "100" };
  const expectedResponse = "Available Date:";

  try {
      const response = await request(app)
          .get("/findNext")
          .send(formData)
          .set("Content-Type", "application/x-www-form-urlencoded");

      console.log('Response Status:', response.status);
      console.log('Response Body:', response.text);

      expect(response.status).toBe(200);
      expect(response.text).toContain(expectedResponse);
  } catch (error) {
      console.error('Test Error:', error);
      fail(error); 
  }
});

it('should return available dates (11)', async () => {
  const formData = { rangeFind: "4", numOfDays: "10" };
  const expectedResponse = "Available Date:";

  try {
      const response = await request(app)
          .get("/findNext")
          .send(formData)
          .set("Content-Type", "application/x-www-form-urlencoded");

      console.log('Response Status:', response.status);
      console.log('Response Body:', response.text);

      expect(response.status).toBe(200);
      expect(response.text).toContain(expectedResponse);
  } catch (error) {
      console.error('Test Error:', error);
      fail(error); 
  }
});

it('should return a fail, not using GET (12)', (done) => {
   
  const formData = { username: "john_doe", password: "secretpassword" };
  const expectedResponse = "Must use GET to run /findNext";
  
  request(app)
     .post("/findNext")
     .send(formData)
     .set("Content-Type", "application/x-www-form-urlencoded")
     .expect("Content-Type", "text/plain")
     .expect(405)
     .end((err, res) => {
       if(err) return done.fail(err);
       expect(res.text).toBeDefined();
       expect(res.text).toBe(expectedResponse);
       done();
     });
});

});

describe('test /lookUp of the runCommand function ', () => {

  it('should return a fail, not using GET (13)', (done) => {
   
    const formData = { username: "hello" };
    const expectedResponse = "Must use GET to run /lookUp";
    
    request(app)
       .post("/lookUp")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(405)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toBe(expectedResponse);
         done();
       });
  });

  it('should return a fail, not using correct parameter (14)', (done) => {
   
    const formData = { username: "hello" };
    const expectedResponse = "Don't have required parameters to run lookUp, which is patient (email/phone number)";
    
    request(app)
       .get("/lookUp")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toBe(expectedResponse);
         done();
       });
  });

  it('should return a fail, not using correct parameter (15)', (done) => {
   
    const formData = { patient: "hello" };
    const expectedResponse = "Patient must be a valid email or phone number.";
    
    request(app)
       .get("/lookUp")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toBe(expectedResponse);
         done();
       });
  });

  
  it('should return accept, use good email (16)', (done) => {
   
    const formData = { patient: "bye@sup.com" };
    const expectedResponse = "Date Start:";
    
    request(app)
       .get("/lookUp")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(200)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return accept, use good email (17)', (done) => {
   
    const formData = { patient: "hello@sup.com" };
    const expectedResponse = "Date Start:";
    
    request(app)
       .get("/lookUp")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(200)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, unknown email (18)', (done) => {
   
    const formData = { patient: "ghello@sup.com" };
    const expectedResponse = "No reservations found.";
    
    request(app)
       .get("/lookUp")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(200)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, unknown email (19)', (done) => {
   
    const formData = { patient: "huoehoedq@sup.com" };
    const expectedResponse = "No reservations found.";
    
    request(app)
       .get("/lookUp")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(200)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, unknown email (20)', (done) => {
   
    const formData = { patient: "feq@sup.com" };
    const expectedResponse = "No reservations found.";
    
    request(app)
       .get("/lookUp")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(200)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

});

describe('test /reserve of the runCommand function ', () => {

  it('should return fail, did not use POST (21)', (done) => {
   
    const formData = { dateToReserve: "feq@sup.com", attendeeToReserve: "uhief" };
    const expectedResponse = "Must use POST to run /reserve";
    
    request(app)
       .get("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(405)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, did not have correct parameters (22)', (done) => {
   
    const formData = { test: "feq@sup.com", test2: "uhief" };
    const expectedResponse = "Don't have required parameters to run reserveDate, which are dateToReserve (YYYYMMDDTHHMMSS) and attendeeToReserve (email/phone number)";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, did not have correct parameters (23)', (done) => {
   
    const formData = { dateToReserve: "feq@sup.com", test: "uhief" };
    const expectedResponse = "Don't have required parameters to run reserveDate, which are dateToReserve (YYYYMMDDTHHMMSS) and attendeeToReserve (email/phone number)";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, did not have correct parameters (24)', (done) => {
   
    const formData = { test2: "feq@sup.com", attendeeToReserve: "uhief" };
    const expectedResponse = "Don't have required parameters to run reserveDate, which are dateToReserve (YYYYMMDDTHHMMSS) and attendeeToReserve (email/phone number)";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, did not have correct parameters assignments (25)', (done) => {
   
    const formData = { dateToReserve: "20250208T000000", attendeeToReserve: "bye" };
    const expectedResponse = "Date can not be a holiday or weekend.";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, did not have correct parameters assignments (26)', (done) => {
   
    const formData = { dateToReserve: "feq@sup.com", attendeeToReserve: "hello@sup.com" };
    const expectedResponse = "Invalid date (YYYYMMDDTTHHMMSS), date was already a scheduled event, or date was a not a future date.";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, did not have future date (27)', (done) => {
   
    const formData = { dateToReserve: "20220501T000000", attendeeToReserve: "hello@sup.com" };
    const expectedResponse = "Invalid date (YYYYMMDDTTHHMMSS), date was already a scheduled event, or date was a not a future date.";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, did not available date (28)', (done) => {
   
    const formData = { dateToReserve: "20240215T000000", attendeeToReserve: "hello@sup.com" };
    const expectedResponse = "Invalid date (YYYYMMDDTTHHMMSS), date was already a scheduled event, or date was a not a future date.";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, did not have weekday (29)', (done) => {
   
    const formData = { dateToReserve: "20240218T000000", attendeeToReserve: "hello@sup.com" };
    const expectedResponse = "Date can not be a holiday or weekend.";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, did not have good patient (30)', (done) => {
   
    const formData = { dateToReserve: "20250226T000000", attendeeToReserve: "help.com" };
    const expectedResponse = "Patient must be a valid email or phone number.";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return accept, good reservation (31)', (done) => {
   
    const formData = { dateToReserve: "20250217T000000", attendeeToReserve: "test@gmail.com" };
    const expectedResponse = "Successfully added reservation";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(200)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });
  
  it('should return accept, good reservation (32)', (done) => {
   
    const formData = { dateToReserve: "20250218T000000", attendeeToReserve: "bye@gmail.com" };
    const expectedResponse = "Successfully added reservation";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(200)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return accept, good reservation (33)', (done) => {
   
    const formData = { dateToReserve: "20250219T000000", attendeeToReserve: "test@gmail.com" };
    const expectedResponse = "Successfully added reservation";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(200)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return accept, already added reservation (34)', (done) => {
   
    const formData = { dateToReserve: "20240215T000000", attendeeToReserve: "test@gmail.com" };
    const expectedResponse = "Invalid date (YYYYMMDDTTHHMMSS), date was already a scheduled event, or date was a not a future date.";
    
    request(app)
       .post("/reserve")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

});

describe('test /cancel of the runCommand function ', () => {

  it('should return fail, did not use PUT (35)', (done) => {
   
    const formData = { date: "ede" };
    const expectedResponse = "Must use PUT to run /cancel";
    
    request(app)
       .get("/cancel")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(405)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, not correct parameter (36)', (done) => {
   
    const formData = { date: "ede" };
    const expectedResponse = "Don't have required parameters to run cancel";
    
    request(app)
       .put("/cancel")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, not correct parameter assignment (37)', (done) => {
   
    const formData = { cancelCode: "enhfewf311o3hi" };
    const expectedResponse = "Invalid cancel code, must be a 10 digit alphanumeric code";
    
    request(app)
       .put("/cancel")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, not cancelCode in database (38)', (done) => {
   
    const formData = { cancelCode: "YEWING89WH" };
    const expectedResponse = "Error during cancellation";
    
    request(app)
       .put("/cancel")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(406)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  
  it('should return accept, cancelCode in database (39)', (done) => {
   
    const formData = { cancelCode: "7Y2GKZVV8C" };
    const expectedResponse = "Successful Cancellation";
    
    request(app)
       .put("/cancel")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(200)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return accept, cancelCode in database (40)', (done) => {
   
    const formData = { cancelCode: "5F9M1HIW5V" };
    const expectedResponse = "Successful Cancellation";
    
    request(app)
       .put("/cancel")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(200)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

});

describe('test /exit and / of the runCommand function ', () => {

  it('should return fail, did not use POST (41)', (done) => {
   
    const formData = { date: "ede" };
    const expectedResponse = "Must use POST to run /exit";
    
    request(app)
       .get("/exit")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(405)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, did not use GET (42)', (done) => {
   
    const formData = { date: "ede" };
    const expectedResponse = "Must use GET to run /";
    
    request(app)
       .post("/")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(405)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  // it('should return accept, for exit (43)', (done) => {
   
  //   const formData = { date: "ede" };
  //   const expectedResponse = "Goodbye";
    
  //   request(app)
  //      .post("/exit")
  //      .send(formData)
  //      .set("Content-Type", "application/x-www-form-urlencoded")
  //      .expect("Content-Type", "text/plain")
  //      .expect(200)
  //      .end((err, res) => {
  //        if(err) return done.fail(err);
  //        expect(res.text).toBeDefined();
  //        expect(res.text).toContain(expectedResponse);
  //        done();
  //      });
  // });

  it('should return accept, for / (43)', (done) => {
   
    const formData = { date: "ede" };
    const expectedResponse = "Welcome to Patient Schedule Planner!";
    
    request(app)
       .get("/")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(200)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

});

describe('test for misc and extras ', () => {

  it('should return fail, not acceptable request (44)', (done) => {
   
    const formData = { date: "ede" };
    const expectedResponse = "Invalid Request, must use /findNext, /lookUp, /reserve, /cancel, /exit, /";
    
    request(app)
       .get("/hello")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(400)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, not acceptable request (45)', (done) => {
   
    const formData = { date: "ede" };
    const expectedResponse = "Invalid Request, must use /findNext, /lookUp, /reserve, /cancel, /exit, /";
    
    request(app)
       .get("/test")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(400)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, not acceptable request (46)', (done) => {
   
    const formData = { date: "ede" };
    const expectedResponse = "Invalid Request, must use /findNext, /lookUp, /reserve, /cancel, /exit, /";
    
    request(app)
       .get("/bello")
       .send(formData)
       .set("Content-Type", "application/x-www-form-urlencoded")
       .expect("Content-Type", "text/plain")
       .expect(400)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, not acceptable request (47)', (done) => {
   
    const formData = { date: "ede" };
    const expectedResponse = "Must input arguments to commands in URL format";
    
    request(app)
       .get("/findNext")
       .send(formData)
       .set("Content-Type", "application/JSON")
       .expect("Content-Type", "text/plain")
       .expect(400)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, not acceptable request (48)', (done) => {
   
    const formData = { date: "ede" };
    const expectedResponse = "Must input arguments to commands in URL format";
    
    request(app)
       .get("/findNext")
       .send(formData)
       .set("Content-Type", "application/JSON")
       .expect("Content-Type", "text/plain")
       .expect(400)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, not acceptable request (49)', (done) => {
   
    const formData = "ede";
    const expectedResponse = "Must input arguments to commands in URL format";
    
    request(app)
       .get("/findNext")
       .send(formData)
       .set("Content-Type", "text/plain")
       .expect("Content-Type", "text/plain")
       .expect(400)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

  it('should return fail, not acceptable request (50)', (done) => {
   
    const formData = "he"
    const expectedResponse = "Must input arguments to commands in URL format";
    
    request(app)
       .get("/findNext")
       .send(formData)
       .set("Content-Type", "application/xml")
       .expect("Content-Type", "text/plain")
       .expect(400)
       .end((err, res) => {
         if(err) return done.fail(err);
         expect(res.text).toBeDefined();
         expect(res.text).toContain(expectedResponse);
         done();
       });
  });

});

//Publisher and Subscriber and Bonder testing 
describe("Publisher Normal Tests", function() {
  let publisher;

  beforeEach(function() {
    publisher = new Publisher();
  });

  it("should subscribe a handler function", function() {
    const handlerFn = jasmine.createSpy('handlerFn');

    publisher.subscribe(handlerFn);
    publisher.publish({});

    expect(handlerFn).toHaveBeenCalled();
  });

  it("should unsubscribe a handler function", function() {
    const handlerFn = jasmine.createSpy('handlerFn');
    publisher.subscribe(handlerFn);

    publisher.unsubscribe(handlerFn);

    expect(handlerFn).not.toHaveBeenCalled();
  });

  it("should publish event properties to all subscribers", function() {
    const handlerFn1 = jasmine.createSpy('handlerFn1');
    const handlerFn2 = jasmine.createSpy('handlerFn2');
    publisher.subscribe(handlerFn1);
    publisher.subscribe(handlerFn2);

    publisher.publish({ message: "Hello, world!" });

    expect(handlerFn1).toHaveBeenCalledWith({ message: "Hello, world!" });
    expect(handlerFn2).toHaveBeenCalledWith({ message: "Hello, world!" });
  });

  it("should not notify unsubscribed subscribers", function() {
    const handlerFn = jasmine.createSpy('handlerFn');
    publisher.subscribe(handlerFn);
    publisher.unsubscribe(handlerFn);

    publisher.publish({}); 

    expect(handlerFn).not.toHaveBeenCalled();
  });

  it("should notify multiple subscribers", function() {
    const handlerFn1 = jasmine.createSpy('handlerFn1');
    const handlerFn2 = jasmine.createSpy('handlerFn2');
    publisher.subscribe(handlerFn1);
    publisher.subscribe(handlerFn2);

    publisher.publish({}); 

    expect(handlerFn1).toHaveBeenCalled();
    expect(handlerFn2).toHaveBeenCalled();
  });

  it("should not throw error if publishing with no subscribers", function() {
    expect(() => publisher.publish({})).not.toThrow();
  });

  it("should allow subscribing the same handler function only once", function() {
    const handlerFn = jasmine.createSpy('handlerFn');
    publisher.subscribe(handlerFn);
    publisher.subscribe(handlerFn);

    publisher.publish({});

    expect(handlerFn.calls.count()).toEqual(1);
  });

  it("should return true when unsubscribing a subscribed handler function", function() {
    const handlerFn = jasmine.createSpy('handlerFn');
    publisher.subscribe(handlerFn);

    const result = publisher.unsubscribe(handlerFn);

    expect(result).toBeTrue();
  });

});

describe("TerminalBonder Normal Tests", function() {
  let terminalBonder, publisher;

  beforeEach(function() {
    terminalBonder = new TerminalBonder();
    publisher = new Publisher();
  });

  it("should bind calculation to event sources", function() {
    const calculation = jasmine.createSpy('calculation').and.returnValue(42);

    terminalBonder.bind(publisher, calculation);

    publisher.publish({ someProperty: "value" });

    expect(terminalBonder.value).toEqual(42);
    expect(calculation).toHaveBeenCalledWith({ someProperty: "value" });
  });
});

describe("MailBonder Normal Tests", function() {
  let mailBonder, publisher;

  beforeEach(function() {
    mailBonder = new MailBonder("example@example.com");
    publisher = new Publisher();
  });

  it("should bind calculation to event sources and send email", function() {
    const calculation = jasmine.createSpy('calculation').and.returnValue("Email text");

    spyOn(console, 'log'); 

    mailBonder.bind(publisher, calculation);

    publisher.publish({ someProperty: "value" });

    expect(mailBonder.value).toEqual(0); 
    expect(calculation).toHaveBeenCalledWith({ someProperty: "value" });
  });
});