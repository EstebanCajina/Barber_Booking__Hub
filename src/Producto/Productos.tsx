import React, { Component } from 'react';
import axios from 'axios';
import './Productos.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Imagen {
  id: number;
  url: string;
  idProducto: number;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  disponible: boolean;
  imagenURL: string;
  imagenesSecundarias: Imagen[];
  categorias: Categoria[];
}

interface User {
  id: number;
  nombreUsuario: string;
  cedula: string;
  contrasena: string;
  estado: string;
  admin: string;
  barbero: string;
  correoElectronico: string;
  numeroTelefono: string;
  imagen: string;
}

interface ProductosState {
  productos: Producto[];
  productoSeleccionado: Producto | null;
  categorias: Categoria[];
  categoriaSeleccionada: string;
  alertaVisible: boolean;
  currentPage: number;
  totalPages: number;
  modalOpen: boolean;
  productoAEliminar: Producto | null;
  nombreBusqueda: string;
}

interface ProductosProps {
  user?: User;
}

class Productos extends Component<ProductosProps, ProductosState> {
  constructor(props: ProductosProps) {
    super(props);
    this.state = {
      productos: [],
      categorias: [],
      categoriaSeleccionada: '',
      productoSeleccionado: null,
      alertaVisible: false,
      currentPage: 1,
      totalPages: 0,
      modalOpen: false,
      productoAEliminar: null,
      nombreBusqueda: '',
    };
  }

  componentDidMount() {
    this.fetchProductos();
    this.fetchCategorias();
  }

  fetchProductos = () => {
    const { currentPage } = this.state;
    axios.get(`http://localhost:1111/productos/listar?page=${currentPage - 1}&size=1`)
      .then(response => {
        console.log('Datos recibidos del backend:', response.data);
        this.setState({ productos: response.data.content, totalPages: response.data.totalPages });
      })
      .catch(error => {
        console.error('Error fetching productos:', error);
      });
  }

  fetchCategorias = () => {
    axios.get(`http://localhost:1111/categorias/listar`)
      .then(response => {
        this.setState({ categorias: response.data });
      })
      .catch(error => {
        console.error('Error fetching categorias:', error);
      });
  }

  fetchProductosPorNombre = () => {
    const { currentPage, nombreBusqueda } = this.state;
    axios.get(`http://localhost:1111/productos/buscarPorNombre?nombre=${nombreBusqueda}&page=${currentPage - 1}&size=15`)
      .then(response => {
        console.log('Datos recibidos del backend:', response.data);
        this.setState({ productos: response.data.content, totalPages: response.data.totalPages });
      })
      .catch(error => {
        console.error('Error fetching productos:', error);
      });
  }

  fetchProductosPorCategoria = () => {
    const { currentPage, categoriaSeleccionada } = this.state;
    axios.get(`http://localhost:1111/productos/buscarPorCategoria?categoria=${categoriaSeleccionada}&page=${currentPage - 1}&size=15`)
      .then(response => {
        console.log('Datos recibidos del backend:', response.data);
        this.setState({ productos: response.data.content, totalPages: response.data.totalPages });
      })
      .catch(error => {
        console.error('Error fetching productos:', error);
      });
  }

  handleCategoriaChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({ categoriaSeleccionada: event.target.value as string }, this.fetchProductosPorCategoria);
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ nombreBusqueda: event.target.value });
  }

  handleBuscar = () => {
    this.fetchProductosPorNombre();
  }

  handleMostrarTodos = () => {
    this.setState({ nombreBusqueda: '', categoriaSeleccionada: '' }, this.fetchProductos);
  }

  handleOpenModal = (producto: Producto) => {
    this.setState({ modalOpen: true, productoAEliminar: producto });
  }

  handleCloseModal = () => {
    this.setState({ modalOpen: false, productoAEliminar: null });
  }

  eliminarProducto = () => {
    const { productoAEliminar } = this.state;
    if (productoAEliminar) {
      axios.delete(`http://localhost:1111/productos/eliminar?id=${productoAEliminar.id}`)
        .then(response => {
          console.log('Producto eliminado exitosamente');
          this.fetchProductos();
          this.handleCloseModal();
        })
        .catch(error => {
          console.error('Error al eliminar el producto:', error);
        });
    }
  }

  mostrarProductoDetalle = (producto: Producto) => {
    this.setState({ productoSeleccionado: producto });
  }

  cerrarProductoDetalle = () => {
    this.setState({ productoSeleccionado: null });
  }

  agregarAlCarrito = (nombreProducto: string) => {
    this.setState({ alertaVisible: true });
    setTimeout(() => {
      this.setState({ alertaVisible: false });
    }, 5000);
  }

  handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    this.setState({ currentPage: value }, this.fetchProductos);
  }

  render() {
    const { productos, categorias, categoriaSeleccionada, productoSeleccionado, alertaVisible, currentPage, totalPages, modalOpen, productoAEliminar, nombreBusqueda } = this.state;
    const { user } = this.props;

    const BarberoId = user ? user.barbero : null;
    const AdminId = user ? user.admin : null;

    return (
      <div style={{ backgroundColor: '#1a1a1a', color: 'white', textAlign: 'center', padding: '5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          {(BarberoId !== '0' || AdminId !== '0') && (
            <Link to={`/productos/agregar`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <AddIcon />
              Agregar producto
            </Link>
          )}
        </div>
        <h1>Listado de Productos</h1>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>


        <FormControl variant="outlined" style={{ marginLeft: '20px', minWidth: '200px', backgroundColor: '#FFF' }}>
            <InputLabel id="categoria-label">Categoría</InputLabel>
            <Select
              labelId="categoria-label"
              value={categoriaSeleccionada}
              onChange={this.handleCategoriaChange}
              label="Categoría"
            >
              
              {categorias.map(categoria => (
                <MenuItem key={categoria.id} value={categoria.nombre}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField 
            label="Buscar Producto" 
            variant="outlined" 
            value={nombreBusqueda} 
            onChange={this.handleInputChange}
            style={{ backgroundColor: 'white' }}
          />
         
          
          <Button variant="contained" onClick={this.handleBuscar}>Buscar</Button>
          <Button variant="contained" onClick={this.handleMostrarTodos}>Mostrar Todos</Button>
          
        </div>

        <div className="productos-container" style={{ display: 'grid', backgroundColor: '#1a1a1a', gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`, gap: '20px', width: '100%', marginBottom: '80px', alignItems: 'center', justifyContent: 'center' }}>
          {productos.map((producto) => (
            <div key={producto.id} className="producto" style={{backgroundColor:'rgba(144,14,17,1)',  height: '100%', width: '100%', padding: '10px', display: 'flex', flexDirection: 'column', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  }}>
                <h3>{producto.nombre}</h3>
                {(BarberoId !== '0' || AdminId !== '0') && (
                  <Link to={`/productos/editar/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <EditIcon style={{ marginRight: '10px', cursor: 'pointer' }} />
                  </Link>
                )}
              </div>
              <img src={producto.imagenURL} alt={producto.imagenURL} style={{ width: '100%', backgroundColor:'rgba(144,14,17,1)', height: '90%', maxWidth: '100%', cursor: 'pointer', borderRadius: '10px' }} onClick={() => this.mostrarProductoDetalle(producto)} />
              <p style={{ color:'white', marginTop: '10px', marginBottom: '10px' }}>Precio: ₡{producto.precio}</p>
              {(BarberoId !== '0' || AdminId !== '0') && (
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                  <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => this.handleOpenModal(producto)} />
                </div>
              )}
            </div>
          ))}
        </div>
        {productoSeleccionado && (
          <ProductoDetalle
            producto={productoSeleccionado}
            cerrarProductoDetalle={this.cerrarProductoDetalle}
            agregarAlCarrito={this.agregarAlCarrito}
          />
        )}
        {alertaVisible && <AlertaTemporal producto={productoSeleccionado} />}

        <Modal
          open={modalOpen}
          onClose={this.handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Confirmación de eliminación
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              ¿Estás seguro de que quieres eliminar el producto {productoAEliminar?.nombre}?
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={this.handleCloseModal} style={{ marginRight: '10px' }}>Cancelar</Button>
              <Button onClick={this.eliminarProducto} variant="contained" color="error">Eliminar</Button>
            </Box>
          </Box>
        </Modal>

        <Stack style={{ backgroundColor: '#1a1a1a', color: 'white', textAlign: 'center' }} spacing={2} alignItems="center">
          <Pagination count={totalPages} page={currentPage} onChange={this.handlePageChange} color="primary" boundaryCount={1} siblingCount={2} />
        </Stack>

      </div>
    );
  }
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface ProductoDetalleProps {
  producto: Producto;
  cerrarProductoDetalle: () => void;
  agregarAlCarrito: (nombreProducto: string) => void;
}

const ProductoDetalle: React.FC<ProductoDetalleProps> = ({ producto, cerrarProductoDetalle, agregarAlCarrito }) => {
  return (
    <div className="producto-detalle" style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#1a1a1a', padding: '20px', border: '1px solid #ccc', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', zIndex: 100 }}>
      <button className="boton-cerrar" style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#DA1212', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }} onClick={cerrarProductoDetalle}>X</button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px', width:'90%'}}>
        <h2  style={{ textAlign: 'center', marginBottom: '10px', color:'rgba(144,14,17,1)' }}>{producto.nombre}</h2>
        <div style={{ backgroundColor: '#1a1a1a', width: '100%', maxHeight: '300px', overflow: 'hidden' }}>
          <Carousel showArrows={true} infiniteLoop={true} emulateTouch={true} dynamicHeight={true}>
            {producto.imagenesSecundarias.map((imagen, index) => (
              <div key={index} style={{marginTop:'10px' }}>
                <img src={imagen.url} alt={producto.nombre} style={{ width: '60%', objectFit: 'contain' }} />
              </div>
            ))}
          </Carousel>
        </div>
        <div style={{backgroundColor: '#1a1a1a', width:'100%', border: 'none'}}>
        <p style={{ textAlign: 'center', color:'#9AAEB8', marginBottom: '10px' }}>Precio: ${producto.precio}</p>
        <p style={{ textAlign: 'center', color:'#9AAEB8',marginBottom: '10px' }}>{producto.descripcion}</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <button className="btn btn-primary" style={{ flex: 1, background: '#11468F' }} onClick={() => agregarAlCarrito(producto.nombre)}>Agregar al carrito</button>
      </div>
    </div>
  );
};

interface AlertaTemporalProps {
  producto: Producto | null;
}

const AlertaTemporal: React.FC<AlertaTemporalProps> = ({ producto }) => {
  if (!producto) return null;
  return (
    <div className="alerta-temporal" style={{ position: 'fixed', bottom: '50px', left: '20px', backgroundColor: '#007bff', color: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0,0,0,0.5)', zIndex: 100 }}>
      Se ha agregado {producto.nombre} al carrito de compras.
    </div>
  );
};

export default Productos;
