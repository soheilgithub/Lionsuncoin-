// UI Utilities for Lionsuncoin Gaming Platform

class UIManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupAnimationObserver();
    this.setupTooltips();
    this.setupKeyboardShortcuts();
    this.setupThemeManager();
    this.setupAccessibility();
    this.initializeAnimations();
  }

  // Intersection Observer for scroll animations
  setupAnimationObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.platform-card, .game-card, .leaderboard-row').forEach(el => {
      observer.observe(el);
    });
  }

  // Enhanced tooltips
  setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
      let tooltip = null;

      element.addEventListener('mouseenter', (e) => {
        const text = element.getAttribute('data-tooltip');
        const position = element.getAttribute('data-tooltip-position') || 'top';
        
        tooltip = this.createTooltip(text, position);
        document.body.appendChild(tooltip);
        this.positionTooltip(tooltip, element, position);
      });

      element.addEventListener('mouseleave', () => {
        if (tooltip) {
          tooltip.remove();
          tooltip = null;
        }
      });

      element.addEventListener('mousemove', (e) => {
        if (tooltip) {
          this.positionTooltip(tooltip, element, element.getAttribute('data-tooltip-position') || 'top');
        }
      });
    });
  }

  createTooltip(text, position = 'top') {
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${position}`;
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      z-index: 10000;
      background: var(--bg-card);
      color: var(--text-primary);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: var(--shadow-lg);
      pointer-events: none;
      opacity: 0;
      transform: translateY(5px);
      transition: all 0.2s ease;
    `;

    // Trigger animation
    setTimeout(() => {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0)';
    }, 10);

    return tooltip;
  }

  positionTooltip(tooltip, element, position) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left, top;

    switch (position) {
      case 'top':
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        top = rect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        top = rect.bottom + 8;
        break;
      case 'left':
        left = rect.left - tooltipRect.width - 8;
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        break;
      case 'right':
        left = rect.right + 8;
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        break;
    }

    // Keep tooltip within viewport
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - tooltipRect.height - 8));

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  // Keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Escape key to close modals
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          activeModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }

      // Ctrl/Cmd + K to open search (if implemented)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Open search modal
      }

      // Quick navigation shortcuts
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.scrollToSection('#home');
            break;
          case '2':
            e.preventDefault();
            this.scrollToSection('#games');
            break;
          case '3':
            e.preventDefault();
            this.scrollToSection('#platforms');
            break;
          case '4':
            e.preventDefault();
            this.scrollToSection('#leaderboard');
            break;
          case '5':
            e.preventDefault();
            this.scrollToSection('#wallet');
            break;
        }
      }
    });
  }

  scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  // Theme management
  setupThemeManager() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.setAttribute('data-theme', savedTheme);
    }

    // Auto theme based on system preference
    if (!savedTheme && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      if (mediaQuery.matches) {
        document.body.setAttribute('data-theme', 'light');
      }

      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          document.body.setAttribute('data-theme', e.matches ? 'light' : 'dark');
        }
      });
    }

    // Theme toggle button (if exists)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Animate theme transition
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  // Accessibility enhancements
  setupAccessibility() {
    // Focus management for modals
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        // Clicked on modal backdrop
        const modal = e.target;
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    });

    // High contrast mode detection
    if (window.matchMedia) {
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      if (highContrastQuery.matches) {
        document.body.classList.add('high-contrast');
      }

      highContrastQuery.addEventListener('change', (e) => {
        document.body.classList.toggle('high-contrast', e.matches);
      });
    }

    // Reduced motion detection
    if (window.matchMedia) {
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (reducedMotionQuery.matches) {
        document.body.classList.add('reduced-motion');
      }

      reducedMotionQuery.addEventListener('change', (e) => {
        document.body.classList.toggle('reduced-motion', e.matches);
      });
    }

    // Skip to content link
    this.addSkipLink();
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-color);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Initialize fancy animations
  initializeAnimations() {
    // Floating animation for coins
    this.animateFloatingCoins();
    
    // Parallax effect for hero section
    this.setupParallax();
    
    // Typewriter effect for hero text
    this.setupTypewriter();
  }

  animateFloatingCoins() {
    const createFloatingCoin = () => {
      const coin = document.createElement('div');
      coin.className = 'floating-coin';
      coin.innerHTML = '🪙';
      coin.style.cssText = `
        position: fixed;
        font-size: 20px;
        pointer-events: none;
        z-index: 1;
        opacity: 0.7;
        animation: floatUp 4s linear infinite;
        left: ${Math.random() * window.innerWidth}px;
        bottom: -30px;
      `;

      const style = document.createElement('style');
      style.textContent = `
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      
      if (!document.querySelector('#floatingCoinsStyle')) {
        style.id = 'floatingCoinsStyle';
        document.head.appendChild(style);
      }

      document.body.appendChild(coin);

      setTimeout(() => {
        coin.remove();
      }, 4000);
    };

    // Create floating coins occasionally
    setInterval(() => {
      if (Math.random() < 0.3 && window.app && window.app.currentUser) {
        createFloatingCoin();
      }
    }, 2000);
  }

  setupParallax() {
    const parallaxElements = document.querySelectorAll('.hero-particles');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrollTop * speed}px)`;
      });
    });
  }

  setupTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid var(--primary-color)';
      
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
          // Blinking cursor effect
          setInterval(() => {
            element.style.borderRight = element.style.borderRight === 'none' 
              ? '2px solid var(--primary-color)' 
              : 'none';
          }, 500);
        }
      }, 50);
    });
  }

  // Utility functions for other parts of the app
  showLoadingSpinner(element) {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    spinner.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      color: var(--primary-color);
    `;
    
    element.innerHTML = '';
    element.appendChild(spinner);
  }

  hideLoadingSpinner(element) {
    const spinner = element.querySelector('.loading-spinner');
    if (spinner) {
      spinner.remove();
    }
  }

  animateCountUp(element, start, end, duration = 2000) {
    const range = end - start;
    const stepTime = Math.abs(Math.floor(duration / range));
    const startTime = new Date().getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max((startTime + duration) - now, 0);
      const value = Math.round(end - (remaining / duration) * range);
      
      element.textContent = value.toLocaleString();
      
      if (value === end) {
        clearInterval(timer);
      }
    }, stepTime);
  }

  createConfetti() {
    const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#ef4444'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * window.innerWidth}px;
        top: -10px;
        z-index: 10000;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes confettiFall {
          to {
            transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      
      if (!document.querySelector('#confettiStyle')) {
        style.id = 'confettiStyle';
        document.head.appendChild(style);
      }
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }

  // Smooth page transitions
  transitionToPage(url) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }

  // Performance monitoring
  measurePerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          
          console.log(`Page load time: ${loadTime}ms`);
          
          // Report slow loads
          if (loadTime > 3000) {
            console.warn('Slow page load detected');
          }
        }, 0);
      });
    }
  }

  // Error boundary for JavaScript errors
  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('JavaScript error:', event.error);
      
      // Show user-friendly error message
      if (window.app) {
        window.app.showToast('Something went wrong. Please refresh the page.', 'error');
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Prevent default browser behavior
      event.preventDefault();
      
      if (window.app) {
        window.app.showToast('Connection error. Please check your internet.', 'error');
      }
    });
  }
}

// Utility functions that can be used globally
window.UIUtils = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  formatCurrency: (amount, currency = 'LC') => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ${currency}`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ${currency}`;
    }
    return `${amount.toLocaleString()} ${currency}`;
  },

  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      if (window.app) {
        window.app.showToast('Copied to clipboard!', 'success');
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      if (window.app) {
        window.app.showToast('Failed to copy', 'error');
      }
    }
  },

  generateQRCode: (text, size = 200) => {
    // Simple QR code generation (in production, use a proper QR library)
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Simple pattern for demo
    ctx.fillStyle = '#000';
    for (let i = 0; i < size; i += 10) {
      for (let j = 0; j < size; j += 10) {
        if ((i + j) % 20 === 0) {
          ctx.fillRect(i, j, 8, 8);
        }
      }
    }
    
    return canvas.toDataURL();
  }
};

// Initialize UI Manager
document.addEventListener('DOMContentLoaded', () => {
  window.uiManager = new UIManager();
  window.uiManager.measurePerformance();
  window.uiManager.setupErrorHandling();
});