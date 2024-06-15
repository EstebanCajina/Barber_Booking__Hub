import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const defaultTheme = createTheme();

export default function SignInSide() {
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      setError('Correo electrónico y contraseña son campos requeridos.');
      return;
    }

    // Validar el formato de correo electrónico
    const emailRegex = /^\S+@\S+$/;
    if (!emailRegex.test(email)) {
      setError('El correo electrónico ingresado no es válido.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:1111/barber_shop_booking_hub/cuenta/login', {
        correoElectronico: email,
        contrasena: password,
      });

      if (!response.data) {
        setError('Credenciales inválidas.');
        return;
      }

      localStorage.setItem('user', JSON.stringify(response.data));
      window.location.href = '/';
    } catch (error) {
      console.error('Error iniciando sesión:', error);
      setError('Credenciales inválidas.');
    }
  };

  const handleChange = () => {
    // Borrar mensaje de error cuando cambia algún campo
    setError('');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{
          height: '100vh',
          background: '#1a1a1a',
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
              backgroundColor: '#1a1a1a', // Ajusta la transparencia aquí
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
              backgroundColor: 'rgba(255, 255, 255, 0.99)', // Ajusta la transparencia aquí
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'error.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar sesión
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoComplete="email"
                autoFocus
                color="error"
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                color="error"
                autoComplete="current-password"
                onChange={handleChange}
              />
              
              {error && (
                <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="error"
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar sesión
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="recuperacion" variant="body2" color="error">
                    ¿Has olvidado tu contraseña?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="registrarse" variant="body2" color="error">
                    {"¿No tienes una cuenta? Inscríbete aquí"}
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
