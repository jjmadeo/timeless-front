import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Spinner } from "react-bootstrap";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import { getStaticData, getEmpresasByLocation, getEmpresas } from "../../helpers/fetch";

const libraries = ["places"];

const BusquedaEmpresas = ({ onResults }) => {
  const [searchType, setSearchType] = useState("direccion");
  const [linea, setLinea] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rubros, setRubros] = useState([]);
  const [selectedRubro, setSelectedRubro] = useState("");

  useEffect(() => {
    fetchRubros();
  }, []);

  const fetchRubros = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;
      const res = await getStaticData(token);
      setRubros(res.rubro);
    } catch (error) {
      console.error("Error al obtener los rubros:", error);
    }
  };

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setLocation({ lng, lat });
      setAddress(place.formatted_address);
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let results = [];
      const token = JSON.parse(localStorage.getItem("token")).token;
      if (searchType === "direccion" && location) {
        results = await getEmpresasByLocation(location.lng, location.lat, 6, selectedRubro, token);
      } else if (searchType === "nombre" && companyName) {
        const allCompanies = await getEmpresas(token);
        results = allCompanies.filter(company => company.datos_fiscales.nombre_fantasia.toLowerCase().includes(companyName.toLowerCase()));
      }
      onResults(results);
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRubroChange = (e) => {
    const selectedText = e.target.options[e.target.selectedIndex].text;
    setSelectedRubro(selectedText);
  };

  const handleUseCurrentLocationChange = (e) => {
    setUseCurrentLocation(e.target.checked);
  };

  return (
    <div>
      <Form>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={2}>
            Tipo de Búsqueda
          </Form.Label>
          <Col sm={10}>
            <Form.Check
              type="radio"
              label="Dirección"
              name="searchType"
              value="direccion"
              checked={searchType === "direccion"}
              onChange={(e) => setSearchType(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Nombre de Empresa"
              name="searchType"
              value="nombre"
              checked={searchType === "nombre"}
              onChange={(e) => setSearchType(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formLinea">
          <Form.Label>Línea de Atención</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la línea de atención"
            value={linea}
            onChange={(e) => setLinea(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formRubro">
          <Form.Label>Rubro</Form.Label>
          <Form.Control as="select" value={selectedRubro} onChange={handleRubroChange}>
            <option value="">Seleccione un rubro</option>
            {rubros.map((rubro) => (
              <option key={rubro.id} value={rubro.id}>
                {rubro.detalle}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {searchType === "direccion" && (
          <Form.Group controlId="formAddress">
            <Form.Label>Dirección</Form.Label>
            <LoadScriptNext googleMapsApiKey="AIzaSyAZ6rhipfSVaz-41Jn4vv-MgEDd87n4Zkc" libraries={libraries}>
              <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
                <Form.Control
                  type="text"
                  placeholder="Ingrese una dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={useCurrentLocation}
                />
              </Autocomplete>
            </LoadScriptNext>
            <Form.Check
              type="checkbox"
              label="Usar ubicación actual"
              checked={useCurrentLocation}
              onChange={handleUseCurrentLocationChange}
            />
          </Form.Group>
        )}

        {searchType === "nombre" && (
          <Form.Group controlId="formCompanyName">
            <Form.Label>Nombre de Empresa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre de la empresa"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </Form.Group>
        )}

        <Button variant="primary" onClick={handleSearch} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Buscar"}
        </Button>
      </Form>
    </div>
  );
};

export default BusquedaEmpresas;