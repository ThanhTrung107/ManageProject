package com.example.demo.config;

import com.example.demo.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  private final JwtFilter jwtFilter;

  public SecurityConfig(JwtFilter jwtFilter) {
    this.jwtFilter = jwtFilter;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .cors(cors -> cors.configure(http))
      .csrf(csrf -> csrf.disable())
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        // Cho phép truy cập không cần authentication
        .requestMatchers("/auth/**").permitAll()
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/cache/**").hasRole("ADMIN")
        // Chỉ ADMIN mới được xóa
        .requestMatchers(HttpMethod.DELETE, "/staffs/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/salaries/**").hasRole("ADMIN")


        // Chỉ ADMIN mới được tạo mới
        .requestMatchers(HttpMethod.POST, "/staffs/**").hasRole("ADMIN")

        // USER và ADMIN đều có thể xem và sửa
        .requestMatchers(HttpMethod.GET, "/staffs/**").hasAnyRole("USER", "ADMIN")
        .requestMatchers(HttpMethod.PUT, "/staffs/**").hasAnyRole("USER", "ADMIN")
        .requestMatchers(HttpMethod.GET, "/salaries/**").hasAnyRole("USER", "ADMIN")
        .requestMatchers(HttpMethod.POST, "/salaries/**").hasAnyRole("USER", "ADMIN")
        .requestMatchers(HttpMethod.PUT, "/salaries/**").hasAnyRole("USER", "ADMIN")

        // Các request còn lại cần authentication
        .anyRequest().authenticated()
      )
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
