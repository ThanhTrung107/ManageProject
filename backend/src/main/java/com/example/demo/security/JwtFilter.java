package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {
  private final JwtUtil jwtUtil;

  public JwtFilter(JwtUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
    if (request.getRequestURI().startsWith("/auth/")) {
      filterChain.doFilter(request, response);
      return;
    }

    String authHeader = request.getHeader("Authorization");

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      String token = authHeader.substring(7);
      try {
        if (jwtUtil.isTokenValid(token)) {
          String username = jwtUtil.extractUsername(token);
          String role = jwtUtil.extractRole(token);

          if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Thêm ROLE_ prefix cho Spring Security
            String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase();

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
              username,
              null,
              Collections.singletonList(new SimpleGrantedAuthority(roleWithPrefix))
            );
            SecurityContextHolder.getContext().setAuthentication(authToken);
          }
        }
      } catch (Exception e) {
        // Token không hợp lệ - tiếp tục mà không set authentication
        SecurityContextHolder.clearContext();
      }
    }

    filterChain.doFilter(request, response);
  }
}
