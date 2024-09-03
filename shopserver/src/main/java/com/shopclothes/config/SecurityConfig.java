package com.shopclothes.config;

import com.shopclothes.service.MyUserService;
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
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private MyUserService myUserService;

    @Autowired
    private JWTAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(request -> request


                        .requestMatchers("/dashboard/brands/all-brands"
                                , "/dashboard/brands/brand/**"
                                ,"/dashboard/categories/all-categories"
                                , "/dashboard/categories/category/**"
                                ,"/dashboard/products/all-products"
                                ,"/dashboard/products/product/**"
                                ,"/auth/**").permitAll()
                        .requestMatchers("/dashboard/brands/add/new-brand").hasAuthority("ADMIN")
                        .requestMatchers("/dashboard/brands/delete/brand/**").hasAuthority("ADMIN")
                        .requestMatchers("/dashboard/brands/update/**").hasAuthority("ADMIN")

                        .requestMatchers("/dashboard/categories/add/new-category").hasAuthority("ADMIN")
                        .requestMatchers("/dashboard/categories/delete/category/**").hasAuthority("ADMIN")
                        .requestMatchers("/dashboard/categories/update/**").hasAuthority("ADMIN")

                        .requestMatchers("/dashboard/products/add/new-product").hasAuthority("ADMIN")
                        .requestMatchers("/dashboard/products/delete/product/**").hasAuthority("ADMIN")
                        .requestMatchers("/dashboard/products/update/**").hasAuthority("ADMIN")

                        .requestMatchers("/dashboard/users/delete/user/**").hasAuthority("ADMIN")
                        .requestMatchers("/dashboard/users/update/**").hasAuthority("ADMIN")
                        .requestMatchers("/dashboard/users/allUsers/**").hasAuthority("ADMIN")

                        .requestMatchers("/dashboard/order/all-order/**").hasAuthority("ADMIN")
                        .requestMatchers("/dashboard/order/update-status/**").hasAuthority("ADMIN")

                        .requestMatchers("/contact/all_contact").hasAuthority("ADMIN")
                        .requestMatchers("/contact/delete/**").hasAuthority("ADMIN")

                        .anyRequest().authenticated())
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider()).addFilterBefore(
                        jwtAuthFilter, UsernamePasswordAuthenticationFilter.class
                )
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.getWriter().flush();
                        })
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID"));

        return httpSecurity.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(myUserService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return daoAuthenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }
}