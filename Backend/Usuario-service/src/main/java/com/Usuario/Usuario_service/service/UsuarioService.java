package com.Usuario.Usuario_service.service;

import com.Usuario.Usuario_service.dto.UsuarioDTO;
import com.Usuario.Usuario_service.model.Usuario;
import com.Usuario.Usuario_service.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> obtenerPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    public Usuario registrar(UsuarioDTO.RegistroRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new IllegalArgumentException("El correo ya se encuentra registrado.");
        }
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .password(request.getPassword())
                .rol(request.getRol() != null && !request.getRol().isBlank() ? request.getRol() : "USER")
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .comuna(request.getComuna())
                .build();

        return usuarioRepository.save(usuario);
    }

    public Usuario login(UsuarioDTO.LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas: correo no registrado."));

        if (!usuario.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Credenciales inválidas: contraseña incorrecta.");
        }

        return usuario;
    }

    public Usuario actualizar(Long id, UsuarioDTO.UpdateRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));

        if (request.getNombre() != null)
            usuario.setNombre(request.getNombre());
        if (request.getPassword() != null && !request.getPassword().isBlank())
            usuario.setPassword(request.getPassword());
        if (request.getRol() != null)
            usuario.setRol(request.getRol());
        if (request.getTelefono() != null)
            usuario.setTelefono(request.getTelefono());
        if (request.getDireccion() != null)
            usuario.setDireccion(request.getDireccion());
        if (request.getComuna() != null)
            usuario.setComuna(request.getComuna());

        return usuarioRepository.save(usuario);
    }

    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}
