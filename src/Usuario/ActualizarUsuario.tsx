import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Usuario } from "../tipos/Usuario";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface Props {
  user: Usuario;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const SignUp: React.FC<Props> = ({ user }: Props) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = React.useState<string>('');
  const [newPassword, setNewPassword] = React.useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [successMessage, setSuccessMessage] = React.useState<string>('');
  const [imageSuccessMessage, setImageSuccessMessage] = React.useState<string>('');
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogAction, setDialogAction] = React.useState<() => void>(() => {});
  const [nombreUsuario, setNombreUsuario] = React.useState(user.nombreUsuario);
  const [cedula, setCedula] = React.useState(user.cedula);
  const [correoElectronico, setCorreoElectronico] = React.useState(user.correoElectronico);
  const [numeroTelefono, setNumeroTelefono] = React.useState(user.numeroTelefono);
  const [loggedInUser, setLoggedInUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser) as Usuario);
    }
  }, []);
  const handleOpenDialog = (action: () => void) => {
    setDialogAction(() => action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const validateFields = async () => {
    // Validar campos no vacíos
    if (!nombreUsuario || !cedula || !correoElectronico || !numeroTelefono) {
      setErrorMessage('Todos los campos son obligatorios.');
      return false;
    }

    // Validar correo electrónico
    if (correoElectronico.trim() !== user.correoElectronico) {
      try {
        const correoResponse = await axios.post('http://localhost:1111/barber_shop_booking_hub/cuenta/verificarCorreo', null, {
          params: { correo: correoElectronico }
        });
        if (correoResponse.data) {
          setErrorMessage('El correo electrónico ya se encuentra registrado.');
          return false;
        }
      } catch (error) {
        console.error('Error verificando correo:', error);
      }
    }

    // Validar cédula
    if (cedula.trim() !== user.cedula) {
      try {
        const cedulaResponse = await axios.post('http://localhost:1111/barber_shop_booking_hub/cuenta/verificarCedula', null, {
          params: { cedula: cedula }
        });
        if (cedulaResponse.data) {
          setErrorMessage('La cédula ya se encuentra registrada.');
          return false;
        }
      } catch (error) {
        console.error('Error verificando cédula:', error);
      }
    }

    setErrorMessage('');
    return true;
  };

  const handleSubmit = async () => {
    if (!(await validateFields())) {
      return;
    }

    try {
      const id = user.id;
      const url = `http://localhost:1111/barber_shop_booking_hub/cuenta/actualizar?id=${id}&nombreUsuario=${nombreUsuario}&cedula=${cedula}&correoElectronico=${correoElectronico}&numeroTelefono=${numeroTelefono}`;
      const response = await axios.post(url);

      console.log(response.data);

      if (loggedInUser && loggedInUser.id === response.data.id) {
        const updatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log("Se actualizó el localStorage");
      }

      window.location.reload();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleImageSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('id', user.id.toString());
    formData.append('imagen', selectedFile);

    try {
      const response = await axios.post(`http://localhost:1111/barber_shop_booking_hub/cuenta/actualizarImagen`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      const imageUrl = response.data.url;
      setImageSuccessMessage('Imagen actualizada exitosamente.');
      console.log("El id de la respuesta es: "+ response.data.id + " el id del usario logueado es: " + loggedInUser?.id)
      if(loggedInUser && loggedInUser.id == response.data.id){
      const updatedUser = { ...user, imagen: imageUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log("se actualizó el localstorage")
      }
      window.location.reload();
    } catch (error) {
      console.error('Error updating user image:', error);
      setImageSuccessMessage('');
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
        setErrorMessage('Solo se permiten archivos .jpg, .jpeg, .png y .gif.');
        setSelectedFile(null);
        setImagePreviewUrl(null);
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrorMessage(''); // Clear any previous error messages
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Las nuevas contraseñas no coinciden.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:1111/barber_shop_booking_hub/cuenta/cambiarContrasena`, null, {
        params: {
          id: user.id,
          contrasenaActual: currentPassword,
          contrasenaNueva: newPassword,
        },
      });
      console.log(response.data);
      setErrorMessage('');
      setSuccessMessage('Contraseña actualizada exitosamente.');
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage('Error al actualizar la contraseña. Verifique su contraseña actual.');
      setSuccessMessage('');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'error.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Actualiza tu Información
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="nombreUsuario"
                  label="Nombre de Usuario"
                  name="nombreUsuario"
                  color="error"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="cedula"
                  label="Cédula"
                  name="cedula"
                  color="error"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="correoElectronico"
                  label="Correo Electrónico"
                  name="correoElectronico"
                  color="error"
                  value={correoElectronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="numeroTelefono"
                  label="Número de Teléfono"
                  name="numeroTelefono"
                  color="error"
                  value={numeroTelefono}
                  onChange={(e) => setNumeroTelefono(e.target.value)}
                />
              </Grid>
              <input type="hidden" name="id" value={user.id} />
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => handleOpenDialog(handleSubmit)}
            >
              Actualizar Información
            </Button>
          </Box>
          <Typography component="h2" variant="h6" sx={{ mt: 4 }}>
            Actualiza tu Imagen
          </Typography>
          {imagePreviewUrl && (
            <Avatar
              alt="User Image"
              src={imagePreviewUrl}
              sx={{ width: 100, height: 100, mt: 2 }}
            />
          )}
          {imageSuccessMessage && (
            <Typography color="success" sx={{ mt: 1 }}>
              {imageSuccessMessage}
            </Typography>
          )}
          <input
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            style={{ marginTop: 16 }}
          />
          <Button
            variant="contained"
            fullWidth
            color="error"
            sx={{ mt: 2 }}
            onClick={() => handleOpenDialog(handleImageSubmit)}
          >
            Actualizar Imagen
          </Button>
          {errorMessage && (
            <Typography color="secondary" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}
          <Typography component="h2" variant="h6" sx={{ mt: 4 }}>
            Cambia tu Contraseña
          </Typography>
          {successMessage && (
            <Typography color="success" sx={{ mt: 1 }}>
              {successMessage}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Contraseña Actual"
            type="password"
            color="error"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Nueva Contraseña"
            type="password"
            color="error"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Confirmar Nueva Contraseña"
            type="password"
            color="error"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            color="error"
            sx={{ mt: 2 }}
            onClick={() => handleOpenDialog(handlePasswordChange)}
          >
            Actualizar Contraseña
          </Button>
        </Box>
      </Container>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas realizar esta acción?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={() => {
              dialogAction(); // Ejecuta la acción correspondiente
              handleCloseDialog();
            }}
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default SignUp;
