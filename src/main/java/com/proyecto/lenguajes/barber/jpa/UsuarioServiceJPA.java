/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyecto.lenguajes.barber.jpa;

import com.proyecto.lenguajes.barber.domain.Usuario;
import com.proyecto.lenguajes.barber.repository.UsuarioRepository;
import com.proyecto.lenguajes.barber.services.CorreoElectronicoService;
import com.proyecto.lenguajes.barber.services.IUsuarioService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 *
 * @author Esteb
 */
@Service
@Primary
public class UsuarioServiceJPA implements IUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private CorreoElectronicoService emailService;  // Un servicio para enviar correos electrónicos

    private Map<Integer, String> tokenStore = new HashMap<>();  // Simula una memoria cache

    public String generarToken() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    @Override
    public boolean enviarToken(String correoElectronico) {
        Usuario usuario = usuarioRepository.findByCorreoElectronicoAndEstado(correoElectronico, '1');
        if (usuario != null) {
            String token = generarToken();
            tokenStore.put(usuario.getId(), token);
            emailService.sendEmail(correoElectronico, "Token de recuperación de contraseña", "Tu token es: " + token);
            return true;
        }
        return false;
    }

    @Override
    public boolean verificarToken(int userId, String token) {
        return tokenStore.containsKey(userId) && tokenStore.get(userId).equals(token);
    }

    @Override
    public boolean actualizarContrasenaConToken(int userId, String nuevaContrasena) {
        Usuario usuario = porId(userId);
        if (usuario != null) {
            usuario.setContrasena(DigestUtils.sha1Hex(nuevaContrasena));
            usuarioRepository.save(usuario);
            tokenStore.remove(userId);
            return true;
        }
        return false;
    }

    public Page<Usuario> listado(Pageable pageable) {
        return usuarioRepository.findByEstado('1', pageable);
    }

    @Override

    public Usuario porId(int id) {
        return usuarioRepository.findById(id).get();
    }

    @Override

    public Usuario agregar(Usuario usuario) {
        // Cifrar la contraseña con SHA-1 antes de guardarla
        usuario.setContrasena(DigestUtils.sha1Hex(usuario.getContrasena()));
        return usuarioRepository.save(usuario);
    }
    
    @Override
    public Usuario recuperarContrasena(int id,String contrasena) {
        Usuario usuario = porId(id);
        // Cifrar la contraseña con SHA-1 antes de guardarla
        usuario.setContrasena(DigestUtils.sha1Hex(contrasena));
        return usuarioRepository.save(usuario);
    }

    @Override

    public void eliminarPorId(int id) {
        Usuario usuarioOptional = porId(id);
        if (usuarioOptional != null) {
            Usuario usuario = usuarioOptional;
            usuario.setEstado('0');
            usuarioRepository.save(usuario);
        }
    }

    @Override

    public Usuario actualizar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override

    public Usuario autenticar(String correoElectronico, String contrasena) {
        // Cifrar la contraseña proporcionada con SHA-1 antes de compararla
        String cifrada = DigestUtils.sha1Hex(contrasena);
        return usuarioRepository.findByCorreoElectronicoAndContrasenaAndEstado(correoElectronico, cifrada, '1');
    }

    @Override

    public boolean actualizarContrasena(int id, String contrasenaActual, String nuevaContrasena) {
        Usuario usuarioOptional = porId(id);
        if (usuarioOptional != null) {
            Usuario usuario = usuarioOptional;
            if (usuario.getContrasena().equals(DigestUtils.sha1Hex(contrasenaActual))) {
                // Cifrar la nueva contraseña antes de guardarla
                usuario.setContrasena(DigestUtils.sha1Hex(nuevaContrasena));
                usuarioRepository.save(usuario);
                return true;
            }
        }
        return false;
    }

    @Override

    public void actualizarImagen(int id, String imagenUrl) {
        Usuario usuario = porId(id);
        if (usuario != null) {
            usuario.setImagen(imagenUrl);
            usuarioRepository.save(usuario);
        }
    }

    @Override
    public Usuario findByCorreoElectronicoAndEstado(String correoElectronico, char estado) {
        
        return usuarioRepository.findByCorreoElectronicoAndEstado(correoElectronico, estado);

    }
    
    // Nuevo método para buscar usuarios por nombre con paginación
    @Override
    public Page<Usuario> buscarPorNombre(String nombreUsuario, Pageable pageable) {
        return usuarioRepository.findByNombreUsuarioAndEstado(nombreUsuario, '1', pageable);
    }
    
}
