import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

interface TarjetaImagenProps {
  image: string;
  title: string;
  description: string;
  showDetails: boolean;
  email?: string;
  phone?: string;
  experience?: number;
  carouselWidth: string | number;
  carouselHeight: string | number;
}

function TarjetaImagen({ image, title, description, showDetails, email, phone, experience, carouselWidth, carouselHeight }: TarjetaImagenProps) {
  return (
    <Card sx={{ maxWidth: carouselWidth }}>
      <CardActionArea>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            height: carouselHeight, // Establecer la altura de la imagen
            objectFit: 'cover', // Ajusta la imagen para llenar el contenedor manteniendo la proporción
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          {showDetails && (
            <>
              {email && (
                <Typography variant="body2" color="text.secondary">
                  Email: {email}
                </Typography>
              )}
              {phone && (
                <Typography variant="body2" color="text.secondary">
                  Phone: {phone}
                </Typography>
              )}
              {experience && (
                <Typography variant="body2" color="text.secondary">
                  Experience: {experience} years
                </Typography>
              )}
            </>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions>
    </Card>
  );
}

export default TarjetaImagen;
