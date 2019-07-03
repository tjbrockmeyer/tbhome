
export let
  apiBasePath = 'http://localhost:3001/api/rest';


if(process.env.ENV === 'live') {
  apiBasePath = 'http://tb.home/api/rest';
}
