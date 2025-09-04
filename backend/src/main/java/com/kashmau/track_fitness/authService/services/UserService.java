package com.kashmau.track_fitness.authService.services;

import com.kashmau.track_fitness.authService.dtos.LoginRequestDto;
import com.kashmau.track_fitness.authService.dtos.RegisterRequestDto;
import com.kashmau.track_fitness.authService.models.UserEntity;
import com.kashmau.track_fitness.authService.repositories.UserRepository;
import com.kashmau.track_fitness.authService.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository repo;
    private final AuthenticationManager authenticationManager;


    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
    //will run hashing 2 to power 10 times
    //BCryptPasswordEncoder by default provided by springSecurity6
    //We can also create the bean in security config instead of static class created here

    public UserEntity registerUser(RegisterRequestDto request) {

        if (repo.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("User already exists with email: " + request.getEmail());
        }
        UserEntity userCreated = UserEntity.builder().email(request.getEmail()).password(encoder.encode(request.getPassword())).role(request.getRole() != null ? request.getRole() : "USER").build();

        return repo.save(userCreated);
    }


    public UserEntity verify(LoginRequestDto user) {
        log.info(user.getEmail());
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        // 2. Get the authenticated user from Authentication object
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // 3. Fetch full UserEntity directly from userDetails without hitting DB again
        UserEntity principalUser = userDetails.getUser();

        if (authentication.isAuthenticated()) return principalUser;
        return null;
    }
}
