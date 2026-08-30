/**
 * utilities.js — CYBERM Interactive Security Utilities
 * Loaded ONLY by utilities.html — not bundled into the global script.js
 * After any innerHTML injection that contains Lucide icon attributes,
 * call lucide.createIcons() to render them.
 */

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */

function setOutput(id, text, isError) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? '#f08080' : '';
}

function copyOutput(id) {
    const el = document.getElementById(id);
    if (!el || !el.textContent.trim()) return;
    navigator.clipboard.writeText(el.textContent).then(() => {
        const original = el.textContent;
        el.textContent = '✓ Copied to clipboard';
        setTimeout(() => { el.textContent = original; }, 1500);
    });
}

/* ─────────────────────────────────────────
   BASE64 ENCODER / DECODER
───────────────────────────────────────── */

function b64Encode() {
    const input = document.getElementById('b64-input').value;
    if (!input.trim()) { setOutput('b64-output', 'Please enter some text to encode.', true); return; }
    try {
        setOutput('b64-output', btoa(unescape(encodeURIComponent(input))));
    } catch (e) {
        setOutput('b64-output', 'Encoding failed: ' + e.message, true);
    }
}

function b64Decode() {
    const input = document.getElementById('b64-input').value.trim();
    if (!input) { setOutput('b64-output', 'Please enter a Base64 string to decode.', true); return; }
    try {
        setOutput('b64-output', decodeURIComponent(escape(atob(input))));
    } catch (e) {
        setOutput('b64-output', 'Invalid Base64 string. Make sure it is properly encoded.', true);
    }
}

/* ─────────────────────────────────────────
   HEX ENCODER / DECODER
───────────────────────────────────────── */

function hexEncode() {
    const input = document.getElementById('hex-input').value;
    if (!input.trim()) { setOutput('hex-output', 'Please enter some text to encode.', true); return; }
    const hex = Array.from(input)
        .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(' ');
    setOutput('hex-output', hex);
}

function hexDecode() {
    const input = document.getElementById('hex-input').value.trim().replace(/\s+/g, '');
    if (!input) { setOutput('hex-output', 'Please enter a hex string to decode.', true); return; }
    if (!/^[0-9a-fA-F]+$/.test(input)) {
        setOutput('hex-output', 'Invalid hex string. Use only 0–9 and A–F characters.', true); return;
    }
    try {
        let text = '';
        for (let i = 0; i < input.length; i += 2) {
            text += String.fromCharCode(parseInt(input.substr(i, 2), 16));
        }
        setOutput('hex-output', text);
    } catch (e) {
        setOutput('hex-output', 'Decoding failed: ' + e.message, true);
    }
}

/* ─────────────────────────────────────────
   URL ENCODER / DECODER
───────────────────────────────────────── */

function urlEncode() {
    const input = document.getElementById('url-input').value;
    if (!input.trim()) { setOutput('url-output', 'Please enter a URL or text to encode.', true); return; }
    setOutput('url-output', encodeURIComponent(input));
}

function urlDecode() {
    const input = document.getElementById('url-input').value.trim();
    if (!input) { setOutput('url-output', 'Please enter a URL-encoded string to decode.', true); return; }
    try {
        setOutput('url-output', decodeURIComponent(input));
    } catch (e) {
        setOutput('url-output', 'Invalid URL-encoded string: ' + e.message, true);
    }
}

/* ─────────────────────────────────────────
   HASH CALCULATOR (Web Crypto API)
───────────────────────────────────────── */

async function computeHash() {
    const input = document.getElementById('hash-input').value;
    const algo = document.getElementById('hash-algo').value;
    if (!input.trim()) { setOutput('hash-output', 'Please enter text to hash.', true); return; }
    setOutput('hash-output', 'Computing…');
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setOutput('hash-output', algo + ':\n' + hashHex);
    } catch (e) {
        setOutput('hash-output', 'Hashing failed: ' + e.message, true);
    }
}

/* ─────────────────────────────────────────
   TEXT CASE CONVERTER
───────────────────────────────────────── */

function convertCase(mode) {
    const input = document.getElementById('case-input').value;
    if (!input.trim()) { setOutput('case-output', 'Please enter text to convert.', true); return; }
    let result = '';
    switch (mode) {
        case 'upper':
            result = input.toUpperCase();
            break;
        case 'lower':
            result = input.toLowerCase();
            break;
        case 'title':
            result = input.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
            break;
        case 'camel':
            result = input.toLowerCase()
                .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
            break;
        case 'snake':
            result = input.toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9_]/g, '');
            break;
        default:
            result = input;
    }
    setOutput('case-output', result);
}

/* ─────────────────────────────────────────
   JWT DECODER
───────────────────────────────────────── */

function jwtDecode() {
    const token = document.getElementById('jwt-input').value.trim();
    if (!token) { setOutput('jwt-output', 'Please paste a JWT token.', true); return; }
    const parts = token.split('.');
    if (parts.length !== 3) {
        setOutput('jwt-output', 'Invalid JWT format. A JWT must have exactly 3 parts separated by dots.', true);
        return;
    }
    try {
        const decodeBase64Url = (str) => {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) str += '=';
            return JSON.parse(decodeURIComponent(escape(atob(str))));
        };
        const header = decodeBase64Url(parts[0]);
        const payload = decodeBase64Url(parts[1]);
        const output = [
            '── HEADER ──',
            JSON.stringify(header, null, 2),
            '',
            '── PAYLOAD ──',
            JSON.stringify(payload, null, 2),
            '',
            '── SIGNATURE ──',
            parts[2] + ' (not verified — paste your secret to verify)'
        ].join('\n');
        setOutput('jwt-output', output);
    } catch (e) {
        setOutput('jwt-output', 'Failed to decode JWT: ' + e.message, true);
    }
}

/* ─────────────────────────────────────────
   SUBNET CALCULATOR
───────────────────────────────────────── */

function calcSubnet() {
    const input = document.getElementById('subnet-input').value.trim();
    if (!input.includes('/')) { setOutput('subnet-output', 'Enter IP in CIDR format — e.g. 192.168.1.0/24', true); return; }
    const [ip, prefixStr] = input.split('/');
    const prefix = parseInt(prefixStr);
    if (isNaN(prefix) || prefix < 0 || prefix > 32) {
        setOutput('subnet-output', 'Invalid prefix length. Must be 0–32.', true); return;
    }
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
        setOutput('subnet-output', 'Invalid IP address.', true); return;
    }
    const ipInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const firstHost = prefix < 31 ? network + 1 : network;
    const lastHost = prefix < 31 ? broadcast - 1 : broadcast;
    const totalHosts = prefix < 31 ? Math.pow(2, 32 - prefix) - 2 : Math.pow(2, 32 - prefix);
    const intToIP = n => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
    const maskParts = [(mask >>> 24) & 255, (mask >>> 16) & 255, (mask >>> 8) & 255, mask & 255];
    const output = [
        `Network Address : ${intToIP(network)}`,
        `Broadcast       : ${intToIP(broadcast)}`,
        `Subnet Mask     : ${maskParts.join('.')}`,
        `First Host      : ${intToIP(firstHost)}`,
        `Last Host       : ${intToIP(lastHost)}`,
        `Usable Hosts    : ${totalHosts.toLocaleString()}`,
        `CIDR Notation   : ${intToIP(network)}/${prefix}`
    ].join('\n');
    setOutput('subnet-output', output);
}

/* ─────────────────────────────────────────
   PASSWORD GENERATOR
───────────────────────────────────────── */

function generatePassword() {
    const length = parseInt(document.getElementById('pass-length').value) || 20;
    const useUpper = document.getElementById('pass-upper').checked;
    const useLower = document.getElementById('pass-lower').checked;
    const useNums = document.getElementById('pass-nums').checked;
    const useSyms = document.getElementById('pass-syms').checked;

    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNums) chars += '0123456789';
    if (useSyms) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';

    if (!chars) { setOutput('pass-output', 'Select at least one character set.', true); return; }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const password = Array.from(array).map(n => chars[n % chars.length]).join('');
    setOutput('pass-output', password);
}

/* ─────────────────────────────────────────
   HTTP HEADER ANALYZER
───────────────────────────────────────── */

function analyzeHeaders() {
    const input = document.getElementById('header-input').value.trim();
    if (!input) { setOutput('header-output', 'Paste raw HTTP headers above.', true); return; }
    const lines = input.split('\n').filter(l => l.trim());
    const results = [];
    const securityHeaders = [
        'strict-transport-security',
        'content-security-policy',
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy',
        'permissions-policy',
        'x-xss-protection'
    ];
    const found = [];
    for (const line of lines) {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) { results.push(`  [!] Skipped: ${line}`); continue; }
        const key = line.slice(0, colonIdx).trim();
        const val = line.slice(colonIdx + 1).trim();
        const isSecHeader = securityHeaders.includes(key.toLowerCase());
        results.push(`  ${isSecHeader ? '🔒' : '  '} ${key}: ${val}`);
        if (isSecHeader) found.push(key.toLowerCase());
    }
    const missing = securityHeaders.filter(h => !found.includes(h));
    results.push('');
    results.push(`── ${found.length} of ${securityHeaders.length} security headers present ──`);
    if (missing.length) {
        results.push('Missing:');
        missing.forEach(h => results.push(`  ✗ ${h}`));
    }
    setOutput('header-output', results.join('\n'));
}

/* ─────────────────────────────────────────
   INIT — Re-render Lucide icons in case any
   utility card injected new icon markup.
   (Called once on load; utilities use plain
   onclick so no additional calls needed here.)
───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    // Icons are already rendered by script.js's lucide.createIcons() call,
    // but we call it again here defensively in case utilities.js loads first.
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
