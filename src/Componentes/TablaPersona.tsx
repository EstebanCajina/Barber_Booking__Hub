import React, { useState, useEffect } from 'react';
import ActualizarUsuario from '../Usuario/ActualizarUsuario';
import axios from 'axios';
import { Usuario } from '../tipos/Usuario';
import { Modal, Button } from 'react-bootstrap';

interface Props {
  users: Usuario[];
}

const PeopleTable: React.FC<Props> = ({ users }: Props) => {
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [showSelfDeleteModal, setShowSelfDeleteModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser) as Usuario);
    }
  }, []);

  const handleUpdateClick = (user: Usuario) => {
    setSelectedUser(currentSelectedUser => {
      if (currentSelectedUser && currentSelectedUser.id === user.id) {
        return null;
      }
      return user;
    });
  };

  const handleShowModal = (id: number) => {
    if (loggedInUser && loggedInUser.id === id) {
      setShowSelfDeleteModal(true);
      return;
    }
    setUserIdToDelete(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUserIdToDelete(null);
  };

  const handleCloseSelfDeleteModal = () => {
    setShowSelfDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (userIdToDelete !== null) {
      try {
        await axios.get(`http://localhost:1111/barber_shop_booking_hub/cuenta/eliminar?id=${userIdToDelete}`);
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
      handleCloseModal();
    }
  };

  const handleAdminToggle = async (user: Usuario) => {
    const newAdminStatus = user.admin === '1' ? '0' : '1';
    try {
      const response = await axios.post(`http://localhost:1111/barber_shop_booking_hub/cuenta/actualizarAdmin`, null, {
        params: {
          id: user.id,
          admin: newAdminStatus,
        },
      });
      const updatedUser = response.data;
      if (loggedInUser && loggedInUser.id === user.id) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setLoggedInUser(updatedUser);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar el estado de administrador:', error);
    }
  };

  const handleBarberToggle = async (user: Usuario) => {
    const newBarberStatus = user.barbero === '1' ? '0' : '1';
    try {
      const response = await axios.post(`http://localhost:1111/barber_shop_booking_hub/cuenta/actualizarBarbero`, null, {
        params: {
          id: user.id,
          barbero: newBarberStatus,
        },
      });
      const updatedUser = response.data;
      if (loggedInUser && loggedInUser.id === user.id) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setLoggedInUser(updatedUser);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar el estado de barbero:', error);
    }
  };

  return (
    <div>
      {users.length === 0 ? (
        <p>No hay usuarios disponibles</p>
      ) : (
        <table className="table table-striped table-bordered border-info">
          <thead className="table-dark">
            <tr>
              <th>Número</th>
              <th>Nombre Usuario</th>
              <th>Cédula</th>
              <th>Admin</th>
              <th>Barbero</th>
              <th>Correo Electrónico</th>
              <th>Número Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.nombreUsuario}</td>
                <td>{user.cedula}</td>
                <td>
                  <button
                    className={`btn btn-${user.admin === '1' ? 'success' : 'secondary'} btn-sm`}
                    onClick={() => handleAdminToggle(user)}
                  >
                    {user.admin === '1' ? 'Administrador' : 'No Administrador'}
                  </button>
                </td>
                <td>
                  <button
                    className={`btn btn-${user.barbero === '1' ? 'success' : 'secondary'} btn-sm`}
                    onClick={() => handleBarberToggle(user)}
                  >
                    {user.barbero === '1' ? 'Barbero' : 'No Barbero'}
                  </button>
                </td>
                <td>{user.correoElectronico}</td>
                <td>{user.numeroTelefono}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-1"
                    onClick={() => handleUpdateClick(user)}
                  >
                    Actualizar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleShowModal(user.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedUser && <ActualizarUsuario key={selectedUser.id} user={selectedUser} />}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este usuario?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSelfDeleteModal} onHide={handleCloseSelfDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Acción no Permitida</Modal.Title>
        </Modal.Header>
        <Modal.Body>No puedes eliminar tu propio usuario.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSelfDeleteModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PeopleTable;