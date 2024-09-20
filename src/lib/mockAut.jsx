
export const mockLogin = (email, password) => {
    // Simular una respuesta de login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com" && password === "password") {
          resolve({ email: email });
        } else {
          reject("Credenciales incorrectas");
        }
      }, 1000); // Simula un retraso de 1 segundo
    });
  };

  export const mockLogout = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500); // Simula un retraso de 0.5 segundos
    });
  };