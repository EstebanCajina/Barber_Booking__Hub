import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';

const defaultTheme = createTheme();

const CarritoDeCompras = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensajeUrl, setMensajeUrl] = useState('');
    const navigate = useNavigate();

    const obtenerProductosEnCarrito = () => {
        axios.get('http://localhost:1111/carrodecompras/')
            .then(response => {
                console.log('Respuesta del servidor:', JSON.stringify(response.data, null, 2));
                const productosConCarroId = response.data.map(producto => ({
                    ...producto,
                    carroId: producto.carroId !== undefined ? producto.carroId : 0, // Asignar un valor por defecto si es undefined
                }));
                setProductos(productosConCarroId);
                setCargando(false);
            })
            .catch(error => {
                console.error('Error al obtener los productos en el carrito de compras:', error);
                setCargando(false);
            });
    };

    useEffect(() => {
        obtenerProductosEnCarrito();
    }, []);

    const handleMouseEnter = (url) => {
        setMensajeUrl(url);
    };

    const handleMouseLeave = () => {
        setMensajeUrl('');
    };

    const handleEliminarProducto = async (carroId, productoId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
            try {
                await axios.delete(`http://localhost:1111/carrodecompras/${carroId}/eliminar/${productoId}`);
                obtenerProductosEnCarrito();
                setMensajeUrl(`Eliminando producto con ID ${productoId} del carrito con ID ${carroId}`);
                setTimeout(() => {
                    setMensajeUrl('');
                }, 3000);
            } catch (error) {
                console.error('Error al eliminar el producto del carrito de compras:', error);
            }
        }
    };

    const handleProcederAlPago = () => {
        navigate('/pago');
    };

    // Calcular el subtotal
    const subtotal = productos.reduce((sum, producto) => sum + producto.precio, 0);


    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Box sx={{ height: '100vh', backgroundColor: '#121212', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Container sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: '#1e1e1e' }}>
                    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #900e11 0%, #000000 20%, #1a1a1a 80%, #900e11 100%)' }}>
                        <div style={{ padding: '10px', textAlign: 'center', color: 'white' }}>Carrito de compras</div>
                    </AppBar>

                    <TableContainer component={Paper} style={{ background: '#333' }}>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#333' }}>
                                    <TableCell>
                                    <Button variant="contained" onClick={handleProcederAlPago} style={{ backgroundColor: '#ff6666', color: 'white' }}>Proceder al Pago</Button>
                                    </TableCell>
                                    <TableCell>Producto</TableCell>
                                    <TableCell>Precio</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productos.map(producto => (
                                    <TableRow key={producto.id}>
                                        <TableCell>
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell>
                                            <img src={producto.imagenURL} alt={producto.nombre} style={{ width: '50px', marginRight: '10px' }} />
                                            {producto.nombre}
                                        </TableCell>
                                        <TableCell>${producto.precio.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                style={{ marginRight: '10px' }}
                                                onMouseEnter={() => handleMouseEnter(`Actualizar: http://localhost:1111/carrodecompras/actualizar/${producto.id}`)}
                                                onMouseLeave={handleMouseLeave}
                                                onClick={() => navigate(`/carrodecompras/actualizar/${producto.id}`)}
                                            >
                                                Actualizar
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onMouseEnter={() => handleMouseEnter(`Eliminar: http://localhost:1111/carrodecompras/${producto.carroId}/eliminar/${producto.id}`)}
                                                onMouseLeave={handleMouseLeave}
                                                onClick={() => handleEliminarProducto(producto.carroId, producto.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={2} />
                                    <TableCell><strong>Subtotal:</strong></TableCell>
                                    <TableCell><strong>${subtotal.toFixed(2)}</strong></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default CarritoDeCompras;
