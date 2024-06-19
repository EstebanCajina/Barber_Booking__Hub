import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../estilos/DatePicker.css';
import { Modal, Button } from 'react-bootstrap'; // Importar componentes para el modal



interface Cita {
  fecha: string;
  hora: string;
  estado: string;
  duracion: number;
}

interface Props {
  onCitaSeleccionada: (cita: Cita) => void;
  barberoId: number | null;
  duracionCita: number; // Nueva prop para la duración de la cita
  
}

const DatePicker: React.FC<Props> = ({ onCitaSeleccionada, barberoId, duracionCita }) => {
  const localizer = momentLocalizer(moment);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date, end: Date } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  

  useEffect(() => {
    if (barberoId) {
      fetchCitas(barberoId);
    }
  }, [barberoId]);

  const fetchCitas = (barberoId: number) => {
    axios.get(`http://localhost:1111/citas/listarPorBarberoId/${barberoId}`)
      .then(response => {
        setCitas(response.data);
      })
      .catch(error => {
        console.error('Error al obtener citas:', error);
      });
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const now = new Date();
    if (start < now) {
      setModalMessage('No puedes asignar una cita en el pasado');
      setShowModal(true);
      return;
    }
    
    const endHour = moment(start).add(duracionCita, 'minutes').toDate();
    const endOfDay = new Date(start);
    endOfDay.setHours(18, 0, 0, 0); // 6:00 PM

    if (endHour > endOfDay) {
      setModalMessage('La cita pasa el horario permitido');
      setShowModal(true);
      return;
    }

    const fecha = moment(start).format('YYYY-MM-DD');
    const hora = moment(start).format('HH:mm');
    setSelectedSlot({ start, end: endHour });

    const nuevaCita = { fecha, hora, estado: 'pendiente', duracion: duracionCita };
    onCitaSeleccionada(nuevaCita);
  };

  const startOfDay = new Date();
  startOfDay.setHours(8, 0, 0, 0); // 8:00 AM
  const endOfDay = new Date();
  endOfDay.setHours(18, 0, 0, 0); // 6:00 PM

  const events = [
    ...citas.map(cita => ({
      start: new Date(`${cita.fecha}T${cita.hora}`),
      end: new Date(moment(`${cita.fecha}T${cita.hora}`).add(cita.duracion, 'minutes').toISOString()),
      title: `Cita con duración de ${cita.duracion} minutos`,
    })),
    selectedSlot && {
      start: selectedSlot.start,
      end: selectedSlot.end,
      title: 'Nueva Cita',
      color: 'green',
    },
  ].filter(Boolean);

  const eventPropGetter = (event: any) => {
    const backgroundColor = event.color || '#3174ad'; // Default to the usual event color if no color is set
    return { style: { backgroundColor } };
  };

  return (
    <div className="date-picker" style={{ height: '400px' ,color:'#F44334'}}>
      <h2 style={{ textAlign: 'center' }}>Selecciona una fecha y hora</h2>
      <Calendar
        localizer={localizer}
        events={events as any} // Ensure TypeScript is happy with the event types
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventPropGetter}
        defaultView="week"
        views={['week', 'day']}
        step={5}
        timeslots={12}
        min={startOfDay}
        max={endOfDay}
        style={{
          backgroundColor: 'white',
          color: 'black',
        }}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Advertencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DatePicker;
