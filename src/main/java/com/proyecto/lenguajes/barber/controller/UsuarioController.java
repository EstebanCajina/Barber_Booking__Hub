package com.proyecto.lenguajes.barber.controller;

import com.proyecto.lenguajes.barber.domain.Usuario;
import com.proyecto.lenguajes.barber.jpa.UsuarioServiceJPA;
import com.proyecto.lenguajes.barber.services.IUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@CrossOrigin(origins = "http://localhost:5173") // Usa allowedOriginPatterns")
@RequestMapping("/barber_shop_booking_hub/cuenta")
@RestController
public class UsuarioController {

    @Autowired
    private IUsuarioService usuarioService;

    @GetMapping("/listar")
    public Page<Usuario> listarUsuarios(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return usuarioService.listado(pageable);
    }
    
    @GetMapping("/buscar")
    public Page<Usuario> buscarUsuariosPorNombre(@RequestParam String nombre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return usuarioService.buscarPorNombre(nombre, pageable);
    }

    @PostMapping("/registrar")
    public Usuario registrarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.agregar(usuario);
    }

    @PostMapping("/actualizarAdmin")
    public Usuario esAdmin(@RequestParam int id, @RequestParam String admin) {
        Usuario usuario = usuarioService.porId(id);
        if (usuario != null) {
            usuario.setAdmin(admin.charAt(0));
            return usuarioService.actualizar(usuario);
        }
        return null;
    }
    
    @PostMapping("/actualizarBarbero")
    public Usuario esBarbero(@RequestParam int id, @RequestParam String barbero) {
        Usuario usuario = usuarioService.porId(id);
        if (usuario != null) {
            usuario.setBarbero(barbero.charAt(0));
            return usuarioService.actualizar(usuario);
        }
        return null;
    }

    @PostMapping("/actualizar")
    public Usuario actualizarUsuario(@RequestParam int id, @RequestBody Usuario usuario) {
        System.out.println(usuario.toString());
        usuario.setId(id);
        Usuario us = usuarioService.porId(id);
        usuario.setContrasena(us.getContrasena());
        usuario.setEstado(us.getEstado());
        usuario.setAdmin(us.getAdmin());
        usuario.setBarbero(us.getBarbero());
        usuario.setImagen(us.getImagen());
        usuario.setServicios(us.getServicios());

        return usuarioService.actualizar(usuario);
    }

    @PostMapping("/actualizarImagen")
    public Map<String, String> actualizarImagen(@RequestParam int id, @RequestParam("imagen") MultipartFile imagen) {
        String folderPath = "uploads/usuario/";
        File folder = new File(folderPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        String fileName = UUID.randomUUID().toString() + "_" + imagen.getOriginalFilename();
        Path filePath = Paths.get(folderPath + fileName);

        Map<String, String> response = new HashMap<>();
        try {
            Files.write(filePath, imagen.getBytes());
            String fileUrl = "http://localhost:1111/" + folderPath + fileName;
            usuarioService.actualizarImagen(id, fileUrl);
            response.put("url", fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            response.put("error", "Error uploading file");
        }

        return response;
    }

    @GetMapping("/eliminar")
    public void eliminarUsuario(@RequestParam int id) {
        usuarioService.eliminarPorId(id);
    }

    @PostMapping("/login")
    public Usuario loginUsuario(@RequestBody Usuario usuario) {

        return usuarioService.autenticar(usuario.getCorreoElectronico(), usuario.getContrasena());
    }

    @PostMapping("/recuperacion")
    public Usuario recuperacionUsuario(@RequestParam int id,
            @RequestParam String contrasena) {

        return usuarioService.recuperarContrasena(id, contrasena);
    }

    @PostMapping("/cambiarContrasena")
    public ResponseEntity<String> cambiarContrasena(
            @RequestParam int id,
            @RequestParam String contrasenaActual,
            @RequestParam String contrasenaNueva
    ) {
        try {
            boolean actualizado = usuarioService.actualizarContrasena(id, contrasenaActual, contrasenaNueva);
            if (actualizado) {
                return ResponseEntity.ok("Contraseña actualizada exitosamente.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al actualizar la contraseña.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor.");
        }
    }

    @PostMapping("/enviar-token")
    public ResponseEntity<Map<String, Object>> enviarToken(@RequestBody Map<String, String> request) {
        String correoElectronico = request.get("correoElectronico");
        boolean enviado = usuarioService.enviarToken(correoElectronico);
        if (enviado) {
            Map<String, Object> response = new HashMap<>();
            Usuario usuario = usuarioService.findByCorreoElectronicoAndEstado(correoElectronico, '1');
            response.put("success", true);
            response.put("userId", usuario.getId());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false));
        }
    }

    @PostMapping("/verificar-token")
    public ResponseEntity<Map<String, Boolean>> verificarToken(@RequestBody Map<String, Object> request) {
        int userId = (int) request.get("userId");
        String token = (String) request.get("token");
        boolean verificado = usuarioService.verificarToken(userId, token);
        return ResponseEntity.ok(Map.of("success", verificado));
    }

    @PostMapping("/actualizarContra")
    public ResponseEntity<Map<String, Boolean>> actualizarContrasenaConToken(@RequestParam int userId, @RequestParam String nuevaContrasena) {
        System.out.println("el id de usuario es: "+ userId +" la nueva contraseña es: "+ nuevaContrasena);
        boolean actualizado = usuarioService.actualizarContrasenaConToken(userId, nuevaContrasena);
        return ResponseEntity.ok(Map.of("success", actualizado));
    }

}
