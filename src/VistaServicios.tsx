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
        <div className="vista-servicios">
            <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
                Servicios
            </h1>
            
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
