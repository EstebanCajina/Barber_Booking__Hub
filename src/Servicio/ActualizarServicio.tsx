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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { Servicio } from "../tipos/Servicio";

interface ActualizarServicioProps {
  servicio: Servicio;
}
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const ActualizarServicio: React.FC<ActualizarServicioProps> = ({
  servicio,
}) => {
  const [nombre, setNombre] = useState(servicio.nombre);
  const [descripcion, setDescripcion] = useState(servicio.descripcion);
  const [duracion, setDuracion] = useState(servicio.duracion.toString());
  const [precioBase, setPrecioBase] = useState(servicio.precioBase.toString());
  const [imagenesNuevas, setImagenesNuevas] = useState<File[]>([]);
  const [imagenesEliminar, setImagenesEliminar] = useState<string[]>([]);
  const [imagenesActuales, setImagenesActuales] = useState(servicio.imagenes);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [carouselKey, setCarouselKey] = useState(0);
  const [openConfirmation, setOpenConfirmation] = useState(false); // State for confirmation dialog

  const handleImagenesChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      // Filter only allowed image file types
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const filteredFiles = files.filter(file => validImageTypes.includes(file.type));
  
      // Check if any file does not have a valid image extension
      if (filteredFiles.length !== files.length) {
        setError("Uno o más archivos no tienen una extensión de imagen válida (jpg, jpeg, png, gif).");
        return;
      }
  
      setImagenesNuevas((prevImagenes) => [...prevImagenes, ...filteredFiles]);
      setCarouselKey((prevKey) => prevKey + 1);
      setError(""); // Clear error message if files are valid
    }
  };
  

  const handleEliminarImagen = (index: number) => {
    const imagenAEliminar = imagenesActuales[index];
    setImagenesEliminar((prevImagenes) => [...prevImagenes, imagenAEliminar]);
    setImagenesActuales((prevImagenes) =>
      prevImagenes.filter((_, i) => i !== index)
    );

    setImagenesNuevas((prevImagenes) => {
      const newImagenes = [...prevImagenes];
      const imagenIndex = newImagenes.findIndex(
        (imagen) => imagen.name === imagenAEliminar
      );
      if (imagenIndex !== -1) {
        newImagenes.splice(imagenIndex, 1);
      }
      return newImagenes;
    });
    setCarouselKey((prevKey) => prevKey + 1);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!nombre.trim()) {
      setError("El nombre está vacío");
      return;
    }

    if (!descripcion.trim()) {
      setError("La descripción está vacía");
      return;
    }

    if (!duracion.trim()) {
      setError("La duración está vacía");
      return;
    }

    if (isNaN(Number(duracion)) || Number(duracion) < 1) {
      setError("La duración debe ser un número positivo");
      return;
    }

    if (!precioBase.trim()) {
      setError("El precio base está vacío");
      return;
    }

    if (isNaN(Number(precioBase)) || Number(precioBase) < 1) {
      setError("El precio base debe ser un número positivo");
      return;
    }

    // Open confirmation dialog
    setOpenConfirmation(true);
  };

  const handleConfirmacionAceptar = async () => {
    // Close confirmation dialog
    setOpenConfirmation(false);

    const params = new FormData();
    params.append("id", servicio.id.toString());
    params.append("nombre", nombre);
    params.append("descripcion", descripcion);
    params.append("duracion", duracion);
    params.append("precioBase", precioBase);
    params.append("usuarioId", servicio.usuario.id.toString());
    params.append("imagenesEliminar", imagenesEliminar.join("!"));

    try {
      const response = await axios.post(
        `http://localhost:1111/barber_shop_booking_hub/servicio/actualizar`,
        params
      );
      console.log("Servicio actualizado:", response.data);

      const servicioId = response.data.id;
      for (const imagen of imagenesNuevas) {
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
      }

      setSuccessMessage("El servicio se actualizó correctamente");
      setNombre("");
      setDescripcion("");
      setDuracion("");
      setPrecioBase("");
      setImagenesNuevas([]);
      setImagenesEliminar([]);
      setImagenesActuales([]);
      setCarouselKey(0);

      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar el servicio:", error);
      setError("Error al actualizar el servicio");
    }
  };

  const handleConfirmacionCancelar = () => {
    // Close confirmation dialog
    setOpenConfirmation(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
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
          <Typography component="h1" variant="h5" align="center" color="error" gutterBottom>
            Actualizar Servicio
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
                  color="error"
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
                  color="error"
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
                  label="Duración en minutos"
                  name="duracion"
                  color="error"
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
                  color="error"
                  value={precioBase}
                  onChange={(e) => {
                    setPrecioBase(e.target.value);
                    setError("");
                  }}
                />
              </Grid>

              {/* Section to manage images */}
              <Grid item xs={12}>
                <label>Imágenes</label>
                {/* Display current images */}
                <div
                  className="mt-4"
                  style={{ width: "200px", height: "200px" }}
                >
                  <Carousel
                    key={carouselKey} // Dynamic key to force carousel update
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
                    {[
                      ...imagenesActuales.map((imagen, index) => (
                        <div
                          key={index}
                          style={{ width: "200px", height: "200px" }}
                        >
                          <img
                            src={imagen}
                            alt={`Imagen ${index}`}
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
                      )),

                      ...imagenesNuevas.map((imagen, index) => (
                        <div
                          key={servicio.imagenes.length + index}
                          style={{ width: "200px", height: "200px" }}
                        >
                          <img
                            src={URL.createObjectURL(imagen)}
                            alt={`Imagen nueva ${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          {/* Button to delete new image */}
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => {
                              setImagenesNuevas((prevImagenes) =>
                                prevImagenes.filter((_, i) => i !== index)
                              );
                              setCarouselKey((prevKey) => prevKey + 1);
                            }}
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
                      )),
                    ]}
                  </Carousel>
                </div>

                {/* Input to add new images */}
                <input
                  id="imagenes"
                  type="file"
                  multiple
                  className="input"
                  onChange={handleImagenesChange}
                />
              </Grid>
            </Grid>

            {/* Show error and success messages */}
            {error && (
              <Typography
                color="primary"
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

            {/* Button to save changes */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="error"
              sx={{ mt: 3, mb: 2 }}
            >
              Guardar
            </Button>
          </form>

          {/* Confirmation Dialog */}
          <Dialog
            open={openConfirmation}
            onClose={() => setOpenConfirmation(false)}
          >
            <DialogTitle>¿Desea actualizar el servicio?</DialogTitle>
            <DialogActions>
              <Button onClick={handleConfirmacionAceptar} color="primary">
                Aceptar
              </Button>
              <Button
                onClick={handleConfirmacionCancelar}
                color="primary"
                autoFocus
              >
                Cancelar
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Grid>
    </ThemeProvider>
  );
};

export default ActualizarServicio;