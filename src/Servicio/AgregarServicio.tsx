import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Usuario } from "../tipos/Usuario";

interface AgregarServicioProps {
  usuario: Usuario;
}

const AgregarServicio: React.FC<AgregarServicioProps> = ({ usuario }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracion, setDuracion] = useState("");
  const [precioBase, setPrecioBase] = useState("");
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [carouselKey, setCarouselKey] = useState(0);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleImagenesChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setImagenes((prevImagenes) => [...prevImagenes, ...files]);
    }
  };

  const handleEliminarImagen = (index: number) => {
    setImagenes((prevImagenes) => {
      const nuevasImagenes = prevImagenes.filter((_, i) => i !== index);
      setCarouselKey((prevKey) => prevKey + 1);
      return nuevasImagenes;
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!nombre.trim() || !descripcion.trim() || !duracion.trim() || !precioBase.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (isNaN(Number(duracion)) || isNaN(Number(precioBase))) {
      setError("La duración y el precio base deben ser números");
      return;
    }

    const params = new URLSearchParams();
    params.append("nombre", nombre);
    params.append("descripcion", descripcion);
    params.append("duracion", duracion);
    params.append("precioBase", precioBase);
    params.append("usuarioId", usuario.id.toString());

    try {
      const response = await axios.post(
        "http://localhost:1111/barber_shop_booking_hub/servicio/registrar",
        params
      );
      console.log("Servicio agregado:", response.data);

      const servicioId = response.data.id;
      imagenes.forEach(async (imagen, index) => {
        const imagenFormData = new FormData();
        imagenFormData.append("id", servicioId.toString());
        imagenFormData.append("imagen", imagen);

        const imagenResponse = await axios.post(
          "http://localhost:1111/barber_shop_booking_hub/servicio/actualizarImagen",
          imagenFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Imagen subida:", imagenResponse.data);
      });

      setSuccessMessage("El servicio se agregó correctamente");
      setOpen(true);
      setNombre("");
      setDescripcion("");
      setDuracion("");
      setPrecioBase("");
      setImagenes([]);

    } catch (error) {
      console.error("Error al agregar el servicio:", error);
      setError("Error al agregar el servicio");
    }
  };

  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Agregar Servicio
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setError("");
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="descripcion"
                  label="Descripción"
                  name="descripcion"
                  value={descripcion}
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                    setError("");
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="duracion"
                  label="Duración"
                  name="duracion"
                  value={duracion}
                  onChange={(e) => {
                    setDuracion(e.target.value);
                    setError("");
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="precioBase"
                  label="Precio Base"
                  name="precioBase"
                  value={precioBase}
                  onChange={(e) => {
                    setPrecioBase(e.target.value);
                    setError("");
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="imagenes">Imágenes</label>
                <input
                  id="imagenes"
                  type="file"
                  multiple
                  className="input"
                  onChange={handleImagenesChange}
                />
                {imagenes.length > 0 && (
                  <div
                    className="mt-4"
                    style={{ width: "200px", height: "200px" }}
                  >
                    <Carousel
                      key={carouselKey}
                      showThumbs={false}
                      showArrows={true}
                      showStatus={false}
                      swipeable={true}
                      dynamicHeight={false}
                      infiniteLoop={true}
                      autoPlay={false}
                      interval={5000}
                      stopOnHover={true}
                      centerMode={true}
                      centerSlidePercentage={100}
                    >
                      {imagenes.map((imagen, index) => (
                        <div
                          key={index}
                          style={{ width: "200px", height: "200px" }}
                        >
                          <img
                            src={URL.createObjectURL(imagen)}
                            alt={`Preview ${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleEliminarImagen(index)}
                            style={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              background: "transparent",
                              border: "none",
                              color: "white",
                              cursor: "pointer",
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </Carousel>
                  </div>
                )}
              </Grid>
            </Grid>
            {error && (
              <Typography
                color="error"
                variant="body2"
                align="center"
                sx={{ mt: 2 }}
              >
                {error}
              </Typography>
            )}
            {successMessage && (
              <Typography
                color="success"
                variant="body2"
                align="center"
                sx={{ mt: 2 }}
              >
                {successMessage}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Guardar
            </Button>
          </form>
        </Paper>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirmación</DialogTitle>
          <DialogContent>
            <Typography>El servicio se agregó correctamente.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </ThemeProvider>
  );
};

export default AgregarServicio;
