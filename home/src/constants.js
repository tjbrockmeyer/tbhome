
export let
  apiBasePath = 'http://localhost:3001/api';


if(process.env.NODE_ENV === 'production') {
  apiBasePath = 'https://tbhome.haiskai.blue/api';
}
