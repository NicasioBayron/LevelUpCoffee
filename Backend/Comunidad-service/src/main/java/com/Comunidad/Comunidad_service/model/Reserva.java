package com.Comunidad.Comunidad_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "nombre_contacto", nullable = false, length = 150)
    private String nombreContacto;

    @Column(name = "correo_contacto", nullable = false, length = 150)
    private String correoContacto;

    @Column(nullable = false)
    private Integer personas;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String estado = "PENDIENTE";

    @Column(name = "fecha_solicitud", nullable = false)
    @Builder.Default
    private LocalDateTime fechaSolicitud = LocalDateTime.now();
}
