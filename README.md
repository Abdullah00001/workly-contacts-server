![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success?style=flat-square&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-Upstash-red?style=flat-square&logo=redis)
![BullMQ](https://img.shields.io/badge/Queue-BullMQ-red?style=flat-square&logo=npm)
![Zod](https://img.shields.io/badge/Validation-Zod-3E67B1?style=flat-square)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=flat-square&logo=jsonwebtokens)
![Swagger](https://img.shields.io/badge/API-Docs-85EA2D?style=flat-square&logo=swagger)
![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-06B6D4?style=flat-square)
![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?style=flat-square&logo=cloudinary)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=flat-square&logo=docker)
![Fly.io](https://img.shields.io/badge/Deploy-Fly.io-7B61FF?style=flat-square&logo=flydotio)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=flat-square&logo=githubactions)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?style=flat-square&logo=jest)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

# Workly Contacts

🔗 **Live Demo:** [https://contacts.workly.ink](https://contacts.workly.ink)

📚 **API Docs:** [https://api.contacts.workly.ink/api-docs](https://api.contacts.workly.ink/api-docs)

A modern, production-grade contact management platform — inspired by Google Contacts — built using a scalable Node.js + TypeScript backend architecture.
Designed for reliability, security, and performance, Workly Contacts demonstrates enterprise-ready backend development practices.

## Description

Workly Contacts is a full-featured backend API for a modern contact management platform.
It provides secure authentication, profile and session management, activity tracking, feedback collection, and complete contact lifecycle operations.
Built with TypeScript, Node.js, and MongoDB, it follows modular clean architecture principles, employs event-driven patterns, and integrates advanced security features such as OAuth, multi-device session control, and activity monitoring.

## About

A RESTful API for contact manager app that supports authentication, profile management, feedback collection, and comprehensive contact management operations. Built with security-first approach and modern development practices.

## Features

### Authentication & Authorization

- **Local Authentication**: Secure login and signup with email and password
- **OAuth Integration**: Sign in seamlessly using Google OAuth
- **Password Management**: Reset password via secure forgot password flow with email verification
- **Multi-Device Sessions**: Support for up to 3 concurrent device logins
- **Hybrid Authentication System**: Combination of session-based and token-based authentication with token rotation
- **Access & Refresh Tokens**: Automatic token rotation for enhanced security
- **Session Management**: Token revocation and session blacklisting capabilities

### Account Security

- **Robust Account Center**: Centralized hub for managing all account settings and security features
- **Security Dashboard**: Comprehensive overview of account security status including:
  - Last password change date
  - Last login timestamp and location
  - Last login device information
  - Account creation date
  - Active sessions monitoring
  - Recent security activity log
- **Advanced Threat Protection**: Multi-layer security system to prevent bot attacks and unauthorized access:
  - Email notifications after 3 failed login attempts
  - reCAPTCHA challenge activated after 3 failed attempts
  - Account lockout after 9 failed login attempts
  - Secure account unlock via password reset
  - Automatic account removal if unlock is not completed
- **Activity Monitoring**: Track and review suspicious activities with detailed activity logs
- **Session Management**: View and manage active sessions across all logged-in devices with remote logout capability
- **Password Security**: Change password using old password verification
- **Account Deletion**: Schedule account deletion with 7-day grace period before permanent removal

### Personal Information Management

- **Profile Management**: View and edit personal information including:
  - Basic information (name, bio, etc.)
  - Profile avatar
  - Contact information
  - Multiple addresses
- **Password & Security Page**: Dedicated section for managing security settings and monitoring account safety

### Contact Management

- **CRUD Operations**: Create, read, update, and delete contacts with ease
- **Trash Management**: Soft delete contacts with 28-day retention and recovery options
- **Permanent Deletion**: Permanently remove contacts from trash
- **Favorites**: Mark important contacts as favorites for quick access
- **Labels & Organization**: Create custom labels to organize contacts efficiently
- **Label Management**: Create, update, and delete labels; manage contacts within specific labels
- **Bulk Operations**: Perform actions on multiple contacts simultaneously
- **Advanced Search**: Search contacts by name, email, or phone number
- **Unsaved Changes Protection**: Discard feature prevents data loss from accidental browser or tab closure

### Import & Export

- **Export Contacts**: Export single or multiple contacts in multiple formats:
  - JSON
  - CSV
  - vCard
- **Import Contacts**: Import contacts using CSV or vCard files with standardized templates
- **Print Functionality**: Print contact information directly from the dashboard

### Rate Limiting & Security Controls

- **Forgot Password Rate Limiting**: Prevents abuse of password reset functionality
- **OTP Resend with Exponential Backoff**: Smart retry mechanism for OTP verification in both signup and password reset flows
- **Unverified Account Cleanup**: Automatic removal of unverified accounts after 24 hours
- **Automatic Data Cleanup**: Trash and activity logs automatically deleted after 28 days
- **OAuth Password Enforcement**: Users signing up via OAuth must set a password before accessing the system

### User Experience

- **Responsive Design**: Fully responsive UI that works seamlessly across all devices
- **User Security-Centric**: Every feature designed with user security as the top priority
- **Reliable & Secure**: Comprehensive security measures to protect user data and accounts
- **Email Notifications**: Stay informed about account activities and security events

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

This project uses Docker Compose for consistent development environments across all machines. Docker is **required** to run this application.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (version 20.10 or higher)
  - [Install Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Install Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
  - [Install Docker Desktop for Linux](https://docs.docker.com/desktop/install/linux-install/)
- **Node.js** (version 18.x or higher) - for local development tools only
- **Git** - for cloning the repository
- **MongoDB Atlas Account** - for database hosting

> **Important:** This project requires MongoDB Atlas (cloud database) because it uses MongoDB sessions, which are not available in the standard MongoDB Docker image. Setting up a local replica set is time-consuming and complex, so we use Atlas for both development and production.

### Development Setup

To set up the development environment on your local machine, follow the comprehensive guide:

**📖 [Development Installation Guide](./docs/DEVELOPMENT_SETUP.md)**

Quick start:

```bash
# Clone repository
git clone https://github.com/Abdullah00001/workly-contacts-server.git
cd workly-contacts-server

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Install dependencies
npm install

# Start with Docker Compose
docker-compose up
```

The development server will be available at `http://localhost:5000`

### Production Deployment

For deploying to production environments (Fly.io, AWS, DigitalOcean, etc.), refer to the detailed deployment guide:

**📖 [Production Deployment Guide](./docs/PRODUCTION_DEPLOYEMENT.md)**

The guide covers:

- Fly.io deployment (current production platform)
- Alternative platforms (Railway, Render, AWS, DigitalOcean)
- Redis configuration options (Upstash, Redis Cloud, self-hosted)
- CI/CD setup with GitHub Actions
- Security best practices and production checklist
- Monitoring and scaling strategies

---

## Scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Run in development mode with nodemon |
| `npm run build` | Compile TypeScript to JavaScript     |
| `npm run start` | Start production server              |
| `npm run lint`  | Lint code with ESLint                |
| `npm run test`  | Run unit and integration tests       |

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

## API Documentation

The API documentation is available via Swagger UI when running the application:

- **Development**: `http://localhost:3000/api-docs`
- **Production**: `https://api.contacts.workly.ink/api-docs`

## Project Structure

```
   .
   ├── CHANGELOG.md
   ├── CODE_OF_CONDUCT.md
   ├── CONTRIBUTING.md
   ├── docker-compose.yaml
   ├── Dockerfile
   ├── Dockerfile.dev
   ├── fly.toml
   ├── jest.config.ts
   ├── LICENSE
   ├── nodemon.json
   ├── package.json
   ├── package-lock.json
   ├── public
   ├── README.md
   ├── scripts
   ├── SECURITY.md
   ├── src
   ├── swagger.yaml
   ├── __tests__
   ├── tsconfig.json
   ├── docs/
   ├── public/
   │   └── temp/
   ├── scripts
   ├── src/
   │   ├── configs/
   │   ├── core/
   │   │   └── base_classes/
   │   ├── interfaces/
   │   ├── jobs/
   │   ├── middlewares/
   │   ├── modules/
   │   │   ├── contacts/
   │   │   ├── feedback/
   │   │   ├── image/
   │   │   ├── label/
   │   │   ├── profile/
   │   │   └── user/
   │   ├── queue/
   │   │   ├── jobs/
   │   │   └── workers/
   │   ├── routes/
   │   │   └── v1/
   │   ├── singletons/
   │   ├── templates/
   │   ├── types/
   │   └── utils/
   └── __tests__/
      ├── integration/
      └── unit/
         └── utils/
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

1. Check the [Issues](https://github.com/Abdullah00001/workly-contacts-server/issues) page
2. Review the [Installation Guide](./docs/INSTALLATION.md) or [Deployment Guide](./docs/DEPLOYMENT.md)
3. Create a new issue if your problem isn't already reported

### Documentation

- 📖 [Installation Guide](./docs/DEVELOPMENT_SETUP.md) - Set up development environment
- 🚀 [Deployment Guide](./docs/PRODUCTION_DEPLOYEMENT.md) - Deploy to production
- 📚 [API Documentation](https://api.contacts.workly.ink/api-docs) - Swagger/OpenAPI docs
- 🔒 [Security Policy](./SECURITY.md) - Report security vulnerabilities
- 📝 [Changelog](./CHANGELOG.md) - Version history and updates
- 🤝 [Code of Conduct](./CODE_OF_CONDUCT.md) - Community guidelines

## Acknowledgments

- Inspired by **Google Contacts** for UI/UX patterns
- Built with modern web technologies and best practices
- Thanks to the open-source community for amazing tools and libraries

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Abdullah00001/workly-contacts-server?style=social)
![GitHub forks](https://img.shields.io/github/forks/Abdullah00001/workly-contacts-server?style=social)
![GitHub issues](https://img.shields.io/github/issues/Abdullah00001/workly-contacts-server)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Abdullah00001/workly-contacts-server)
![GitHub last commit](https://img.shields.io/github/last-commit/Abdullah00001/workly-contacts-server)

---

**Developed with ❤️ by Abdullah Bin Omar Chowdhury**  
_Designed for scalability, security, and real-world backend excellence._
