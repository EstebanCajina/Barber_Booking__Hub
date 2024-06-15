import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {Servicio} from "../tipos/Servicio";

interface ActualizarServicioProps {
  servicio: Servicio;
}

const ActualizarServicio: React.FC<ActualizarServicioProps> = ({ servicio }) => {
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

  const handleImagenesChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setImagenesNuevas((prevImagenes) => [...prevImagenes, ...files]);
      setCarouselKey((prevKey) => prevKey + 1);
    }
  };

  const handleEliminarImagen = (index: number) => {
    const imagenAEliminar = imagenesActuales[index];
    setImagenesEliminar((prevImagenes) => [...prevImagenes, imagenAEliminar]);
    setImagenesActuales((prevImagenes) => prevImagenes.filter((_, i) => i !== index));

    setImagenesNuevas((prevImagenes) => {
      const newImagenes = [...prevImagenes];
      const imagenIndex = newImagenes.findIndex((imagen) => imagen.name === imagenAEliminar);
      if (imagenIndex !== -1) {
        newImagenes.splice(imagenIndex, 1);
      }
      return newImagenes;
    });
    setCarouselKey((prevKey) => prevKey + 1);
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
    
                  {/* Sección para gestionar las imágenes */}
                  <Grid item xs={12}>
                    <label>Imágenes</label>
                    {/* Mostrar imágenes actuales */}
                    <div className="mt-4" style={{ width: "200px", height: "200px" }}>
                      <Carousel
                        key={carouselKey} // Clave dinámica para forzar la actualización del carrusel
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
                          <div key={index} style={{ width: "200px", height: "200px" }}>
                            <img
                              src={imagen}
                              alt={`Imagen ${index}`}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                          <div key={servicio.imagenes.length + index} style={{ width: "200px", height: "200px" }}>
                            <img
                              src={URL.createObjectURL(imagen)}
                              alt={`Imagen nueva ${index}`}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            {/* Botón para eliminar imagen nueva */}
                            <button
                              type="button"
                              className="delete-button"
                              onClick={() => {
                                setImagenesNuevas((prevImagenes) => prevImagenes.filter((_, i) => i !== index));
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
    
                    {/* Input para agregar nuevas imágenes */}
                    <input
                      id="imagenes"
                      type="file"
                      multiple
                      className="input"
                      onChange={handleImagenesChange}
                    />
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
                {/* Botón para guardar los cambios */}
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
          </Grid>
        </ThemeProvider>
      );
    };
    
    export default ActualizarServicio;
