package com.Ordenes.Ordenes_service.controller;

import com.Ordenes.Ordenes_service.dto.OrdenDTO;
import com.Ordenes.Ordenes_service.model.Orden;
import com.Ordenes.Ordenes_service.service.OrdenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    @Autowired
    private OrdenService ordenService;

    @GetMapping
    public ResponseEntity<List<Orden>> listar(@RequestParam(required = false) Long usuarioId) {
        if (usuarioId != null) {
            return ResponseEntity.ok(ordenService.listarPorUsuario(usuarioId));
        }
        return ResponseEntity.ok(ordenService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return ordenService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/numero/{numero}")
    public ResponseEntity<?> obtenerPorNumero(@PathVariable String numero) {
        return ordenService.obtenerPorNumero(numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearOrden(@Valid @RequestBody OrdenDTO.CrearOrdenRequest request) {
        try {
            Orden orden = ordenService.crearOrden(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(orden);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @Valid @RequestBody OrdenDTO.ActualizarEstadoRequest request) {
        try {
            Orden orden = ordenService.actualizarEstado(id, request.getEstado());
            return ResponseEntity.ok(orden);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
