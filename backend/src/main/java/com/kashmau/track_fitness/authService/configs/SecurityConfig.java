package com.kashmau.track_fitness.authService.configs;

import com.kashmau.track_fitness.authService.security.CustomOAuth2UserService;
import com.kashmau.track_fitness.authService.security.JwtFilter;
import com.kashmau.track_fitness.authService.security.OAuth2SuccessHandler;
import com.kashmau.track_fitness.authService.security.UserDetailServiceImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    UserDetailServiceImpl userDetailsService;

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private OAuth2SuccessHandler oAuth2SuccessHandler;

    @Autowired
    private CustomOAuth2UserService oAuth2UserService;

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers( "/error", "/webjars/**").permitAll()
//                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
//                        .anyRequest().authenticated()
//                )
//                .csrf(customizer-> customizer.disable())
//                .oauth2Login(Customizer.withDefaults());
//
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//TODO: Remove /api from permitted url (no need)
        return http.csrf(customizer -> customizer.disable()).cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable secure CORS
                .authorizeHttpRequests(request -> request.requestMatchers("/api/loginUser", "/loginUser", "/api/register", "/register", "/api/refresh", "/refresh", "/oauth2/**", "/public/**", "/swagger-ui/**", "/swagger-ui.html", "/swagger-ui.html", "/v3/api-docs/**", "swagger-ui/index.html/**", "/v3/api-docs/swagger-config", "/swagger-resources/**", "/webjars/**").permitAll().anyRequest().authenticated()).httpBasic(Customizer.withDefaults()).sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).oauth2Login(oauth2 -> oauth2.userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService)).successHandler(oAuth2SuccessHandler)).logout(logout -> logout.logoutUrl("/logout").deleteCookies("refreshToken").invalidateHttpSession(true).logoutSuccessHandler((request, response, authentication) -> {
                    Cookie cookie = new Cookie("refreshToken", "");
                    cookie.setHttpOnly(true);
                    cookie.setSecure(false);   // ✅ Set TRUE in production (HTTPS)
                    cookie.setPath("/");
                    cookie.setMaxAge(0); // Expire immediately
                    response.addCookie(cookie);
                    response.setStatus(HttpServletResponse.SC_OK);  // ✅ Send 200 OK instead of redirect
                }).permitAll())
                // ✅ Force Spring to return 401 instead of redirecting
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Unauthorized\"}");
                })).build();
        //When authentication request comes first filter is UserNamePassword Filter. To Authenticate with token we need to add JWT filter before it.
    }


    //Instead of spring's default user detail service we are overwriting our own.
    // So now spring's default behaviour will change
//    @Bean
//    public UserDetailsService userDetailsService(){

    /// /        Passing custom users
    /// /        UserDetails user1 = User
    /// /                .withDefaultPasswordEncoder()
    /// /                .username("kiran")
    /// /                .password("kis")
    /// /                .build();
//
//
//        return new InMemoryUserDetailsManager();
//    }

    // To work with database.
    // Overwriting Authentication Provider (the one which validates username and password by default)
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();//Auth provider that is useful to connect with database
        provider.setPasswordEncoder(new BCryptPasswordEncoder(10));//disabling pass encoder
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    //to enable jwt we need to edit auth manager layer
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // ✅ Allow only your React frontend URL
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        // Allowed HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Allow all headers
        configuration.setAllowedHeaders(List.of("*"));
        // Allow cookies & Authorization headers for JWT/OAuth2
        configuration.setAllowCredentials(true);
        // Apply CORS to all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
