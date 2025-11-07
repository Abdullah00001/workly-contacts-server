## Production Deployment

This guide covers deploying Workly Contacts to production environments. The application is designed to be cloud-native and can be deployed to various platforms.

### Prerequisites

Before deploying to production, ensure you have:

- **MongoDB Atlas** account with a production cluster
- **Redis** service (self-hosted or managed service like Upstash, AWS ElastiCache, Redis Cloud)
- **Container Registry** account (Docker Hub, AWS ECR, GitHub Container Registry)
- **Deployment Platform** (Fly.io, AWS, DigitalOcean, Railway, Render, etc.)
- **Domain Name** (optional but recommended)
- **Email Service** (Gmail, SendGrid, AWS SES, etc.)
- **Cloudinary Account** (for image uploads)

---

## Deployment Options

### Option 1: Fly.io (Recommended - Used in Production)

Fly.io is the current production deployment platform for Workly Contacts, offering global edge deployment with auto-scaling capabilities.

#### Why Fly.io?

- ✅ Docker-native platform
- ✅ Global edge network with low latency
- ✅ Automatic SSL certificates
- ✅ Built-in health checks and auto-restart
- ✅ Simple deployment with CLI
- ✅ Affordable pricing with free tier

#### Setup Steps

##### 1. Install Fly.io CLI

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Verify installation
fly version
```

##### 2. Login to Fly.io

```bash
fly auth login
```

##### 3. Create Fly.io Application

```bash
# Launch interactive setup
fly launch

# Or create manually
fly apps create api-workly-contacts --region bom
```

**Recommended Regions:**

- `bom` - Mumbai, India (Asia)
- `sin` - Singapore (Asia-Pacific)
- `iad` - Ashburn, VA (US East)
- `lhr` - London (Europe)

##### 4. Configure Secrets

Set all environment variables as Fly.io secrets:

```bash
# Server Configuration
fly secrets set NODE_ENV=production
fly secrets set PORT=5000
fly secrets set SERVER_BASE_URL=https://api.contacts.workly.ink
fly secrets set CLIENT_BASE_URL=https://contacts.workly.ink

# MongoDB Atlas
fly secrets set MONGODB_PRODUCTION_URI="mongodb+srv://user:pass@cluster.mongodb.net/workly-contacts-prod?retryWrites=true&w=majority"

# Redis Configuration (use production Redis service)
fly secrets set REDIS_PRODUCTION_URI="redis://default:password@redis-host:port"
fly secrets set REDIS_HOST=your-redis-host
fly secrets set REDIS_PORT=6379
fly secrets set REDIS_PASSWORD=your-redis-password

# JWT Secrets (generate new ones for production)
fly secrets set JWT_ACCESS_TOKEN_SECRET_KEY=$(openssl rand -hex 32)
fly secrets set JWT_REFRESH_TOKEN_SECRET_KEY=$(openssl rand -hex 32)
fly secrets set JWT_RECOVER_SESSION_TOKEN_SECRET_KEY=$(openssl rand -hex 32)
fly secrets set JWT_ACTIVATION_TOKEN_SECRET_KEY=$(openssl rand -hex 32)
fly secrets set JWT_CHANGE_PASSWORD_PAGE_TOKEN_SECRET_KEY=$(openssl rand -hex 32)
fly secrets set JWT_CLEAR_DEVICE_TOKEN_SECRET_KEY=$(openssl rand -hex 32)
fly secrets set JWT_ADD_PASSWORD_PAGE_TOKEN_SECRET_KEY=$(openssl rand -hex 32)
fly secrets set JWT_SALT_ROUND=12

# Security
fly secrets set OTP_HASH_SECRET=$(openssl rand -hex 32)
fly secrets set RECAPTCHA_SECRET_KEY=your-recaptcha-secret

# SMTP Configuration
fly secrets set SMTP_HOST=smtp.gmail.com
fly secrets set SMTP_PORT=587
fly secrets set SMTP_USER=your-production-email@gmail.com
fly secrets set SMTP_PASS=your-app-password

# CORS
fly secrets set CORS_ORIGIN_DEV=http://localhost:3000
fly secrets set CORS_ORIGIN_PROD=https://contacts.workly.ink

# OAuth (if using)
fly secrets set GOOGLE_CLIENT_ID=your-google-client-id
fly secrets set GOOGLE_CLIENT_SECRET=your-google-client-secret
fly secrets set CALLBACK_URL=https://api.contacts.workly.ink/api/v1/auth/google/callback

# Cloudinary
fly secrets set CLOUDINARY_NAME=your-cloud-name
fly secrets set CLOUDINARY_API_KEY=your-api-key
fly secrets set CLOUDINARY_API_SECRET_KEY=your-api-secret

# Redis Production Token (if required by provider)
fly secrets set REDIS_PRODUCTION_TOKEN=your-redis-token
```

**Bulk Secret Import:**

Create a `.env.production` file (never commit this):

```env
NODE_ENV=production
PORT=5000
# ... all your production variables
```

Then import:

```bash
fly secrets import < .env.production
```

##### 5. Configure `fly.toml`

Create or verify your `fly.toml` configuration:

```toml
app = "api-workly-contacts"
primary_region = "bom"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "5000"

[http_service]
  internal_port = 5000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

  [[http_service.checks]]
    grace_period = "10s"
    interval = "30s"
    method = "GET"
    timeout = "5s"
    path = "/health"

[[vm]]
  size = "shared-cpu-1x"
  memory = "512mb"

[deploy]
  strategy = "rolling"
```

##### 6. Manual Deployment

```bash
# Deploy to Fly.io
fly deploy

# Check deployment status
fly status

# View logs
fly logs

# Open application in browser
fly open
```

##### 7. Custom Domain Setup (Optional)

```bash
# Add custom domain
fly certs add api.contacts.workly.ink

# Check certificate status
fly certs show api.contacts.workly.ink

# Get DNS configuration
fly ips list
```

Add these DNS records to your domain:

```
Type    Name                Value
A       api.contacts        [IPv4 from fly ips list]
AAAA    api.contacts        [IPv6 from fly ips list]
```

---

### Automated CI/CD Deployment

The project includes GitHub Actions workflow for automated deployment on version tags.

#### Setup GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret:

```
DOCKER_USERNAME          # Your Docker Hub username
DOCKER_PASSWORD          # Your Docker Hub password or access token
FLY_API_TOKEN           # Your Fly.io API token
```

**Get Fly.io API Token:**

```bash
fly auth token
```

#### Deployment Workflow

The `.github/workflows/deploy.yml` workflow automatically:

1. ✅ Triggers on version tags (e.g., `v1.0.0`, `v2.1.3`)
2. ✅ Builds Docker image from `Dockerfile`
3. ✅ Pushes image to Docker Hub with version tag and `latest` tag
4. ✅ Deploys to Fly.io using the built image
5. ✅ Uses Mumbai (`bom`) region for deployment

#### Creating a Release

```bash
# Commit your changes
git add .
git commit -m "Release v1.0.0"

# Create and push tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions will automatically deploy to production
```

#### Monitoring Deployment

```bash
# Watch GitHub Actions
# Visit: https://github.com/yourusername/workly-contacts/actions

# Monitor Fly.io deployment
fly logs --app api-workly-contacts

# Check deployment status
fly status --app api-workly-contacts
```

---

## Redis Configuration for Production

You have multiple options for Redis in production:

### Option 1: Upstash Redis (Recommended for Serverless)

**Pros:**

- ✅ Serverless with automatic scaling
- ✅ No cold starts
- ✅ Global replication
- ✅ Free tier available
- ✅ REST API support

**Setup:**

1. Create account at [Upstash](https://upstash.com)
2. Create a Redis database
3. Get connection details
4. Set secrets:

```bash
fly secrets set REDIS_PRODUCTION_URI="redis://default:password@your-upstash-host:port"
fly secrets set REDIS_HOST=your-upstash-host.upstash.io
fly secrets set REDIS_PORT=6379
fly secrets set REDIS_PASSWORD=your-password
fly secrets set REDIS_PRODUCTION_TOKEN=your-upstash-token
```

### Option 2: Redis Cloud (Redis Labs)

**Pros:**

- ✅ Managed Redis by Redis Labs
- ✅ High availability
- ✅ 24/7 monitoring
- ✅ Free tier available

**Setup:**

1. Sign up at [Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/)
2. Create a subscription and database
3. Configure connection:

```bash
fly secrets set REDIS_PRODUCTION_URI="redis://default:password@redis-host:port"
fly secrets set REDIS_HOST=redis-12345.c123.us-east-1-1.ec2.redns.redis-cloud.com
fly secrets set REDIS_PORT=12345
fly secrets set REDIS_PASSWORD=your-password
```

### Option 3: AWS ElastiCache

**Pros:**

- ✅ Fully managed by AWS
- ✅ High availability with Multi-AZ
- ✅ Automatic failover
- ✅ VPC security

**Setup:**

1. Create ElastiCache cluster in AWS Console
2. Use VPC peering or Transit Gateway to connect to Fly.io
3. Configure connection:

```bash
fly secrets set REDIS_PRODUCTION_URI="redis://your-elasticache-endpoint:6379"
fly secrets set REDIS_HOST=your-cluster.cache.amazonaws.com
fly secrets set REDIS_PORT=6379
```

### Option 4: Self-Hosted Redis on Same Server

**Pros:**

- ✅ No external dependencies
- ✅ Low latency
- ✅ Cost-effective

**Cons:**

- ⚠️ Requires container orchestration
- ⚠️ Manual scaling and monitoring

**Setup with Docker Compose on VPS:**

1. Deploy to VPS (DigitalOcean, Linode, AWS EC2)
2. Use Docker Compose with Redis:

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: redis_production
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - '127.0.0.1:6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - app_network

  server:
    image: abdullah00001/workly-contacts:latest
    container_name: server_production
    restart: always
    ports:
      - '5000:5000'
    environment:
      - NODE_ENV=production
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    env_file:
      - .env.production
    depends_on:
      - redis
    networks:
      - app_network

volumes:
  redis_data:

networks:
  app_network:
    driver: bridge
```

3. Deploy:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Redis Configuration:**

```bash
# Set strong password
REDIS_PASSWORD=$(openssl rand -hex 32)

# Configure in environment
export REDIS_PRODUCTION_URI="redis://:${REDIS_PASSWORD}@redis:6379"
```

---

## Alternative Deployment Platforms

### Option 2: Railway

**Setup:**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Set environment variables
railway variables set NODE_ENV=production
railway variables set MONGODB_PRODUCTION_URI="your-mongo-uri"
# ... set all variables

# Deploy
railway up
```

### Option 3: Render

**Setup:**

1. Create account at [Render](https://render.com)
2. Connect GitHub repository
3. Create new Web Service
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Add all variables from Environment Variables section

### Option 4: DigitalOcean App Platform

**Setup:**

1. Create account at [DigitalOcean](https://www.digitalocean.com)
2. Create new App
3. Connect GitHub repository
4. Configure environment variables
5. Deploy

### Option 5: AWS ECS/Fargate

**Setup:**

1. Push Docker image to ECR
2. Create ECS cluster
3. Define task definition with environment variables
4. Create Fargate service
5. Configure ALB for load balancing

### Option 6: Self-Hosted VPS (DigitalOcean, Linode, Vultr)

**Complete Setup:**

```bash
# SSH into VPS
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Clone repository
git clone https://github.com/yourusername/workly-contacts.git
cd workly-contacts

# Create production environment file
nano .env.production
# Paste all production variables

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Setup Nginx reverse proxy
apt install nginx -y

# Configure Nginx
nano /etc/nginx/sites-available/workly-contacts
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name api.contacts.workly.ink;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/workly-contacts /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx

# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d api.contacts.workly.ink
```

---

## Production Dockerfile

The production `Dockerfile` is optimized for size and security:

```dockerfile
FROM node:22.14.0-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:22.14.0-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

ENV NODE_ENV=production
EXPOSE 5000

USER node

CMD ["node", "dist/index.js"]
```

---

## Production Checklist

### Pre-Deployment

- [ ] Generate strong JWT secrets (minimum 32 characters each)
- [ ] Configure MongoDB Atlas production cluster
- [ ] Set up production Redis service (Upstash/Redis Cloud/AWS)
- [ ] Configure production email service
- [ ] Set up Cloudinary for production
- [ ] Update Google OAuth callback URLs for production domain
- [ ] Configure reCAPTCHA with production domain
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure log aggregation (Logtail, Papertrail, etc.)

### Security

- [ ] All secrets stored in platform's secret manager (never in code)
- [ ] Different JWT secrets for dev and production
- [ ] Strong bcrypt salt rounds (12+ for production)
- [ ] HTTPS enabled with valid SSL certificate
- [ ] CORS configured with production domain only
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Database access restricted to application IPs only

### Monitoring & Logging

- [ ] Health check endpoint configured (`/health`)
- [ ] Application logs centralized
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Database performance monitoring
- [ ] Redis monitoring enabled

### Performance

- [ ] Database indexes created
- [ ] Redis caching enabled
- [ ] Compression middleware active
- [ ] Static assets cached
- [ ] CDN configured (if applicable)
- [ ] Connection pooling optimized

### Backup & Recovery

- [ ] MongoDB Atlas automated backups enabled
- [ ] Redis persistence configured
- [ ] Disaster recovery plan documented
- [ ] Database restore procedure tested

---

## Post-Deployment

### Verify Deployment

```bash
# Check health endpoint
curl https://api.contacts.workly.ink/health

# Check API documentation
curl https://api.contacts.workly.ink/api-docs

# Test authentication
curl -X POST https://api.contacts.workly.ink/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### Monitoring Commands

```bash
# Fly.io monitoring
fly logs --app api-workly-contacts
fly status --app api-workly-contacts
fly scale show --app api-workly-contacts

# Railway monitoring
railway logs
railway status

# Docker monitoring (VPS)
docker-compose logs -f
docker stats
```

### Common Issues

#### Application Won't Start

```bash
# Check environment variables
fly secrets list

# View startup logs
fly logs --app api-workly-contacts

# Restart application
fly apps restart api-workly-contacts
```

#### Database Connection Failed

- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` or deployment platform IPs
- Check connection string format
- Verify database user permissions
- Test connection string locally

#### Redis Connection Issues

- Verify Redis host, port, and password
- Check Redis service is running (24/7, no cold starts)
- Test connection with Redis CLI
- Verify firewall rules allow connection

---

## Scaling

### Horizontal Scaling (Fly.io)

```bash
# Scale to multiple machines
fly scale count 3 --app api-workly-contacts

# Scale to different regions
fly scale count 2 --region bom --app api-workly-contacts
fly scale count 1 --region sin --app api-workly-contacts

# Auto-scaling configuration in fly.toml
[[services.concurrency]]
  type = "connections"
  hard_limit = 1000
  soft_limit = 800
```

### Vertical Scaling

```bash
# Increase machine resources
fly scale vm shared-cpu-2x --app api-workly-contacts
fly scale memory 1024 --app api-workly-contacts
```

---

## Cost Optimization

### Fly.io Pricing Estimates

- **Shared CPU 1x (256MB):** ~$5/month
- **Shared CPU 1x (512MB):** ~$10/month
- **Persistent storage:** $0.15/GB/month
- **Bandwidth:** First 100GB free

### MongoDB Atlas

- **M0 (Free Tier):** 512MB storage
- **M2:** ~$9/month, 2GB storage
- **M5:** ~$25/month, 5GB storage

### Redis Services

- **Upstash:** Free tier available, pay-per-request
- **Redis Cloud:** 30MB free, paid plans from $7/month
- **AWS ElastiCache:** From $15/month

---

## Support & Troubleshooting

### Get Help

- **Documentation Issues:** Open issue on GitHub
- **Deployment Problems:** Check platform-specific docs
- **Application Bugs:** Create GitHub issue with logs

### Useful Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**🚀 Your production deployment is now complete! Monitor your application and ensure all services are running smoothly.**
