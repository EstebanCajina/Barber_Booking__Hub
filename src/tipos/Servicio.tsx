import { Usuario } from "./Usuario";
export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    duracion: number;
    precioBase: number;
    imagenes: string[];
    usuario: Usuario;
  }