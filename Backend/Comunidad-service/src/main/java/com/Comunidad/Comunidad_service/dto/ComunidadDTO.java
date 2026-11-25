package com.Comunidad.Comunidad_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class ComunidadDTO {

    @Data
    public static class EventoRequest {
        @NotBlank(message = "El título es requerido")
        private String titulo;

        private String descripcion;

        @NotNull(message = "La fecha es requerida")
        private LocalDateTime fecha;

        @NotNull(message = "La capacidad es requerida")
        @Min(value = 1, message = "La capacidad debe ser mayor a 0")
        private Integer capacidad;

        private Integer activo;
    }

    @Data
    public static class ReservaRequest {
        @NotNull(message = "El eventoId es requerido")
        private Long eventoId;

        private Long usuarioId;

        @NotBlank(message = "El nombre de contacto es requerido")
        private String nombreContacto;

        @NotBlank(message = "El correo de contacto es requerido")
        @Email(message = "Correo no válido")
        private String correoContacto;

        @NotNull(message = "El número de personas es requerido")
        @Min(value = 1, message = "Debe ser al menos 1 persona")
        private Integer personas;
    }

    @Data
    public static class MensajeContactoRequest {
        private Long usuarioId;

        @NotBlank(message = "El nombre es requerido")
        private String nombre;

        @NotBlank(message = "El correo es requerido")
        @Email(message = "Correo no válido")
        private String correo;

        @NotBlank(message = "El asunto es requerido")
        private String asunto;

        @NotBlank(message = "El mensaje es requerido")
        private String mensaje;
    }

    @Data
    public static class PublicacionRequest {
        @NotBlank(message = "El título es requerido")
        private String titulo;

        private String resumen;

        @NotBlank(message = "El contenido es requerido")
        private String contenido;

        private String imagen;
        private Integer publicado;
    }

    @Data
    public static class EstadoUpdateRequest {
        @NotBlank(message = "El estado es requerido")
        private String estado;
    }
}
