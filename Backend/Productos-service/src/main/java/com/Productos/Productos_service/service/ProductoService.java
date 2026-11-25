package com.Productos.Productos_service.service;

import com.Productos.Productos_service.dto.ProductoDTO;
import com.Productos.Productos_service.model.Categoria;
import com.Productos.Productos_service.model.Producto;
import com.Productos.Productos_service.repository.CategoriaRepository;
import com.Productos.Productos_service.repository.ProductoRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @PostConstruct
    public void init() {
        if (categoriaRepository.count() == 0) {
            Categoria estrategia = categoriaRepository.save(Categoria.builder().nombre("Estrategia").build());
            Categoria tcg = categoriaRepository.save(Categoria.builder().nombre("TCG").build());
            Categoria rol = categoriaRepository.save(Categoria.builder().nombre("Rol").build());
            Categoria cartas = categoriaRepository.save(Categoria.builder().nombre("Cartas").build());
            Categoria cafe = categoriaRepository.save(Categoria.builder().nombre("Café").build());
            Categoria pociones = categoriaRepository.save(Categoria.builder().nombre("Pociones").build());
            Categoria snacks = categoriaRepository.save(Categoria.builder().nombre("Snacks").build());

            productoRepository.save(Producto.builder()
                    .nombre("Catan (Juego Base)")
                    .categoria(estrategia)
                    .precio(new BigDecimal("39990"))
                    .imagen("/img/catan.png")
                    .descripcion("Juego de comercio y construcción.")
                    .stock(20)
                    .descuento(BigDecimal.ZERO)
                    .tipo("juego")
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Booster Pack Pokemon TCG")
                    .categoria(tcg)
                    .precio(new BigDecimal("4990"))
                    .imagen("/img/cartaspokemon.png")
                    .descripcion("Paquete de refuerzo Pokémon TCG.")
                    .stock(20)
                    .descuento(new BigDecimal("15"))
                    .tipo("juego")
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Set de Dados D&D Nebulosa")
                    .categoria(rol)
                    .precio(new BigDecimal("12990"))
                    .imagen("/img/dados.png")
                    .descripcion("Set de dados poliédricos para rol.")
                    .stock(20)
                    .descuento(BigDecimal.ZERO)
                    .tipo("juego")
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Exploding Kittens")
                    .categoria(cartas)
                    .precio(new BigDecimal("19990"))
                    .imagen("/img/kittens.png")
                    .descripcion("Juego de cartas de gatos explosivos.")
                    .stock(20)
                    .descuento(BigDecimal.ZERO)
                    .tipo("juego")
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Radiant Espresso")
                    .categoria(cafe)
                    .precio(new BigDecimal("3990"))
                    .imagen("/img/espresso.png")
                    .descripcion("Espresso para recuperar energía.")
                    .stock(20)
                    .descuento(BigDecimal.ZERO)
                    .tipo("cafe")
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Capuchino Trifuerza")
                    .categoria(cafe)
                    .precio(new BigDecimal("5990"))
                    .imagen("/img/capuchino.png")
                    .descripcion("Espresso, leche vaporizada y espuma.")
                    .stock(20)
                    .descuento(new BigDecimal("15"))
                    .tipo("cafe")
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Latte AFK")
                    .categoria(cafe)
                    .precio(new BigDecimal("4990"))
                    .imagen("/img/latte.png")
                    .descripcion("Latte suave para un descanso.")
                    .stock(20)
                    .descuento(BigDecimal.ZERO)
                    .tipo("cafe")
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Poción de Vida")
                    .categoria(pociones)
                    .precio(new BigDecimal("6990"))
                    .imagen("/img/pociondevida.png")
                    .descripcion("Bebida frutal energizante.")
                    .stock(20)
                    .descuento(BigDecimal.ZERO)
                    .tipo("cafe")
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Cold Brew Jungla")
                    .categoria(pociones)
                    .precio(new BigDecimal("8990"))
                    .imagen("/img/coldbrewjungla.png")
                    .descripcion("Extracción en frío con toque herbal.")
                    .stock(20)
                    .descuento(BigDecimal.ZERO)
                    .tipo("cafe")
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Muffin de Maná")
                    .categoria(snacks)
                    .precio(new BigDecimal("3490"))
                    .imagen("/img/muffindemana.png")
                    .descripcion("Muffin con arándanos y chocolate.")
                    .stock(20)
                    .descuento(new BigDecimal("15"))
                    .tipo("cafe")
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Sandwich GG WP")
                    .categoria(snacks)
                    .precio(new BigDecimal("5990"))
                    .imagen("/img/sandwich.png")
                    .descripcion("Ciabatta con jamón y queso.")
                    .stock(20)
                    .descuento(BigDecimal.ZERO)
                    .tipo("cafe")
                    .build());
        }
    }

    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    public Categoria guardarCategoria(ProductoDTO.CategoriaRequest request) {
        Categoria c = Categoria.builder()
                .nombre(request.getNombre())
                .activo(request.getActivo() != null ? request.getActivo() : 1)
                .build();
        return categoriaRepository.save(c);
    }

    public List<Producto> listarProductos(Long categoriaId, String tipo) {
        if (categoriaId != null) {
            return productoRepository.findByCategoriaIdAndActivo(categoriaId, 1);
        }
        if (tipo != null && !tipo.isBlank()) {
            return productoRepository.findByTipoAndActivo(tipo, 1);
        }
        return productoRepository.findAll();
    }

    public Optional<Producto> obtenerProducto(Long id) {
        return productoRepository.findById(id);
    }

    public Producto crearProducto(ProductoDTO.ProductoRequest request) {
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + request.getCategoriaId()));

        Producto producto = Producto.builder()
                .nombre(request.getNombre())
                .categoria(categoria)
                .precio(request.getPrecio())
                .imagen(request.getImagen() != null ? request.getImagen() : "")
                .descripcion(request.getDescripcion() != null ? request.getDescripcion() : "")
                .stock(request.getStock() != null ? request.getStock() : 0)
                .descuento(request.getDescuento() != null ? request.getDescuento() : BigDecimal.ZERO)
                .tipo(request.getTipo() != null ? request.getTipo() : "juego")
                .activo(request.getActivo() != null ? request.getActivo() : 1)
                .build();

        return productoRepository.save(producto);
    }

    public Producto actualizarProducto(Long id, ProductoDTO.ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));

        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + request.getCategoriaId()));
            producto.setCategoria(categoria);
        }

        if (request.getNombre() != null) producto.setNombre(request.getNombre());
        if (request.getPrecio() != null) producto.setPrecio(request.getPrecio());
        if (request.getImagen() != null) producto.setImagen(request.getImagen());
        if (request.getDescripcion() != null) producto.setDescripcion(request.getDescripcion());
        if (request.getStock() != null) producto.setStock(request.getStock());
        if (request.getDescuento() != null) producto.setDescuento(request.getDescuento());
        if (request.getTipo() != null) producto.setTipo(request.getTipo());
        if (request.getActivo() != null) producto.setActivo(request.getActivo());

        return productoRepository.save(producto);
    }

    public Producto descontarStock(Long id, int cantidad) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));

        if (producto.getStock() < cantidad) {
            throw new IllegalArgumentException("Stock insuficiente para el producto: " + producto.getNombre());
        }

        producto.setStock(producto.getStock() - cantidad);
        return productoRepository.save(producto);
    }

    public void eliminarProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));
        producto.setActivo(0);
        productoRepository.save(producto);
    }
}
