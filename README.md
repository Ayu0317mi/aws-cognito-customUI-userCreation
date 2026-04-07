# AWS Cognito Authentication with React + Terraform
A full-stack authentication application using AWS Cognito for user management, built with React + Vite frontend and Terraform for infrastructure as code.

## 🙏 Credits
This project was created based on the tutorial: [Build a Custom Login/Signup Flow with AWS Cognito, AWS Amplify, and React (Terraform) by WittCode](https://youtu.be/JujyvvZui3k?si=1Xxm7BJktLEUgdrs)

## Features
- **AWS Cognito Authentication**
  - Email-based user registration
  - Email verification with confirmation codes
  - Secure login/logout
  - Protected routes
  - Session management

- **Modern React Frontend**
  - Built with Vite for fast development
  - React Router for navigation
  - AWS Amplify for auth integration
  - Responsive mobile-friendly layout

- **Infrastructure as Code**
  - Terraform for AWS resource management
  - Automated Cognito User Pool setup
  - Configurable password policies
  - Optional MFA support

## Project Structure

```
custom-login/
├── iac/                    # Terraform infrastructure code
│   ├── provider.tf         # AWS provider configuration
│   ├── variables.tf        # Input variables
│   ├── main.tf            # Cognito resources
│   ├── outputs.tf         # Output values
│
└── react-cognito-app/     # React frontend application
    ├── src/
    │   ├── routes/        # Page components
    │   ├── contexts/      # Auth context
    │   ├── components/    # Route guards
    │   └── main.jsx       # App entry point
    ├── .env               # Environment variables (not in git)
    └── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) v20.19+ or v22.12+
- [Terraform](https://www.terraform.io/downloads.html) >= 1.0
- [AWS CLI](https://aws.amazon.com/cli/) configured
- AWS account with Cognito permissions

## Using the Application

### Sign Up
1. Click "Sign up" link on login page
2. Enter your name, email, and password (min 8 characters)
3. Click "Sign Up"
4. Check your email for verification code

### Verify Email
1. Enter your email and the 6-digit code
2. Click "Verify Email"
3. You'll be auto-signed in and redirected to dashboard

### Sign In
1. Enter your email and password
2. Click "Sign In"
3. Access the protected dashboard

### Dashboard
- View your user information
- See session status
- Sign out when done

## Security Notes

**Files Not Committed to Git:**
- ✅ `.env` - Contains sensitive Cognito credentials
- ✅ `terraform.tfvars` - Contains AWS configuration
- ✅ `*.tfstate` - Terraform state files
- ✅ `node_modules/` - Dependencies

**Before Pushing to GitHub:**
```bash
# Verify sensitive files are ignored
git status

# Should NOT see:
# - .env
# - terraform.tfvars
# - *.tfstate files
```

## Tech Stack

**Frontend:**
- React 18
- Vite 8
- React Router v6
- AWS Amplify v6
- CSS3 (custom styling)

**Backend:**
- AWS Cognito
- AWS IAM

**Infrastructure:**
- Terraform
- AWS Provider

## License

MIT

---

**Note:** This is a demo application. For production use, implement additional security measures like:
- HTTPS enforcement
- Rate limiting
- Additional auth flows (forgot password, change password)
- Multi-factor authentication
- CORS configuration
- CloudWatch logging and monitoring

## Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

