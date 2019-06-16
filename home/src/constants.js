
export let
  apiBasePath = 'http://localhost:3001/api/call';


if(process.env.ENV === 'live') {
  apiBasePath = 'http://tb.home/api/call';
}
