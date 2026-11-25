package com.Productos.Productos_service.controller;

import com.Productos.Productos_service.dto.ProductoDTO;
import com.Productos.Productos_service.model.Categoria;
import com.Productos.Productos_service.model.Producto;
import com.Productos.Productos_service.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<Producto>> listar(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) String tipo) {
        return ResponseEntity.ok(productoService.listarProductos(categoriaId, tipo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return productoService.obtenerProducto(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody ProductoDTO.ProductoRequest request) {
        try {
            Producto producto = productoService.crearProducto(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(producto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ProductoDTO.ProductoRequest request) {
        try {
            Producto actualizado = productoService.actualizarProducto(id, request);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/descontar-stock")
    public ResponseEntity<?> descontarStock(@PathVariable Long id,
            @Valid @RequestBody ProductoDTO.StockUpdateRequest request) {
        try {
            Producto producto = productoService.descontarStock(id, request.getCantidad());
            return ResponseEntity.ok(producto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            productoService.eliminarProducto(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<Categoria>> listarCategorias() {
        return ResponseEntity.ok(productoService.listarCategorias());
    }

    @PostMapping("/categorias")
    public ResponseEntity<?> crearCategoria(@Valid @RequestBody ProductoDTO.CategoriaRequest request) {
        try {
            Categoria categoria = productoService.guardarCategoria(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(categoria);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
