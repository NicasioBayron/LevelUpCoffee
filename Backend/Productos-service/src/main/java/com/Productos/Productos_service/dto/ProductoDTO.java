package com.Productos.Productos_service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

public class ProductoDTO {

    @Data
    public static class ProductoRequest {
        @NotBlank(message = "El nombre es requerido")
        private String nombre;

        @NotNull(message = "La categoría es requerida")
        private Long categoriaId;

        @NotNull(message = "El precio es requerido")
        @DecimalMin(value = "0.0", message = "El precio debe ser mayor o igual a 0")
        private BigDecimal precio;

        private String imagen;
        private String descripcion;

        @Min(value = 0, message = "El stock debe ser mayor o igual a 0")
        private Integer stock;

        private BigDecimal descuento;
        private String tipo;
        private Integer activo;
    }

    @Data
    public static class StockUpdateRequest {
        @NotNull(message = "La cantidad a descontar es requerida")
        private Integer cantidad;
    }

    @Data
    public static class CategoriaRequest {
        @NotBlank(message = "El nombre de la categoría es requerido")
        private String nombre;

        private Integer activo;
    }
}
