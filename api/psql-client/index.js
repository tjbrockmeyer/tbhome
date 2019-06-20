const {Pool} = require('pg');


let pool;
let logQueries = false;
const unwrappedQueries = {};


class PSQLError extends Error {
  constructor(error) {
    super(error.message);
    const msg = error.message;
    if(msg.includes('ECONNREFUSED')) {
      this.code = 'CONNECTION';
      this.message = "could not connect to the database";
      this.details = msg;
    }
    if(msg.includes('already exists')) {
      this.code = 'CONFLICT';
      this.message = "inserting the given data resulted in a conflict";
      this.details = msg;
    }
  }
}

function formatParam(param) {
  if(typeof param === 'string') {
    return `'${param}'`;
  } else if(param instanceof Array) {
    return `[${param.map(x => formatParam(x))}]`
  } else if(param instanceof Date) {
    return param.toISOString();
  } else if(typeof param === 'object') {
    return `{${Object.getOwnPropertyNames(param).map(x => `${x}:${formatParam(param[x])}`)}}`
  }
  return String(param);
}

function formatQuery(query, params=[]) {
  query = query.replace(/\$[0-9]+/g, (match) => {
    const index = parseInt(match.substring(1));
    if(index >= params.length) {
      throw new PSQLError(`out of range: found $${index} in query, but only ${params.length} params were provided`)
    }
    return formatParam(params[index]);
  });
  return query;
}

function queryDecorator(func, tx) {
  return async function() {
    let ret;
    const client = tx || await pool.connect();
    try {
      const result = func.apply(this, arguments);
      if(typeof result === 'string') {
        ret = await run(result, [], client);
      } else if(result instanceof Array) {
        let query = result, params = [], last = result[result.length - 1];
        if(last instanceof Array) {
          query = result.slice(0, result.length - 1);
          params = last;
        }
        ret = await run(query.join('\n'), params, client);
      }
    } finally {
      if(!tx) {
        client.release();
      }
    }
    return ret;
  }
}

async function run(query, params, client) {
  try {
    if(logQueries) console.debug(formatQuery(query, params));
    return await client.query(query, params);
  } catch(error) {
    throw new PSQLError(error);
  }
}


module.exports = {

  PSQLError,

  start(host, port, user, pass, dbName, {logLevel=0, idleErrorHandler}={}) {
    pool = new Pool({host, port, user, password: pass, database: dbName});
    pool.on('error', (err, client) => {
      if(idleErrorHandler) {
        idleErrorHandler(err, client);
      } else {
        console.error(err);
      }
    });
    logQueries = logLevel > 0
  },

  async stop() {
    await pool.end();
  },

  initQueries(queries) {
    Object.getOwnPropertyNames(queries).forEach(n => {
      unwrappedQueries[n] = queries[n];
      queries[n] = queryDecorator(queries[n]);
    })
  },

  async transaction(func) {
    let client, queries = {};
    try {
      client = await pool.connect();
      await client.query('BEGIN');
      Object.getOwnPropertyNames(unwrappedQueries).forEach(n => {
        queries[n] = queryDecorator(unwrappedQueries[n], client);
      });
      await func(queries);
      client.query('COMMIT');
    } catch(error) {
      client.query('ROLLBACK');
      throw new PSQLError(error);
    } finally {
      if(client) {
        client.release();
      }
    }
  },
};