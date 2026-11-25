package com.Comunidad.Comunidad_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "publicaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(length = 500)
    private String resumen;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(length = 250)
    private String imagen;

    @Column(nullable = false)
    @Builder.Default
    private Integer publicado = 0;

    @Column(name = "fecha_publicacion")
    private LocalDateTime fechaPublicacion;
}
