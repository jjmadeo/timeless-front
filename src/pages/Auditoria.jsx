import { useState, useEffect } from 'react';
import { getAuditEmpresa } from "../helpers/fetch";
import { useAuth } from '../lib/authProvider';
import { useNavigate } from 'react-router-dom';
import PaginatedTable from '../components/PaginatedTable';
import { Container, Button, Toast, ToastContainer } from 'react-bootstrap';
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
    }, .1);

    return () => clearTimeout(timeoutId);
  }, [auth, navigate]);

  useEffect(() => {
    if (auth.userProfile) {
      setIdEmpresa(auth.userProfile.id_empresa);
    }
  }, [auth]);

  const handleGetAuditoria = async (tipo) => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;
      const response = await getAuditEmpresa(tipo, idEmpresa, token);
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
        setToastMessage("Error al obtener las auditorias");
        setError(true);
        setShowToast(true);
      }
    } catch (err) {
      setToastMessage("Error al obtener las auditorias");
      setError(true);
      setShowToast(true);
    }
  };

  const columns = [
    { id: 'id_auditoria', Header: 'ID', accessor: 'id_auditoria' },
    { id: 'usuario', Header: 'Usuario', accessor: 'usuario' },
    { id: 'telefono_usuario', Header: 'Teléfono usuario', accessor: 'telefono_usuario' },
    { id: 'turno', Header: 'Turno', accessor: 'turno' },
    { id: 'canceled_by', Header: 'Cancelado por', accessor: 'canceled_by' },
    { id: 'fh_event', Header: 'Fecha Cancelación', accessor: 'fh_event' },
    // Agrega más columnas según sea necesario
  ];

  return (
    <Container>
      <h1>Cancelaciones</h1>
      <div className="d-flex justify-content-center mb-4">
      <Button className='mx-4' variant='primary' onClick={() => handleGetAuditoria("EMPRESA")}>Cancelados por empresa</Button>
      <Button variant='secondary' onClick={() => handleGetAuditoria("USUARIO")}>Cancelados por usuarios</Button>
      </div>
      <PaginatedTable 
        columns={columns}
        data={auditEmpresaData}
        pageSize={10}
      />
      <ToastContainer position="bottom-end" className="p-3">
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