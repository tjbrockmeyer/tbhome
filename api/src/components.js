
const {
  convertComponentsToRefs, ref,
  parameter, body, response, authorization
} = require('@brockmeyer-tyler/openapi3/components');

module.exports = {
  securitySchemes: {
    token: authorization('apiKey', 'x-access-token', 'header', 'Token received from logging in')
  },

  parameters: {
    path: {
      $container: true,
      listName: parameter('listName', 'path', 'Name of the list to target', true, {type: 'string'})
    }
  },

  requestBodies: {
    addItem: body('Information about the item to be added to this list', true, ref('list/item/create')),
  },

  responses: {
    badRequest: response('Bad Request', ref('error')),
    error: response('Internal Server Error', ref('error')),
    unauthenticated: response('Unauthenticated'),
    forbidden: response('Forbidden'),
    list: {
      $container: true,
      obj: response('Found', ref('list/obj')),
      created: response('List successfully created'),
      submitted: response('Item successfully submitted'),
    }
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
