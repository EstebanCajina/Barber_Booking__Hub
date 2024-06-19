import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Avatar, Typography, Grid, Paper, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Usuario } from "../tipos/Usuario";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#900e11',
  color: 'white',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const VistaUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!usuario) {
    return null; // or a loading spinner
  }

  return (
    <Container component="main" maxWidth={false} disableGutters sx={{ backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh', padding: 4 }}>
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Perfil
        </Typography>
        <Typography variant="h6" gutterBottom>
          {usuario.barbero == '1' ? "Soy un barbero altamente profesional" : "Bienvenido a tu perfil de cliente"}
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={3}>
              <Typography variant="h5" gutterBottom>
                {usuario.barbero == '1' ? "Acerca de mí" : "Información del cliente"}
              </Typography>
              <Typography variant="body1" paragraph>
                {usuario.barbero == '1'
                  ? "Soy un barbero con una sólida trayectoria en la industria, especializado en cortes de cabello modernos y tradicionales. Mi objetivo es proporcionar a cada cliente una experiencia personalizada y de alta calidad. Con más de 10 años de experiencia, he perfeccionado mis habilidades para ofrecer servicios excepcionales que superan las expectativas de mis clientes."
                  : "Gracias por ser parte de nuestra comunidad. Como cliente, puedes acceder a una variedad de servicios y productos diseñados para proporcionarte la mejor experiencia posible. Nuestro objetivo es superar tus expectativas en cada visita."}
              </Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Avatar alt={usuario.nombreUsuario} src={usuario.imagen} sx={{ width: 200, height: 200 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={3}>
              <Typography variant="h5" gutterBottom>
                Detalles
              </Typography>
              <Typography variant="body1">
                <strong>Nombre:</strong> {usuario.nombreUsuario}
              </Typography>
              <Typography variant="body1">
                <strong>Cédula:</strong> {usuario.cedula}
              </Typography>
              <Typography variant="body1">
                <strong>Correo Electrónico:</strong> {usuario.correoElectronico}
              </Typography>
              <Typography variant="body1">
                <strong>Teléfono:</strong> {usuario.numeroTelefono}
              </Typography>
              <Box sx={{ marginTop: 2 }}>
                <Link href="#" color="inherit" sx={{ marginRight: 1 }}>
                  <i className="fab fa-facebook-f"></i>
                </Link>
                <Link href="#" color="inherit" sx={{ marginRight: 1 }}>
                  <i className="fab fa-twitter"></i>
                </Link>
                <Link href="#" color="inherit">
                  <i className="fab fa-instagram"></i>
                </Link>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default VistaUsuario;
