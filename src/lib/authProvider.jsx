

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, createContext } from "react";
import { mockLogin, mockLogout } from "./mockAut";
import { loginRequest, registerRequest } from "../helpers/fetch";


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
  
  const login = async (email, password) => {
    try {
      const loggedInUser = await loginRequest(email, password);
      if (loggedInUser) {
        setUser(loggedInUser.userInfo);
        return loggedInUser;
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error; // Asegúrate de lanzar el error para manejarlo en el componente
    }
  };

    const register = async (payload) => {
      try {
        const registeredUser = await registerRequest(payload);
        if (registeredUser) {
          setUser(registeredUser.userInfo);
          localStorage.setItem("state", JSON.stringify(registeredUser.userInfo));
          return registeredUser;
        }
      } catch (error) {
        console.error('Error al registrar:', error);
        throw error;
      }
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


  const setUserInfo = () => {
    const lsToken = localStorage.getItem("token");
    if (lsToken) {
        var base64Url = lsToken.split('.')[1];
        if (base64Url) {
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            localStorage.setItem("userInfo", jsonPayload);
            return jsonPayload;
        } else {
            console.log("Token invalido");
            return null; 
        }
    } else {
        console.log("No se recibio token.");
        return null; 
    }
};

  

  return {
    user,
    login,
    register,
    logout,
  };
}

export default ProvideAuth;