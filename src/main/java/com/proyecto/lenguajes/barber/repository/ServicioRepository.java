/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyecto.lenguajes.barber.repository;

import com.proyecto.lenguajes.barber.domain.Servicio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Esteb
 */
public interface ServicioRepository extends JpaRepository<Servicio, Integer>{
        Page<Servicio> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

}
