import com.na.manager.manager.role.RoleRepository;
import com.na.manager.manager.user.User;
import com.na.manager.manager.user.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    
    @PostConstruct
    public void initData() {
        // Create test admin user with strong password
        if (!userRepository.existsByEmail("admin@test.com")) {
            var adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new IllegalStateException("ADMIN role not found"));
            
            var admin = User.builder()
                .firstname("Admin")
                .lastname("User")
                .email("admin@test.com")
                .password(passwordEncoder.encode("AdminPassword123!")) // Strong password
                .enabled(true)
                .accountLocked(false)
                .roles(List.of(adminRole))
                .build();
            userRepository.save(admin);
            
            System.out.println("Admin user created: admin@test.com / AdminPassword123!");
        }
        
        // Create test regular user
        if (!userRepository.existsByEmail("user@test.com")) {
            var userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new IllegalStateException("USER role not found"));
            
            var user = User.builder()
                .firstname("Test")
                .lastname("User")
                .email("user@test.com")
                .password(passwordEncoder.encode("UserPassword123!")) // Strong password
                .enabled(true)
                .accountLocked(false)
                .roles(List.of(userRole))
                .build();
            userRepository.save(user);
            
            System.out.println("Test user created: user@test.com / UserPassword123!");
        }
    }
}


