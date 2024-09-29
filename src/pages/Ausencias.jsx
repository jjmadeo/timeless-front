
/*handleAddAusencia y handleRemoveAusencia son funciones que se encargan de agregar y eliminar ausencias respectivamente.
const handleAddAusencia = () => {
    setFormData((prevData) => ({
      ...prevData,
      calendario: {
        ...prevData.calendario,
        ausencias: [
          ...prevData.calendario.ausencias,
          { desde: "", hasta: "", descripcion: "" },
        ],
      },
    }));
  };

  const handleRemoveAusencia = (index) => {
    setFormData((prevData) => {
      const newAusencias = prevData.calendario.ausencias.filter(
        (_, i) => i !== index
      );
      return {
        ...prevData,
        calendario: {
          ...prevData.calendario,
          ausencias: newAusencias,
        },
      };
    });
  };
  */

  /*validaciones ausencias

  for (const ausencia of ausencias) {
    if (ausencia.desde >= ausencia.hasta) {
      setToastMessage(
        "La fecha de inicio de la ausencia no puede ser mayor o igual a la fecha de fin."
      );
      setError(true);
      setShowToast(true);
      return false;
    }
  }
    */


  /*form ausencias
  <h3>Ausencias</h3>
                            {formData.calendario.ausencias.map((ausencia, index) => (
                                <Row key={index} className="item-container">
                                    <Col md={4}>
                                        <Form.Group controlId={`desde-${index}`}>
                                            <Form.Label>Desde</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name={`calendario.ausencias.${index}.desde`}
                                                value={ausencia.desde}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId={`hasta-${index}`}>
                                            <Form.Label>Hasta</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name={`calendario.ausencias.${index}.hasta`}
                                                value={ausencia.hasta}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId={`descripcion-${index}`}>
                                            <Form.Label>Descripción</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name={`calendario.ausencias.${index}.descripcion`}
                                                value={ausencia.descripcion}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12} className="text-right">
                                        <Button
                                            variant="danger"
                                            className="btn-quitar"
                                            onClick={() => handleRemoveAusencia(index)}
                                        >
                                            Quitar
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button variant="primary" onClick={handleAddAusencia}>
                                Agregar Ausencia
                            </Button>

                            */