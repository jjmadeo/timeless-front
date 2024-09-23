

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, createContext } from "react";
import { mockLogin, mockLogout } from "./mockAut";
import { getProfile, loginRequest, registerRequest } from "../helpers/fetch";



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
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {

    const userInfo = JSON.parse(localStorage.getItem("state"));
    const userProfileLocal = JSON.parse(localStorage.getItem("userProfile"));
    if (userInfo) {
      setUser(userInfo);
    }

    if (userProfileLocal) {
      setUserProfile(userProfileLocal);
    }

  }, []);


  const login = async (email, password) => {
    try {
      const loggedInUser = await loginRequest(email, password);
      if (loggedInUser) {
        setUser(loggedInUser.userInfo);
        localStorage.setItem("state", JSON.stringify(loggedInUser.userInfo));
        await fetchUserProfile();
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


  const fetchUserProfile = async () => {
      
    try {
      const token = JSON.parse(localStorage.getItem('token')).token; 
      const profile = await getProfile(token);
      setUserProfile(profile);
      localStorage.setItem("userProfile", JSON.stringify(profile));
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
    }
  };

  return {
    user,
    userProfile,
    login,
    register,
    logout,
    fetchUserProfile
  };
}

export default ProvideAuth;