
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
    dayOfWeek: {type: 'string', enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']},
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
        required: ['id', 'name'],
        properties: {
          id: {type: 'integer'},
          name: {type: 'string'},
          description: {type: 'string'},
          closeDate: {type: 'string', format: 'dateTime'},
          items: {
            type: 'array',
            items: ref('list/item/obj'),
          }
        }
      },
      listOfLists: {
        type: 'array',
        items: ref('list/obj')
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
    event: {
      $container: true,
      series: {
        type: 'object',
        required: ['title', 'description'],
        properties: {
          title: {type: 'string'},
          description: {type: 'string'},
          imageUrl: {type: 'string'},
          startDate: {type: 'string', format: 'dateTime'},
          endDate: {type: 'string', format: 'dateTime'},
          recurrence: ref('event/recurrence'),
        }
      },
      recurrence: {
        oneOf: [
          {
            type: 'object',
            required: ['type', 'date'],
            properties: {
              type: {type: 'string', enum: ['nonRecurring']},
              date: {type: 'string', format: 'dateTime'},
            }
          },
          {
            type: 'object',
            required: ['type', 'month', 'day'],
            properties: {
              type: {type: 'string', enum: ['annually', 'semiannually', 'quarterly']},
              month: {type: 'number', format: 'integer', minimum: 1, maximum: 12},
              day: {type: 'number', format: 'integer', minimum: 1, maximum: 31},
            }
          },
          {
            type: 'object',
            required: ['type', 'day'],
            properties: {
              type: {type: 'string', enum: ['monthly', 'bimonthly']},
              day: {type: 'number', format: 'integer', minimum: 1, maximum: 31},
            }
          },
          {
            type: 'object',
            required: ['type', 'daysOfWeek'],
            properties: {
              type: {type: 'string', enum: ['weekly']},
              daysOfWeek: {
                type: 'array',
                minItems: 1,
                maxItems: 7,
                items: ref('dayOfWeek')
              },
            }
          },
          {
            type: 'object',
            required: ['type', 'hour'],
            properties: {
              type: {type: 'string', enum: ['daily']},
              hour: {type: 'number', format: 'integer', minimum: 1, maximum: 24},
            }
          },
          {
            type: 'object',
            required: ['type'],
            properties: {
              type: {type: 'string', enum: ['highFrequency']}
            }
          }
        ]
      }
    }
  }
};

convertComponentsToRefs(module.exports);
