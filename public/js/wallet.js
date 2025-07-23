// Wallet Management for Lionsuncoin Gaming Platform

class WalletManager {
  constructor() {
    this.walletAddress = null;
    this.balance = 0;
    this.transactions = [];
    this.exchangeRate = 0.001; // 1 Lionsuncoin = 0.001 ETH (example)
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadWalletData();
    this.startBalanceUpdater();
  }

  setupEventListeners() {
    // Wallet action buttons
    const sendBtn = document.querySelector('.wallet-actions .btn:nth-child(1)');
    const withdrawBtn = document.querySelector('.wallet-actions .btn:nth-child(2)');
    const historyBtn = document.querySelector('.wallet-actions .btn:nth-child(3)');

    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.openSendModal());
    }

    if (withdrawBtn) {
      withdrawBtn.addEventListener('click', () => this.openWithdrawModal());
    }

    if (historyBtn) {
      historyBtn.addEventListener('click', () => this.showTransactionHistory());
    }

    // Connect wallet button (if exists)
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (connectWalletBtn) {
      connectWalletBtn.addEventListener('click', () => this.connectExternalWallet());
    }
  }

  async loadWalletData() {
    if (!window.app || !window.app.currentUser) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/wallet/balance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.updateWalletUI(data);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  }

  updateWalletUI(data) {
    const walletBalance = document.getElementById('walletBalance');
    const userCoins = document.getElementById('userCoins');
    const totalEarned = document.getElementById('totalEarned');

    if (walletBalance && data.balance !== undefined) {
      walletBalance.textContent = this.formatNumber(data.balance);
      this.balance = data.balance;
    }

    if (userCoins && data.balance !== undefined) {
      userCoins.textContent = this.formatNumber(data.balance);
    }

    if (totalEarned && data.totalEarned !== undefined) {
      totalEarned.textContent = this.formatNumber(data.totalEarned);
    }

    // Update exchange rate display
    this.updateExchangeRateDisplay();
  }

  updateExchangeRateDisplay() {
    const exchangeElements = document.querySelectorAll('.exchange-rate');
    exchangeElements.forEach((element) => {
      const ethValue = (this.balance * this.exchangeRate).toFixed(6);
      element.textContent = `≈ ${ethValue} ETH`;
    });
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  }

  openSendModal() {
    if (!window.app || !window.app.currentUser) {
      if (window.app) {
        window.app.showToast('Please log in to send coins', 'warning');
      }
      return;
    }

    const modalHtml = `
      <div class="modal active" id="sendModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Send Lionsuncoin</h3>
            <button class="modal-close" onclick="this.closest('.modal').remove()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="sendForm" class="modal-form">
            <div class="form-group">
              <label for="sendRecipient">Recipient Username or Wallet Address</label>
              <input type="text" id="sendRecipient" required placeholder="Enter username or wallet address">
            </div>
            <div class="form-group">
              <label for="sendAmount">Amount (Lionsuncoin)</label>
              <input type="number" id="sendAmount" min="1" max="${this.balance}" required placeholder="0">
              <small>Available: ${this.formatNumber(this.balance)} coins</small>
            </div>
            <div class="form-group">
              <label for="sendNote">Note (Optional)</label>
              <input type="text" id="sendNote" placeholder="What's this for?">
            </div>
            <div class="transaction-summary">
              <div class="summary-row">
                <span>Amount:</span>
                <span id="summaryAmount">0 LC</span>
              </div>
              <div class="summary-row">
                <span>Network Fee:</span>
                <span>1 LC</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span id="summaryTotal">1 LC</span>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-full">
              <i class="fas fa-paper-plane"></i>
              Send Coins
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';

    // Setup form handler
    const sendForm = document.getElementById('sendForm');
    const amountInput = document.getElementById('sendAmount');

    amountInput.addEventListener('input', () => {
      const amount = parseFloat(amountInput.value) || 0;
      const total = amount + 1; // 1 coin network fee
      document.getElementById('summaryAmount').textContent = `${amount} LC`;
      document.getElementById('summaryTotal').textContent = `${total} LC`;
    });

    sendForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.processSendTransaction(sendForm);
    });
  }

  async processSendTransaction(form) {
    const recipient = form.sendRecipient.value.trim();
    const amount = parseFloat(form.sendAmount.value);
    const note = form.sendNote.value.trim();

    if (amount + 1 > this.balance) {
      if (window.app) {
        window.app.showToast('Insufficient balance for this transaction', 'error');
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/wallet/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient,
          amount,
          note
        })
      });

      const data = await response.json();

      if (response.ok) {
        form.closest('.modal').remove();
        document.body.style.overflow = '';

        if (window.app) {
          window.app.showToast(`Successfully sent ${amount} coins to ${recipient}!`, 'success');
          // Update balance
          if (window.app.currentUser) {
            window.app.currentUser.lionsunCoins = data.newBalance;
            window.app.updateUI();
          }
        }

        this.loadWalletData();
      } else {
        throw new Error(data.error || 'Transaction failed');
      }
    } catch (error) {
      console.error('Send transaction error:', error);
      if (window.app) {
        window.app.showToast(error.message, 'error');
      }
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  openWithdrawModal() {
    if (!window.app || !window.app.currentUser) {
      if (window.app) {
        window.app.showToast('Please log in to withdraw coins', 'warning');
      }
      return;
    }

    const minWithdraw = 1000; // Minimum withdrawal amount

    const modalHtml = `
      <div class="modal active" id="withdrawModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Withdraw to External Wallet</h3>
            <button class="modal-close" onclick="this.closest('.modal').remove()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="withdrawForm" class="modal-form">
            <div class="form-group">
              <label for="withdrawAddress">Ethereum Wallet Address</label>
              <input type="text" id="withdrawAddress" required placeholder="0x..." pattern="^0x[a-fA-F0-9]{40}$">
              <small>Enter a valid Ethereum address</small>
            </div>
            <div class="form-group">
              <label for="withdrawAmount">Amount (Lionsuncoin)</label>
              <input type="number" id="withdrawAmount" min="${minWithdraw}" max="${this.balance}" required placeholder="${minWithdraw}">
              <small>Minimum withdrawal: ${this.formatNumber(minWithdraw)} coins</small>
            </div>
            <div class="exchange-info">
              <div class="exchange-row">
                <span>Exchange Rate:</span>
                <span>1 LC = ${this.exchangeRate} ETH</span>
              </div>
              <div class="exchange-row">
                <span>You'll receive:</span>
                <span id="ethReceive">0 ETH</span>
              </div>
              <div class="exchange-row">
                <span>Network Fee:</span>
                <span>~0.001 ETH</span>
              </div>
            </div>
            <div class="withdrawal-warning">
              <i class="fas fa-exclamation-triangle"></i>
              <p>Withdrawals are irreversible. Please double-check your wallet address.</p>
            </div>
            <button type="submit" class="btn btn-primary btn-full">
              <i class="fas fa-download"></i>
              Withdraw to Ethereum
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';

    // Setup form handler
    const withdrawForm = document.getElementById('withdrawForm');
    const amountInput = document.getElementById('withdrawAmount');

    amountInput.addEventListener('input', () => {
      const amount = parseFloat(amountInput.value) || 0;
      const ethAmount = (amount * this.exchangeRate).toFixed(6);
      document.getElementById('ethReceive').textContent = `${ethAmount} ETH`;
    });

    withdrawForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.processWithdrawal(withdrawForm);
    });
  }

  async processWithdrawal(form) {
    const address = form.withdrawAddress.value.trim();
    const amount = parseFloat(form.withdrawAmount.value);

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      if (window.app) {
        window.app.showToast('Invalid Ethereum address format', 'error');
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Withdrawal...';
    submitBtn.disabled = true;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          address,
          amount
        })
      });

      const data = await response.json();

      if (response.ok) {
        form.closest('.modal').remove();
        document.body.style.overflow = '';

        if (window.app) {
          window.app.showToast('Withdrawal request submitted successfully!', 'success');
          window.app.showToast('Processing may take 5-10 minutes', 'info');
        }

        this.loadWalletData();
      } else {
        throw new Error(data.error || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      if (window.app) {
        window.app.showToast(error.message, 'error');
      }
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  async connectExternalWallet() {
    if (typeof window.ethereum === 'undefined') {
      if (window.app) {
        window.app.showToast('MetaMask not detected. Please install MetaMask!', 'warning');
      }
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length > 0) {
        this.walletAddress = accounts[0];

        // Save wallet address to backend
        const token = localStorage.getItem('authToken');
        if (token) {
          await fetch('/api/wallet/connect', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              walletAddress: this.walletAddress
            })
          });
        }

        if (window.app) {
          window.app.showToast('Wallet connected successfully!', 'success');
        }

        this.updateWalletAddressDisplay();
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      if (window.app) {
        window.app.showToast('Failed to connect wallet', 'error');
      }
    }
  }

  updateWalletAddressDisplay() {
    const addressElements = document.querySelectorAll('.wallet-address');
    addressElements.forEach((element) => {
      if (this.walletAddress) {
        element.textContent = `${this.walletAddress.substring(0, 6)}...${this.walletAddress.substring(38)}`;
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    });
  }

  showTransactionHistory() {
    const modalHtml = `
      <div class="modal active" id="historyModal">
        <div class="modal-content" style="max-width: 800px;">
          <div class="modal-header">
            <h3>Transaction History</h3>
            <button class="modal-close" onclick="this.closest('.modal').remove()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="transaction-history">
            <div class="history-loading">
              <i class="fas fa-spinner fa-spin"></i>
              Loading transactions...
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';

    this.loadTransactionHistory();
  }

  async loadTransactionHistory() {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/wallet/transactions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const transactions = await response.json();
        this.renderTransactionHistory(transactions);
      } else {
        throw new Error('Failed to load transactions');
      }
    } catch (error) {
      console.error('Transaction history error:', error);
      const historyContainer = document.querySelector('.transaction-history');
      if (historyContainer) {
        historyContainer.innerHTML = `
          <div class="history-error">
            <i class="fas fa-exclamation-circle"></i>
            Failed to load transaction history
          </div>
        `;
      }
    }
  }

  renderTransactionHistory(transactions) {
    const historyContainer = document.querySelector('.transaction-history');
    if (!historyContainer) return;

    if (transactions.length === 0) {
      historyContainer.innerHTML = `
        <div class="history-empty">
          <i class="fas fa-inbox"></i>
          <p>No transactions yet</p>
        </div>
      `;
      return;
    }

    const transactionsHtml = transactions.map((tx) => {
      const isIncoming = tx.type === 'received' || tx.type === 'earned';
      const icon = this.getTransactionIcon(tx.type);
      const amountClass = isIncoming ? 'positive' : 'negative';
      const amountPrefix = isIncoming ? '+' : '-';

      return `
        <div class="transaction-item">
          <div class="transaction-icon ${tx.type}">
            <i class="${icon}"></i>
          </div>
          <div class="transaction-details">
            <div class="transaction-title">${this.getTransactionTitle(tx)}</div>
            <div class="transaction-desc">${tx.description || ''}</div>
            <div class="transaction-date">${new Date(tx.createdAt).toLocaleDateString()}</div>
          </div>
          <div class="transaction-amount ${amountClass}">
            ${amountPrefix}${this.formatNumber(tx.amount)} LC
          </div>
        </div>
      `;
    }).join('');

    historyContainer.innerHTML = `
      <div class="history-list">
        ${transactionsHtml}
      </div>
    `;
  }

  getTransactionIcon(type) {
    const icons = {
      sent: 'fas fa-arrow-up',
      received: 'fas fa-arrow-down',
      earned: 'fas fa-gamepad',
      withdrawal: 'fas fa-external-link-alt',
      purchase: 'fas fa-shopping-cart'
    };
    return icons[type] || 'fas fa-exchange-alt';
  }

  getTransactionTitle(transaction) {
    const titles = {
      sent: `Sent to ${transaction.recipient || 'Unknown'}`,
      received: `Received from ${transaction.sender || 'Unknown'}`,
      earned: `Game Reward - ${transaction.gameName || 'Unknown Game'}`,
      withdrawal: 'Withdrawal to Ethereum',
      purchase: 'In-game Purchase'
    };
    return titles[transaction.type] || 'Transaction';
  }

  startBalanceUpdater() {
    // Update balance every 30 seconds
    setInterval(() => {
      if (window.app && window.app.currentUser) {
        this.loadWalletData();
      }
    }, 30000);
  }

  // Price tracking
  async updateExchangeRate() {
    try {
      // In a real implementation, you would fetch from a price API
      // For demo purposes, we'll simulate price fluctuation
      const baseRate = 0.001;
      const fluctuation = (Math.random() - 0.5) * 0.0002; // ±0.0001 ETH
      this.exchangeRate = Math.max(0.0005, baseRate + fluctuation);

      this.updateExchangeRateDisplay();
    } catch (error) {
      console.error('Exchange rate update error:', error);
    }
  }

  // Staking functionality (future feature)
  async stakeCoins(amount, duration) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/wallet/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount, duration })
      });

      if (response.ok) {
        const data = await response.json();
        if (window.app) {
          window.app.showToast(`Successfully staked ${amount} coins for ${duration} days!`, 'success');
        }
        return data;
      }
      throw new Error('Staking failed');
    } catch (error) {
      console.error('Staking error:', error);
      if (window.app) {
        window.app.showToast('Failed to stake coins', 'error');
      }
    }
  }
}

// Initialize wallet manager
document.addEventListener('DOMContentLoaded', () => {
  window.walletManager = new WalletManager();

  // Update exchange rates every 5 minutes
  setInterval(() => {
    if (window.walletManager) {
      window.walletManager.updateExchangeRate();
    }
  }, 300000);
});
