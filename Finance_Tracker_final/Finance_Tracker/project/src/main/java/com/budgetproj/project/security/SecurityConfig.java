package com.budgetproj.project.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    // Password encoder bean for controller/service use
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Security filter chain where we register our JwtAuthFilter
   @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {

    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth

            // ✅ Allow static UI pages
            .requestMatchers(
                "/",
                "/index.html",
                "/login.html",
                "/register.html",
                "/dashboard.html",
                "/addexpense.html",
                "/assets/**",        // CSS, JS, images
                "/favicon.ico",
                "/error"
            ).permitAll()

            // ✅ Allow auth APIs
            .requestMatchers("/api/auth/**").permitAll()

            // 🔐 Protect expenses API (recommended)
            .requestMatchers("/api/expenses/**").authenticated()

            // ✅ Allow health check
            .requestMatchers("/health").permitAll()

            // 🔐 Everything else needs login
            .anyRequest().authenticated()
        );

    // JWT filter
    http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}



    // CORS configuration: allow any origin pattern and credentials (use explicit origins in prod)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // For development: allow all origin patterns; in production list explicit origins instead of "*"
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
