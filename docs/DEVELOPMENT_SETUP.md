### Setup Instructions

#### 1. Get MongoDB Atlas Connection String

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (free tier is sufficient for development)
3. Set up database access (create a database user)
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string (it should look like: `mongodb+srv://username:password@cluster.mongodb.net/`)

#### 2. Clone the Repository

```bash
git clone https://github.com/yourusername/workly-contacts.git
cd workly-contacts
```

#### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your configuration:

```env
# ============================================
# Server Configuration
# ============================================
NODE_ENV=development
PORT=5000
SERVER_BASE_URL=http://localhost:5000
CLIENT_BASE_URL=http://localhost:3000

# ============================================
# MongoDB Configuration (Required)
# ============================================
# Development - MongoDB Atlas Connection String
MONGODB_DEVELOPMENT_URI=mongodb+srv://username:password@cluster.mongodb.net/workly-contacts-dev?retryWrites=true&w=majority

# Production - MongoDB Atlas Connection String (Optional for dev)
MONGODB_PRODUCTION_URI=mongodb+srv://username:password@cluster.mongodb.net/workly-contacts-prod?retryWrites=true&w=majority

# ============================================
# Redis Configuration
# ============================================
# For Docker Compose (automatically configured)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Development Redis URI (Docker Compose)
REDIS_DEVELOPMENT_URI=redis://redis:6379

# Production Redis URI (e.g., Upstash, Redis Cloud)
REDIS_PRODUCTION_URI=redis://default:your-redis-password@your-redis-host:port
REDIS_PRODUCTION_TOKEN=your-redis-token-if-required

# ============================================
# JWT Secrets (Generate strong random strings)
# ============================================
JWT_ACCESS_TOKEN_SECRET_KEY=your-super-secret-access-token-key-min-32-chars
JWT_REFRESH_TOKEN_SECRET_KEY=your-super-secret-refresh-token-key-min-32-chars
JWT_RECOVER_SESSION_TOKEN_SECRET_KEY=your-super-secret-recover-session-key-min-32-chars
JWT_ACTIVATION_TOKEN_SECRET_KEY=your-super-secret-activation-token-key-min-32-chars
JWT_CHANGE_PASSWORD_PAGE_TOKEN_SECRET_KEY=your-super-secret-change-password-key-min-32-chars
JWT_CLEAR_DEVICE_TOKEN_SECRET_KEY=your-super-secret-clear-device-key-min-32-chars
JWT_ADD_PASSWORD_PAGE_TOKEN_SECRET_KEY=your-super-secret-add-password-key-min-32-chars
JWT_SALT_ROUND=10

# ============================================
# Security Keys
# ============================================
# OTP Hashing Secret
OTP_HASH_SECRET=your-otp-hash-secret-key-min-32-chars

# Google reCAPTCHA v2 Secret Key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# ============================================
# Email Configuration (SMTP)
# ============================================
# Gmail Configuration (Recommended for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# For Gmail: Generate App Password at https://myaccount.google.com/apppasswords

# ============================================
# CORS Configuration
# ============================================
CORS_ORIGIN_DEV=http://localhost:3000
CORS_ORIGIN_PROD=https://contacts.workly.ink

# ============================================
# OAuth Configuration (Optional)
# ============================================
# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Get credentials at: https://console.cloud.google.com/apis/credentials

# ============================================
# Cloudinary Configuration (Optional)
# ============================================
# For image/avatar uploads
CLOUDINARY_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET_KEY=your-cloudinary-api-secret

# Get credentials at: https://cloudinary.com/console
```

> **Security Note:**
>
> - Never commit the `.env` file to version control
> - Generate strong random strings for all JWT secrets (minimum 32 characters)
> - Use different secrets for development and production environments
> - Keep your API keys and passwords secure

**Quick Secret Generation:**

```bash
# Generate random secrets for JWT tokens (run this 7 times for all JWT secrets)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

#### 4. Install Dependencies

```bash
npm install
```

#### 5. Start the Application with Docker Compose

```bash
docker-compose up
```

This command will:

- Pull the Redis image from Docker Hub
- Build the development server image using `Dockerfile.dev`
- Start Redis, Redis UI, and the Node.js server
- Set up automatic code reloading with volume mounting

#### 6. Verify the Setup

Once all containers are running, verify the installation:

- **API Server**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Redis UI**: http://localhost:8081

You should see logs indicating successful connection to MongoDB Atlas and Redis.

#### 7. Start Coding! 🚀

Your development environment is now ready. Any changes you make to the code will automatically reload the server thanks to nodemon and Docker volume mounting.

### Essential Environment Variables Explained

| Category       | Variable                    | Description                                      | Required     |
| -------------- | --------------------------- | ------------------------------------------------ | ------------ |
| **Server**     | `NODE_ENV`                  | Environment mode (`development` or `production`) | ✅ Yes       |
|                | `PORT`                      | Server port (default: 5000)                      | ✅ Yes       |
|                | `SERVER_BASE_URL`           | Backend API base URL                             | ✅ Yes       |
|                | `CLIENT_BASE_URL`           | Frontend application URL                         | ✅ Yes       |
| **Database**   | `MONGODB_DEVELOPMENT_URI`   | MongoDB Atlas connection string for dev          | ✅ Yes       |
|                | `MONGODB_PRODUCTION_URI`    | MongoDB Atlas connection string for prod         | ⚠️ Prod only |
| **Redis**      | `REDIS_HOST`                | Redis host (use `redis` for Docker)              | ✅ Yes       |
|                | `REDIS_PORT`                | Redis port (default: 6379)                       | ✅ Yes       |
|                | `REDIS_DEVELOPMENT_URI`     | Redis connection URI for dev                     | ✅ Yes       |
| **JWT**        | `JWT_*_SECRET_KEY`          | Secret keys for different JWT token types        | ✅ Yes       |
|                | `JWT_SALT_ROUND`            | Bcrypt salt rounds (default: 10)                 | ✅ Yes       |
| **Security**   | `OTP_HASH_SECRET`           | Secret for OTP hashing                           | ✅ Yes       |
|                | `RECAPTCHA_SECRET_KEY`      | Google reCAPTCHA secret                          | ✅ Yes       |
| **Email**      | `SMTP_HOST`                 | Email service host                               | ✅ Yes       |
|                | `SMTP_PORT`                 | SMTP port (587 for TLS)                          | ✅ Yes       |
|                | `SMTP_USER`                 | Email account username                           | ✅ Yes       |
|                | `SMTP_PASS`                 | Email account password/app password              | ✅ Yes       |
| **OAuth**      | `GOOGLE_CLIENT_ID`          | Google OAuth client ID                           | ❌ Optional  |
|                | `GOOGLE_CLIENT_SECRET`      | Google OAuth client secret                       | ❌ Optional  |
|                | `CALLBACK_URL`              | OAuth callback URL                               | ❌ Optional  |
| **Cloudinary** | `CLOUDINARY_NAME`           | Cloudinary cloud name                            | ❌ Optional  |
|                | `CLOUDINARY_API_KEY`        | Cloudinary API key                               | ❌ Optional  |
|                | `CLOUDINARY_API_SECRET_KEY` | Cloudinary API secret                            | ❌ Optional  |

### Docker Services

The `docker-compose.yaml` configures three services:

1. **Redis** (`redis:latest`)

   - Runs on port `6379`
   - Used for caching and session management
   - Data persists in `redis_volume`

2. **Redis Commander** (UI for Redis)

   - Runs on port `8081`
   - Provides a web interface to inspect Redis data
   - Access at http://localhost:8081

3. **Server** (Node.js Application)
   - Runs on port `5000`
   - Auto-reloads on code changes
   - Connects to MongoDB Atlas and local Redis

### Useful Commands

```bash
# Start all services
docker-compose up

# Start in detached mode (runs in background)
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f server

# Rebuild containers (after dependency changes)
docker-compose up --build

# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Access server container shell
docker exec -it server_container sh

# Run tests inside container
docker exec -it server_container npm test
```

### Troubleshooting

#### Port Already in Use

If you get a port conflict error:

```bash
# Find process using the port
# On macOS/Linux:
lsof -i :5000

# On Windows:
netstat -ano | findstr :5000

# Kill the process or change the port in docker-compose.yaml
```

#### MongoDB Connection Failed

- Verify your MongoDB Atlas connection string is correct
- Ensure your IP address is whitelisted in Atlas (use `0.0.0.0/0` for development)
- Check that your database user has proper read/write permissions
- Verify the database name in the connection string

#### Redis Connection Issues

```bash
# Check if Redis container is running
docker ps | grep redis

# Restart Redis container
docker-compose restart redis

# Check Redis logs
docker-compose logs redis
```

#### Email/SMTP Issues

- For Gmail: Enable 2-factor authentication and create an [App Password](https://myaccount.google.com/apppasswords)
- Verify SMTP credentials are correct
- Check if your email provider allows SMTP access
- Test email configuration with a simple send test

#### Docker Build Fails

```bash
# Clean up Docker system
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Remove all containers and rebuild
docker-compose down -v
docker-compose up --build
```

#### Changes Not Reflecting

```bash
# Restart the server container
docker-compose restart server

# Or rebuild if dependencies changed
docker-compose up --build
```

#### Environment Variables Not Loading

- Ensure `.env` file is in the root directory
- Check for typos in variable names
- Verify no extra spaces around `=` signs
- Restart Docker containers after `.env` changes

### Development Workflow

1. Make changes to your code
2. Docker automatically detects changes and restarts the server (via nodemon)
3. Test your changes at http://localhost:5000
4. Check API documentation at http://localhost:5000/api-docs
5. Monitor logs with `docker-compose logs -f server`
6. Inspect Redis data at http://localhost:8081
7. Run tests with `docker exec -it server_container npm test`

### Getting API Credentials

#### MongoDB Atlas

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free M0 cluster
3. Create a database user under "Database Access"
4. Whitelist IP: `0.0.0.0/0` under "Network Access"
5. Get connection string from "Connect" → "Connect your application"

#### Gmail SMTP (for emails)

1. Enable 2-Factor Authentication on your Google account
2. Visit [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this password in `SMTP_PASS`

#### Google OAuth (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/v1/auth/google/callback`

#### Google reCAPTCHA

1. Visit [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register a new site with reCAPTCHA v2 (checkbox)
3. Add `localhost` to domains
4. Copy the secret key

#### Cloudinary (optional)

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get credentials from your dashboard
3. Copy Cloud Name, API Key, and API Secret
