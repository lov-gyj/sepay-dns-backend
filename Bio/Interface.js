// ==================== INTERFACE MANAGER ====================

const interfaces = [
    {
        name: "Default Purple",
        icon: "fa-solid fa-palette",
        light: {
            '--bg-color': '#f3f4f8',
            '--card-bg': '#ffffff',
            '--primary': '#8b7cf6',
            '--gradient-start': '#6d7cff',
            '--gradient-end': '#ff72c6',
            '--text-main': '#1c1d2e',
            '--text-sub': '#757b95',
            '--shadow-light': 'rgba(255, 255, 255, 0.8)',
            '--shadow-dark': 'rgba(28, 29, 46, 0.08)'
        },
        dark: {
            '--bg-color': '#12121a',
            '--card-bg': '#1c1c28',
            '--text-main': '#ffffff',
            '--text-sub': '#b2b8c9',
            '--shadow-light': 'rgba(255, 255, 255, 0.02)',
            '--shadow-dark': 'rgba(0, 0, 0, 0.3)'
        }
    },
    {
        name: "Ocean Blue",
        icon: "fa-solid fa-water",
        light: {
            '--bg-color': '#f0f5fa',
            '--card-bg': '#ffffff',
            '--primary': '#0284c7',
            '--gradient-start': '#38bdf8',
            '--gradient-end': '#818cf8',
            '--text-main': '#0f172a',
            '--text-sub': '#64748b',
            '--shadow-light': 'rgba(255, 255, 255, 0.9)',
            '--shadow-dark': 'rgba(15, 23, 42, 0.08)'
        },
        dark: {
            '--bg-color': '#0f172a',
            '--card-bg': '#1e293b',
            '--text-main': '#f8fafc',
            '--text-sub': '#94a3b8',
            '--shadow-light': 'rgba(255, 255, 255, 0.02)',
            '--shadow-dark': 'rgba(0, 0, 0, 0.4)'
        }
    },
    {
        name: "Sky Pink",
        icon: "fa-solid fa-cloud-sun",
        light: {
            '--bg-color': '#f4f8fc',
            '--card-bg': '#ffffff',
            '--primary': '#0ea5e9',
            '--gradient-start': '#f472b6',
            '--gradient-end': '#38bdf8',
            '--text-main': '#1e293b',
            '--text-sub': '#64748b',
            '--shadow-light': 'rgba(255, 255, 255, 0.9)',
            '--shadow-dark': 'rgba(14, 165, 233, 0.06)'
        },
        dark: {
            '--bg-color': '#0b0f19',
            '--card-bg': '#161f30',
            '--primary': '#38bdf8',
            '--text-main': '#f8fafc',
            '--text-sub': '#94a3b8',
            '--shadow-light': 'rgba(255, 255, 255, 0.01)',
            '--shadow-dark': 'rgba(0, 0, 0, 0.4)'
        }
    },
    {
        name: "Rose Gold",
        icon: "fa-solid fa-heart",
        light: {
            '--bg-color': '#fdfafb',
            '--card-bg': '#ffffff',
            '--primary': '#f43f5e',
            '--gradient-start': '#fb7185',
            '--gradient-end': '#fdba74',
            '--text-main': '#31181c',
            '--text-sub': '#886d71',
            '--shadow-light': 'rgba(255, 255, 255, 0.95)',
            '--shadow-dark': 'rgba(244, 63, 94, 0.1)'
        },
        dark: {
            '--bg-color': '#1a0b0d',
            '--card-bg': '#2d161a',
            '--primary': '#fb7185',
            '--text-main': '#ffe4e6',
            '--text-sub': '#cca5a9',
            '--shadow-light': 'rgba(255, 255, 255, 0.01)',
            '--shadow-dark': 'rgba(0, 0, 0, 0.4)'
        }
    },
    {
        name: "Midnight Emerald",
        icon: "fa-solid fa-gem",
        light: {
            '--bg-color': '#f2faf5',
            '--card-bg': '#ffffff',
            '--primary': '#059669',
            '--gradient-start': '#10b981',
            '--gradient-end': '#3b82f6',
            '--text-main': '#0f1e1a',
            '--text-sub': '#4b6b5e',
            '--shadow-light': 'rgba(255, 255, 255, 0.9)',
            '--shadow-dark': 'rgba(5, 150, 105, 0.08)'
        },
        dark: {
            '--bg-color': '#0a1914',
            '--card-bg': '#112d24',
            '--primary': '#10b981',
            '--text-main': '#ecfdf5',
            '--text-sub': '#a7c4b7',
            '--shadow-light': 'rgba(255, 255, 255, 0.02)',
            '--shadow-dark': 'rgba(0, 0, 0, 0.4)'
        }
    },
    {
        name: "Sunset Orange",
        icon: "fa-solid fa-sun",
        light: {
            '--bg-color': '#fff7ed',
            '--card-bg': '#ffffff',
            '--primary': '#ea580c',
            '--gradient-start': '#f97316',
            '--gradient-end': '#ef4444',
            '--text-main': '#2d1606',
            '--text-sub': '#7c4d32',
            '--shadow-light': 'rgba(255, 255, 255, 0.95)',
            '--shadow-dark': 'rgba(234, 88, 12, 0.1)'
        },
        dark: {
            '--bg-color': '#1c0f07',
            '--card-bg': '#2d1a0f',
            '--primary': '#f97316',
            '--text-main': '#fff7ed',
            '--text-sub': '#c9a087',
            '--shadow-light': 'rgba(255, 255, 255, 0.01)',
            '--shadow-dark': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {
        name: "Lavender Dream",
        icon: "fa-solid fa-feather",
        light: {
            '--bg-color': '#f8f5ff',
            '--card-bg': '#ffffff',
            '--primary': '#8b5cf6',
            '--gradient-start': '#a78bfa',
            '--gradient-end': '#f472b6',
            '--text-main': '#2e1a47',
            '--text-sub': '#6b5680',
            '--shadow-light': 'rgba(255, 255, 255, 0.9)',
            '--shadow-dark': 'rgba(139, 92, 246, 0.08)'
        },
        dark: {
            '--bg-color': '#1a1128',
            '--card-bg': '#2d1f3d',
            '--primary': '#a78bfa',
            '--text-main': '#f3e8ff',
            '--text-sub': '#c4b0d6',
            '--shadow-light': 'rgba(255, 255, 255, 0.02)',
            '--shadow-dark': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {
        name: "Mint Chocolate",
        icon: "fa-solid fa-leaf",
        light: {
            '--bg-color': '#f0fdf4',
            '--card-bg': '#ffffff',
            '--primary': '#14b8a6',
            '--gradient-start': '#2dd4bf',
            '--gradient-end': '#d4a373',
            '--text-main': '#1a2e24',
            '--text-sub': '#5a7a66',
            '--shadow-light': 'rgba(255, 255, 255, 0.9)',
            '--shadow-dark': 'rgba(20, 184, 166, 0.08)'
        },
        dark: {
            '--bg-color': '#0f1f18',
            '--card-bg': '#1d332a',
            '--primary': '#2dd4bf',
            '--text-main': '#ecfdf5',
            '--text-sub': '#a7c4b7',
            '--shadow-light': 'rgba(255, 255, 255, 0.01)',
            '--shadow-dark': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {
        name: "Aurora Borealis",
        icon: "fa-solid fa-wand-magic-sparkles",
        light: {
            '--bg-color': '#f0f9ff',
            '--card-bg': '#ffffff',
            '--primary': '#06b6d4',
            '--gradient-start': '#22d3ee',
            '--gradient-end': '#a855f7',
            '--text-main': '#0c2333',
            '--text-sub': '#3d6b80',
            '--shadow-light': 'rgba(255, 255, 255, 0.9)',
            '--shadow-dark': 'rgba(6, 182, 212, 0.08)'
        },
        dark: {
            '--bg-color': '#05161f',
            '--card-bg': '#0d2a3a',
            '--primary': '#22d3ee',
            '--text-main': '#ecfeff',
            '--text-sub': '#a0cdd9',
            '--shadow-light': 'rgba(255, 255, 255, 0.02)',
            '--shadow-dark': 'rgba(0, 0, 0, 0.5)'
        }
    }
];

// ==================== LOGIC CHUYỂN GIAO DIỆN ====================

let currentInterfaceIndex = 0;
let isDarkMode = false;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    isDarkMode = true;
    document.body.classList.add('dark-mode');
}

const savedInterface = localStorage.getItem('interface');
if (savedInterface !== null) {
    currentInterfaceIndex = parseInt(savedInterface);
}

function applyInterface(index, dark = false) {
    const iface = interfaces[index];
    const root = document.documentElement;
    const colors = dark ? iface.dark : iface.light;
    
    for (const [key, value] of Object.entries(colors)) {
        root.style.setProperty(key, value);
    }
    
    const interfaceText = document.getElementById('interfaceText');
    const interfaceToggle = document.getElementById('interfaceToggle');
    
    if (interfaceText) {
        interfaceText.textContent = iface.name;
    }
    if (interfaceToggle) {
        const icon = interfaceToggle.querySelector('i');
        if (icon) {
            icon.className = iface.icon;
        }
    }
    
    localStorage.setItem('interface', index);
}

function toggleInterface() {
    currentInterfaceIndex = (currentInterfaceIndex + 1) % interfaces.length;
    applyInterface(currentInterfaceIndex, isDarkMode);
    
    const iface = interfaces[currentInterfaceIndex];
    if (typeof showToast === 'function') {
        showToast(`🎨 Giao diện: ${iface.name}`, iface.icon);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyInterface(currentInterfaceIndex, isDarkMode);
    
    const interfaceToggle = document.getElementById('interfaceToggle');
    if (interfaceToggle) {
        interfaceToggle.addEventListener('click', toggleInterface);
    }
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(() => {
                isDarkMode = document.body.classList.contains('dark-mode');
                applyInterface(currentInterfaceIndex, isDarkMode);
            }, 50);
        });
    }
});

window.YOUNJ_Interface = {
    toggle: toggleInterface,
    apply: applyInterface,
    getCurrent: () => currentInterfaceIndex,
    getList: () => interfaces
};