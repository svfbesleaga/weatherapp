# Scripts Directory

This directory contains automation scripts for the Weather App project.

## 📦 package-and-publish.sh

A comprehensive release automation script that handles the complete CI/CD pipeline for publishing the Weather App to AWS ECR.

### What it does:

1. **🏷️ Git Tagging**: Creates and pushes a new Git tag with semantic versioning
2. **🐳 Docker Build**: Builds a production Docker image with the version tag
3. **☁️ ECR Management**: Creates AWS ECR repository if it doesn't exist
4. **🚀 Image Publishing**: Pushes the Docker image to AWS ECR

### Prerequisites:

- **Git**: For version tagging and repository management
- **Docker**: For building and tagging images
- **AWS CLI**: For ECR operations (must be configured with credentials)
- **AWS Permissions**: ECR repository creation, read/write access

### AWS CLI Setup:

```bash
# Configure AWS CLI (choose one method)

# Method 1: Interactive configuration
aws configure

# Method 2: Environment variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"

# Method 3: AWS Profile
aws configure --profile myprofile
export AWS_PROFILE=myprofile

# Verify configuration
aws sts get-caller-identity
```

### Usage:

#### Interactive Mode (Recommended)
```bash
./scripts/package-and-publish.sh
```

The script will:
- Check prerequisites
- Show current configuration
- Display the latest Git tag
- Offer version increment options (patch, minor, major, custom)
- Ask for confirmation before proceeding

#### Specify Version Directly
```bash
./scripts/package-and-publish.sh v1.2.3
```

#### Using Environment Variables
```bash
# Use different AWS region
AWS_REGION=eu-west-1 ./scripts/package-and-publish.sh

# Use different ECR repository name
ECR_REPOSITORY_NAME=my-weather-app ./scripts/package-and-publish.sh

# Use custom image name
IMAGE_NAME=custom-weatherapp ./scripts/package-and-publish.sh

# Use different Dockerfile
DOCKERFILE_PATH=./docker/Dockerfile.prod ./scripts/package-and-publish.sh
```

### Configuration Options:

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `AWS_REGION` | `us-east-1` | AWS region for ECR repository |
| `ECR_REPOSITORY_NAME` | `weatherapp` | Name of the ECR repository |
| `IMAGE_NAME` | `weatherapp` | Local Docker image name |
| `DOCKERFILE_PATH` | `./Dockerfile` | Path to the Dockerfile |

### Version Format:

The script uses semantic versioning (SemVer) format: `vMAJOR.MINOR.PATCH`

- **Patch** (`v1.0.1`): Bug fixes, no new features
- **Minor** (`v1.1.0`): New features, backward compatible
- **Major** (`v2.0.0`): Breaking changes

### Example Workflow:

```bash
# 1. Make sure your changes are committed
git add .
git commit -m "Add new feature"
git push

# 2. Run the release script
./scripts/package-and-publish.sh

# Output:
# ╔══════════════════════════════════════════════╗
# ║           Weather App - Release Tool         ║
# ╚══════════════════════════════════════════════╝
#
# [INFO] Starting release process...
# [INFO] Configuration:
#   - AWS Region: us-east-1
#   - ECR Repository: weatherapp
#   - Image Name: weatherapp
#   - Dockerfile: ./Dockerfile
#
# [INFO] Checking prerequisites...
# [SUCCESS] All prerequisites met!
# [INFO] Latest tag: v1.0.0
#
# Select version increment:
# 1) Patch: v1.0.1 (bug fixes)
# 2) Minor: v1.1.0 (new features)
# 3) Major: v2.0.0 (breaking changes)
# 4) Custom version
# Enter choice (1-4): 2
#
# [INFO] Selected version: v1.1.0
#
# [WARNING] This will:
#   1. Create and push Git tag: v1.1.0
#   2. Build Docker image: weatherapp:v1.1.0
#   3. Create ECR repository if needed: weatherapp
#   4. Push image to ECR in region: us-east-1
#
# Continue? (y/N): y
#
# [INFO] Creating Git tag: v1.1.0
# [SUCCESS] Git tag v1.1.0 created and pushed!
# [INFO] Building Docker image: weatherapp:v1.1.0
# [SUCCESS] Docker image built successfully!
# [INFO] AWS Account ID: 123456789012
# [INFO] ECR Registry: 123456789012.dkr.ecr.us-east-1.amazonaws.com
# [SUCCESS] ECR repository 'weatherapp' already exists.
# [INFO] Logging in to ECR...
# [SUCCESS] Successfully logged in to ECR!
# [INFO] Tagging image for ECR...
# [INFO] Pushing image to ECR: 123456789012.dkr.ecr.us-east-1.amazonaws.com/weatherapp:v1.1.0
# [INFO] Pushing latest tag to ECR: 123456789012.dkr.ecr.us-east-1.amazonaws.com/weatherapp:latest
# [SUCCESS] Image pushed successfully to ECR!
#
# [INFO] Image URIs:
#   - 123456789012.dkr.ecr.us-east-1.amazonaws.com/weatherapp:v1.1.0
#   - 123456789012.dkr.ecr.us-east-1.amazonaws.com/weatherapp:latest
#
# Remove local Docker images? (y/N): y
# [INFO] Cleaning up local images...
# [SUCCESS] Local images cleaned up!
#
# [SUCCESS] 🎉 Release v1.1.0 completed successfully!
#
# [INFO] Next steps:
#   - Update your deployment configurations to use: 123456789012.dkr.ecr.us-east-1.amazonaws.com/weatherapp:v1.1.0
#   - Consider creating a GitHub release for tag: v1.1.0
#   - Update your production environment
```

### Troubleshooting:

#### AWS Credentials Issues
```bash
# Check if AWS CLI is configured
aws sts get-caller-identity

# If not configured, run:
aws configure
```

#### Docker Not Running
```bash
# Start Docker Desktop or Docker daemon
sudo systemctl start docker  # Linux
# or restart Docker Desktop on macOS/Windows
```

#### Permission Denied
```bash
# Make script executable
chmod +x scripts/package-and-publish.sh

# Check if you have ECR permissions
aws ecr describe-repositories --region us-east-1
```

#### Git Tag Already Exists
```bash
# List existing tags
git tag -l

# Delete a tag if needed (be careful!)
git tag -d v1.0.0
git push origin --delete v1.0.0
```

### Features:

- ✅ **Interactive version selection** with semantic versioning
- ✅ **Comprehensive prerequisite checking**
- ✅ **AWS credential validation**
- ✅ **ECR repository auto-creation** with security settings
- ✅ **Image lifecycle management** (keeps last 10 images)
- ✅ **Colorized output** for better readability
- ✅ **Error handling** with meaningful messages
- ✅ **Rollback safety** (checks for existing tags)
- ✅ **Cleanup options** for local images
- ✅ **Help documentation** (`--help` flag)

### Security Features:

- 🔒 **Image scanning** enabled on ECR repository
- 🔒 **AES256 encryption** for stored images
- 🔒 **No credentials stored** in scripts or images
- 🔒 **IAM-based authentication** through AWS CLI

## Future Scripts

Additional automation scripts can be added to this directory:

- `deploy.sh` - Deploy to staging/production environments
- `rollback.sh` - Rollback to previous version
- `cleanup.sh` - Clean up old images and resources
- `test.sh` - Run integration tests against deployed image 