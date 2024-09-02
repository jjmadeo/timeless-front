/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, createContext } from "react";
import { mockLogin, mockLogout } from "./mockAut";

// Crear el contexto de autenticación
export const AuthContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook para acceder al contexto de autenticación
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveer la lógica de autenticación
function useProvideAuth() {
  const [user, setUser] = useState(null);
  
  const login = (email, password) => {
    // Guardar el estado de autenticación en el localStorage
    localStorage.setItem(
      "state",
      JSON.stringify({ email: email, password: password })
    );
    setUser({ email: email, password: password });
    return { email: email, password: password };
  };

  const register = (email, password) => {
    // Aquí puedes agregar la lógica para registrar un nuevo usuario
  };


  const logout = async () => {
    try {
      await mockLogout();
      localStorage.removeItem("state");
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const checkUser = () => {
      const storage = localStorage.getItem("state");
      if (storage !== null) {
        setUser(JSON.parse(storage));
      } else {
        setUser(false);
      }
    };

    checkUser();
  }, []);

  

  return {
    user,
    login,
    register,
    logout,
  };
}

export default ProvideAuth;