import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper'; // Importa Paper
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    cedula: '',
    contrasena: '',
    confirmarContrasena: '',
    correoElectronico: '',
    numeroTelefono: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
    // Borra el mensaje de error cuando cambia un campo
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        setError(`El campo ${key} no puede estar vacío.`);
        return;
      }
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validación de formato de correo electrónico (puedes usar una expresión regular más completa si lo deseas)
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.correoElectronico)) {
      setError('El correo electrónico ingresado no es válido.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:1111/barber_shop_booking_hub/cuenta/registrar', formData);
      
      console.log(response.data);

      // Inicio de sesión automático después del registro exitoso
      const loginResponse = await axios.post('http://localhost:1111/barber_shop_booking_hub/cuenta/login', {
        correoElectronico: formData.correoElectronico,
        contrasena: formData.contrasena,
      });

      console.log(loginResponse.data);

      // Guardar los datos del usuario en localStorage o en el estado de la aplicación
      localStorage.setItem('user', JSON.stringify(loginResponse.data));

      // Redirigir al usuario a la vista principal
      window.location.href = '/barber_shop_booking_hub';

    } catch (error) {
      console.error('Error registrando usuario:', error);
    }
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Grid
        container
        component="main"
        sx={{
          height: '100vh',
          background: 'linear-gradient(90deg, rgba(138,13,123,1) 0%, rgba(8,212,224,1) 52%, rgba(138,13,123,1) 100%)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
              boxShadow: 3,
              borderRadius: 2,
              background: 'linear-gradient(94deg, rgba(0,0,0,1) 0%, rgba(85,29,61,1) 55%, rgba(210,202,31,1) 100%)', // Ajusta la transparencia aquí
            }} square >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)', // Ajusta la transparencia aquí
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Registrarse
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="nombreUsuario"
                    label="Nombre de Usuario"
                    name="nombreUsuario"
                    value={formData.nombreUsuario}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="cedula"
                    label="Cédula"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="contrasena"
                    label="Contraseña"
                    type="password"
                    id="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmarContrasena"
                    label="Confirmar Contraseña"
                    type="password"
                    id="confirmarContrasena"
                    value={formData.confirmarContrasena}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="correoElectronico"
                    label="Correo Electrónico"
                    name="correoElectronico"
                    value={formData.correoElectronico}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="numeroTelefono"
                    label="Número de Teléfono"
                    name="numeroTelefono"
                    value={formData.numeroTelefono}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox name="allowExtraEmails" color="primary" />}
                    label="Quiero recibir inspiración, promociones de marketing y actualizaciones por correo electrónico."
                  />
                </Grid>
              </Grid>
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Registrarse
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="login" variant="body2">
                    ¿Ya tienes una cuenta? Inicia sesión
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignUp;
