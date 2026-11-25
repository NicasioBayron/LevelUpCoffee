package com.Ordenes.Ordenes_service.service;

import com.Ordenes.Ordenes_service.dto.OrdenDTO;
import com.Ordenes.Ordenes_service.model.DetalleOrden;
import com.Ordenes.Ordenes_service.model.Orden;
import com.Ordenes.Ordenes_service.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    @Value("${productos.service.url:http://localhost:8082/api/productos}")
    private String productosServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Orden> listarTodas() {
        return ordenRepository.findAllByOrderByFechaDesc();
    }

    public List<Orden> listarPorUsuario(Long usuarioId) {
        return ordenRepository.findByUsuarioId(usuarioId);
    }

    public Optional<Orden> obtenerPorId(Long id) {
        return ordenRepository.findById(id);
    }

    public Optional<Orden> obtenerPorNumero(String numero) {
        return ordenRepository.findByNumero(numero);
    }

    @Transactional
    public Orden crearOrden(OrdenDTO.CrearOrdenRequest request) {
        BigDecimal subtotal = BigDecimal.ZERO;
        List<DetalleOrden> detalles = new ArrayList<>();

        String numero = "LU-" + Long.toString(System.currentTimeMillis(), 36).toUpperCase();

        Orden orden = Orden.builder()
                .numero(numero)
                .usuarioId(request.getUsuarioId())
                .fecha(LocalDateTime.now())
                .estado("CONFIRMADO")
                .tipoEntrega(request.getTipoEntrega())
                .sucursalRetiro(request.getSucursalRetiro())
                .nombreCliente(request.getNombreCliente())
                .correoCliente(request.getCorreoCliente())
                .direccionEntrega(request.getDireccionEntrega())
                .costoEnvio(request.getCostoEnvio() != null ? request.getCostoEnvio() : BigDecimal.ZERO)
                .build();

        for (OrdenDTO.DetalleRequest item : request.getItems()) {
            if (item.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0 para " + item.getNombreProducto());
            }

            BigDecimal itemSubtotal = item.getPrecioUnitario().multiply(new BigDecimal(item.getCantidad()));
            subtotal = subtotal.add(itemSubtotal);

            DetalleOrden detalle = DetalleOrden.builder()
                    .orden(orden)
                    .productoId(item.getProductoId())
                    .nombreProducto(item.getNombreProducto())
                    .precioUnitario(item.getPrecioUnitario())
                    .cantidad(item.getCantidad())
                    .subtotal(itemSubtotal)
                    .build();

            detalles.add(detalle);

            // Intentar descontar stock en Productos-service si está disponible
            try {
                restTemplate.patchForObject(
                        productosServiceUrl + "/" + item.getProductoId() + "/descontar-stock",
                        Map.of("cantidad", item.getCantidad()),
                        Void.class
                );
            } catch (Exception ignored) {
                // Si el microservicio de productos no está accesible de inmediato, se registra la orden igualmente
            }
        }

        orden.setSubtotal(subtotal);
        BigDecimal costoEnvio = orden.getCostoEnvio();
        orden.setTotal(subtotal.add(costoEnvio));
        orden.setDetalles(detalles);

        return ordenRepository.save(orden);
    }

    public Orden actualizarEstado(Long id, String nuevoEstado) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada con ID: " + id));

        orden.setEstado(nuevoEstado);
        return ordenRepository.save(orden);
    }
}
