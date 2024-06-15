/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/springframework/Controller.java to edit this template
 */
package com.proyecto.lenguajes.barber.controller;

import com.proyecto.lenguajes.barber.domain.Servicio;
import com.proyecto.lenguajes.barber.domain.Usuario;
import com.proyecto.lenguajes.barber.services.IServicioService;
import com.proyecto.lenguajes.barber.services.IUsuarioService;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/barber_shop_booking_hub/servicio")
@RestController
public class ServicioController {

    @Autowired
    private IServicioService servicioService;
    @Autowired
    private IUsuarioService usuarioService;

    @GetMapping("/listar")
    public Page<Servicio> listarServicios(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return servicioService.listado(pageable);
    }
    
    @GetMapping("/buscar")
    public Page<Servicio> buscarServicios(@RequestParam String nombre,
                                          @RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "3") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return servicioService.buscarPorNombre(nombre, pageable);
    }

    @PostMapping("/registrar")
    public Servicio registrarServicio(
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam int duracion,
            @RequestParam double precioBase,
            @RequestParam int usuarioId
    ) {

        Servicio servicio = new Servicio();
        servicio.setNombre(nombre);
        servicio.setDescripcion(descripcion);
        servicio.setDuracion(duracion);
        servicio.setPrecioBase(precioBase);
        servicio.setUsuario(usuarioService.porId(usuarioId));

        return servicioService.agregar(servicio);
    }

    @PostMapping("/actualizar")
    public Servicio actualizarServicio(
            @RequestParam int id,
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam int duracion,
            @RequestParam double precioBase,
            @RequestParam int usuarioId,
            @RequestParam String imagenesEliminar

    ) {
        System.out.println(imagenesEliminar);
        String []vec = imagenesEliminar.split("!");
        Servicio servicio = servicioService.porId(id);
        servicio.setId(id);
        servicio.setNombre(nombre);
        servicio.setDescripcion(descripcion);
        servicio.setDuracion(duracion);
        servicio.setPrecioBase(precioBase);
        servicio.setUsuario(usuarioService.porId(usuarioId));
        
        for(String imagen: vec){
        servicio.getImagenes().remove(imagen);
        }

        return servicioService.agregar(servicio);
    }

    @PostMapping("/actualizarImagen")
    public Map<String, String> actualizarImagen(@RequestParam int id, @RequestParam("imagen") MultipartFile imagen) {
        String folderPath = "uploads/servicio/";
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
            Servicio servicio = servicioService.porId(id);
            servicio.getImagenes().add(fileUrl);
            servicioService.agregar(servicio);
            response.put("url", fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            response.put("error", "Error uploading file");
        }

        return response;
    }
    
    
    @DeleteMapping("/eliminar")
    public void eliminarServicio(@RequestParam int id){
        
        servicioService.eliminarPorId(id);
        
    }
    
    
}


