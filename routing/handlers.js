// Define the handlers
const handlers = {};

// process hello rounitg
handlers.hello = (data, callback) => {
    const msg = {msg: 'Hello world'};

    callback(200, msg);
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

module.exports = handlers;