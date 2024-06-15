/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyecto.lenguajes.barber.services;

import com.proyecto.lenguajes.barber.domain.Usuario;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface IUsuarioService {
    Usuario agregar(Usuario usuario);
    Page<Usuario> listado(Pageable pageable);
    void eliminarPorId(int usuarioId);
    Usuario porId(int usuarioId);
    void actualizarImagen(int id, String imagenUrl);
    Usuario actualizar(Usuario usuario);
    Usuario autenticar(String correoElectronico, String contrasena);
    boolean actualizarContrasena(int id, String contrasenaActual, String nuevaContrasena);
    Usuario recuperarContrasena(int id,String contrasena);
    boolean enviarToken(String correoElectronico);
    boolean verificarToken(int userId, String token);
    boolean actualizarContrasenaConToken(int userId, String nuevaContrasena);
    Usuario findByCorreoElectronicoAndEstado(String correoElectronico, char estado);
    Page<Usuario> buscarPorNombre(String nombreUsuario, Pageable pageable);

}