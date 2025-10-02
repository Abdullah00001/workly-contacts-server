# Workly Contacts

A modern contact management web application inspired by Google Contacts, built with Node.js, TypeScript, and MongoDB.

## Description

Workly Contacts is a full-featured contact manager web application that provides a comprehensive RESTful API for managing personal and professional contacts. The application offers secure authentication, profile management, feedback systems, and complete contact lifecycle management with modern web technologies.

## About

A RESTful API for contact manager app that supports authentication, profile management, feedback collection, and comprehensive contact management operations. Built with security-first approach and modern development practices.

## Features

### Authentication & Authorization

- **JWT Authentication**: Secure access and refresh token implementation
- **OTP Verification**: Email-based verification system
- **Password Management**: Forgot password functionality with secure reset
- **Account Security**: Change password and delete account options

### Profile Management

- Complete user profile CRUD operations
- Profile customization and settings
- Account preferences management

### Contact Management

- **Add Contacts**: Create new contacts with detailed information
- **Favorites**: Mark important contacts as favorites
- **Trash Management**: Soft delete contacts to trash
- **Hard Delete**: Permanent contact removal
- **Edit Contacts**: Update contact information
- **Search Functionality**: Find contacts quickly with search
- **Caching**: Redis-powered caching for improved performance

### Additional Features

- **Feedback System**: User feedback collection and management
- **API Documentation**: Comprehensive Swagger API documentation
- **Testing Suite**: Unit and integration tests
- **Docker Support**: Containerized deployment

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
   NODE_ENV=development
   PORT=3000
   MONGODB_DEVELOPMENT_URI=mongodb://localhost:27017/development_db
   MONGODB_PRODUCTION_URI=mongodb+srv://username:password@cluster.mongodb.net/production_db
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET_KEY=your_api_secret_key
   REDIS_DEVELOPMENT_URI=redis://localhost:6379
   REDIS_PRODUCTION_URI=redis://your_redis_url
   REDIS_PRODUCTION_TOKEN=your_redis_token
   JWT_ACCESS_TOKEN_SECRET_KEY=your_access_token_secret_key
   JWT_REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret_key
   JWT_SALT_ROUND=10
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=587
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_pass
   CORS_ORIGIN_DEV=http://localhost:3000
   CORS_ORIGIN_PROD=https://your_production_url

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
./
├── __tests__/                 # Test files
│   ├── unit/                 # Unit tests
│   └── integration/          # Integration tests
├── .github/                  # GitHub workflows and templates
├── .vscode/                  # VS Code configuration
├── public/                   # Static files
├── scripts/                  # Build and deployment scripts
└── src/                      # Source code
    ├── modules/              # Feature modules
    ├── configs/              # Configuration files
    ├── utils/                # Utility functions
    ├── middlewares/          # Express middlewares
    ├── interfaces/           # TypeScript interfaces
    ├── routes/               # API routes
    ├── templates/            # Email templates
    ├── types/                # Type definitions
    ├── app.ts                # Express app configuration
    ├── const.ts              # Application constants
    ├── server.ts             # Server entry point
    └── env.ts                # Environment configuration
```

## API Documentation

The API documentation is available via Swagger UI when running the application:

- **Development**: `http://localhost:3000/api-docs`
- **Production**: `https://your-domain.com/api-docs`

### Main API Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-otp` - Verify OTP

#### Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `DELETE /api/profile` - Delete user account
- `PUT /api/profile/change-password` - Change password

#### Contacts

- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create new contact
- `GET /api/contacts/:id` - Get contact by ID
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact (soft delete)
- `POST /api/contacts/:id/favorite` - Toggle favorite status
- `GET /api/contacts/favorites` - Get favorite contacts
- `GET /api/contacts/trash` - Get deleted contacts
- `DELETE /api/contacts/:id/permanent` - Permanently delete contact

#### Feedback

- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get feedback (admin only)

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

**Made with ❤️ by the Workly Contacts Team**
