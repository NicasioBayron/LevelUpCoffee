package com.Comunidad.Comunidad_service.controller;

import com.Comunidad.Comunidad_service.dto.ComunidadDTO;
import com.Comunidad.Comunidad_service.model.Evento;
import com.Comunidad.Comunidad_service.model.MensajeContacto;
import com.Comunidad.Comunidad_service.model.Publicacion;
import com.Comunidad.Comunidad_service.model.Reserva;
import com.Comunidad.Comunidad_service.service.ComunidadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comunidad")
public class ComunidadController {

    @Autowired
    private ComunidadService comunidadService;

    // --- EVENTOS ---
    @GetMapping("/eventos")
    public ResponseEntity<List<Evento>> listarEventos() {
        return ResponseEntity.ok(comunidadService.listarEventos());
    }

    @PostMapping("/eventos")
    public ResponseEntity<?> crearEvento(@Valid @RequestBody ComunidadDTO.EventoRequest req) {
        try {
            Evento evento = comunidadService.crearEvento(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(evento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- RESERVAS ---
    @GetMapping("/reservas")
    public ResponseEntity<List<Reserva>> listarReservas(@RequestParam(required = false) Long usuarioId) {
        return ResponseEntity.ok(comunidadService.listarReservas(usuarioId));
    }

    @PostMapping("/reservas")
    public ResponseEntity<?> crearReserva(@Valid @RequestBody ComunidadDTO.ReservaRequest req) {
        try {
            Reserva reserva = comunidadService.crearReserva(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(reserva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/reservas/{id}/estado")
    public ResponseEntity<?> actualizarEstadoReserva(
            @PathVariable Long id,
            @Valid @RequestBody ComunidadDTO.EstadoUpdateRequest req) {
        try {
            Reserva reserva = comunidadService.actualizarEstadoReserva(id, req.getEstado());
            return ResponseEntity.ok(reserva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- MENSAJES DE CONTACTO ---
    @GetMapping("/mensajes")
    public ResponseEntity<List<MensajeContacto>> listarMensajes() {
        return ResponseEntity.ok(comunidadService.listarMensajes());
    }

    @PostMapping("/mensajes")
    public ResponseEntity<?> crearMensaje(@Valid @RequestBody ComunidadDTO.MensajeContactoRequest req) {
        try {
            MensajeContacto mensaje = comunidadService.crearMensaje(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(mensaje);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/mensajes/{id}/estado")
    public ResponseEntity<?> actualizarEstadoMensaje(
            @PathVariable Long id,
            @Valid @RequestBody ComunidadDTO.EstadoUpdateRequest req) {
        try {
            MensajeContacto mensaje = comunidadService.actualizarEstadoMensaje(id, req.getEstado());
            return ResponseEntity.ok(mensaje);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- BLOG / PUBLICACIONES ---
    @GetMapping("/publicaciones")
    public ResponseEntity<List<Publicacion>> listarPublicaciones(
            @RequestParam(defaultValue = "true") boolean soloPublicadas) {
        return ResponseEntity.ok(comunidadService.listarPublicaciones(soloPublicadas));
    }

    @GetMapping("/publicaciones/{id}")
    public ResponseEntity<?> obtenerPublicacion(@PathVariable Long id) {
        return comunidadService.obtenerPublicacion(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/publicaciones")
    public ResponseEntity<?> crearPublicacion(@Valid @RequestBody ComunidadDTO.PublicacionRequest req) {
        try {
            Publicacion publicacion = comunidadService.crearPublicacion(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(publicacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
