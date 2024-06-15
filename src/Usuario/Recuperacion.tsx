import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

const RecuperacionContrasena: React.FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState('');

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
    try {
      const response = await axios.post(`http://localhost:1111/barber_shop_booking_hub/cuenta/actualizarContra`, null, {
        params: {
          userId,
          nuevaContrasena: newPassword,
        },
      });
      if (response.data.success) {
        alert('Contraseña actualizada correctamente');
        setStep(1);
        setEmail('');
        setCode('');
        setNewPassword('');
        window.location.href = '/barber_shop_booking_hub/login';
    } else {
        setError('Error al actualizar la contraseña. Inténtalo de nuevo más tarde.');
      }
    } catch (error) {
      setError('Error al actualizar la contraseña. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h1 className="text-center mb-5">Recuperación de Contraseña</h1>
              {step === 1 && (
                <>
                  <p>Introduce tu correo electrónico para enviar un token de recuperación:</p>
                  <TextField
                    label="Correo Electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <Button variant="contained" color="primary" onClick={handleSendToken} fullWidth>
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
                    margin="normal"
                  />
                  <Button variant="contained" color="primary" onClick={handleVerifyToken} fullWidth>
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
                  />
                  <Button variant="contained" color="primary" onClick={handleChangePassword} fullWidth>
                    Cambiar Contraseña
                  </Button>
                </>
              )}
              {error && <p className="text-danger mt-3">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperacionContrasena;
