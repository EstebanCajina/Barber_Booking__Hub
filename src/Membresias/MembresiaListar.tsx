import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const defaultTheme = createTheme();

interface Beneficio {
  id: number;
  descripcion: string;
}

interface Membresia {
  id: number;
  horaVencimiento: number[];
  tipo: string;
  precio: number;
  beneficios: Beneficio[];
}

const MembresiaList: React.FC = () => {
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [membresiaToDelete, setMembresiaToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembresias(page, pageSize);
  }, [page, pageSize]);

  const fetchMembresias = (page: number, pageSize: number) => {
    setLoading(true);
    axios.get(`http://localhost:1111/membresias/paginado?page=${page}&size=${pageSize}`)
      .then(response => {
        if (response.data) {
          setMembresias(response.data.membresias); // Actualiza con los membresias
          setTotalPages(response.data.totalPages); // Establece el total de páginas
        } else {
          console.error('Error: Response data or content is missing.', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching membresias:', error);
        setLoading(false);
      });
  };

  const handleDeleteClick = (id: number) => {
    setMembresiaToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (membresiaToDelete !== null) {
      try {
        await axios.delete(`http://localhost:1111/membresias/eliminar/${membresiaToDelete}`);
        setMembresias(prevMembresias => prevMembresias.filter(m => m.id !== membresiaToDelete));
        setDeleteModalOpen(false);
        setMembresiaToDelete(null);
      } catch (error) {
        console.error('Error al eliminar membresía:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setMembresiaToDelete(null);
  };

  const handleAgregar = () => {
    navigate('/agregar');
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', backgroundColor: '#121212', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Container sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: '#1e1e1e' }}>
          <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #900e11 0%, #000000 20%, #1a1a1a 80%, #900e11 100%)' }}>
            <div style={{ padding: '10px', textAlign: 'center', color: 'white' }}>Listar Membresias</div>
          </AppBar>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              <TableContainer component={Paper} style={{ background: '#333' }}>
                <Table>
                  <TableHead>
                    <TableRow style={{ background: 'linear-gradient(90deg, #900e11 0%, #000000 20%, #1a1a1a 80%, #900e11 100%)' }}>
                      <TableCell>
                        <Button variant="contained" style={{ backgroundColor: '#ff6666', color: 'white' }} onClick={handleAgregar}>Agregar</Button>
                      </TableCell>
                      <TableCell style={{ color: 'white' }}>Tipo</TableCell>
                      <TableCell style={{ color: 'white' }}>Precio</TableCell>
                      <TableCell style={{ color: 'white' }}>Beneficios</TableCell>
                      <TableCell style={{ color: 'white' }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {membresias && membresias.length > 0 ? (
                      membresias.map((membresia, index) => (
                        <TableRow key={membresia.id} sx={{ background: index % 2 === 0 ? '#1e1e1e' : '#2e2e2e' }}>
                          <TableCell>
                            {index + 1} {/* Mostrar el número consecutivo */}
                          </TableCell>
                          <TableCell>
                            {membresia.tipo}
                          </TableCell>
                          <TableCell>
                            ₡ {membresia.precio}
                          </TableCell>
                          <TableCell>
                            <ul>
                              {membresia.beneficios.map((beneficio, index) => (
                                <li key={index}>{beneficio.descripcion}</li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell>
                            <Button variant="contained" style={{ background: '#ff6666', marginRight: '10px', color: 'white' }} onClick={() => navigate(`/actualizar/${membresia.id}`)}>Actualizar</Button>
                            <Button variant="contained" style={{ background: '#ff6666', color: 'white' }} onClick={() => handleDeleteClick(membresia.id)}>Eliminar</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} style={{ color: 'white', textAlign: 'center' }}>
                          No se encontraron membresías.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination count={totalPages} page={page + 1} onChange={handleChangePage} color="primary" />
              </Box>
            </>
          )}
        </Container>
      </Box>
      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: '#121212', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography id="modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
            Confirmar eliminación
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2, color: 'white' }}>
            ¿Estás seguro de que deseas eliminar esta membresía?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button variant="contained" style={{ backgroundColor: '#ff6666', color: 'white', marginRight: 2 }} onClick={handleDeleteConfirm}>
              Confirmar
            </Button>
            <Button variant="contained" style={{ backgroundColor: '#ff6666', color: 'white' }} onClick={handleDeleteCancel}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}

export default MembresiaList;
