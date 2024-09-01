import { useContext } from 'react';
import { AuthContext } from '../../lib/authProvider'; // Asegúrate de ajustar la ruta si es necesario

const LogoutButton = () => {
  const { logout, user } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Bienvenido, {user.email}!</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <p>No estás logueado.</p>
      )}
    </div>
  );
};

export default LogoutButton;