import React, { useState, useEffect } from 'react';
import PeopleTable from '../componentes/TablaPersona';
import ActualizarUsuario from '../Usuario/ActualizarUsuario';
import axios from 'axios';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Usuario } from '../tipos/Usuario';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [usuario, setUser] = useState<Usuario | null>(null);
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (usuario && usuario.admin === '1') {
      if (isFiltering && nombreBusqueda) {
        axios.get(`http://localhost:1111/barber_shop_booking_hub/cuenta/buscar?nombre=${nombreBusqueda}&page=${page}&size=2`)
          .then(response => {
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
          })
          .catch(error => {
            console.error('Error fetching users:', error);
          });
      } else {
        axios.get(`http://localhost:1111/barber_shop_booking_hub/cuenta/listar?page=${page}&size=2`)
          .then(response => {
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
          })
          .catch(error => {
            console.error('Error fetching users:', error);
          });
      }
    }
  }, [page, usuario, isFiltering, nombreBusqueda]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNombreBusqueda(event.target.value);
  };

  const handleSearch = () => {
    setIsFiltering(true);
    setPage(0); // Reset to the first page
  };

  const handleShowAll = () => {
    setIsFiltering(false);
    setNombreBusqueda('');
    setPage(0); // Reset to the first page
  };

  return (
    <div className="" style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',  // Ajusta el tamaño mínimo del contenedor si es necesario
      padding: '20px',     // Añade un poco de espacio interno
    }}>
      <h1 className="text-center text-light">Usuarios</h1>
      
      <Tabs defaultActiveKey="peopleTable" id="people-tabs" className="mb-3">
        <Tab eventKey="peopleTable" title="Personas">
          {usuario && usuario.admin === '1' ? (
            <div>
              <Form className="d-flex mb-3">
                <Form.Control 
                  type="text" 
                  value={nombreBusqueda} 
                  onChange={handleSearchChange} 
                  placeholder="Buscar por nombre" 
                  className="me-2"
                />
                <Button variant="danger" onClick={handleSearch} className="me-2">Buscar</Button>
                <Button variant="primary" onClick={handleShowAll}>Mostrar todos</Button>
              </Form>
              <PeopleTable users={users} />
            </div>
          ) : (
            usuario && <ActualizarUsuario user={usuario} />
          )}
        </Tab>
      </Tabs>
      {usuario && usuario.admin === '1' && (
        <Pagination className="justify-content-center ">
          {Array.from(Array(totalPages), (_, index) => (
            <Pagination.Item key={index} active={index === page} onClick={() => handlePageChange(index)}>
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
}

export default App;
