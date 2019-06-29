
const oas = require('@brockmeyer-tyler/openapi3');
const comps = require('../components');


module.exports = [
  new oas.Endpoint(
    'POST', '/event/{eventName}', 'Event', 'Create a new event',
    'Create a new event')
    .body(oas.requestBodyDoc('Spec for the event', true, comps.schemas.event.obj))
    .response(200, oas.responseDoc('Event created successfully'))
    .response(409, oas.responseDoc('An event with that name already exists'))
];