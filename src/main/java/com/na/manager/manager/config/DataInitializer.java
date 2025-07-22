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
        // Create test admin user
        if (!userRepository.existsByEmail("admin@test.com")) {
            var adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new IllegalStateException("ADMIN role not found"));
            
            var admin = User.builder()
                .firstname("Admin")
                .lastname("User")
                .email("admin@test.com")
                .password(passwordEncoder.encode("admin123"))
                .enabled(true)
                .accountLocked(false)
                .roles(List.of(adminRole))
                .build();
            userRepository.save(admin);
            
            System.out.println("Admin user created: admin@test.com / admin123");
        }
    }
}

