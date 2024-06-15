/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyecto.lenguajes.barber.repository;

import com.proyecto.lenguajes.barber.domain.Usuario;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Page<Usuario> findByEstado(char estado, Pageable pageable);
    Usuario findByCorreoElectronicoAndContrasenaAndEstado(String correoElectronico, String contrasena, char estado);
    Usuario findByCorreoElectronicoAndEstado(String correoElectronico, char estado);
    // Nuevo método para buscar usuarios por nombre
    @Query("SELECT u FROM Usuario u WHERE u.nombreUsuario LIKE %:nombreUsuario% AND u.estado = :estado")
    Page<Usuario> findByNombreUsuarioAndEstado(@Param("nombreUsuario") String nombreUsuario, @Param("estado") char estado, Pageable pageable);

    
}
