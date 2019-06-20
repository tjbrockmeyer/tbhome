
const {
  convertComponentsToRefs, ref,
  parameterDoc, requestBodyDoc, responseDoc, authDoc,
} = require('@brockmeyer-tyler/openapi3/components');
const {token} = require('./constants');


const securitySchemes = {};
securitySchemes[token.name] = authDoc('apiKey', 'x-access-token', 'header', 'Token received from logging in');

module.exports = {
  securitySchemes,

  parameters: {
    path: {
      $container: true,
      listName: parameterDoc('listName', 'path', 'Name of the list to target', true, {type: 'string'})
    }
  },

  requestBodies: {

  },

  responses: {
    badRequest: responseDoc('Bad Request', ref('error')),
    error: responseDoc('Internal Server Error', ref('error')),
    unauthenticated: responseDoc('Unauthenticated'),
    forbidden: responseDoc('Forbidden'),
  },

  schemas: {
    error: {
      type: 'object',
      required: ['error'],
      properties: {
        error: {type: 'string'},
        object: {type: 'object'}
      }
    },
    list: {
      $container: true,
      create: {
        type: 'object',
        properties: {
          description: {type: 'string'}
        }
      },
      obj: {
        type: 'object',
        required: ['name', 'items'],
        properties: {
          name: {type: 'string'},
          description: {type: 'string'},
          closeDate: {type: 'string', format: 'dateTime'},
          items: {
            type: 'array',
            items: ref('list/item/obj'),
          }
        }
      },
      item: {
        $container: true,
        obj: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {type: 'string'},
            description: {type: 'string'},
          }
        },
        delete: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {type: 'string'},
          }
        },
      }

    },
  }
};

convertComponentsToRefs(module.exports);
