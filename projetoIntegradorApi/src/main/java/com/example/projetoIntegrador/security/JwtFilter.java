package com.example.projetoIntegrador.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.context.SecurityContext;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        // evita mostrar dados pessoais nos logs
        String header =
        request.getHeader("Authorization");


        if (
            header != null &&
            header.startsWith("Bearer ")
        ) {
            String token =
                    header.substring(7).trim();

            boolean tokenValido =
                    jwtUtil.tokenValido(token);


            if (!tokenValido) {
                response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Token JWT inválido ou expirado."
                );

                return;
            }

            String email =
                    jwtUtil.extrairEmail(token);

            String tipo =
                    jwtUtil.extrairTipo(token);

            if (
                email == null ||
                email.isBlank() ||
                tipo == null ||
                tipo.isBlank()
            ) {
                response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Token JWT sem usuário ou perfil."
                );

                return;
            }

            UsernamePasswordAuthenticationToken auth =
                UsernamePasswordAuthenticationToken
                    .authenticated(
                        email,
                        null,
                        List.of(
                            new SimpleGrantedAuthority(
                                "ROLE_" + tipo.toUpperCase()
                            )
                        )
                    );

            SecurityContext context =
                    SecurityContextHolder
                            .createEmptyContext();

            context.setAuthentication(auth);

            SecurityContextHolder.setContext(context);

        }

        chain.doFilter(request, response);
    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return "GET".equals(request.getMethod())
                && (path.startsWith("/api/cep/") || path.equals("/api/estatisticas"));
    }
}
