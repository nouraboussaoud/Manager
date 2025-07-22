package com.na.manager.manager.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {
    private final JwtFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> {
                    System.out.println("Configuring security rules...");
                    req.requestMatchers(
                                     "/auth/**",
                                     "/api/v1/auth/**",
                                     "/v2/api-docs",
                                     "/v3/api-docs" ,
                                     "/v3/api-docs/**" ,
                                     "/swagger-resources" ,
                                     "/swagger-resources/**",
                                     "/swagger-ui.html",
                                     "/swagger-ui/**",
                                     "/webjars/**",
                                     "/configuration/ui",
                                     "/configuration/security"
                                    )
                            .permitAll()
                            .requestMatchers("/api/v1/users/**")
                            .permitAll() // Temporarily allow all access for testing
                            .anyRequest()
                                .authenticated();
                })
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter , UsernamePasswordAuthenticationFilter.class);
           return http.build();
         }

}
