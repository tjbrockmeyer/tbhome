
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
      obj: {
        type: 'object',
        required: ['name', 'items'],
        properties: {
          name: {type: 'string'},
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
          required: ['id', 'title'],
          properties: {
            id: {type: 'integer'},
            title: {type: 'string'},
            description: {type: 'string'},
            additionalInfo: {type: 'string'},
          }
        },
        create: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {type: 'string'},
            description: {type: 'string'},
            additionalInfo: {type: 'string'},
          }
        },
      }

    },
  }
};

convertComponentsToRefs(module.exports);
