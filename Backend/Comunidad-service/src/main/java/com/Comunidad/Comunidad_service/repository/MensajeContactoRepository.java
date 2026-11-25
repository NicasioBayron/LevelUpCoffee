package com.Comunidad.Comunidad_service.repository;

import com.Comunidad.Comunidad_service.model.MensajeContacto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeContactoRepository extends JpaRepository<MensajeContacto, Long> {
    List<MensajeContacto> findAllByOrderByFechaDesc();
    List<MensajeContacto> findByEstado(String estado);
}
