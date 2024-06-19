import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination, Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../estilos/styleCita.css";

interface Cita {
  idCita: number;
  fecha: string;
  hora: string;
  estado: string;
  duracion: number;
  cliente: {
    nombreUsuario: string;
  };
  barbero: {
    nombreUsuario: string;
  };
  servicios: {
    nombre: string;
  }[];
}

interface User {
  id: number;
  nombreUsuario: string;
}

interface Props {
  user?: User;
}

const ListarCitasBarbero: React.FC<Props> = ({ user }) => {
  const [citasPorFecha, setCitasPorFecha] = useState<{ [fecha: string]: Cita[] }>({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga inicial
  const [filterDate, setFilterDate] = useState<string>("");

  useEffect(() => {
    fetchCitas();
  }, [user, filterDate]);

  const fetchCitas = () => {
    if (user) {
      setLoading(true);
      const endpoint = filterDate
        ? `http://localhost:1111/citas/listarPorFechaYBarbero`
        : `http://localhost:1111/citas/listarPorBarbero`;

      const params = filterDate
        ? { fecha: filterDate, barberoId: user.id, page: 0, size: 20, sort: "fecha,desc" }
        : { barberoId: user.id, page: 0, size: 20, sort: "fecha,desc" };

      axios
        .get(endpoint, { params })
        .then((response) => { 


          

const citasData = filterDate ? response.data.content : response.data.content;


if(filterDate){
  setCitasPorFecha(citasData);
  setTotalPages(response.data.totalPages);
}

          const citas = citasData;
          const citasPorFecha: { [fecha: string]: Cita[] } = {};
          citas.forEach((cita: Cita) => {
            const fecha = cita.fecha;
            if (!citasPorFecha[fecha]) {
              citasPorFecha[fecha] = [];
            }
            citasPorFecha[fecha].push(cita);
          });
          setCitasPorFecha(citasPorFecha);
          setTotalPages(Object.keys(citasPorFecha).length);
          setLoading(false); // Una vez cargadas las citas, establecer loading a false
        })
        .catch((error) => {
          console.error("Error al obtener las citas del barbero:", error);
        });
    }
  };

  const formatDate = (dateString: string): string => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-ES", options);
  };

  const getInitialPage = () => {
    const sortedDates = Object.keys(citasPorFecha).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const currentDate = new Date();
    for (let i = 0; i < sortedDates.length; i++) {
      if (new Date(sortedDates[i]) <= currentDate) {
        return i;
      }
    }
    return 0;
  };

  useEffect(() => {
    if (!loading) {
      setPage(getInitialPage());
    }
  }, [citasPorFecha, loading]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber - 1);
  };

  const handleShowDetails = (cita: Cita) => {
    setSelectedCita(cita);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCita(null);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(event.target.value);
  };

  const handleShowAll = () => {
    setFilterDate("");
  };

  return (
    <div className="view-container">
      <div className="transparent-container">
        <h2 className="mb-4" style={{color:'#F44334'}} >Citas</h2>
        <Form>
          <Form.Group controlId="filterDate">
          <Form.Label style={{color:'#9AAEB8'}}>Filtrar por Fecha</Form.Label>
            <Form.Control type="date" value={filterDate} onChange={handleDateChange} />
          </Form.Group>
          <Button variant="primary" onClick={handleShowAll}>
            Mostrar todas
          </Button>
        </Form>
        {loading ? (
          <p>Cargando citas...</p>
        ) : Object.keys(citasPorFecha).length === 0 ? (
          <p>Aún no hay citas registradas.</p>
        ) : (
          <>
            {Object.keys(citasPorFecha)
              .slice(page, page + 1)
              .map((fecha, index) => (

                
                <div key={index} >
                  <h3 style={{color:"#9AAEB8"}}>{formatDate(fecha)}</h3>
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Hora</th>
                        <th>Estado</th>
                        <th>Cliente</th>
                        <th>Funciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citasPorFecha[fecha].map((cita: Cita) => (
                        <tr key={cita.idCita}>
                          <td>{cita.hora}</td>
                          <td>{cita.estado}</td>
                          <td>{cita.cliente.nombreUsuario}</td>
                          <td>
                            <Button variant="primary" onClick={() => handleShowDetails(cita)}>
                              Ver más detalles
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ))}
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item key={i} active={i === page} onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}

        {selectedCita && (
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Detalles de la Cita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                <strong>Fecha:</strong> {formatDate(selectedCita.fecha)}
              </p>
              <p>
                <strong>Hora:</strong> {selectedCita.hora}
              </p>
              <p>
                <strong>Duración:</strong> {selectedCita.duracion} minutos
              </p>
              <p>
                <strong>Estado:</strong> {selectedCita.estado}
              </p>
              <p>
                <strong>Cliente:</strong> {selectedCita.cliente.nombreUsuario}
              </p>
              <p>
                <strong>Barbero:</strong> {selectedCita.barbero.nombreUsuario}
              </p>
              <p>
                <strong>Servicios:</strong>
              </p>
              <ul>
                {selectedCita.servicios.map((servicio, index) => (
                  <li key={index}>{servicio.nombre}</li>
                ))}
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ListarCitasBarbero;
