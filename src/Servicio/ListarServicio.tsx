import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel, Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ActualizarServicio from "./ActualizarServicio";
import { Servicio } from "../tipos/Servicio";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

const ServicioList: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState<Servicio | null>(null);
  const size = 4;
  const storedUser = localStorage.getItem("user");
  const isBarbero = storedUser && JSON.parse(storedUser).barbero === "1";
  const usuario = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1111/barber_shop_booking_hub/servicio/listar?page=${page}&size=${size}`
        );
        setServicios(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching servicios:", error);
      }
    };

    fetchServicios();
  }, [page, size]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleActualizarClick = (servicio: Servicio) => {
    if (usuario && usuario.id === servicio.usuario.id) {
      setSelectedServicio(servicio);
      setOpenConfirmDialog(true);
    } else {
      alert("No tienes permisos para actualizar este servicio");
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
      alert("No tienes permisos para eliminar este servicio");
    }
  };

  const handleConfirmDelete = async () => {
    if (servicioToDelete) {
      try {
        await axios.delete(`http://localhost:1111/barber_shop_booking_hub/servicio/eliminar`, {
          params: { id: servicioToDelete.id }
        });
        setServicios(servicios.filter(s => s.id !== servicioToDelete.id));
        alert("Servicio eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        alert("Error al eliminar el servicio");
      }
      setOpenDeleteConfirmDialog(false);
    }
  };

  const handleCloseDeleteConfirmDialog = () => {
    setOpenDeleteConfirmDialog(false);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">SERVICIOS</h1>
      <div className="row">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="col-lg-6 mb-4">
            <div className="card" style={{ height: "650px" }}>
              <div style={{ height: "500px", overflow: "hidden" }}>
                <Carousel>
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
              <div className="card-body">
                <h5 className="card-title">{servicio.nombre}</h5>
                <p className="card-text">{servicio.descripcion}</p>
                <small className="text-muted">
                  Duración: {servicio.duracion} mins | Precio Base: ₡
                  {servicio.precioBase}
                </small>

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
                    <h6 className="mb-0">{servicio.usuario.nombreUsuario}</h6>
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
                      className="btn btn-danger mt-3 ml-2"
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
        <Pagination>
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
