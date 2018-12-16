const handlers = require('./handlers');

// Define a request router
module.exports = {
    'hello': handlers.hello,
    'notFound': handlers.notFound
};