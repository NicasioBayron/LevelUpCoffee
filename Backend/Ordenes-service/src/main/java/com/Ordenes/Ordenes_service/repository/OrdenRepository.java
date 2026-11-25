package com.Ordenes.Ordenes_service.repository;

import com.Ordenes.Ordenes_service.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    Optional<Orden> findByNumero(String numero);
    List<Orden> findByUsuarioId(Long usuarioId);
    List<Orden> findAllByOrderByFechaDesc();
}
