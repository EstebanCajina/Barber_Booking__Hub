import React, { useState, useEffect } from 'react';
import ListarServicios from './Servicio/ListarServicio';
import AgregarServicio from './Servicio/AgregarServicio';

interface Usuario {
    id: number;
    nombreUsuario: string;
    cedula: string;
    contrasena: string;
    estado: string;
    admin: string;
    barbero: string;
    correoElectronico: string;
    numeroTelefono: string;
    imagen: string;
}

const VistaServicios: React.FC = () => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUsuario(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="vista-servicios" style={{
            backgroundColor: '#1a1a1a',
            minHeight: '100vh',  // Ajusta el tamaño mínimo del contenedor si es necesario
            padding: '20px',     // Añade un poco de espacio interno
          }}>
            
            {usuario && usuario.barbero === '1' && (
                <div className="mt-6 flex justify-center">
                    <div className="w-3/4"> {/* Ancho del 75% de su contenedor */}
                        <AgregarServicio usuario={usuario} />
                    </div>
                </div>
            )}
            {!usuario && (
                <div className="mt-6">
                    <ListarServicios />
                </div>
            )}
            {usuario && (
                <div className="mt-6">
                    <ListarServicios />
                </div>
            )}
        </div>
    );
};

export default VistaServicios;
