package com.Ordenes.Ordenes_service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

public class OrdenDTO {

    @Data
    public static class DetalleRequest {
        @NotNull(message = "productoId es requerido")
        private Long productoId;

        @NotBlank(message = "nombreProducto es requerido")
        private String nombreProducto;

        @NotNull(message = "precioUnitario es requerido")
        @DecimalMin(value = "0.0")
        private BigDecimal precioUnitario;

        @NotNull(message = "cantidad es requerida")
        private Integer cantidad;
    }

    @Data
    public static class CrearOrdenRequest {
        private Long usuarioId;

        @NotBlank(message = "El nombre del cliente es requerido")
        private String nombreCliente;

        @NotBlank(message = "El correo del cliente es requerido")
        @Email(message = "Correo no válido")
        private String correoCliente;

        @NotBlank(message = "El tipo de entrega es requerido (envio / retiro)")
        private String tipoEntrega;

        private String sucursalRetiro;
        private String direccionEntrega;

        @DecimalMin(value = "0.0")
        private BigDecimal costoEnvio;

        @NotEmpty(message = "Debe incluir al menos un producto en el pedido")
        private List<DetalleRequest> items;
    }

    @Data
    public static class ActualizarEstadoRequest {
        @NotBlank(message = "El nuevo estado es requerido")
        private String estado;
    }
}
