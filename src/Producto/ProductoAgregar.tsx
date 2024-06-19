import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import ImageUploader from '../Componentes/CargarImagen';
import { useNavigate } from 'react-router-dom';
import { Producto, Categoria, Imagen } from './Productos'; // Importa las interfaces

const ariaLabel = { 'aria-label': 'description' };



const Agregar: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagen, setImage] = useState<string | null>(null);
  const [producto, setProducto] = useState<Producto>({} as Producto);
  const [imagenesSecundarias, setImagenesSecundarias] = useState<Imagen[]>([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [availableCategorias, setAvailableCategorias] = useState<Categoria[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:1111/categorias/listar')
      .then(response => {
        setAvailableCategorias(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

  const handleImageSelect = (files: File[]) => {
    setSelectedImage(files[0] || null);
    setImage(files[0]?.name || null);
    console.log('Imagen principal seleccionada en Agregar:', files[0]?.name);
  };

  const handleImagenesSecundariasSelect = (files: File[]) => {
    const nuevasImagenes: Imagen[] = files.map(file => ({ id: 0, url: file.name, idProducto: producto.id }));
    setImagenesSecundarias(prevImagenes => [...prevImagenes, ...nuevasImagenes]);
  };
  
  const eliminarImagenSecundaria = (index: number) => {
    const nuevasImagenesSecundarias = [...imagenesSecundarias];
    nuevasImagenesSecundarias.splice(index, 1);
    setImagenesSecundarias(nuevasImagenesSecundarias);
  };
  
  const handleCategoriaChange = (event: SelectChangeEvent<number[]>, child: React.ReactNode) => {
    const selectedCategoriaIds = event.target.value as number[];
    const selectedCategorias: Categoria[] = selectedCategoriaIds.map(id => {
      const categoria = availableCategorias.find(c => c.id === id);
      if (categoria) return categoria;
      return {} as Categoria;
    });
    setCategorias(selectedCategorias);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedImage) {
      setModalMessage('Por favor, Ingrese una imagen');
      setModalOpen(true);
      return;
    }

    const addBaseUrlIfNeeded = (url: string) => {
      const baseUrl = 'http://localhost:1111/uploads/producto/';
      return url.startsWith(baseUrl) ? url : baseUrl + url;
    };

    const nuevoProducto = {
      nombre,
      precio: parseFloat(precio),
      descripcion,
      stock: parseInt(stock),
      disponible,
      imagenURL: imagenesSecundarias.length > 0 ? addBaseUrlIfNeeded(imagenesSecundarias[0].url) : null,
      categorias: categorias.map(categoria => categoria.id),
      imagenesSecundarias: imagenesSecundarias.map(imagen => `http://localhost:1111/uploads/producto/${imagen.url}`)
    };

    console.log("Datos enviados al backend:");
    console.log(`Nombre: ${nombre}, Tipo: ${typeof nombre}`);
    console.log(`Precio: ${precio}, Tipo: ${typeof precio}`);
    console.log(`Descripción: ${descripcion}, Tipo: ${typeof descripcion}`);
    console.log(`Stock: ${stock}, Tipo: ${typeof stock}`);
    console.log(`Disponible: ${disponible ? 's' : 'n'}, Tipo: ${typeof disponible}`);
    console.log("Categorías:", categorias);
    console.log(`Imagen principal: ${selectedImage?.name}, Tipo: ${typeof selectedImage?.name}`);
    console.log("Imágenes secundarias:", imagenesSecundarias.map(file => file));

    const queryString = Object.keys(nuevoProducto)
      .map(key => {
        const value = (nuevoProducto as any)[key];
        if (Array.isArray(value)) {
          return value.map(val => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');

    axios.post(`http://localhost:1111/productos/guardarProducto?${queryString}`, null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then((response) => {
      console.log("Producto guardado exitosamente:", response.data);
      navigate("/productos");
    })
    .catch((error) => {
      console.error("Error al guardar el producto:", error);
    });
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '120vh',
      backgroundColor: '#1a1a1a',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={{
        position: 'relative',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '20px',
        width: '700px',
        backgroundColor: '#2c2c2c',
      }}>
        <form onSubmit={handleSubmit}>
          <label style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            color: '#F44334',
            zIndex: 1,
          }}>Ingresar Producto</label>
  
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            marginTop: '40px',
          }}>
            <ImageUploader
              onImageSelect={handleImageSelect}
              onFilesSelect={handleImagenesSecundariasSelect}
              initialImages={imagenesSecundarias?.length > 0 ? imagenesSecundarias.map(imagen => `http://localhost:1111/uploads/producto/${imagen.url}`) : []}
              eliminarImagenSecundaria={eliminarImagenSecundaria} // Paso de la función
            />
            {selectedImage ? null : <span style={{ color: 'red' }}>Seleccione una imagen</span>}
          </div>
  
          <div style={{ marginBottom: '20px', marginTop: '40px' }}>
            <label style={{ marginRight: '10px', color: '#9AAEB8' }}> Nombre :</label>
            <Input
              name="nombre"
              value={nombre}
              required
              onChange={(e) => {
                let inputValue = e.target.value;
                // Eliminar espacios en blanco al principio
                if (inputValue.length > 0 && inputValue[0] === ' ') {
                  inputValue = inputValue.trimStart();
                }
                // Expresión regular para validar que el nombre solo contenga letras y espacios
                const regex = /^[a-zA-Z\s]*$/;
                if (regex.test(inputValue)) {
                  setNombre(inputValue);
                }
              }}
              placeholder="nombre"
              inputProps={{
                ...ariaLabel,
                style: { color: '#9AAEB8' },
              }}
              style={{ color: '#9AAEB8' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '10px', color: '#9AAEB8' }}> Precio :</label>
            <Input
              name="precio"
              type="number"
              value={precio}
              required
              onChange={(e) => {
                const inputPrecio = e.target.value;
                if (inputPrecio === "" || parseFloat(inputPrecio) >= 0) {
                  setPrecio(inputPrecio);
                }
              }}
              placeholder="1500"
              inputProps={{
                ...ariaLabel,
                style: { color: '#9AAEB8' },
              }}
              style={{ color: '#9AAEB8' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#9AAEB8' }}> Categorias :</label>
            <Select
              name="categorias"
              multiple
              value={categorias.map(categoria => categoria.id)}
              onChange={handleCategoriaChange}
              input={<Input style={{ color: '#9AAEB8' }} />}
              renderValue={(selected) =>
                (selected as number[]).map(id => availableCategorias.find(c => c.id === id)?.nombre).join(', ')
              }
              sx={{ width: '150px', color: '#9AAEB8' }}
              required
            >
              {availableCategorias.map(categoria => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  <Checkbox checked={categorias.some(c => c.id === categoria.id)} />
                  {categoria.nombre}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div style={{ marginBottom: '20px', marginTop: '150px' }}>
            <Box component="div" sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}>
              <TextField
                id="outlined-textarea"
                label="Descripción"
                placeholder="Placeholder"
                multiline
                value={descripcion}
                required
                onChange={(e) => {
                  let inputValue = e.target.value;
                  // Eliminar espacios en blanco al principio
                  if (inputValue.length > 0 && inputValue[0] === ' ') {
                    inputValue = inputValue.trimStart();
                  }
                  // Expresión regular para validar que la descripción solo contenga palabras, espacios, la letra "ñ" y la tilde
                  const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
                  if (regex.test(inputValue)) {
                    setDescripcion(inputValue);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace') {
                    // Permitir la eliminación del último carácter
                    return;
                  }
                }}
                InputLabelProps={{
                  style: { color: '#9AAEB8' }
                }}
                inputProps={{
                  style: { color: '#9AAEB8' }
                }}
              />
            </Box>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '10px', color: '#9AAEB8' }}> Stock :</label>
            <Input
              type='number'
              value={stock}
              onChange={(e) => {
                const inputStock = e.target.value;
                if (inputStock === "" || parseFloat(inputStock) >= 0) {
                  setStock(inputStock);
                }
              }}
              placeholder="1500"
              inputProps={{ ...ariaLabel, required: true, min: 0, style: { color: '##9AAEB8' } }}
              style={{ color: '#9AAEB8' }}
            />
          </div>
          <div style={{ marginBottom: '20px', color: '#9AAEB8' }}>
            <Checkbox checked={disponible} onChange={(e) => setDisponible(e.target.checked)} {...ariaLabel} />
            Disponible
          </div>
  
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" variant="contained" color="primary">
              Agregar
            </Button>
          </div>
        </form>
  
        <Modal
          open={modalOpen}
          onClose={closeModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography id="modal-title" variant="h6" component="h2" style={{ color: '##9AAEB8' }}>
              Información
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }} style={{ color: '##9AAEB8' }}>
              {modalMessage}
            </Typography>
            <Button onClick={closeModal} variant="contained" color="primary" sx={{ mt: 2 }}>
              Cerrar
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Agregar;
