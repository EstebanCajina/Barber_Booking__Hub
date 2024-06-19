import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const RecuperacionContrasena: React.FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSendToken = async () => {
    try {
      const response = await axios.post('http://localhost:1111/barber_shop_booking_hub/cuenta/enviar-token', { correoElectronico: email });
      if (response.data.success) {
        setUserId(response.data.userId);
        setStep(2);
      } else {
        setError('No se pudo enviar el token. Verifica tu correo electrónico.');
      }
    } catch (error) {
      setError('Error al enviar el token. Inténtalo de nuevo más tarde.');
    }
  };

  const handleVerifyToken = async () => {
    try {
      const response = await axios.post('http://localhost:1111/barber_shop_booking_hub/cuenta/verificar-token', { userId, token: code });
      if (response.data.success) {
        setStep(3);
      } else {
        setError('Token incorrecto. Inténtalo de nuevo.');
      }
    } catch (error) {
      setError('Error al verificar el token. Inténtalo de nuevo más tarde.');
    }
  };

  const handleChangePassword = async () => {

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('La contraseña no puede estar vacía.');
      return;
    }

    if ((newPassword !== confirmPassword)) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:1111/barber_shop_booking_hub/cuenta/actualizarContra`, null, {
        params: {
          userId,
          nuevaContrasena: newPassword,
        },
      });
      if (response.data.success) {
        setOpen(true);
        setStep(1);
        setEmail('');
        setCode('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError('Error al actualizar la contraseña. Inténtalo de nuevo más tarde.');
      }
    } catch (error) {
      setError('Error al actualizar la contraseña. Inténtalo de nuevo más tarde.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    window.location.href = '/login';
  };

  return (
    <div className="" style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',  // Ajusta el tamaño mínimo del contenedor si es necesario
      padding: '20px',     // Añade un poco de espacio interno
    }}>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h1 className="text-center mb-5">Recuperación de Contraseña</h1>
              {step === 1 && (
                <>
                  <p className='text-center'>Introduce tu correo electrónico para enviar un token de recuperación:</p>
                  <TextField
                    label="Correo Electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    color="secondary"
                  />
                  <Button variant="contained" color="error" onClick={handleSendToken} fullWidth>
                    Enviar Token
                  </Button>
                </>
              )}
              {step === 2 && (
                <>
                  <p>Introduce el código de verificación enviado a tu correo electrónico:</p>
                  <TextField
                    label="Código de Verificación"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    fullWidth
                    color="secondary"
                    margin="normal"
                  />
                  <Button variant="contained" color="error" onClick={handleVerifyToken} fullWidth>
                    Verificar Código
                  </Button>
                </>
              )}
              {step === 3 && (
                <>
                  <p>Introduce tu nueva contraseña:</p>
                  <TextField
                    label="Nueva Contraseña"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    color="secondary"
                  />
                  <p>Confirma tu nueva contraseña:</p>
                  <TextField
                    label="Confirmar Contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    color="secondary"
                  />
                  <Button variant="contained" color="error" onClick={handleChangePassword} fullWidth>
                    Cambiar Contraseña
                  </Button>
                </>
              )}
              {error && <p className="text-primary mt-3">{error}</p>}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Contraseña Actualizada</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Contraseña actualizada correctamente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RecuperacionContrasena;