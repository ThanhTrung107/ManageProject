package com.example.demo.controller;

import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/cache")
public class CacheController {

  private final CacheManager cacheManager;

  public CacheController(CacheManager cacheManager) {
    this.cacheManager = cacheManager;
  }

  // Xóa tất cả cache
  @DeleteMapping("/clear-all")
  public ResponseEntity<?> clearAllCaches() {
    cacheManager.getCacheNames().forEach(cacheName -> {
      Objects.requireNonNull(cacheManager.getCache(cacheName)).clear();
    });
    return ResponseEntity.ok(Map.of("message", "All caches cleared"));
  }

  // Xóa cache theo tên
  @DeleteMapping("/clear/{cacheName}")
  public ResponseEntity<?> clearCache(@PathVariable String cacheName) {
    var cache = cacheManager.getCache(cacheName);
    if (cache != null) {
      cache.clear();
      return ResponseEntity.ok(Map.of("message", "Cache '" + cacheName + "' cleared"));
    }
    return ResponseEntity.badRequest().body(Map.of("error", "Cache not found: " + cacheName));
  }

  // Lấy danh sách tên cache
  @GetMapping("/names")
  public ResponseEntity<?> getCacheNames() {
    return ResponseEntity.ok(Map.of("caches", cacheManager.getCacheNames()));
  }
}
