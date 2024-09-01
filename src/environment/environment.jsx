/* eslint-disable no-unused-vars */
// LOCAL
const LOCAL_ENV = {
    environment: 'LOCAL',
    base: 'http://localhost/api',
  };
  
  // DEV
  const DEV_ENV = {
    environment: 'DEV',
    base: 'http://10.32.11.96/api',
  };
  

  

  
  export const environment = LOCAL_ENV; // Default to DEV_ENV if not found