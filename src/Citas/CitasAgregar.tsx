import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from '../Componentes/DatePicker';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../estilos/Appointment.css';
import moment from 'moment';

interface Cita {
  fecha: string;
  hora: string;
  estado: string;
  duracion: number;
}

interface User {
  id: number;
  nombreUsuario: string;
  admin: string;
  barbero: string;
}

interface Servicio {
  id: number;
  nombre: string;
  precioBase: number;
  duracion: number;
}

interface Usuario {
  id: number;
  nombreUsuario: string;
  admin: string;
  barbero: string;
}

interface Props {
  user?: User;
}

const AgregarCitas: React.FC<Props> = ({ user }) => {
  const [barberos, setBarberos] = useState<Usuario[]>([]);
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState<number | null>(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [conflictError, setConflictError] = useState<boolean>(false);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<number[]>([]);
  const [showDateModal, setShowDateModal] = useState<boolean>(false); // Estado para mostrar modal de advertencia de fecha

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:1111/citas/obtenerBarberos')
      .then((response) => {
        setBarberos(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los barberos:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:1111/citas/obtenerClientes')
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los clientes:', error);
      });
  }, []);

  useEffect(() => {
    const obtenerServicios = async () => {
      if (user?.barbero === '1' || barberoSeleccionado) {
        try {
          const response = await axios.get(
            `http://localhost:1111/barber_shop_booking_hub/servicio/ServiciosPorId?usuarioId=${
              user?.barbero === '1' ? user.id : barberoSeleccionado
            }`
          );
          setServicios(response.data);
        } catch (error) {
          console.error('Error al obtener los servicios:', error);
        }
      }
    };
    obtenerServicios();
  }, [user, barberoSeleccionado]);

  useEffect(() => {
    if (user?.barbero === '1') {
      fetchCitas(user.id);
    } else if (barberoSeleccionado) {
      fetchCitas(barberoSeleccionado);
    }
  }, [user, barberoSeleccionado]);

  const fetchCitas = (barberoId: number) => {
    axios
      .get(`http://localhost:1111/citas/listarPorBarberoId/${barberoId}`)
      .then((response) => {
        setCitas(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener citas:', error);
      });
  };

  const handleCitaSeleccionada = (cita: Cita) => {
    setCitaSeleccionada(cita);

    if (checkForConflict(cita, citas)) {
      setConflictError(true);
      setModalVisible(true);
    } else {
      setConflictError(false);
      setModalVisible(false);
    }
  };

  const checkForConflict = (newCita: Cita, existingCitas: Cita[]): boolean => {
    const newStart = moment(`${newCita.fecha} ${newCita.hora}`, 'YYYY-MM-DD HH:mm');
    const newEnd = newStart.clone().add(newCita.duracion, 'minutes');

    for (const cita of existingCitas) {
      const start = moment(`${cita.fecha} ${cita.hora}`, 'YYYY-MM-DD HH:mm');
      const end = start.clone().add(cita.duracion, 'minutes');

      if (newStart.isBefore(end) && newEnd.isAfter(start)) {
        return true;
      }
    }

    return false;
  };

  const handleGuardarCita = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
  
    // Verificar si citaSeleccionada.fecha es undefined
    if (!citaSeleccionada || !citaSeleccionada.fecha) {
      setShowDateModal(true);
      return;
    }
  
    if (cliente && barbero && citaSeleccionada) {
      if (checkForConflict(citaSeleccionada, citas)) {
        setConflictError(true);
        setModalVisible(true);
        return;
      }
  
      const listaIdsServicios = servicioSeleccionado.join(',');
  
      const params = new URLSearchParams({
        idBarbero: barbero.toString(),
        idCliente: cliente.toString(),
        hora: citaSeleccionada.hora,
        estado: 'pendiente',
        fecha: citaSeleccionada.fecha,
        duracion: citaSeleccionada.duracion.toString(),
        servicios: listaIdsServicios,
      }).toString();
  
      axios
        .post(`http://localhost:1111/citas/agregar?${params}`)
        .then((response) => {
          console.log('Cita agregada exitosamente:', response.data);
          navigate('/ver Citas');
        })
        .catch((error) => {
          console.error('Error al agregar la cita:', error);
        });
    } else {
      setConflictError(false);
      setModalVisible(true);
      console.error('Faltan datos para agregar la cita');
    }
  };

  const handleServicioSeleccionado = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedServiceIds = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));

    setServicioSeleccionado(selectedServiceIds);

    try {
      const response = await axios.post('http://localhost:1111/barber_shop_booking_hub/servicio/sumarDuraciones', selectedServiceIds);
      const duracionTotal: number = response.data;

      setCitaSeleccionada((prevCita: Cita | null) => ({ ...prevCita!, duracion: duracionTotal }));
    } catch (error) {
      console.error('Error al obtener la duración total de los servicios:', error);
    }
  };

  return (
    <div className="appointment-container" style={{ paddingTop: '195px', width: '100%' }}>
    <Card className="appointment-card" style={{ width: '100%' }}>
    <Card.Body className="text">
    <Card.Title>Agendar Cita</Card.Title>
    <Form onSubmit={handleGuardarCita} style={{ width: '100%' }}>
    {(user?.admin === '1' || user?.barbero === '1') && (
    <Form.Group className="mb-3 text2" controlId="clienteSelect">
    <Form.Label>Selecciona un Cliente:</Form.Label>
    <Form.Select
    value={clienteSeleccionado || ''}
    onChange={(e) => setClienteSeleccionado(parseInt(e.target.value))}
    required
    >
    <option value="" disabled>
    Seleccionar cliente
    </option>
    {clientes.map((cliente) => (
    <option key={cliente.id} value={cliente.id}>
    {cliente.nombreUsuario}
    </option>
    ))}
    </Form.Select>
    </Form.Group>
    )}
    {user?.barbero !== '1' && (
    <Form.Group className="mb-3 text2" controlId="barberoSelect">
    <Form.Label>Selecciona un Barbero:</Form.Label>
    <Form.Select
    value={barberoSeleccionado || ''}
    onChange={(e) => setBarberoSeleccionado(parseInt(e.target.value))}
    required
    >
    <option value="" disabled>
    Seleccionar barbero
    </option>
    {barberos.map((barbero) => (
    <option key={barbero.id} value={barbero.id}>
    {barbero.nombreUsuario}
    </option>
    ))}
    </Form.Select>
    </Form.Group>
    )}
    <Form.Group className="text2" controlId="servicioSelect">
    <Form.Label>Selecciona un Servicio:</Form.Label>
    <Form.Select
    value={servicioSeleccionado.map((num) => num.toString())}
    onChange={handleServicioSeleccionado}
    required
    multiple
    style={{ width: '100%', minWidth: '400px' }}
    >
    <option value="" disabled>
    Seleccionar servicio
    </option>
    {servicios.map((servicio) => (
    <option key={servicio.id} value={servicio.id}>
    {servicio.nombre} - ${servicio.precioBase} - Duración: {servicio.duracion} minutos
    </option>
    ))}
    </Form.Select>
    </Form.Group>
    
            <div className="date-picker-container" style={{ width: '100%',backgroundColor:'#1a1a1a',height:'400px' }}>
              <DatePicker
                onCitaSeleccionada={handleCitaSeleccionada}
                barberoId={user?.barbero === '1' ? user.id : barberoSeleccionado}
                duracionCita={citaSeleccionada?.duracion || 0} // Valor predeterminado de duración en caso de que citaSeleccionada sea null
              />
            </div>
            <Button type="submit" variant="primary" className="submit-btn" style={{ marginTop: '120px' }}>
              Agendar cita
            </Button>
          </Form>
        </Card.Body>
      </Card>
    
      <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {conflictError
            ? 'No se puede agregar una cita en ese intervalo de tiempo porque ya hay una cita asignada.'
            : 'No se puede agregar una cita sin seleccionar una fecha y hora antes.'}
        </Modal.Body>
      </Modal>
    
      <Modal show={showDateModal} onHide={() => setShowDateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Advertencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>Debes seleccionar una fecha y hora antes de agendar la cita.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDateModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    );
    };
    
    export default AgregarCitas;