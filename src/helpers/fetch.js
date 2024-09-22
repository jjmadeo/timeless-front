import { environment } from '../environment/environment'; // Ajusta la ruta según sea necesario

export const postRequest = async (endpoint, data, token = null) => {
  console.log('API Base URL:', environment.base);
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(environment.base + endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  // Verifica si la respuesta es correcta
  if (!response.ok) {
    const errorData = await response.json();
    // Aquí puedes lanzar un error más descriptivo
    throw new Error(`${errorData.error.title}`);
  }

  return response.json();
};

export const getRequest = async (endpoint, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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

    // Si la API devuelve un token, es un éxito
    if (response.token) {
      console.log("Token recibido:", response.token);

      const base64Url = response.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = JSON.parse(window.atob(base64));
      console.log("Token decodificado:", jsonPayload);

      localStorage.setItem("token", JSON.stringify(response));

      return { email, token: response.token, userInfo: jsonPayload };
    }

    // Si hay un error, maneja el mensaje del servidor
    else if (response.error) {
      throw new Error(response.error.title || 'Error desconocido');
    }

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

export const registerRequest = async (payload) => {
  try {
    const response = await postRequest('register', payload); // Cambia 'register' al endpoint correcto
    return response;
  } catch (error) {
    console.error('Error al registrar:', error);
    throw error;
  }
};

export const getProfile = async (token) => {
  try {
    const response = await getRequest('perfil', token);
    return response;
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    throw error;
  }
};

export const getUsers = async (token) => {
  try {
    const response = await getRequest('usuarios', token);
    return response;
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    throw error;
  }
};

export const empresaRequest = async (payload, token) => {
  try {
    const response = await postRequest('empresa', payload, token);
    return response;
  } catch (error) {
    console.error('Error al registrar:', error);
    throw error;
  }
};