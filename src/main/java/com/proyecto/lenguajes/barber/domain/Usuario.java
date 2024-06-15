
package com.proyecto.lenguajes.barber.domain;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "nombreUsuario", nullable = false, length = 45)
    private String nombreUsuario;

    @Column(name = "cedula", nullable = false, length = 45, unique = true)
    private String cedula;

    @Column(name = "contrasena", nullable = false, length = 45)
    private String contrasena;

    @Column(name = "estado", nullable = false, length = 1)
    private char estado = '1';

    @Column(name = "admin", nullable = false, length = 1)
    private char admin = '0';
    
    @Column(name = "barbero", nullable = false, length = 1)
    private char barbero = '0';

    @Column(name = "correoElectronico", nullable = false, length = 45, unique = true)
    private String correoElectronico;

    @Column(name = "numeroTelefono", nullable = false, length = 45)
    private String numeroTelefono;

    @Column(name = "imagen", length = 150)
    private String imagen;
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Servicio> servicios;

    // Constructor por defecto
    public Usuario() {}

    public Usuario(int id, String nombreUsuario, String cedula, String contrasena, String correoElectronico, String numeroTelefono, String imagen, List<Servicio> servicios) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.cedula = cedula;
        this.contrasena = contrasena;
        this.correoElectronico = correoElectronico;
        this.numeroTelefono = numeroTelefono;
        this.imagen = imagen;
        this.servicios = servicios;
    }

    public List<Servicio> getServicios() {
        return servicios;
    }

    public void setServicios(List<Servicio> servicios) {
        this.servicios = servicios;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public char getEstado() {
        return estado;
    }

    public void setEstado(char estado) {
        this.estado = estado;
    }

    public char getAdmin() {
        return admin;
    }

    public void setAdmin(char admin) {
        this.admin = admin;
    }

    public char getBarbero() {
        return barbero;
    }

    public void setBarbero(char barbero) {
        this.barbero = barbero;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public String getNumeroTelefono() {
        return numeroTelefono;
    }

    public void setNumeroTelefono(String numeroTelefono) {
        this.numeroTelefono = numeroTelefono;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

   

    // toString para representar el objeto como cadena
    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", nombreUsuario='" + nombreUsuario + '\'' +
                ", cedula='" + cedula + '\'' +
                ", contrasena='" + contrasena + '\'' +
                ", estado=" + estado +
                ", admin=" + admin +
                ", correoElectronico='" + correoElectronico + '\'' +
                ", numeroTelefono='" + numeroTelefono + '\'' +
                ", imagen='" + imagen + '\'' +
                '}';
    }
}