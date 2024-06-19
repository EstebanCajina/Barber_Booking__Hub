import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import ImageUploader from '../Componentes/CargarImagen';
import { useNavigate, useParams } from 'react-router-dom';
import { Producto, Categoria, Imagen } from './Productos';

const ariaLabel = { 'aria-label': 'description' };

const Editar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  useEffect(() => {
    axios.get('http://localhost:1111/categorias/listar')
      .then(response => {
        setAvailableCategorias(response.data);
      })
      .catch(error => {
        console.error("Hubo un error al obtener las categorías:", error);
      });
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:1111/productos/actualizar?id=${id}`)
        .then(response => {
          const productoData = response.data;

          setProducto(productoData);
          setNombre(productoData.nombre);
          setPrecio(productoData.precio.toString());
          setDescripcion(productoData.descripcion);
          setStock(productoData.stocks.toString());
          setDisponible(productoData.disponible === 's');
          setImage(productoData.imagenURL);
          setImagenesSecundarias(productoData.imagenesSecundarias);
          setCategorias(productoData.categorias);
        })
        .catch(error => {
          console.error("Hubo un error al obtener el producto:", error);
        });
    }
  }, [id]);

  const handleImageSelect = (files: File[]) => {
    setSelectedImage(files[0] || null);
    setImage(files[0]?.name || null);
  };

  const handleImagenesSecundariasSelect = (files: File[]) => {
    const imagenesSecundariasActualizadas = [...imagenesSecundarias];
  
    files.forEach((file, index) => {
      const nuevaImagen: Imagen = {
        id: index + 1,
        url: file.name,
        idProducto: producto.id
      };
  
      const existe = imagenesSecundariasActualizadas.some(img => img.url === nuevaImagen.url);
  
      if (!existe) {
        imagenesSecundariasActualizadas.push(nuevaImagen);
      }
    });
  
    if (files.length > 0) {
      setSelectedImage(files[0]);
      setImage(files[0].name);
    }
  
    setImagenesSecundarias(imagenesSecundariasActualizadas);
  };

  const eliminarImagenSecundaria = (index: number) => {
    const nuevasImagenesSecundarias = [...imagenesSecundarias];
    nuevasImagenesSecundarias.splice(index, 1);
    setImagenesSecundarias(nuevasImagenesSecundarias);
  };

  const handleCategoriaChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedCategoriaIds = event.target.value as number[];
    const selectedCategorias = availableCategorias.filter(categoria => selectedCategoriaIds.includes(categoria.id));
    setCategorias(selectedCategorias);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openModal();
  };

  const handleConfirmSubmit = () => {
    if (imagenesSecundarias.length === 0) {
      alert("Debes agregar al menos una imagen en el carrusel.");
      return;
    }
    const addBaseUrlIfNeeded = (url: string) => {
      const baseUrl = 'http://localhost:1111/uploads/producto/';
      return url.startsWith(baseUrl) ? url : baseUrl + url;
    };
  
    const queryParams = {
      id: id,
      nombre: nombre,
      precio: precio,
      descripcion: descripcion,
      stock: stock,
      disponible: disponible ? 's' : 'n',
      imagenURL: imagenesSecundarias.length > 0 ? addBaseUrlIfNeeded(imagenesSecundarias[0].url) : null,
      imagenesSecundarias: imagenesSecundarias.map(imagen => addBaseUrlIfNeeded(imagen.url)).join(','),
      categorias: categorias.map(categoria => categoria.id).join(',')
    };
  
    const queryString = Object.keys(queryParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
  
    axios.put(`http://localhost:1111/productos/guardarProductoActualizado?${queryString}`)
      .then((response) => {
        console.log("Producto guardado exitosamente:", response.data);
        navigate("/productos");
      })
      .catch((error) => {
        console.error("Error al guardar el producto:", error);
      });

    closeModal();
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
        <label style={{
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '24px',
        color: '#F44334',
        zIndex: 1,
      }}>Editar Producto</label>

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        marginTop: '40px',
      }}>
        <ImageUploader
          onImageSelect={handleImagenesSecundariasSelect}
          onFilesSelect={handleImagenesSecundariasSelect}
          initialImages={imagenesSecundarias.map(imagen => {
            const url = imagen.url.startsWith('http://localhost:1111/uploads/producto/') ? imagen.url : `http://localhost:1111/uploads/producto/${imagen.url}`;
            return url;
          })}
          eliminarImagenSecundaria={eliminarImagenSecundaria}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px', marginTop: '40px' }}>
          <label style={{ marginRight: '10px', color: '#9AAEB8' }}> Nombre :</label>
          <Input
            name="nombre"
            value={nombre}
            required
            onChange={(e) => {
              let inputValue = e.target.value;
              if (inputValue.length > 0 && inputValue[0] === ' ') {
                inputValue = inputValue.trimStart();
              }
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
          <label style={{ color: '#9AAEB8' }}> Categorías :</label>
          <Select
            name="categorias"
            multiple
            value={categorias.map(categoria => categoria.id)}
            onChange={handleCategoriaChange}
            input={<Input style={{ color: '#9AAEB8' }} />}
            renderValue={(selected) => (selected as number[]).map(id => availableCategorias.find(c => c.id === id)?.nombre).join(', ')}
            sx={{ width: '150px', color: '#9AAEB8' }}
            required
          >
            {availableCategorias.map(categoria => (
              <MenuItem key={categoria.id} value={categoria.id}>
                <Checkbox checked={categorias.map(c => c.id).includes(categoria.id)} />
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
                if (inputValue.length > 0 && inputValue[0] === ' ') {
                  inputValue = inputValue.trimStart();
                }
                const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
                if (regex.test(inputValue)) {
                  setDescripcion(inputValue);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace') {
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
            inputProps={{ ...ariaLabel, required: true, min: 0, style: { color: '#9AAEB8' } }}
            style={{ color: '#F44334' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px', color: '#9AAEB8' }}> Disponible :</label>
          <Checkbox name="disponible" checked={disponible} onChange={(e) => setDisponible(e.target.checked)} />
        </div>
        <Button type="submit" variant="contained" color="primary">Guardar</Button>
      </form>
    </div>

    <Modal
      open={modalOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: '#F44334' }}>
          Confirmar Actualización
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{ color: '#F44334' }}>
          ¿Estás seguro de que quieres actualizar el producto?
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={closeModal} sx={{ mr: 2 }}>Cancelar</Button>
          <Button onClick={handleConfirmSubmit} variant="contained" color="primary">Confirmar</Button>
        </Box>
      </Box>
    </Modal>
  </div>
);};

export default Editar;
