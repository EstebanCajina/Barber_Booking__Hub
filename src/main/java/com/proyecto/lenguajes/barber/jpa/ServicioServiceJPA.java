/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyecto.lenguajes.barber.jpa;

import com.proyecto.lenguajes.barber.domain.Servicio;
import com.proyecto.lenguajes.barber.repository.ServicioRepository;
import com.proyecto.lenguajes.barber.repository.UsuarioRepository;
import com.proyecto.lenguajes.barber.services.IServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 *
 * @author Esteb
 */
@Service
@Primary
public class ServicioServiceJPA implements IServicioService {
    
    @Autowired
    private ServicioRepository servicioRepository;

    @Override
    public Servicio agregar(Servicio servicio) {
        
        return servicioRepository.save(servicio);
        
    }

    @Override
    public Page<Servicio> listado(Pageable pageable) {
        
        return servicioRepository.findAll(pageable);

    }

    @Override
    public void eliminarPorId(int servicioId) {
        
        servicioRepository.deleteById(servicioId);
    }

    @Override
    public Servicio porId(int servicioId) {
        
        return servicioRepository.findById(servicioId).get();
        
    }
    
    @Override
    public Page<Servicio> buscarPorNombre(String nombre, Pageable pageable) {
        return servicioRepository.findByNombreContainingIgnoreCase(nombre, pageable);
    }
    
}
