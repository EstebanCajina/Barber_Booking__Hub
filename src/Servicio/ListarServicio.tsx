import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel, Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ActualizarServicio from "./ActualizarServicio";
import { Servicio } from "../tipos/Servicio";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const ServicioList: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState<Servicio | null>(null);
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const size = 4;
  const storedUser = localStorage.getItem("user");
  const usuario = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        let response;
        if (isFiltering && nombreBusqueda) {
          response = await axios.get(
            `http://localhost:1111/barber_shop_booking_hub/servicio/buscar?nombre=${nombreBusqueda}&page=${page}&size=${size}`
          );
        } else {
          response = await axios.get(
            `http://localhost:1111/barber_shop_booking_hub/servicio/listar?page=${page}&size=${size}`
          );
        }
        setServicios(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching servicios:", error);
      }
    };

    fetchServicios();
  }, [page, size, isFiltering, nombreBusqueda]);

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

  const handleActualizarClick = (servicio: Servicio) => {
    if (usuario && usuario.id === servicio.usuario.id) {
      setSelectedServicio(servicio);
      setOpenConfirmDialog(true);
    } else {
      // Aquí podrías manejar un mensaje de error o simplemente no hacer nada si no tiene permisos
      console.log("No tienes permisos para actualizar este servicio");
    }
  };

  const handleConfirmActualizar = () => {
    setOpenConfirmDialog(false);
    // Lógica para actualizar el servicio
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleEliminarClick = (servicio: Servicio) => {
    if (usuario && usuario.id === servicio.usuario.id) {
      setServicioToDelete(servicio);
      setOpenDeleteConfirmDialog(true);
    } else {
      // Aquí podrías manejar un mensaje de error o simplemente no hacer nada si no tiene permisos
      console.log("No tienes permisos para eliminar este servicio");
    }
  };

  const handleConfirmDelete = async () => {
    if (servicioToDelete) {
      try {
        await axios.delete(`http://localhost:1111/barber_shop_booking_hub/servicio/eliminar`, {
          params: { id: servicioToDelete.id }
        });
        setServicios(servicios.filter(s => s.id !== servicioToDelete.id));
        console.log("Servicio eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        console.log("Error al eliminar el servicio");
      }
      setOpenDeleteConfirmDialog(false);
      window.location.reload();

    }
  };

  const handleCloseDeleteConfirmDialog = () => {
    setOpenDeleteConfirmDialog(false);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 text-light">SERVICIOS</h1>
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          value={nombreBusqueda}
          onChange={handleSearchChange}
          placeholder="Buscar por nombre"
          className="form-control mr-2"
          style={{ width: '300px' }}
        />
        <button onClick={handleSearch} className="btn btn-danger mr-2">Buscar</button>
        <button onClick={handleShowAll} className="btn btn-primary">Mostrar todos</button>
      </div>
      <div className="row">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="col-lg-6 mb-4">
            <div className="card" style={{ height: "650px" }}>
              <div style={{ height: "500px", overflow: "hidden" }}>
                <Carousel data-bs-theme="ligth"
                >
                  {servicio.imagenes.map((imagen, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={imagen}
                        alt={`Imagen ${index + 1}`}
                        style={{
                          height: "500px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
              <div className="card-body bg-danger">
                <h4 className="card-title text-light">{servicio.nombre}</h4>
                <p className="card-text text-light">{servicio.descripcion}</p>
                <h6 className="text-light">
                  Duración: {servicio.duracion} mins | Precio Base: ₡
                  {servicio.precioBase}
                </h6>

                <div className="d-flex align-items-center mt-4">
                  <img
                    src={servicio.usuario.imagen}
                    alt="Avatar"
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="ml-3">
                    <h6 className="mb-0 text-light">{servicio.usuario.nombreUsuario}</h6>
                  </div>
                </div>
                {usuario && usuario.id === servicio.usuario.id && (
                  <>
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => handleActualizarClick(servicio)}
                    >
                      Actualizar Servicio
                    </button>
                    <button
                      className="btn btn-light mt-3 ml-2"
                      onClick={() => handleEliminarClick(servicio)}
                    >
                      Eliminar Servicio
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center">
        <Pagination data-bs-theme="dark"
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index}
              active={index === page}
              onClick={() => handlePageChange(index)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
      {selectedServicio && (
        <ActualizarServicio
          key={selectedServicio.id}
          servicio={selectedServicio}
        />
      )}

      {/* Modal para confirmar actualización */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>Confirmar Actualización</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas actualizar este servicio?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmActualizar} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para confirmar eliminación */}
      <Dialog
        open={openDeleteConfirmDialog}
        onClose={handleCloseDeleteConfirmDialog}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este servicio?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServicioList;
