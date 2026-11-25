package com.Comunidad.Comunidad_service.repository;

import com.Comunidad.Comunidad_service.model.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {
    List<Publicacion> findByPublicadoOrderByFechaPublicacionDesc(Integer publicado);
}
