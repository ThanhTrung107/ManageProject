package com.example.demo.service;

import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.entity.Account;
import com.example.demo.repository.AccountRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountService {

  private final AccountRepository accountRepository;
  private final PasswordEncoder passwordEncoder;

  public AccountService(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
    this.accountRepository = accountRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public Optional<Account> authenticate(String username, String password) {
    Optional<Account> accountOpt = accountRepository.findByUsername(username);

    if (accountOpt.isPresent()) {
      Account account = accountOpt.get();
      // So sánh password
      if (passwordEncoder.matches(password, account.getPassword())) {
        return Optional.of(account);
      }
    }
    return Optional.empty();
  }

  @Cacheable(value = "accounts", key = "#username")
  public Optional<Account> findByUsername(String username) {
    return accountRepository.findByUsername(username);
  }

  public boolean existsByUsername(String username) {
    return accountRepository.existsByUsername(username);
  }

  @CacheEvict(value = "accounts", key = "#request.username")
  public Account register(RegisterRequest request) {
    Account account = new Account();
    account.setUsername(request.getUsername());
    account.setPassword(passwordEncoder.encode(request.getPassword()));
    account.setRole(request.getRole());

    return accountRepository.save(account);
  }
}
