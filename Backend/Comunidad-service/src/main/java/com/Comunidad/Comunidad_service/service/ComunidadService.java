package com.Comunidad.Comunidad_service.service;

import com.Comunidad.Comunidad_service.dto.ComunidadDTO;
import com.Comunidad.Comunidad_service.model.Evento;
import com.Comunidad.Comunidad_service.model.MensajeContacto;
import com.Comunidad.Comunidad_service.model.Publicacion;
import com.Comunidad.Comunidad_service.model.Reserva;
import com.Comunidad.Comunidad_service.repository.EventoRepository;
import com.Comunidad.Comunidad_service.repository.MensajeContactoRepository;
import com.Comunidad.Comunidad_service.repository.PublicacionRepository;
import com.Comunidad.Comunidad_service.repository.ReservaRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ComunidadService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private MensajeContactoRepository mensajeContactoRepository;

    @Autowired
    private PublicacionRepository publicacionRepository;

    @PostConstruct
    public void init() {
        if (eventoRepository.count() == 0) {
            eventoRepository.save(Evento.builder()
                    .titulo("Torneo de Catan de Otoño")
                    .descripcion("Compite por recursos en nuestro torneo mensual con premios especiales de la cafetería.")
                    .fecha(LocalDateTime.now().plusDays(7))
                    .capacidad(16)
                    .activo(1)
                    .build());

            eventoRepository.save(Evento.builder()
                    .titulo("Noche de Rol & Dungeons")
                    .descripcion("Campaña One-Shot para principiantes y veteranos, incluye set de dados y poción a elección.")
                    .fecha(LocalDateTime.now().plusDays(12))
                    .capacidad(10)
                    .activo(1)
                    .build());
        }

        if (publicacionRepository.count() == 0) {
            publicacionRepository.save(Publicacion.builder()
                    .titulo("Guía rápida: Primeros pasos en D&D")
                    .resumen("Consejos esenciales para crear tu primer personaje y no morir en el primer intento.")
                    .contenido("En esta guía te explicamos cómo elegir tu raza, clase y distribuir tus estadísticas de juego de manera óptima...")
                    .imagen("/img/dados.png")
                    .publicado(1)
                    .fechaPublicacion(LocalDateTime.now().minusDays(3))
                    .build());
        }
    }

    // --- EVENTOS ---
    public List<Evento> listarEventos() {
        return eventoRepository.findByActivo(1);
    }

    public Evento crearEvento(ComunidadDTO.EventoRequest req) {
        Evento evento = Evento.builder()
                .titulo(req.getTitulo())
                .descripcion(req.getDescripcion())
                .fecha(req.getFecha())
                .capacidad(req.getCapacidad())
                .activo(req.getActivo() != null ? req.getActivo() : 1)
                .build();
        return eventoRepository.save(evento);
    }

    // --- RESERVAS ---
    public List<Reserva> listarReservas(Long usuarioId) {
        if (usuarioId != null) return reservaRepository.findByUsuarioId(usuarioId);
        return reservaRepository.findAll();
    }

    public Reserva crearReserva(ComunidadDTO.ReservaRequest req) {
        Evento evento = eventoRepository.findById(req.getEventoId())
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado con ID: " + req.getEventoId()));

        Reserva reserva = Reserva.builder()
                .evento(evento)
                .usuarioId(req.getUsuarioId())
                .nombreContacto(req.getNombreContacto())
                .correoContacto(req.getCorreoContacto())
                .personas(req.getPersonas() != null ? req.getPersonas() : 1)
                .estado("CONFIRMADA")
                .fechaSolicitud(LocalDateTime.now())
                .build();

        return reservaRepository.save(reserva);
    }

    public Reserva actualizarEstadoReserva(Long id, String estado) {
        Reserva r = reservaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada con ID: " + id));
        r.setEstado(estado);
        return reservaRepository.save(r);
    }

    // --- MENSAJES DE CONTACTO ---
    public List<MensajeContacto> listarMensajes() {
        return mensajeContactoRepository.findAllByOrderByFechaDesc();
    }

    public MensajeContacto crearMensaje(ComunidadDTO.MensajeContactoRequest req) {
        MensajeContacto m = MensajeContacto.builder()
                .usuarioId(req.getUsuarioId())
                .nombre(req.getNombre())
                .correo(req.getCorreo())
                .asunto(req.getAsunto())
                .mensaje(req.getMensaje())
                .estado("NUEVO")
                .fecha(LocalDateTime.now())
                .build();
        return mensajeContactoRepository.save(m);
    }

    public MensajeContacto actualizarEstadoMensaje(Long id, String estado) {
        MensajeContacto m = mensajeContactoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mensaje no encontrado con ID: " + id));
        m.setEstado(estado);
        return mensajeContactoRepository.save(m);
    }

    // --- BLOG / PUBLICACIONES ---
    public List<Publicacion> listarPublicaciones(boolean soloPublicadas) {
        if (soloPublicadas) {
            return publicacionRepository.findByPublicadoOrderByFechaPublicacionDesc(1);
        }
        return publicacionRepository.findAll();
    }

    public Optional<Publicacion> obtenerPublicacion(Long id) {
        return publicacionRepository.findById(id);
    }

    public Publicacion crearPublicacion(ComunidadDTO.PublicacionRequest req) {
        Publicacion p = Publicacion.builder()
                .titulo(req.getTitulo())
                .resumen(req.getResumen())
                .contenido(req.getContenido())
                .imagen(req.getImagen())
                .publicado(req.getPublicado() != null ? req.getPublicado() : 1)
                .fechaPublicacion(LocalDateTime.now())
                .build();
        return publicacionRepository.save(p);
    }
}
