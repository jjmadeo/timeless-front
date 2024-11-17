import { useState, useEffect } from 'react';
import { getAuditEmpresa } from "../helpers/fetch";
import { useAuth } from '../lib/authProvider';
import { useNavigate } from 'react-router-dom';
import PaginatedTable from '../components/PaginatedTable';
import { Container, Toast, ToastContainer } from 'react-bootstrap';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Auditoria = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [idEmpresa, setIdEmpresa] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [error, setError] = useState(false);
  const [auditEmpresaData, setAuditEmpresaData] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!auth.user || auth.user.ROL !== "[ROLE_EMPRESA]") {
        navigate("/login");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [auth, navigate]);

  useEffect(() => {
    if (auth.userProfile) {
      setIdEmpresa(auth.userProfile.id);
    }
  }, [auth]);

  useEffect(() => {
    const fetchAuditoria = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token")).token;
        const response = await getAuditEmpresa("EMPRESA", idEmpresa, token);
        console.log(response);
        if (response.data.length > 0) {
          const formattedData = response.data.map(item => ({
            ...item,
            fh_event: format(new Date(item.fh_event), 'dd/MM/yyyy HH:mm:ss', { locale: es }),
            turno: format(new Date(item.turno), 'dd/MM/yyyy HH:mm:ss', { locale: es })
          }));
          setAuditEmpresaData(formattedData);
          setError(false);
        } else {
          setToastMessage("No se encontraron cancelaciones");
          setError(true);
          setShowToast(true);
        }
      } catch (err) {
        setToastMessage("Error al obtener las auditorias");
        setError(true);
        setShowToast(true);
      }
    };

    if (idEmpresa) {
      fetchAuditoria();
    }
  }, [idEmpresa]);

  const columns = [
    { id: 'dni', Header: 'DNI', accessor: 'dni' },
    { id: 'correo', Header: 'Correo', accessor: 'correo' },
    { id: 'usuario', Header: 'Usuario', accessor: 'usuario' },
    { id: 'telefono_usuario', Header: 'Teléfono usuario', accessor: 'telefono_usuario' },
    { id: 'turno', Header: 'Fecha turno', accessor: 'turno' },
    { id: 'canceled_by', Header: 'Cancelado por', accessor: 'canceled_by' },
    { id: 'fh_event', Header: 'Fecha Cancelación', accessor: 'fh_event' },
    // Agrega más columnas según sea necesario
  ];

  return (
    <Container>
      <h1>Cancelaciones</h1>
      <PaginatedTable 
        columns={columns}
        data={auditEmpresaData}
        pageSize={8}
      />
      <ToastContainer position="bottom-end" className="p-3 text-white">
        <Toast
          bg={error ? "danger" : "success"}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Auditoria;