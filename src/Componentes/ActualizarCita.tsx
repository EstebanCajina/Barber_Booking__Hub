import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Alert } from 'react-bootstrap';

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

interface Props {
  onCitaSeleccionada: (cita: Cita) => void;
  idBarbero: number;
  duracionCita: number;
  citaActualId: number | null;
}

const DatePicker: React.FC<Props> = ({
  onCitaSeleccionada,
  idBarbero,
  duracionCita,
  citaActualId,
}) => {
  const localizer = momentLocalizer(moment);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [tempEvent, setTempEvent] = useState<any | null>(null); // Event for temporary selection
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [conflictError, setConflictError] = useState<boolean>(false);
  const [horarioError, setHorarioError] = useState<boolean>(false);

  useEffect(() => {
    if (idBarbero) {
      fetchCitas(idBarbero);
    }
  }, [idBarbero]);

  const fetchCitas = (barberoId: number) => {
    axios.get(`http://localhost:1111/citas/listarPorBarberoId/${barberoId}`)
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

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(18, 0, 0, 0); // 6:00 PM

    if (start < now) {
      setModalVisible(true);
      setConflictError(false); // No hay conflicto, solo un error de fecha pasada
      setHorarioError(false);
      return;
    }

    if (start.getHours() >= 18) {
      setModalVisible(true);
      setConflictError(false);
      setHorarioError(true); // Mostrar mensaje de horario solo si es después de las 6:00 PM
      return;
    }

    const fecha = moment(start).format('YYYY-MM-DD');
    const hora = moment(start).format('HH:mm');

    const newCita: Cita = {
      id: citaActualId || 0,
      fecha,
      hora,
      estado: 'pendiente',
      duracion: duracionCita,
      idBarbero,
      idCliente: 0,
      servicios: [],
      barbero: { nombreUsuario: '' },
      cliente: { nombreUsuario: '' },
    };

    onCitaSeleccionada(newCita);

    handleDoubleClick(start);
  };

  const handleDoubleClick = (start: Date) => {
    const newCita: Cita = {
      id: citaActualId || 0,
      fecha: moment(start).format('YYYY-MM-DD'),
      hora: moment(start).format('HH:mm'),
      estado: 'pendiente',
      duracion: duracionCita,
      idBarbero,
      idCliente: 0,
      servicios: [],
      barbero: { nombreUsuario: '' },
      cliente: { nombreUsuario: '' },
    };
  
    const end = moment(start).add(duracionCita, 'minutes').toDate();
  
    // Verificar si la cita propuesta sobrepasa las 6:00 PM
    const newEndHour = moment(end).hour();
    const newEndMinute = moment(end).minute();
    if (newEndHour > 18 || (newEndHour === 18 && newEndMinute > 0)) {
      setConflictError(true);
      setHorarioError(true);
      setModalVisible(true);
      return;
    }
  
    setTempEvent({
      start,
      end,
      title: 'Cita provisional',
      color: 'red',
    });
  
    if (checkForConflict(newCita, citas)) {
      setConflictError(true);
      setModalVisible(true);
    } else {
      setConflictError(false);
      setModalVisible(false);
    }
  };
  

  const startOfDay = new Date();
  startOfDay.setHours(8, 0, 0, 0); // 8:00 AM
  const endOfDay = new Date();
  endOfDay.setHours(18, 0, 0, 0); // 6:00 PM

  const checkForConflict = (newCita: Cita, existingCitas: Cita[]): boolean => {
    const newStart = moment(`${newCita.fecha} ${newCita.hora}`, 'YYYY-MM-DD HH:mm');
    const newEnd = newStart.clone().add(newCita.duracion, 'minutes');

    for (const cita of existingCitas) {
      // Skip comparison with itself if citaActualId is defined
      if (citaActualId && cita.id === citaActualId) {
        continue;
      }

      const start = moment(`${cita.fecha} ${cita.hora}`, 'YYYY-MM-DD HH:mm');
      const end = start.clone().add(cita.duracion, 'minutes');

      if (newStart.isBefore(end) && newEnd.isAfter(start)) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="date-picker" style={{ height: '400px' }}>
      <h2 style={{ textAlign: 'center' }}>Selecciona una fecha y hora</h2>
      <Calendar
        localizer={localizer}
        events={[
          ...citas.map(cita => ({
            start: new Date(`${cita.fecha}T${cita.hora}`),
            end: new Date(moment(`${cita.fecha}T${cita.hora}`).add(cita.duracion, 'minutes').toISOString()),
            title: `Cita con duración de ${cita.duracion} minutos`,
            color: cita.id === citaActualId ? 'yellow' : 'blue',
          })),
          ...(tempEvent ? [tempEvent] : [])
        ]}
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView="week"
        views={['week', 'day']}
        step={5}
        timeslots={12}
        min={startOfDay}
        max={endOfDay}
        eventPropGetter={(event) => {
          const backgroundColor = event.color;
          return { style: { backgroundColor } };
        }}
      />

      <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {horarioError ?
            <Alert variant="danger">
              La cita sobrepasa nuestro horario de atención (6:00 PM). Por favor, selecciona un horario válido dentro de nuestro horario de trabajo.
            </Alert>
            :
            conflictError ?
              "No se puede agregar una cita en ese intervalo de tiempo porque ya hay una cita asignada." :
              "No se puede agregar una cita sin seleccionar una fecha y hora antes."
          }
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DatePicker;
