// Lionsun Airdrop Demo - Interactive JavaScript

class LionsunAirdrop {
    constructor() {
        this.isWalletConnected = false;
        this.walletAddress = '';
        this.countdownEndDate = new Date(Date.now() + (12 * 24 * 60 * 60 * 1000) + (8 * 60 * 60 * 1000) + (17 * 60 * 1000) + (22 * 1000)); // 12d 8h 17m 22s from now
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startCountdown();
        this.setupAnimations();
        this.checkUrlParams();
    }

    setupEventListeners() {
        // Wallet connection buttons
        document.getElementById('connectWallet').addEventListener('click', () => {
            this.showWalletModal();
        });

        // Wallet options in main section
        document.querySelectorAll('.wallet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.connectWallet(e.target.closest('.wallet-btn').dataset.wallet);
            });
        });

        // Wallet options in modal
        document.querySelectorAll('.wallet-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.connectWallet(e.target.closest('.wallet-option').dataset.wallet);
                this.hideWalletModal();
            });
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            this.hideWalletModal();
        });

        // Modal background click
        document.getElementById('walletModal').addEventListener('click', (e) => {
            if (e.target.id === 'walletModal') {
                this.hideWalletModal();
            }
        });

        // Claim button
        document.getElementById('claimButton').addEventListener('click', () => {
            this.claimTokens();
        });

        // Copy referral link
        document.getElementById('copyLink').addEventListener('click', () => {
            this.copyReferralLink();
        });

        // Learn More button
        document.querySelector('.btn-secondary').addEventListener('click', () => {
            this.showLearnMore();
        });
    }

    showWalletModal() {
        document.getElementById('walletModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    hideWalletModal() {
        document.getElementById('walletModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    async connectWallet(walletType) {
        // Simulate wallet connection
        const loadingStates = {
            metamask: 'Connecting to MetaMask...',
            walletconnect: 'Connecting via WalletConnect...',
            trustwallet: 'Connecting to Trust Wallet...'
        };

        this.showNotification(loadingStates[walletType] || 'Connecting wallet...', 'info');

        // Simulate connection delay
        await this.delay(2000);

        // Generate a random wallet address
        this.walletAddress = this.generateWalletAddress();
        this.isWalletConnected = true;

        // Update UI
        this.updateWalletUI();
        this.showNotification('Wallet connected successfully!', 'success');

        // Hide wallet section and show claim section
        document.getElementById('walletSection').style.display = 'none';
        document.getElementById('claimSection').style.display = 'block';

        // Update referral link
        this.updateReferralLink();
    }

    generateWalletAddress() {
        const chars = '0123456789abcdef';
        let address = '0x';
        for (let i = 0; i < 40; i++) {
            address += chars[Math.floor(Math.random() * chars.length)];
        }
        return address;
    }

    updateWalletUI() {
        // Update wallet address display
        const shortAddress = this.walletAddress.substring(0, 6) + '...' + this.walletAddress.substring(38);
        document.getElementById('walletAddress').textContent = shortAddress;

        // Update referral link
        this.updateReferralLink();
    }

    updateReferralLink() {
        const baseUrl = window.location.origin + window.location.pathname;
        const referralLink = `${baseUrl}?ref=${this.walletAddress}`;
        document.getElementById('referralLink').value = referralLink;
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const refAddress = urlParams.get('ref');
        
        if (refAddress) {
            // Simulate referral bonus
            this.showNotification(`Welcome! You were invited by ${refAddress.substring(0, 6)}...${refAddress.substring(38)}`, 'success');
        }
    }

    startCountdown() {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = this.countdownEndDate.getTime() - now;

            if (distance < 0) {
                // Airdrop has ended
                document.getElementById('countdown').innerHTML = '<div class="time-unit"><span class="time-value">ENDED</span></div>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        };

        // Update immediately and then every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    async claimTokens() {
        const claimButton = document.getElementById('claimButton');
        const originalText = claimButton.innerHTML;
        
        // Show loading state
        claimButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Claiming...';
        claimButton.disabled = true;

        // Simulate claiming process
        await this.delay(3000);

        // Show success
        claimButton.innerHTML = '<i class="fas fa-check"></i> Claimed!';
        claimButton.style.background = 'linear-gradient(45deg, #4caf50, #66bb6a)';
        
        this.showNotification('🎉 Successfully claimed 150 $LIONSUN!', 'success');

        // Reset button after delay
        setTimeout(() => {
            claimButton.innerHTML = originalText;
            claimButton.disabled = false;
            claimButton.style.background = '';
        }, 2000);
    }

    async copyReferralLink() {
        const referralLink = document.getElementById('referralLink');
        referralLink.select();
        referralLink.setSelectionRange(0, 99999); // For mobile devices

        try {
            await navigator.clipboard.writeText(referralLink.value);
            this.showNotification('Referral link copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            document.execCommand('copy');
            this.showNotification('Referral link copied to clipboard!', 'success');
        }

        // Visual feedback
        const copyBtn = document.getElementById('copyLink');
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = '#4caf50';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            copyBtn.style.background = '';
        }, 2000);
    }

    showLearnMore() {
        const lore = `Lionsun Coin represents the cosmic lion trapped in a psychological maze. 
        
        The more people join the quest, the stronger the lion becomes. Each referral strengthens the community and brings us closer to freeing the Roaring Lion.

        Join thousands of adventurers in this epic quest to liberate the cosmic lion and unlock the power of decentralized gaming!`;
        
        alert(lore);
    }

    setupAnimations() {
        // Add scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards
        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        return colors[type] || '#2196f3';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the airdrop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LionsunAirdrop();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add particle effect on click
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn') || e.target.closest('.wallet-btn')) {
            createParticleEffect(e.clientX, e.clientY);
        }
    });

    // Add hover effects for cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

function createParticleEffect(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: #ffd700;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: particle 0.6s ease-out forwards;
        `;

        const angle = (i / 8) * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        particle.style.setProperty('--vx', vx + 'px');
        particle.style.setProperty('--vy', vy + 'px');

        document.body.appendChild(particle);

        setTimeout(() => {
            document.body.removeChild(particle);
        }, 600);
    }
}

// Add particle animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes particle {
        0% {
            transform: translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: translate(var(--vx), var(--vy));
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);