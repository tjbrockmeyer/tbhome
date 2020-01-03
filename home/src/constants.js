
export let
  apiBasePath = 'http://localhost:3001/api';


if(process.env.NODE_ENV === 'production') {
  apiBasePath = `${process.env.REACT_APP_DOMAIN_URL}/api`;
}
