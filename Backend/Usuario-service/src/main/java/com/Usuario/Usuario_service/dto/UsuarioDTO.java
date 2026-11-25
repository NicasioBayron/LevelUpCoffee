package com.Usuario.Usuario_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class UsuarioDTO {

    @Data
    public static class LoginRequest {
        @NotBlank(message = "El correo es requerido")
        @Email(message = "Correo no válido")
        private String correo;

        @NotBlank(message = "La contraseña es requerida")
        private String password;
    }

    @Data
    public static class RegistroRequest {
        @NotBlank(message = "El nombre es requerido")
        private String nombre;

        @NotBlank(message = "El correo es requerido")
        @Email(message = "Correo no válido")
        private String correo;

        @NotBlank(message = "La contraseña es requerida")
        private String password;

        private String rol; // USER o ADMIN
        private String telefono;
        private String direccion;
        private String comuna;
    }

    @Data
    public static class UpdateRequest {
        private String nombre;
        private String password;
        private String rol;
        private String telefono;
        private String direccion;
        private String comuna;
    }
}
