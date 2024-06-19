import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Membresia } from './Membresia';

const defaultTheme = createTheme();

const AgregarMembresia: React.FC = () => {
    const [horaVencimiento, setHoraVencimiento] = useState<string>('');
    const [tipoMembresia, setTipoMembresia] = useState<string>('');
    const [precio, setPrecio] = useState<number>(0);
    const [beneficios, setBeneficios] = useState<{ descripcion: string }[]>([]);
    const [nuevoBeneficio, setNuevoBeneficio] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleTipoMembresiaChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedTipo = event.target.value as string;
        setTipoMembresia(selectedTipo);

        switch (selectedTipo) {
            case 'Basico':
                setPrecio(10000);
                break;
            case 'Pro':
                setPrecio(20000);
                break;
            case 'Premium':
                setPrecio(30000);
                break;
            default:
                setPrecio(0);
                break;
        }
    };

    const handleAgregarBeneficio = () => {
        if (nuevoBeneficio.trim() !== '') {
            setBeneficios([...beneficios, { descripcion: nuevoBeneficio }]);
            setNuevoBeneficio('');
        }
    };

    const handleAgregarMembresia = async () => {
        try {
            if (!horaVencimiento || !tipoMembresia || precio === 0 || beneficios.length === 0) {
                setError('Todos los campos son requeridos.');
                return;
            } else {
                setError('');
            }

            const nuevaMembresia: Membresia = {
                tipo: tipoMembresia,
                precio: precio,
                horaVencimiento: horaVencimiento,
                beneficios: beneficios
            };

            await axios.post<Membresia>('http://localhost:1111/membresias/agregar', nuevaMembresia);
            navigate('/membresias');
        } catch (error) {
            console.error('Error al agregar membresía:', error);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Box sx={{ height: '100vh', backgroundColor: '#121212', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Container sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: '#1e1e1e' }}>
                    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #900e11 0%, #000000 20%, #1a1a1a 80%, #900e11 100%)' }}>
                        <div style={{ padding: '10px', textAlign: 'center', color: 'white' }}>Agregar Membresia</div>
                    </AppBar>

                    {/* Campo Hora de Vencimiento */}
                    <TextField
                        label="Hora de Vencimiento"
                        type="date"
                        value={horaVencimiento}
                        onChange={(e) => setHoraVencimiento(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!horaVencimiento}
                        helperText={!horaVencimiento ? 'Campo requerido' : ''}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: 'white' }
                        }}
                        InputProps={{
                            style: { color: 'white', backgroundColor: '#333' },
                            disableUnderline: true // Remueve la línea de subrayado
                        }}
                        sx={{
                            '& .MuiInputBase-root': {
                                '&:before': { borderBottom: 'none' },
                                '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                                '&:after': { borderBottom: 'none' },
                            }
                        }}
                    />

                    {/* Campo Tipo */}
                    <InputLabel htmlFor="tipo-membresia" sx={{ color: 'white', mt: 2 }}>Tipo</InputLabel>
                    <Select
                        id="tipo-membresia"
                        value={tipoMembresia}
                        onChange={handleTipoMembresiaChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!tipoMembresia}
                        sx={{ color: 'white' }}
                        InputProps={{
                            style: { color: 'white', backgroundColor: '#333' },
                            disableUnderline: true // Remueve la línea de subrayado
                        }}
                    >
                        <MenuItem value="Basico">Básico</MenuItem>
                        <MenuItem value="Pro">Pro</MenuItem>
                        <MenuItem value="Premium">Premium</MenuItem>
                    </Select>

                    {/* Campo Precio */}
                    <TextField
                        label="Precio"
                        value={precio}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                            style: { color: 'white', backgroundColor: '#333' },
                            disableUnderline: true // Remueve la línea de subrayado
                        }}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: 'white' }
                        }}
                    />

                    {/* Campo Nuevo Beneficio */}
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <TextField
                            label="Nuevo Beneficio"
                            value={nuevoBeneficio}
                            onChange={(e) => setNuevoBeneficio(e.target.value)}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                                style: { color: 'white' }
                            }}
                            InputProps={{
                                style: { color: 'white', backgroundColor: '#333' },
                                disableUnderline: true // Remueve la línea de subrayado
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    '&:before': { borderBottom: 'none' },
                                    '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                                    '&:after': { borderBottom: 'none' },
                                }
                            }}
                        />
                        <Button variant="contained" onClick={handleAgregarBeneficio} style={{ marginLeft: '10px', backgroundColor: '#ff6666', color: 'black' }}>Agregar Beneficio</Button>
                    </div>

                    {/* Mensaje de error */}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {/* Lista de Beneficios */}
                    <ul>
                        {beneficios.map((beneficio, index) => (
                            <li key={index} style={{ color: 'white' }}>{beneficio.descripcion}</li>
                        ))}
                    </ul>

                    {/* Botón para agregar membresía */}
                    <Button variant="contained" style={{ backgroundColor: '#ff6666', color: 'black' }} onClick={handleAgregarMembresia}>Agregar Membresía</Button>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default AgregarMembresia;
