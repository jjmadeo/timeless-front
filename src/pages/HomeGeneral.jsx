import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast, ToastContainer } from "react-bootstrap";
import "./styles/HomeGeneral.scss";
import { getTurnosByUser } from "../helpers/fetch";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AppointmentCard = ({ appointment, color, data }) => {
    return (
        <div className={`card mb-3 shadow`} style={{ backgroundColor: color }}>
            <div className="card-body">
                <h5 className="card-title">
                    {appointment.fecha_hora.replace("T", " ")}
                </h5>
                <p className="card-text">
                    {appointment.rubro.detalle} - {appointment.nombre_empresa}
                </p>
                <p className="card-text">{appointment.direccion}</p>

                {/* Mostrar botones sólo si data.pasado es null */}
                {data.pasado === null && (
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-secondary btn-sm">Cancelar turno</button>
                        <button className="btn btn-secondary btn-sm">Ver mapa</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const HomeGeneral = () => {
    const [data, setData] = useState({ hoy: [], futuros: [], pasados: [] });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const location = useLocation();

    const fetchGetTurnos = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token")).token;
            const res = await getTurnosByUser(token);
            setData(res);
        } catch (error) {
            console.error("Error al obtener los turnos:", error);
        }
    };

    useEffect(() => {
        fetchGetTurnos();
    }, []);

    useEffect(() => {
        if (location.state && location.state.message) {
            const { mensaje, direccion, fecha_hora } = location.state.message;
            const fechaFormateada = format(new Date(fecha_hora), "EEEE d 'de' MMMM yyyy 'a las' HH:mm'hs'", { locale: es });
            setToastMessage(`${mensaje}<br />${fechaFormateada}<br />${direccion}`);
            setToastType(location.state.type || "success");
            setShowToast(true);
        }
    }, [location.state]);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md ">
                    <h2>Hoy</h2>
                    <div className="scrollable-div-hoy turnoContainer">
                        {data.hoy.length === 0 ? (
                            <p>No hay turnos hoy.</p>
                        ) : (
                            data.hoy.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    color="#3B6C5B"
                                    data={data}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-5 ">
                    <h2>Próximos</h2>
                    <div className="scrollable-div-futuros turnoContainer">
                        {data.futuros.length === 0 ? (
                            <p>No hay turnos próximos.</p>
                        ) : (
                            data.futuros.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    color="#73633A"
                                    data={data}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className="col-md-7 ">
                    <h2>Turnos históricos</h2>
                    <div className="scrollable-div-historico turnoContainer">
                        {data.pasados.length === 0 ? (
                            <p>No hay turnos pasados.</p>
                        ) : (
                            data.pasados.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    color="#C25959"
                                    data={data}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast
                    bg={toastType === "success" ? "success" : "danger"}
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                >
                    <Toast.Body dangerouslySetInnerHTML={{ __html: toastMessage }} />
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default HomeGeneral;