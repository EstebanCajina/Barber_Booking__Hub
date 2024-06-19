import React from 'react';

export interface Membresia {
    id: number;
    horaVencimiento: Date;
    tipo: number;
    precio: number;
    beneficios: string[];
}