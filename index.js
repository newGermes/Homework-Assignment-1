'use strict';

/**
 * A simple API wich returns data in JSON format
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder =  require('string_decoder').StringDecoder;

// Custom dependencies
const config = require('./config');
const router = require('./routing/routers');

// Instantiate the HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

// Start server HTTP server
httpServer.listen(config.httpPort, () => {
    console.log(`The server is listening on port ${config.httpPort}`);
});

// All the server logic for the server
const unifiedServer = (req, res) => {
    // Get URL and parse it
    const parseUrl = url.parse(req.url, true);
 
    // Get the path
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the query string as an object
    const queryStringObject = parseUrl.query;
 
    // Get the HTTP method
    const method = req.method.toLowerCase();
    
    // Get the headers as an object
    const headers = req.headers;
    
    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', data => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handler this request should to go
        const chosenHandler = (typeof router[trimmedPath] !== 'undefined') 
                                ? router[trimmedPath] : router.notFound;
        
        // Construct the data object to send to the handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            'payload': buffer
        };
        
        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, 
            // or default to 200
            statusCode = (typeof statusCode === 'number') ? statusCode : 200; 

            // Use payload called back by the handler, 
            // or default to an empty object
            payload = (typeof payload === 'object') ? payload : {};

            // Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);


            // Log the request path
            console.log(`Returning this response ${statusCode} ${payloadString}`); 
        });
    });
};