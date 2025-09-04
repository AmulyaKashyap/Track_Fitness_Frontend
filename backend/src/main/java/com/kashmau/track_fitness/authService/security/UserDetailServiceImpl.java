package com.kashmau.track_fitness.authService.security;

import com.kashmau.track_fitness.authService.models.UserEntity;
import com.kashmau.track_fitness.authService.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailServiceImpl implements UserDetailsService {

    private final UserRepository repo;

    @Override
    public CustomUserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        UserEntity user = repo.findByEmail(userEmail);
        if (user == null) {
            log.error("No user found!");
            throw new UsernameNotFoundException("No user found!");
        }
        return new CustomUserDetails(user);
    }

    public CustomUserDetails loadUserById(UUID userId) throws UsernameNotFoundException {
        UserEntity user = repo.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        return new CustomUserDetails(user);
    }

}
