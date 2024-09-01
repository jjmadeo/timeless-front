import { environment } from '../environment/environment'; // Ajusta la ruta según sea necesario

export const postRequest = async (endpoint, data) => {
  console.log('API Base URL:', environment.base); // Agrega un console.log para depuración
  const response = await fetch(environment.base + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getRequest = async (endpoint) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${JSON.parse(token).token}`;
  }
  
  const response = await fetch(environment.base + endpoint, {
    method: 'GET',
    headers,
  });
  
  return response.json();
};