![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success?style=flat-square&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-Upstash-red?style=flat-square&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?style=flat-square&logo=jest)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

# Workly Contacts

A modern, production-grade contact management platform — inspired by Google Contacts — built using a scalable Node.js + TypeScript backend architecture.
Designed for reliability, security, and performance, Workly Contacts demonstrates enterprise-ready backend development practices.

## Description

Workly Contacts is a full-featured backend API for a modern contact management platform.
It provides secure authentication, profile and session management, activity tracking, feedback collection, and complete contact lifecycle operations.
Built with TypeScript, Node.js, and MongoDB, it follows modular clean architecture principles, employs event-driven patterns, and integrates advanced security features such as OAuth, multi-device session control, and activity monitoring.

## About

A RESTful API for contact manager app that supports authentication, profile management, feedback collection, and comprehensive contact management operations. Built with security-first approach and modern development practices.

## Features

### 🛡️ Authentication & Authorization

- **JWT Authentication**: Secure access and refresh token implementation.
- **OAuth Login (Google)**: Seamless login via Google OAuth 2.0 with enforced password setup.
- **Session Management**: Multi-device login support (max 3) with Redis-based tracking and self-healing middleware.
- **OTP Verification**: Email-based verification during signup and password reset.
- **Password Management**: Forgot password, password reset, and change password functionality.
- **Account Security**: Account lock/unlock system, suspicious activity detection, and automated account deletion workflow.

---

### 👤 Profile Management

- Complete user profile CRUD operations with secure validation.
- Editable personal information, avatar updates, and account preferences.
- Integrated device and location tracking for better security insights.
- Real-time account activity tracking through activity logs.

---

### 📇 Contact Management

- **Add Contacts**: Create and manage contacts with rich details and images.
- **Edit Contacts**: Update existing contact information seamlessly.
- **Favorites**: Mark and view frequently used contacts.
- **Trash Management**: Soft delete and restore contacts from trash.
- **Hard Delete**: Permanent deletion for unwanted contacts.
- **Labels / Tags**: Assign labels to contacts with full CRUD support and alphabetical sorting.
- **Search Functionality**: Enhanced keyword search for quick access.
- **Import / Export Contacts**: Easily import contacts from files or export them for backup.
- **Caching**: Redis-based caching for optimized read performance and reduced latency.

---

### ⚙️ Additional Features

- **Activity Queue System**: Event-driven logging of user activities using BullMQ and Redis.
- **Feedback System**: Collect, manage, and review user feedback.
- **Security & Password Page**: View account overview, manage active sessions, and review recent activities.
- **API Documentation**: Comprehensive Swagger-powered API docs.
- **Logging & Monitoring**: Centralized logging using Winston and Morgan.
- **Email Handling**: Transactional email system using Nodemailer with Handlebars templates.
- **Cron Jobs**: Automated background tasks (e.g., cleanup, email queue).
- **Docker Support**: Fully containerized setup for consistent environment deployment.
- **Testing Suite**: Unit and integration testing powered by Jest.

---

## 💡 Why This Project Stands Out

- **Production-like Design:** Implements real-world backend standards used in scalable SaaS applications.
- **Security-First Mindset:** JWT, OAuth2, rate-limiting, multi-session management, and suspicious activity detection.
- **Clean Architecture:** Controller-Service-Repository pattern with clear module separation and dependency management.
- **DevOps-Ready:** Dockerized deployment, environment-based configs, and CI/CD integration.
- **Comprehensive Testing:** Unit and integration tests with Jest for high code reliability.
- **Real-World Complexity:** Integrates async queues, cron jobs, caching layers, and email workflows.


## 🧰 Production Readiness Highlights

- Fully containerized via Docker & Docker Compose
- Structured CI/CD pipeline with staging and production flow
- Environment-driven configuration management
- Modular codebase for horizontal scaling
- Optimized Redis usage for caching and session recovery

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Redis** - Caching and session management

### Security & Authentication

- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Testing & Development

- **Jest** - Testing framework
- **Supertest** - HTTP integration testing
- **Docker** - Containerization
- **Git/GitHub** - Version control

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis
- Docker (optional)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/workly-contacts.git
   cd workly-contacts
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=
   PORT=
   SERVER_BASE_URL=
   CLIENT_BASE_URL=
   MONGODB_DEVELOPMENT_URI=
   MONGODB_PRODUCTION_URI=
   CLOUDINARY_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET_KEY=
   REDIS_HOST=
   REDIS_PORT=
   REDIS_PASSWORD=
   REDIS_DEVELOPMENT_URI=
   REDIS_PRODUCTION_URI=
   REDIS_PRODUCTION_TOKEN=
   JWT_ACCESS_TOKEN_SECRET_KEY=
   JWT_REFRESH_TOKEN_SECRET_KEY=
   JWT_RECOVER_SESSION_TOKEN_SECRET_KEY=
   JWT_ACTIVATION_TOKEN_SECRET_KEY=
   JWT_CHANGE_PASSWORD_PAGE_TOKEN_SECRET_KEY=
   JWT_CLEAR_DEVICE_TOKEN_SECRET_KEY=
   JWT_ADD_PASSWORD_PAGE_TOKEN_SECRET_KEY=
   JWT_SALT_ROUND=
   OTP_HASH_SECRET=
   RECAPTCHA_SECRET_KEY=
   SMTP_HOST=
   SMTP_PORT=
   SMTP_USER=
   SMTP_PASS=
   CORS_ORIGIN_DEV=
   CORS_ORIGIN_PROD=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   CALLBACK_URL=
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

## Scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Run in development mode with nodemon |
| `npm run build` | Compile TypeScript to JavaScript     |
| `npm run start` | Start production server              |
| `npm run lint`  | Lint code with ESLint                |
| `npm run test`  | Run unit and integration tests       |

## Project Structure

```
.
├── CHANGELOG.md
├── docker-compose.yaml
├── Dockerfile
├── Dockerfile.dev
├── jest.config.ts
├── LICENSE
├── nodemon.json
├── package.json
├── package-lock.json
├── public
│   └── temp
├── README.md
├── scripts
│   ├── build.sh
│   ├── createModule.js
│   ├── createTestModule.js
│   └── init-replica.sh
├── SECURITY.md
├── src
│   ├── app.ts
│   ├── configs
│   │   ├── cloudinary.configs.ts
│   │   ├── cors.configs.ts
│   │   ├── db.configs.ts
│   │   ├── googleStrategy.config.ts
│   │   ├── logger.configs.ts
│   │   ├── morgan.configs.ts
│   │   ├── nodemailer.configs.ts
│   │   └── redis.configs.ts
│   ├── const.ts
│   ├── core
│   │   └── base_classes
│   │       └── dto.base.ts
│   ├── env.ts
│   ├── interfaces
│   │   ├── cookie.interface.ts
│   │   ├── env.interfaces.ts
│   │   ├── jwtPayload.interfaces.ts
│   │   ├── mailOption.interfaces.ts
│   │   ├── otp.interface.ts
│   │   ├── securityEmail.interfaces.ts
│   │   └── verificationEmailData.interfaces.ts
│   ├── jobs
│   │   ├── activityCleanup.ts
│   │   ├── index.ts
│   │   ├── trashCleanup.ts
│   │   └── unverifiedUserCleanup.ts
│   ├── middlewares
│   │   ├── globalError.middleware.ts
│   │   └── multer.middleware.ts
│   ├── modules
│   │   ├── contacts
│   │   │   ├── contacts.controllers.ts
│   │   │   ├── contacts.enums.ts
│   │   │   ├── contacts.interfaces.ts
│   │   │   ├── contacts.middlewares.ts
│   │   │   ├── contacts.models.ts
│   │   │   ├── contacts.repositories.ts
│   │   │   ├── contacts.services.ts
│   │   │   └── contacts.validations.ts
│   │   ├── feedback
│   │   │   ├── feedback.controllers.ts
│   │   │   ├── feedback.enums.ts
│   │   │   ├── feedback.interfaces.ts
│   │   │   ├── feedback.middlewares.ts
│   │   │   ├── feedback.models.ts
│   │   │   ├── feedback.repositories.ts
│   │   │   ├── feedback.services.ts
│   │   │   └── feedback.validations.ts
│   │   ├── image
│   │   │   ├── image.controllers.ts
│   │   │   ├── image.enums.ts
│   │   │   ├── image.interfaces.ts
│   │   │   ├── image.middlewares.ts
│   │   │   ├── image.models.ts
│   │   │   ├── image.repositories.ts
│   │   │   ├── image.services.ts
│   │   │   └── image.validations.ts
│   │   ├── label
│   │   │   ├── label.controllers.ts
│   │   │   ├── label.enums.ts
│   │   │   ├── label.interfaces.ts
│   │   │   ├── label.middlewares.ts
│   │   │   ├── label.models.ts
│   │   │   ├── label.repositories.ts
│   │   │   ├── label.services.ts
│   │   │   └── label.validations.ts
│   │   ├── profile
│   │   │   ├── profile.controllers.ts
│   │   │   ├── profile.enums.ts
│   │   │   ├── profile.interfaces.ts
│   │   │   ├── profile.middlewares.ts
│   │   │   ├── profile.models.ts
│   │   │   ├── profile.repositories.ts
│   │   │   ├── profile.services.ts
│   │   │   └── profile.validations.ts
│   │   └── user
│   │       ├── user.controllers.ts
│   │       ├── user.dto.ts
│   │       ├── user.enums.ts
│   │       ├── user.interfaces.ts
│   │       ├── user.middlewares.ts
│   │       ├── user.models.ts
│   │       ├── user.repositories.ts
│   │       ├── user.services.ts
│   │       └── user.validations.ts
│   ├── queue
│   │   ├── index.ts
│   │   ├── jobs
│   │   │   ├── accountDelete.jobs.ts
│   │   │   ├── activity.jobs.ts
│   │   │   └── email.jobs.ts
│   │   ├── queues.ts
│   │   └── workers
│   │       ├── accountDelete.workers.ts
│   │       ├── activity.workers.ts
│   │       └── email.worker.ts
│   ├── routes
│   │   └── v1
│   │       ├── contacts.routes.ts
│   │       ├── feedback.routes.ts
│   │       ├── image.routes.ts
│   │       ├── index.ts
│   │       ├── label.routes.ts
│   │       ├── profile.routes.ts
│   │       └── user.routes.ts
│   ├── server.ts
│   ├── singletons
│   │   ├── index.ts
│   │   └── otp.utils.singletons.ts
│   ├── templates
│   │   ├── accountDeletationScheduleCancelAndLoginEmailTemplate.ts
│   │   ├── accountDeletationScheduleEmailTemplate.ts
│   │   ├── accountDeletionConfirmationEmailTemplate.ts
│   │   ├── accountLockedEmailTemplate.ts
│   │   ├── accountRecoveryEmailTemplate.ts
│   │   ├── accountUnLockedEmailTemplate.ts
│   │   ├── failedLoginAttemptEmailTemplate.ts
│   │   ├── loginSuccessEmailTemplate.ts
│   │   ├── passwordResetNotificationTemplate.ts
│   │   ├── signupSuccessEmailTemplate.ts
│   │   └── verificationEmailTemplate.ts
│   ├── types
│   │   └── express.d.ts
│   └── utils
│       ├── calculation.utils.ts
│       ├── cookie.utils.ts
│       ├── date.utils.ts
│       ├── getEnvVariables.utils.ts
│       ├── import.utils.ts
│       ├── jwt.utils.ts
│       ├── mailOption.utils.ts
│       ├── metaData.utils.ts
│       ├── otp.utils.ts
│       ├── password.utils.ts
│       └── sendEmail.utils.ts
├── swagger.yaml
├── __tests__
│   ├── integration
│   ├── jest.setup.ts
│   └── unit
│       └── utils
│           ├── calculation.utils.test.ts
│           ├── cookie.utils.test.ts
│           ├── getEnvVariables.utils.test.ts
│           ├── jwt.utils.test.ts
│           ├── mailOption.utils.test.ts
│           └── password.utils.test.ts
└── tsconfig.json
```

## API Documentation

The API documentation is available via Swagger UI when running the application:

- **Development**: `http://localhost:3000/api-docs`
- **Production**: `https://your-domain.com/api-docs`

## Testing

Run the test suite:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test -- --coverage
```

## Docker Deployment

1. **Build the Docker image**

   ```bash
   docker build -t workly-contacts .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## Contributing

This is a personal portfolio project created to showcase technical skills and coding abilities. While direct contributions are not accepted, feedback and suggestions are always welcome!

## How You Can Help

### Feedback & Suggestions

- Found a bug or issue? Please report it in the Issues section
- Have suggestions for improvements? I'd love to hear your thoughts
- Code review feedback is appreciated for learning purposes

### Professional Inquiries

- Interested in discussing the technical implementation? Feel free to reach out
- Questions about design decisions or architecture choices are welcome
- Open to networking and professional discussions about the project

### Educational Use

- Feel free to study the code structure and implementation patterns
- Use this project as a learning reference for similar applications
- Educational discussions about the codebase are encouraged

## Contact for Discussion

If you're interested in discussing this project, potential collaborations, or have professional inquiries:

- Open an issue for technical discussions
- Contact directly for professional inquiries
- Connect for networking and knowledge sharing

> **Note:** This project represents original work created entirely by the author for portfolio and learning purposes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any problems or have questions, please:

1. Check the [Issues](https://github.com/yourusername/workly-contacts/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the development team

## Acknowledgments

- Inspired by Google Contacts
- Built with modern web technologies
- Community-driven development

---

**Developed with ❤️ by Abdullah Bin Omar Chowdhury**  
_Designed for scalability, security, and real-world backend excellence._
