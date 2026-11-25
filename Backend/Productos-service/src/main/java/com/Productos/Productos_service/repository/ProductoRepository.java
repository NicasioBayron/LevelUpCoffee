package com.Productos.Productos_service.repository;

import com.Productos.Productos_service.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByActivo(Integer activo);
    List<Producto> findByCategoriaIdAndActivo(Long categoriaId, Integer activo);
    List<Producto> findByTipoAndActivo(String tipo, Integer activo);
}
