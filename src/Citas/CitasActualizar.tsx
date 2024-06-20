import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../estilos/Appointment.css';
import moment from 'moment';

import DatePicker from '../Componentes/ActualizarCita';

interface Servicio {
  id: number;
  nombre: string;
  precioBase: number;
  duracion: number;
}

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  duracion: number;
  idBarbero: number;
  idCliente: number;
  servicios: Servicio[];
  barbero: { nombreUsuario: string };
  cliente: { nombreUsuario: string };
}

interface User {
  id: number;
  nombreUsuario: string;
  admin: string;
  barbero: string;
}

interface Props {
  user?: User;
}

const ActualizarCitas: React.FC<Props> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [barberoSeleccionado, setBarberoSeleccionado] = useState<number | null>(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [barbero, setBarbero] = useState<User | null>(null);
  const [servicio, setServicio] = useState<Servicio[] | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<number[]>([]);
  const [idCita, setIdCita] = useState<number | null>(null);
  const [conflictError, setConflictError] = useState<boolean>(false);
  const [pastDateError, setPastDateError] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Cargar la cita seleccionada por su ID
    if (id) {
      axios.get(`http://localhost:1111/citas/obtenerCitasPorId?id=${id}`)
        .then(response => {
          const cita = response.data;
          setCitaSeleccionada(cita);
          setClienteSeleccionado(cita.cliente.id);
          setBarberoSeleccionado(cita.barbero.id);
          setServicio(cita.servicios);
          setBarbero(cita.barbero);
          setServicioSeleccionado(cita.servicios.map((servicio: Servicio) => servicio.id));
          setIdCita(parseInt(id));
        })
        .catch(error => {
          console.error("Error al obtener la cita:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    // Obtener la lista de citas del barbero una sola vez al cargar
    if (citaSeleccionada && citaSeleccionada.idBarbero) {
      fetchCitas(citaSeleccionada.idBarbero);
    }
  }, [citaSeleccionada]);

  const fetchCitas = (barberoId: number) => {
    axios
      .get(`http://localhost:1111/citas/listarPorBarberoId/${barberoId}`)
      .then(response => {
        const citasConIdCorrecto = response.data.map((cita: any) => ({
          id: cita.idCita,
          fecha: cita.fecha,
          hora: cita.hora,
          estado: cita.estado,
          duracion: cita.duracion,
          idBarbero: cita.barbero.id,
          idCliente: cita.cliente.id,
          servicios: cita.servicios,
          barbero: { nombreUsuario: cita.barbero.nombreUsuario },
          cliente: { nombreUsuario: cita.cliente.nombreUsuario }
        }));

        setCitas(citasConIdCorrecto);
      })
      .catch(error => {
        console.error('Error al obtener citas:', error);
      });
  };

  const handleCitaSeleccionada = (cita: Cita) => {
    setCitaSeleccionada(cita);
    if (checkForConflict(cita, citas)) {
      setConflictError(true);
    } else {
      setConflictError(false);
    }
    if (checkForPastDate(cita)) {
      setPastDateError(true);
    } else {
      setPastDateError(false);
    }
  };

  const checkForConflict = (newCita: Cita, existingCitas: Cita[]): boolean => {
    const newStart = moment(`${newCita.fecha} ${newCita.hora}`, 'YYYY-MM-DD HH:mm');
    const newEnd = newStart.clone().add(newCita.duracion, 'minutes');

    for (const cita of existingCitas) {
      // Excluir la propia cita si las IDs son iguales
      if (newCita.id === cita.id) {
        continue; // Saltar esta iteración y pasar a la siguiente cita
      }

      const start = moment(`${cita.fecha} ${cita.hora}`, 'YYYY-MM-DD HH:mm');
      const end = start.clone().add(cita.duracion, 'minutes');

      if (newStart.isBefore(end) && newEnd.isAfter(start)) {
        return true; // Hay conflicto con esta cita
      }
    }

    return false; // No hay conflictos
  };

  const checkForPastDate = (cita: Cita): boolean => {
    const now = moment();
    const citaDateTime = moment(`${cita.fecha} ${cita.hora}`, 'YYYY-MM-DD HH:mm');
    return citaDateTime.isBefore(now); // Retorna true si la cita está en el pasado
  };

  const handleGuardarCita = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowModal(true);
  };

  const confirmGuardarCita = () => {
    let cliente: number | null = null;
    let barbero: number | null = null;

    if (user) {
      if (user.admin === '1' || user.barbero === '1') {
        cliente = clienteSeleccionado;
        if (user.barbero === '1') {
          barbero = user.id;
        } else {
          barbero = barberoSeleccionado;
        }
      } else {
        cliente = user.id;
        barbero = barberoSeleccionado;
      }
    }

    if (cliente && barbero && citaSeleccionada) {
      if (checkForConflict(citaSeleccionada, citas)) {
        setConflictError(true);
        setShowModal(false);
        return;
      }

      if (checkForPastDate(citaSeleccionada)) {
        setPastDateError(true);
        setShowModal(false);
        return;
      }

      const listaIdsServicios = servicioSeleccionado.join(',');

      const params = new URLSearchParams({
        idBarbero: barbero.toString(),
        idCliente: cliente.toString(),
        hora: citaSeleccionada.hora,
        estado: "pendiente",
        fecha: citaSeleccionada.fecha,
        duracion: citaSeleccionada.duracion.toString(),
        servicios: JSON.stringify(listaIdsServicios)
      }).toString();

      axios.put(`http://localhost:1111/citas/actualizar/${id}?${params}`)
        .then((response) => {
          console.log("Cita actualizada exitosamente:", response.data);
          navigate("/ver Citas");
        })
        .catch((error) => {
          console.error("Error al actualizar la cita:", error);
        });
    } else {
      console.error("Faltan datos para actualizar la cita");
    }
    setShowModal(false);
  };

  const cancelGuardarCita = () => {
    setShowModal(false);
  };

  return (
    <div className="appointment-container" style={{ paddingTop: '370px', width: '100%' }}>
      <Card className="appointment-card" style={{ width: '100%' }}>
        <Card.Body>
          <Card.Title className="text">Actualizar Cita</Card.Title>
          <Form onSubmit={handleGuardarCita} style={{ width: '100%' }}>
            {citaSeleccionada && (
              <Form.Group className="mb-3 text2" controlId="barberoSelect">
                <Form.Label>Barbero:</Form.Label>
                <Form.Control
                  type="text"
                  value={barbero?.nombreUsuario}
                  readOnly
                />
              </Form.Group>
            )}

            {citaSeleccionada && (
              <Form.Group className='text2' controlId="servicioSelect">
                <Form.Label>Servicios:</Form.Label>
                <Form.Control
                  as="select"
                  value={servicioSeleccionado.map(num => num.toString())}
                  readOnly
                  multiple
                >
                  {servicio?.map((servicio) => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre} - ${servicio.precioBase} - Duración: {servicio.duracion} minutos
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            <div className="date-picker-container" style={{ width: '100%' }}>
              <DatePicker
                onCitaSeleccionada={handleCitaSeleccionada}
                idBarbero={barberoSeleccionado || 0}
                duracionCita={citaSeleccionada?.duracion || 0}
                citaActualId={idCita}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="submit-btn"
              style={{ marginTop: '40px' }}
              disabled={conflictError || pastDateError || !citaSeleccionada}
            >
              Actualizar cita
            </Button>
            {pastDateError && (
              <p className="error-text" style={{ color: 'red', marginTop: '10px' }}>
                No se puede actualizar la cita a una fecha o hora en el pasado.
              </p>
            )}
          </Form>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={cancelGuardarCita}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Actualización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que quieres guardar la cita el día {citaSeleccionada?.fecha} a las {citaSeleccionada?.hora}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelGuardarCita}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmGuardarCita}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActualizarCitas;
