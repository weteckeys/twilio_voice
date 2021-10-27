'use strict';

require('dotenv-safe').load();
const http = require('http');
const express = require('express');
const { urlencoded } = require('body-parser');
const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

let app = express();
app.use(express.static(__dirname + '/public'));
app.use(urlencoded({ extended: false }));

// Generate a Twilio Client capability token
app.get('/token', (request, response) => {
    try {
        const capability = new ClientCapability({
            accountSid: 'ACee11cb478f140dfcb300b589ba4be47e',
            authToken: '414bdfd54333b884e5c6f88d910a7e0f',
        });

        capability.addScope(
            new ClientCapability.OutgoingClientScope({
                applicationSid: 'APb88abe2a3da3b66b561960d46622d106',
            })
        );

        const token = capability.toJwt();

        // Include token in a JSON response
        response.send({
            token: token,
        });
    } catch (error) {
        console.log(error + '@@@@@@@');
        response.send({
            token: error,
        });
    }

});

// Create TwiML for outbound calls
app.post('/voice', (request, response) => {
    // console.log("*************");
    // console.log(response);
    // console.log("*************");
    let voiceResponse = new VoiceResponse();
    voiceResponse.dial({
        callerId: '+18302613020',
    }, request.body.number);

    console.log("*************");
    console.log(voiceResponse);
    console.log("*************");

    // Update Start

    // // Use the Twilio Node.js SDK to build an XML response
    // const twiml = new VoiceResponse();
    // twiml.say('Hello. Please leave a message after the beep.');

    // // Use <Record> to record and transcribe the caller's message
    // twiml.record({ transcribe: true, maxLength: 30 });

    // // End the call with <Hangup>
    // twiml.hangup();

    // // Render the response as XML in reply to the webhook request
    // response.type('text/xml');
    // response.send(twiml.toString());

    // Update End
    response.type('text/xml');
    response.send(voiceResponse.toString());
});

app.use((error, req, res, next) => {
    res.status(500)
    res.send('Server Error')
    console.error(error.stack)
    next(error)
})

let server = http.createServer(app);
let port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Express Server listening on *:${port}`);
});

module.exports = app;