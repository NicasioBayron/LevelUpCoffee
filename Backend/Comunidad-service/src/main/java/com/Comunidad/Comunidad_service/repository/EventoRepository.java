package com.Comunidad.Comunidad_service.repository;

import com.Comunidad.Comunidad_service.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByActivo(Integer activo);
}
