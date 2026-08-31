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

        String header =
        request.getHeader("Authorization");

        System.out.println(
            "JWT: rota=" + request.getRequestURI() +
            ", authorizationPresente=" + (header != null)
        );

        if (
            header != null &&
            header.startsWith("Bearer ")
        ) {
            String token =
                    header.substring(7).trim();

            boolean tokenValido =
                    jwtUtil.tokenValido(token);

            System.out.println(
                "JWT: tokenValido=" + tokenValido
            );

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

            System.out.println(
                "JWT: usuário autenticado=" + email +
                ", perfil=" + tipo
            );
        }

        chain.doFilter(request, response);
    }
}