package com.budgetproj.project.controllers;

import com.budgetproj.project.dto.AuthRequest;
import com.budgetproj.project.dto.AuthResponse;
import com.budgetproj.project.models.User;
import com.budgetproj.project.repositories.UserRepository;
import com.budgetproj.project.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthControllerV2 {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        // req.email, req.password (ensure dto matches)
        if (userRepository.existsById(req.getEmail())) {
            return ResponseEntity.status(400).body("Email already registered");
        }
        User u = new User();
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepository.save(u);
        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req){
        return userRepository.findById(req.getEmail())
                .map(u -> {
                    if(passwordEncoder.matches(req.getPassword(), u.getPassword())){
                        return ResponseEntity.ok(new AuthResponse(jwtUtil.generateToken(u.getEmail())));
                    } else return ResponseEntity.status(401).body("Invalid credentials");
                }).orElse(ResponseEntity.status(404).body("User not found"));
    }
}
