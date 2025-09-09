package com.example.backend.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.example.backend.modal.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.CustomUserDetailsImplmentation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class AppConfig {

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsImplmentation customUserDetailsImplmentation;
    private final UserRepository userRepository;

    public AppConfig(JwtProvider jwtProvider, CustomUserDetailsImplmentation customUserDetails, UserRepository userRepository) {
        this.jwtProvider = jwtProvider;
        this.customUserDetailsImplmentation = customUserDetails;
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(Authorize -> Authorize.requestMatchers("/oauth2/**", "/login/oauth2/code/**").permitAll()
            .requestMatchers("/api/**").authenticated().anyRequest().permitAll()
            ).addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
            .oauth2Login(ouath -> ouath
            .loginPage("/oauth2/authorization/google")
            .successHandler(oauth2LoginSuccessHandler())
            .permitAll())
            .csrf().disable()
            .cors().configurationSource(corsConfigrationSource()).and()
            .httpBasic().and().formLogin();

        return http.build();
    }

    private AuthenticationSuccessHandler oauth2LoginSuccessHandler() {
        return (HttpServletRequest request, HttpServletResponse response, Authentication authentication) -> {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
    
            String name = oauthToken.getPrincipal().getAttribute("name");
            System.out.println(oauthToken.getPrincipal().getAttributes());

            String email = oauthToken.getPrincipal().getAttribute("email");
    
            User user = userRepository.findByEmail(email);
            if (user == null) {
                user = new User();
                user.setFullName(name);
                user.setEmail(email);
                user.setPassword("");
                user.setLogin_with_google(true);
                userRepository.save(user); // Save new user
            } else {
                // Optional: update the existing user login flag
                user.setLogin_with_google(true);
                user.setPassword("");
                userRepository.save(user); // Ensure it's saved
            }
    
           String jwtToken = jwtProvider.generateTokenWithEmail(email); 
    
            response.setHeader("Authorization", "Bearer " + jwtToken);
    
            response.sendRedirect("http://localhost:3000/home?token=" + jwtToken);
        };
    }
    
    private CorsConfigurationSource corsConfigrationSource() {
     
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request){
                
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
                cfg.setAllowedMethods(Collections.singletonList("*"));
                cfg.setAllowCredentials(true);
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                cfg.setExposedHeaders(Arrays.asList("Authorization"));
                cfg.setMaxAge(3600L);
                return cfg;
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}