import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

interface Cita {
  idCita: number;
  fecha: string;
  hora: string;
  estado: string;
  barbero: {
    nombreUsuario: string;
  };
}

interface User {
  id: number;
  nombreUsuario: string;
}

interface Props {
  user?: User;
}

const ListarCitasCliente: React.FC<Props> = ({ user }) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [open, setOpen] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [fecha, setFecha] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCitas();
    }
  }, [user, page, fecha]);

  const fetchCitas = () => {
    if (user) {
      let endpoint = `http://localhost:1111/citas/listarPorCliente?clienteId=${user.id}`;

      if (fecha) {
        endpoint = `http://localhost:1111/citas/listarPorFecha?fecha=${fecha}&clienteId=${user.id}`;
      }

      axios
        .get(endpoint, {
          params: { page: page, size: 20, sort: "fecha,desc" },
        })
        .then((response) => {
          if (fecha) {
            setCitas(response.data);
            setTotalPages(response.data.total.pages);
          } else {
            setCitas(response.data.content);
            setTotalPages(response.data.totalPages);
          }
        })
        .catch((error) => {
          console.error("Error al obtener las citas del usuario:", error);
        });
    }
  };

  // Función para formatear la fecha en el formato deseado (dia mes año)
  const formatDate = (dateString: string): string => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString("es-ES", options);
  };

  const handleDeleteClick = (idCita: number) => {
    setCitaToDelete(idCita);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCitaToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (citaToDelete !== null) {
      axios
        .delete(`http://localhost:1111/citas/eliminar/${citaToDelete}`)
        .then(() => {
          setCitas((prevCitas) => prevCitas.filter((cita) => cita.idCita !== citaToDelete));
          handleClose();
        })
        .catch((error) => {
          console.error("Error al eliminar la cita:", error);
          handleClose();
        });
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber - 1);
  };

  const handleUpdateClick = (idCita: number) => {
    navigate(`/actualizar-cita/${idCita}`);
  };

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(e.target.value);
    setPage(0);
  };

  const handleMostrarTodasClick = () => {
    setFecha(""); // Limpiar el filtro de fecha
    setPage(0); // Reiniciar la página a la primera
  };

  return (
    <div style={{ padding: "20px", backgroundColor:'#1a1a1a' }}>
      <h2 style={{ marginBottom: "20px", color:'#F44334' }}>Mis Citas</h2>
      
      <Form.Group controlId="fecha">
        <Form.Label style={{color:'#9AAEB8'}}>Filtrar por Fecha</Form.Label>
        <Form.Control
          type="date"
          value={fecha}
          onChange={handleFechaChange}
          style={{color:'#9AAEB8'}}
        />
      </Form.Group>

      <Button variant="primary" onClick={handleMostrarTodasClick} style={{ marginBottom: "10px" }}>
        Mostrar Todas
      </Button>


      <Table class="table table-dark table-striped" striped bordered hover style={{ marginTop: "20px" ,}}>
        <thead>
          <tr>
            <th style={{ minWidth: "120px" }}>Fecha</th>
            <th style={{ minWidth: "120px" }}>Hora</th>
            <th style={{ minWidth: "120px" }}>Estado</th>
            <th style={{ minWidth: "150px" }}>Barbero</th>
            <th style={{ minWidth: "180px" }}>Funciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.idCita}>
              <td>{formatDate(cita.fecha)}</td>
              <td>{cita.hora}</td>
              <td style={{ color: cita.estado === "finalizado" ? "red" : "inherit" }}>
                {cita.estado}
              </td>
              <td>{cita.barbero.nombreUsuario}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(cita.idCita)}
                  style={{ marginRight: "10px", display: cita.estado === "finalizado" ? "none" : "inline-block" }}
                >
                  Eliminar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleUpdateClick(cita.idCita)}
                  style={{ display: cita.estado === "finalizado" ? "none" : "inline-block" }}
                >
                  Actualizar
                </Button>
                {cita.estado === "finalizado" && <span style={{ color: "red", marginLeft: "10px" }}>La cita ha finalizado</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination style={{ marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i}
            active={i === page}
            onClick={() => handlePageChange(i + 1)}
            style={{ cursor: "pointer" }}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListarCitasCliente;
