// Authentication Module for Lionsuncoin Gaming Platform

class AuthManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupFormHandlers();
    this.setupValidation();
  }

  setupFormHandlers() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin(e.target);
      });
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSignup(e.target);
      });
    }
  }

  setupValidation() {
    // Real-time validation for forms
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');

    inputs.forEach((input) => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    // Password strength indicator
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach((input) => {
      if (input.id.includes('signup')) {
        input.addEventListener('input', () => this.showPasswordStrength(input));
      }
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name || field.id;

    // Remove existing error
    this.clearFieldError(field);

    let isValid = true;
    let errorMessage = '';

    switch (fieldType) {
      case 'email':
        if (!value) {
          errorMessage = 'Email is required';
          isValid = false;
        } else if (!this.isValidEmail(value)) {
          errorMessage = 'Please enter a valid email address';
          isValid = false;
        }
        break;

      case 'password':
        if (!value) {
          errorMessage = 'Password is required';
          isValid = false;
        } else if (fieldName.includes('signup') && !this.isStrongPassword(value)) {
          errorMessage = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
          isValid = false;
        }
        break;

      case 'text':
        if (fieldName.includes('username')) {
          if (!value) {
            errorMessage = 'Username is required';
            isValid = false;
          } else if (value.length < 3) {
            errorMessage = 'Username must be at least 3 characters';
            isValid = false;
          } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            errorMessage = 'Username can only contain letters, numbers, and underscores';
            isValid = false;
          }
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);

    field.style.borderColor = '#ef4444';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;

    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  showPasswordStrength(passwordField) {
    const password = passwordField.value;
    const strength = this.calculatePasswordStrength(password);

    // Remove existing strength indicator
    const existingIndicator = passwordField.parentNode.querySelector('.password-strength');
    if (existingIndicator) {
      existingIndicator.remove();
    }

    if (password.length === 0) return;

    const strengthDiv = document.createElement('div');
    strengthDiv.className = 'password-strength';
    strengthDiv.style.cssText = `
      margin-top: 0.5rem;
      font-size: 0.875rem;
    `;

    const strengthBar = document.createElement('div');
    strengthBar.style.cssText = `
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 0.25rem;
    `;

    const strengthFill = document.createElement('div');
    strengthFill.style.cssText = `
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 2px;
    `;

    let strengthText = '';
    let strengthColor = '';
    let strengthWidth = '';

    switch (strength) {
      case 1:
        strengthText = 'Very Weak';
        strengthColor = '#ef4444';
        strengthWidth = '20%';
        break;
      case 2:
        strengthText = 'Weak';
        strengthColor = '#f97316';
        strengthWidth = '40%';
        break;
      case 3:
        strengthText = 'Fair';
        strengthColor = '#eab308';
        strengthWidth = '60%';
        break;
      case 4:
        strengthText = 'Good';
        strengthColor = '#22c55e';
        strengthWidth = '80%';
        break;
      case 5:
        strengthText = 'Strong';
        strengthColor = '#16a34a';
        strengthWidth = '100%';
        break;
    }

    strengthFill.style.width = strengthWidth;
    strengthFill.style.background = strengthColor;

    const strengthLabel = document.createElement('div');
    strengthLabel.style.color = strengthColor;
    strengthLabel.textContent = `Password Strength: ${strengthText}`;

    strengthBar.appendChild(strengthFill);
    strengthDiv.appendChild(strengthBar);
    strengthDiv.appendChild(strengthLabel);
    passwordField.parentNode.appendChild(strengthDiv);
  }

  calculatePasswordStrength(password) {
    let score = 0;

    // Length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character types
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    // Reduce score for common patterns
    if (/(.)\1{2,}/.test(password)) score--; // Repeated characters
    if (/123|abc|qwe/i.test(password)) score--; // Sequential characters

    return Math.max(1, Math.min(5, score));
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isStrongPassword(password) {
    return password.length >= 8
           && /[a-z]/.test(password)
           && /[A-Z]/.test(password)
           && /[0-9]/.test(password)
           && /[^a-zA-Z0-9]/.test(password);
  }

  async handleLogin(form) {
    const formData = new FormData(form);
    const email = formData.get('email') || document.getElementById('loginEmail').value;
    const password = formData.get('password') || document.getElementById('loginPassword').value;

    // Validate fields
    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');

    const isEmailValid = this.validateField(emailField);
    const isPasswordValid = this.validateField(passwordField);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem('authToken', data.token);

        // Update UI
        if (window.app) {
          window.app.setCurrentUser(data.user);
          window.app.closeModal('loginModal');
          window.app.showToast('Welcome back!', 'success');
        }

        // Reset form
        form.reset();
        this.clearAllFieldErrors(form);
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (window.app) {
        window.app.showToast(error.message, 'error');
      }
    } finally {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  async handleSignup(form) {
    const formData = new FormData(form);
    const username = formData.get('username') || document.getElementById('signupUsername').value;
    const email = formData.get('email') || document.getElementById('signupEmail').value;
    const password = formData.get('password') || document.getElementById('signupPassword').value;
    const platform = formData.get('platform') || document.getElementById('signupPlatform').value;

    // Validate all fields
    const usernameField = document.getElementById('signupUsername');
    const emailField = document.getElementById('signupEmail');
    const passwordField = document.getElementById('signupPassword');

    const isUsernameValid = this.validateField(usernameField);
    const isEmailValid = this.validateField(emailField);
    const isPasswordValid = this.validateField(passwordField);

    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
      return;
    }

    // Additional password strength check
    if (!this.isStrongPassword(password)) {
      this.showFieldError(passwordField, 'Password does not meet strength requirements');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username, email, password, platform
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem('authToken', data.token);

        // Update UI
        if (window.app) {
          window.app.setCurrentUser(data.user);
          window.app.closeModal('signupModal');
          window.app.showToast(`Welcome to Lionsuncoin, ${data.user.username}! You've received 1000 coins to start!`, 'success');
        }

        // Reset form
        form.reset();
        this.clearAllFieldErrors(form);
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (window.app) {
        window.app.showToast(error.message, 'error');
      }
    } finally {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  clearAllFieldErrors(form) {
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach((error) => error.remove());

    const fields = form.querySelectorAll('input');
    fields.forEach((field) => {
      field.style.borderColor = '';
    });

    const strengthIndicators = form.querySelectorAll('.password-strength');
    strengthIndicators.forEach((indicator) => indicator.remove());
  }

  // Social login methods (for future implementation)
  async loginWithGoogle() {
    // Implementation for Google OAuth
    if (window.app) {
      window.app.showToast('Google login coming soon!', 'info');
    }
  }

  async loginWithApple() {
    // Implementation for Apple Sign In
    if (window.app) {
      window.app.showToast('Apple login coming soon!', 'info');
    }
  }

  async loginWithMetaMask() {
    // Implementation for MetaMask wallet connection
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          if (window.app) {
            window.app.showToast('MetaMask wallet connected!', 'success');
          }
          // Here you would implement wallet-based authentication
        }
      } catch (error) {
        console.error('MetaMask connection error:', error);
        if (window.app) {
          window.app.showToast('Failed to connect MetaMask wallet', 'error');
        }
      }
    } else if (window.app) {
      window.app.showToast('MetaMask not detected. Please install MetaMask!', 'warning');
    }
  }

  // Password reset functionality
  async requestPasswordReset(email) {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        if (window.app) {
          window.app.showToast('Password reset link sent to your email!', 'success');
        }
      } else {
        throw new Error('Failed to send reset email');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      if (window.app) {
        window.app.showToast('Failed to send password reset email', 'error');
      }
    }
  }

  // Token management
  getStoredToken() {
    return localStorage.getItem('authToken');
  }

  removeStoredToken() {
    localStorage.removeItem('authToken');
  }

  isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      return true;
    }
  }

  // Auto-refresh token before expiration
  setupTokenRefresh() {
    const token = this.getStoredToken();
    if (!token || this.isTokenExpired(token)) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const refreshTime = expiryTime - Date.now() - 300000; // Refresh 5 minutes before expiry

      if (refreshTime > 0) {
        setTimeout(() => {
          this.refreshToken();
        }, refreshTime);
      }
    } catch (error) {
      console.error('Token refresh setup error:', error);
    }
  }

  async refreshToken() {
    const token = this.getStoredToken();
    if (!token) return;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        this.setupTokenRefresh(); // Setup next refresh
      } else {
        // Token refresh failed, redirect to login
        this.removeStoredToken();
        if (window.app) {
          window.app.currentUser = null;
          window.app.updateUI();
          window.app.showToast('Session expired. Please log in again.', 'warning');
        }
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  }

  // Two-factor authentication setup
  async enableTwoFactor() {
    const token = this.getStoredToken();
    if (!token) return;

    try {
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (window.app) {
          window.app.showToast('Two-factor authentication enabled!', 'success');
        }
        return data.qrCode; // QR code for authenticator app
      }
      throw new Error('Failed to enable 2FA');
    } catch (error) {
      console.error('2FA enable error:', error);
      if (window.app) {
        window.app.showToast('Failed to enable two-factor authentication', 'error');
      }
    }
  }
}

// Initialize authentication manager
document.addEventListener('DOMContentLoaded', () => {
  window.authManager = new AuthManager();
});

// Add social login buttons event listeners when available
document.addEventListener('DOMContentLoaded', () => {
  // Google login button
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
      window.authManager.loginWithGoogle();
    });
  }

  // Apple login button
  const appleLoginBtn = document.getElementById('appleLoginBtn');
  if (appleLoginBtn) {
    appleLoginBtn.addEventListener('click', () => {
      window.authManager.loginWithApple();
    });
  }

  // MetaMask login button
  const metamaskLoginBtn = document.getElementById('metamaskLoginBtn');
  if (metamaskLoginBtn) {
    metamaskLoginBtn.addEventListener('click', () => {
      window.authManager.loginWithMetaMask();
    });
  }

  // Password reset link
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      if (email) {
        window.authManager.requestPasswordReset(email);
      } else if (window.app) {
        window.app.showToast('Please enter your email address first', 'warning');
      }
    });
  }
});
