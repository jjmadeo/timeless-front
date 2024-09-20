import { environment } from '../environment/environment'; // Ajusta la ruta según sea necesario

export const postRequest = async (endpoint, data) => {
  console.log('API Base URL:', environment.base); 
  const response = await fetch(environment.base + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // Verifica si la respuesta es correcta
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error en la solicitud');
  }

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

export const loginRequest = async (email, password) => {
  try {
    const data = { correo: email, clave: password };
    const response = await postRequest('authenticate', data); 
      
    if (response.token) {
      console.log("Token recibido:", response.token);

      const base64Url = response.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = JSON.parse(window.atob(base64));
      console.log("Token decodificado:", jsonPayload);

      localStorage.setItem("token", JSON.stringify(response));

      return { email, token: response.token, userInfo: jsonPayload }; 
    } else {
      throw new Error('No se recibió un token válido');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

