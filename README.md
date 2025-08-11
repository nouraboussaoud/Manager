# Manager - Account & User Management System

A comprehensive full-stack application for managing users, accounts, and financial client data with integrated Keycloak authentication and modern web interface.

## 🚀 Overview

Manager is a sophisticated account management system designed for financial institutions and organizations that need to manage user accounts, client information, and SEF (Société d'Expertise Financière) client data. The application provides both internal database user management and external Keycloak user integration.

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x with Java 17+
- **Security**: Spring Security with JWT authentication
- **Database**: JPA/Hibernate with PostgreSQL support
- **External Auth**: Keycloak integration for external users
- **Data Storage**: JSON file-based storage for account data
- **API**: RESTful APIs with OpenAPI/Swagger documentation

### Frontend (Angular)
- **Framework**: Angular 17+ with TypeScript
- **UI**: Modern responsive design with CSS Grid/Flexbox
- **State Management**: RxJS Observables
- **Authentication**: JWT token-based authentication
- **Charts**: Custom CSS-based visualizations
- **Routing**: Angular Router with lazy loading

## 📋 Features

### 🔐 Authentication & Authorization
- **Dual Authentication System**:
  - Internal database users (for administrators)
  - External Keycloak users (for clients)
- **JWT Token Management**
- **Role-based access control**
- **Secure API endpoints**

### 👥 User Management
- **Internal User CRUD Operations**
- **Keycloak User Integration**
- **User Profile Management**
- **Account Status Management**
- **User Statistics & Analytics**

### 🏢 Account Management
- **Client Account Creation & Management**
- **Account-centric data view**
- **Client Code & Identity Management**
- **Trade Account Support**
- **Account Status Tracking**

### 📊 Dashboard & Analytics
- **Real-time Statistics**
- **User Distribution Charts**
- **Account Status Visualizations**
- **Interactive Progress Bars**
- **Responsive Design**

### 🏦 SEF Client Management
- **SEF Client Registration**
- **Client Information Management**
- **Trade QB Integration**
- **Client Authentication**

## 🛠️ Technology Stack

### Backend Dependencies
```xml
- Spring Boot Starter Web
- Spring Boot Starter Security
- Spring Boot Starter Data JPA
- Spring Boot Starter Validation
- Keycloak Spring Boot Starter
- Jackson for JSON processing
- Lombok for code generation
- SpringDoc OpenAPI for documentation
```

### Frontend Dependencies
```json
- Angular 19
- TypeScript 5+
- RxJS for reactive programming
- Angular Router
- Angular HTTP Client
- Font Awesome for icons
```

## 📁 Project Structure

```
Manager/
├── src/main/java/com/na/manager/manager/
│   ├── account/           # Account management logic
│   ├── auth/             # Authentication services
│   ├── config/           # Configuration classes
│   ├── keycloak/         # Keycloak integration
│   ├── security/         # Security configuration
│   └── user/             # User management
├── src/main/resources/
│   ├── application.yml   # Application configuration
│   └── templates/        # Email templates
├── data/                 # JSON data files
│   ├── bo-accounts.json  # Account data
│   ├── sef-clients.json  # SEF client data
│   └── accounts-list.json # Account list
└── ManagerUi/            # Angular frontend
    ├── src/app/
    │   ├── pages/        # Application pages
    │   ├── services/     # HTTP services
    │   ├── shared/       # Shared components
    │   └── guards/       # Route guards
    └── src/assets/       # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18+ and npm
- PostgreSQL (optional, can use H2 for development)
- Keycloak server (for external authentication)

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Manager
```

2. **Configure application properties**
```yaml
# src/main/resources/application-dev.yml
server:
  port: 9090

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/manager_db
    username: your_username
    password: your_password
```

3. **Run the backend**
```bash
./mvnw spring-boot:run
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ManagerUi
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
ng serve
```

4. **Access the application**
- Frontend: http://localhost:4200
- Backend API: http://localhost:9090
- Swagger UI: http://localhost:9090/swagger-ui.html

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register new internal user
- `POST /api/v1/auth/authenticate` - Login internal user
- `POST /api/v1/external-auth/login` - External user login

### User Management
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/me` - Get current user profile
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Account Management
- `GET /api/v1/integrated-accounts/users-with-accounts` - Get users with accounts
- `GET /api/v1/integrated-accounts/user/{userId}/accounts` - Get user accounts
- `POST /api/v1/integrated-accounts/user/{userId}/accounts` - Create account
- `PUT /api/v1/integrated-accounts/user/{userId}/accounts/{accountId}` - Update account
- `DELETE /api/v1/integrated-accounts/user/{userId}/accounts/{accountId}` - Delete account

### Dashboard
- `GET /api/v1/integrated-accounts/dashboard-summary` - Get dashboard statistics

## 🔧 Configuration

### Security Configuration
The application uses Spring Security with JWT tokens:
- Internal users authenticate via database
- External users authenticate via Keycloak
- API endpoints are secured with role-based access

### CORS Configuration
CORS is configured to allow frontend access:
```java
@CrossOrigin(origins = "http://localhost:4200")
```

### File Storage
Account data is stored in JSON files located in the `data/` directory:
- `bo-accounts.json` - Main account data
- `sef-clients.json` - SEF client information
- `accounts-list.json` - Account listing

## 🎨 UI Features

### Dashboard
- Real-time statistics with animated counters
- Progress bar charts for data visualization
- Responsive grid layout
- Modern gradient design

### Account Management
- Account-centric data view
- Inline editing capabilities
- Client code and identity management
- Trade account support

### User Profile
- Dynamic profile display
- Support for both internal and external users
- Clean, professional interface

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **CORS Protection** for cross-origin requests
- **Input Validation** on all API endpoints
- **SQL Injection Protection** via JPA
- **XSS Protection** with proper data sanitization

## 🧪 Testing

### Backend Testing
```bash
./mvnw test
```

### Frontend Testing
```bash
cd ManagerUi
ng test
```

## 📦 Deployment

### Backend Deployment
```bash
./mvnw clean package
java -jar target/manager-*.jar
```

### Frontend Deployment
```bash
cd ManagerUi
ng build --prod
# Deploy dist/ folder to web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nour Aboussaoud**
- Email: nour.aboussaoud@esprit.tn
- GitHub: [@nour-aboussaoud](https://github.com/nour-aboussaoud)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Angular team for the powerful frontend framework
- Keycloak team for authentication services
- All contributors and testers

---

**Built with ❤️ for modern account management**
