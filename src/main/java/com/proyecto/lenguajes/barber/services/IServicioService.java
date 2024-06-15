/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyecto.lenguajes.barber.services;

import com.proyecto.lenguajes.barber.domain.Servicio;
import com.proyecto.lenguajes.barber.domain.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 *
 * @author Esteb
 */
public interface IServicioService {
    
    Servicio agregar(Servicio servicio);
    Page<Servicio> listado(Pageable pageable);
    void eliminarPorId(int servicioId);
    Servicio porId(int servicioId);
    Page<Servicio> buscarPorNombre(String nombre, Pageable pageable);
    
    
}
