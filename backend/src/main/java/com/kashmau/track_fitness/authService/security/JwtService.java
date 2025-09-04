package com.kashmau.track_fitness.authService.security;

import com.kashmau.track_fitness.authService.models.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

    private final String secretKey;
    private final Integer accessExpiration = 900000;

    public JwtService() {
        try {
            KeyGenerator KeyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = KeyGen.generateKey();
            secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public String generateToken(UserEntity user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId().toString());  // UUID
        claims.put("email", user.getEmail());               // Email
        claims.put("role", user.getRole());

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(user.getId().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessExpiration)) //15min validity
                .and()
                .signWith(getKey())
                .compact();

    }

//    public String generateRefreshToken(String username) {
//        Map<String,Object> claims = new HashMap<>();
//
//        return Jwts.builder()
//                .claims()
//                .add(claims)
//                .subject(username)
//                .issuedAt(new Date(System.currentTimeMillis()))
//                .expiration(new Date(System.currentTimeMillis() + refreshExpiration)) //7 days validity
//                .and()
//                .signWith(getKey())
//                .compact();
//    }

    private SecretKey getKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public UUID extractUserId(String token) {
        String userId = extractClaim(token, Claims::getSubject); // `sub` contains UUID
        return UUID.fromString(userId);
    }

    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    // Extract role from JWT (if stored as a custom claim)
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
//        final String email = extractEmail(token);
//        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
        return !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
