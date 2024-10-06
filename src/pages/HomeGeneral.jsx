import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/HomeGeneral.scss";

const mockData = {
    hoy: [{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      }],
    futuros: [{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      }],
    pasados: [
      {
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },
      {
        id: 755,
        hashid: "93b4472c-0989-432b-8e57-467bb1bcdea4",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:15",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },
      {
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      },{
        id: 753,
        hashid: "187e57cd-32c3-4c3c-8030-a194859aac6a",
        mensaje: "Consultoría en estrategias de marketing",
        fecha_hora: "2024-09-18T09:00",
        direccion: "Av. Siempre Viva 742, Springfield, Springfield",
        duracion: 15,
        rubro: {
          id: 1,
          detalle: "BARBERIA"
        },
        nombre_empresa: "XYZ Solutions",
        error: null
      }
    ],
    error: null
  };
  
  const AppointmentCard = ({ appointment, color }) => {
    return (
      <div className={`card  mb-3 shadow`} style={{ backgroundColor:color }}>
        <div className="card-body">
          <h5 className="card-title">{appointment.fecha_hora.replace("T"," ")}</h5>
          <p className="card-text">{appointment.rubro.detalle} - {appointment.nombre_empresa}</p>
          <p className="card-text">{appointment.direccion}</p>
          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary btn-sm">Cancelar turno</button>
            <button className="btn btn-secondary btn-sm">Ver mapa</button>
          </div>
        </div>
      </div>
    );
  };
  


  

  
  const HomeGeneral = () => {
    const [data, setData] = useState({ hoy: [], futuros: [], pasados: [] });
  
    useEffect(() => {
      // Simular llamada a la API
      setTimeout(() => {
        setData(mockData);
      }, 1000);
    }, []);
  
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-5 scrollable-div-hoy">
            <h2>Turnos de hoy</h2>
            {data.hoy.length === 0 ? <p>No hay turnos hoy.</p> : data.hoy.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} color="#3b6b5b" />
            ))}
  
            <h2>Turnos próximos</h2>
            {data.futuros.length === 0 ? <p>No hay turnos próximos.</p> : data.futuros.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} color="#72633a" />
            ))}
          </div>
  
          <div className="col-md-7 scrollable-div-historico">
            <h2>Turnos históricos</h2>
            {data.pasados.length === 0 ? <p>No hay turnos pasados.</p> : data.pasados.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} color="#b33611" />
            ))}
          </div>
        </div>
      </div>
    );
  };

export default HomeGeneral;