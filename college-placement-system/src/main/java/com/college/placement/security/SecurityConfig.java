package com.college.placement.security;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import java.util.List;
import com.college.placement.ratelimit.RateLimitFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;



@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RateLimitFilter rateLimitFilter;
    public SecurityConfig(
            CustomUserDetailsService userDetailsService,
            JwtAuthenticationEntryPoint unauthorizedHandler,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            RateLimitFilter rateLimitFilter
    ) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.rateLimitFilter = rateLimitFilter;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }












    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> {})
            .csrf(AbstractHttpConfigurer::disable)
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                                .requestMatchers(
                                        "/api/auth/**",
                                        "/v3/api-docs/**",
                                        "/swagger-ui/**",
                                        "/swagger-ui.html"
                                ).permitAll()
                
                .requestMatchers(HttpMethod.POST, "/api/admin/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/admin/dashboard").hasAuthority("ROLE_ADMIN")
                
                .requestMatchers(HttpMethod.GET, "/api/branches").hasAnyAuthority("ROLE_STUDENT", "ROLE_COORDINATOR", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/branches").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/branches/**").hasAuthority("ROLE_ADMIN")
                
                .requestMatchers(HttpMethod.GET, "/api/skills").hasAnyAuthority("ROLE_STUDENT", "ROLE_COORDINATOR", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/skills").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")
                
                .requestMatchers("/api/student-profiles/me").hasAnyAuthority("ROLE_STUDENT")
                .requestMatchers("/api/student-profiles/search").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")
                .requestMatchers("/api/student-profiles/eligible-companies").hasAuthority("ROLE_STUDENT")
                
                .requestMatchers("/api/certificates/my-certificates").hasAuthority("ROLE_STUDENT")
                .requestMatchers(HttpMethod.PUT, "/api/certificates/*/status").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")
                
                .requestMatchers(HttpMethod.GET, "/api/companies/**").hasAnyAuthority("ROLE_STUDENT", "ROLE_COORDINATOR", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/companies").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/companies/**").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/companies/**").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/companies/*/applications", "/api/companies/*/eligible-students").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")
                
                .requestMatchers(HttpMethod.POST, "/api/applications/apply").hasAuthority("ROLE_STUDENT")
                .requestMatchers(HttpMethod.GET, "/api/applications/my-applications").hasAuthority("ROLE_STUDENT")
                .requestMatchers(HttpMethod.GET, "/api/applications").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/applications/*/status").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")

                    .requestMatchers(HttpMethod.GET, "/api/topics/**", "/api/sessions/**", "/api/news/**", "/api/notifications/**").hasAnyAuthority("ROLE_STUDENT", "ROLE_COORDINATOR", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/topics", "/api/sessions", "/api/news").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/topics/**", "/api/sessions/**", "/api/news/**").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/topics/**", "/api/sessions/**", "/api/news/**").hasAnyAuthority("ROLE_COORDINATOR", "ROLE_ADMIN")
                
                .requestMatchers(HttpMethod.PUT, "/api/notifications/*/read").hasAnyAuthority("ROLE_STUDENT", "ROLE_COORDINATOR", "ROLE_ADMIN")
                    .requestMatchers("/api/users/**").hasAuthority("ROLE_ADMIN")
                    .requestMatchers(
                            HttpMethod.GET,
                            "/api/admin/rate-limit-events/**"
                    ).hasAuthority("ROLE_ADMIN")



                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        http.addFilterAfter(
                rateLimitFilter,
                JwtAuthenticationFilter.class
        );

        return http.build();
    }
}
