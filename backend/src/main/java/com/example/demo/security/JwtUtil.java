package com.example.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

  @Value("${jwt.secret:gbrYVii0QAIXeQ6trE8kjcQjdzB9OGkUiwyaMk7akru0RBU7M0ArFojaVF046w6sWtMFYT7PsgU9WqQ/tSeC7TwS+5YJdThX0GwL7htOkN/imA5mnEOfiLYstGN0a6rCI1EQKzJo+HK6X/7KV/qEYd3E0ehH1gQbcemFMw2SMp/AgwfCKAz5RkWhta66YjJtYfYPcA+j/3K4UY1UqiAp1qy7PngA30Zzk9A6O65wiXHo5whouwtPhs4oh18Vh3zai6pq12Mz+sSjgKzOul3nlGlXu55AGfYa8MeqaX4v59FYiZwsHYHVNmLgKZBA7x6Mu0jWOIw7kL9KaG7UCGJ1wQ==}")
  private String secretKey;
  @Value("${jwt.expiration:3600000}")
  private long expirationTime;

  private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(secretKey.getBytes());
  }

  public String generateToken(String username, String role) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("role", role);

    return Jwts.builder()
      .claims(claims)
      .subject(username)
      .issuedAt(new Date())
      .expiration(new Date(System.currentTimeMillis() + expirationTime))
      .signWith(getSigningKey())
      .compact();
  }

  public String extractUsername(String token) {
    return extractClaims(token).getSubject();
  }

  public String extractRole(String token) {
    return extractClaims(token).get("role", String.class);
  }

  public boolean isTokenValid(String token) {
    try {
      return !isTokenExpired(token);
    } catch (Exception e) {
      return false;
    }
  }

  private boolean isTokenExpired(String token) {
    return extractClaims(token).getExpiration().before(new Date());
  }

  private Claims extractClaims(String token) {
    return Jwts.parser()
      .verifyWith(getSigningKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();
  }
}
