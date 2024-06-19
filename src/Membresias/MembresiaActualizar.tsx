import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const defaultTheme = createTheme();

interface Beneficio {
    id: number;
    descripcion: string;
}

interface Membresia {
    id: number;
    tipo: string;
    precio: number;
    horaVencimiento: string;
    beneficios: Beneficio[];
}

const ActualizarMembresia: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [membresia, setMembresia] = useState<Membresia | null>(null);
    const [horaVencimiento, setHoraVencimiento] = useState<string>('');
    const [tipo, setTipo] = useState<string>('');
    const [precio, setPrecio] = useState<number>(0);
    const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
    const [nuevoBeneficio, setNuevoBeneficio] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        axios.get<Membresia>(`http://localhost:1111/membresias/${id}`)
            .then(response => {
                const { tipo, precio, horaVencimiento, beneficios } = response.data;
                setMembresia(response.data);
                setTipo(tipo);
                setPrecio(precio);
                setHoraVencimiento(horaVencimiento);
                setBeneficios(beneficios);
            })
            .catch(error => {
                console.error('Error fetching membresia details:', error);
            });
    }, [id]);

    const handleTipoChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedTipo = event.target.value as string;
        setTipo(selectedTipo);

        // Actualizar precio según el tipo seleccionado
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

    const handleActualizarBeneficio = (index: number, valor: string) => {
        const nuevosBeneficios = [...beneficios];
        nuevosBeneficios[index].descripcion = valor;
        setBeneficios(nuevosBeneficios);
    };

    const handleActualizarMembresia = async () => {
        try {
            if (!horaVencimiento || !tipo || precio === 0 || beneficios.length === 0) {
                setError('Todos los campos son requeridos.');
                return;
            } else {
                setError('');
            }

            const membresiaActualizada: Membresia = {
                ...membresia!,
                tipo: tipo,
                precio: precio,
                horaVencimiento: horaVencimiento,
                beneficios: beneficios
            };

            await axios.put(`http://localhost:1111/membresias/actualizar/${id}`, membresiaActualizada);
            navigate('/membresias');
        } catch (error) {
            console.error('Error al actualizar membresía:', error);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Box sx={{ height: '100vh', backgroundColor: '#121212', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Container sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: '#1e1e1e' }}>
                    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #900e11 0%, #000000 20%, #1a1a1a 80%, #900e11 100%)' }}>
                        <div style={{ padding: '10px', textAlign: 'center', color: 'white' }}>Actualizar Membresia</div>
                    </AppBar>

                    <TextField
                        label="Fecha de Vencimiento"
                        type="date"
                        value={horaVencimiento}
                        onChange={(e) => setHoraVencimiento(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                    />

                    <InputLabel htmlFor="tipo" style={{ color: 'white', marginTop: '20px' }}>Tipo</InputLabel>
                    <Select
                        id="tipo"
                        value={tipo}
                        onChange={handleTipoChange}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ style: { color: 'white' } }}
                        sx={{ color: 'white' }}
                    >
                        <MenuItem value="Basico">Básico</MenuItem>
                        <MenuItem value="Pro">Pro</MenuItem>
                        <MenuItem value="Premium">Premium</MenuItem>
                    </Select>

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

                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <TextField
                            label="Nuevo Beneficio"
                            value={nuevoBeneficio}
                            onChange={(e) => setNuevoBeneficio(e.target.value)}
                            margin="normal"
                            InputLabelProps={{ style: { color: 'white' } }}
                            InputProps={{ style: { color: 'white' } }}
                        />
                        <Button
                            variant="contained"
                            onClick={() => {
                                if (nuevoBeneficio.trim() !== '') {
                                    setBeneficios([...beneficios, { id: beneficios.length + 1, descripcion: nuevoBeneficio }]);
                                    setNuevoBeneficio('');
                                }
                            }}
                            style={{ marginLeft: '10px', backgroundColor: '#ff6666', color: 'white' }}
                        >
                            Agregar Beneficio
                        </Button>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <ul>
                        {beneficios.map((beneficio, index) => (
                            <li key={index} style={{ color: 'white' }}>
                                <TextField
                                    value={beneficio.descripcion}
                                    onChange={(e) => handleActualizarBeneficio(index, e.target.value)}
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{ style: { color: 'white' } }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        const nuevosBeneficios = beneficios.filter((_, i) => i !== index);
                                        setBeneficios(nuevosBeneficios);
                                    }}
                                    style={{ marginLeft: '10px', backgroundColor: '#ff6666', color: 'white' }}
                                >
                                    Eliminar
                                </Button>
                            </li>
                        ))}
                    </ul>

                    <Button
                        variant="contained"
                        onClick={handleActualizarMembresia}
                        fullWidth
                        style={{ marginTop: '20px', backgroundColor: '#ff6666', color: 'white' }}
                    >
                        Actualizar Membresía
                    </Button>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default ActualizarMembresia;
