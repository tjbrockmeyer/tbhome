
export let
  apiBasePath = 'http://localhost:3001/api/rest';


if(process.env.NODE_ENV === 'production') {
  apiBasePath = 'http://tb.home/api/rest';
}
