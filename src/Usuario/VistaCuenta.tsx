import React, { useState, useEffect } from 'react';
import PeopleTable from '../componentes/TablaPersona';
import ActualizarUsuario from '../Usuario/ActualizarUsuario';
import axios from 'axios';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Pagination from 'react-bootstrap/Pagination';
import { Usuario } from '../tipos/Usuario';

const App: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [usuario, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (usuario && usuario.admin === '1') {
      axios.get(`http://localhost:1111/barber_shop_booking_hub/cuenta/listar?page=${page}&size=2`)
        .then(response => {
          setUsers(response.data.content);
          setTotalPages(response.data.totalPages);
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    }
  }, [page, usuario]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return (
    <div>
      <h1>People List</h1>
      <Tabs defaultActiveKey="peopleTable" id="people-tabs" className="mb-3">
        <Tab eventKey="peopleTable" title="People Table">
          {usuario && usuario.admin === '1' ? (
            <PeopleTable users={users} />
          ) : (
            usuario && <ActualizarUsuario user={usuario} />
          )}
        </Tab>
        <Tab eventKey="otherTab" title="Other Tab">
          {/* Other Tab Content */}
        </Tab>
      </Tabs>
      {usuario && usuario.admin === '1' && (
        <Pagination>
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
