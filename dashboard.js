/**
 * dashboard.js — CYBERM Dashboard Interactive Logic
 * Handles: universal search, AI chat mock, keyboard shortcuts, progress ring animation
 * Loaded ONLY by dashboard.html
 */

/* ─────────────────────────────────────────
   SEARCH INDEX
───────────────────────────────────────── */
const SEARCH_INDEX = [
    { type: 'ROADMAP', title: 'Ethical Hacking & Penetration Testing', desc: 'Beginner to Advanced · 6 Months', href: 'roadmaps.html', icon: 'compass' },
    { type: 'ROADMAP', title: 'SOC Analyst & Blue Team Defense', desc: 'Beginner to Intermediate · 4 Months', href: 'roadmaps.html', icon: 'compass' },
    { type: 'ROADMAP', title: 'Web Application Security Specialist', desc: 'Intermediate · 5 Months', href: 'roadmaps.html', icon: 'compass' },
    { type: 'TOOL', title: 'Nmap — Network Scanner', desc: 'Port scanning and service detection', href: 'tools.html', icon: 'scan-search' },
    { type: 'TOOL', title: 'Burp Suite — Web Proxy', desc: 'Web application security testing', href: 'tools.html', icon: 'crosshair' },
    { type: 'TOOL', title: 'Wireshark — Packet Analyser', desc: 'Network traffic capture and inspection', href: 'tools.html', icon: 'activity' },
    { type: 'TOOL', title: 'Metasploit — Exploitation Framework', desc: 'Penetration testing platform', href: 'tools.html', icon: 'terminal' },
    { type: 'TOOL', title: 'Hashcat — Password Recovery', desc: 'GPU-accelerated hash cracking', href: 'tools.html', icon: 'zap' },
    { type: 'TOOL', title: 'Shodan — OSINT Search', desc: 'Search engine for exposed devices', href: 'tools.html', icon: 'search' },
    { type: 'TOOL', title: 'Ghidra — Reverse Engineering', desc: 'NSA\'s binary analysis framework', href: 'tools.html', icon: 'code-2' },
    { type: 'TOOL', title: 'Volatility — Memory Forensics', desc: 'RAM dump analysis tool', href: 'tools.html', icon: 'cpu' },
    { type: 'GUIDE', title: 'Getting Started with Ethical Hacking', desc: 'Complete beginner walkthrough', href: 'guides.html', icon: 'book-open' },
    { type: 'GUIDE', title: 'OWASP Top 10 Explained', desc: 'All 10 vulnerability categories', href: 'guides.html', icon: 'book-open' },
    { type: 'GUIDE', title: 'Wireshark for Beginners', desc: 'Packet capture step by step', href: 'guides.html', icon: 'book-open' },
    { type: 'GUIDE', title: 'SQL Injection Deep Dive', desc: 'From basic to advanced SQLi', href: 'guides.html', icon: 'book-open' },
    { type: 'GUIDE', title: 'Nmap Mastery Guide', desc: 'Every scan type explained', href: 'guides.html', icon: 'book-open' },
    { type: 'GUIDE', title: 'Burp Suite Complete Guide', desc: 'Proxy, Repeater, Intruder, Scanner', href: 'guides.html', icon: 'book-open' },
    { type: 'GUIDE', title: 'Build Your Home Security Lab', desc: 'Local lab setup with Kali & Metasploitable', href: 'guides.html', icon: 'book-open' },
    { type: 'GUIDE', title: 'CTF Beginner\'s Handbook', desc: 'How to approach CTF competitions', href: 'guides.html', icon: 'book-open' },
    { type: 'UTILITY', title: 'Base64 Encoder / Decoder', desc: 'Encode and decode Base64 strings', href: 'utilities.html', icon: 'code' },
    { type: 'UTILITY', title: 'Hash Calculator (SHA-256)', desc: 'Compute SHA-1, SHA-256, SHA-512', href: 'utilities.html', icon: 'hash' },
    { type: 'UTILITY', title: 'JWT Decoder', desc: 'Parse and inspect JWT tokens', href: 'utilities.html', icon: 'key-round' },
    { type: 'UTILITY', title: 'Subnet Calculator', desc: 'CIDR network/broadcast/host range', href: 'utilities.html', icon: 'network' },
    { type: 'UTILITY', title: 'Password Generator', desc: 'Cryptographically secure passwords', href: 'utilities.html', icon: 'lock' },
    { type: 'UTILITY', title: 'Hex Encoder / Decoder', desc: 'Text to hex and back', href: 'utilities.html', icon: 'binary' },
    { type: 'UTILITY', title: 'URL Encoder / Decoder', desc: 'URL-encode and decode strings', href: 'utilities.html', icon: 'link' },
    { type: 'UTILITY', title: 'HTTP Header Analyzer', desc: 'Analyze raw HTTP headers', href: 'utilities.html', icon: 'list' },
    { type: 'RESOURCE', title: 'TryHackMe', desc: 'Browser-based hacking labs for all levels', href: 'resources.html', icon: 'layers' },
    { type: 'RESOURCE', title: 'Hack The Box', desc: 'CTF-style machines and challenges', href: 'resources.html', icon: 'layers' },
    { type: 'RESOURCE', title: 'PortSwigger Web Academy', desc: 'Free web security training by Burp creators', href: 'resources.html', icon: 'layers' },
    { type: 'RESOURCE', title: 'OSCP Certification', desc: 'Offensive Security gold standard', href: 'resources.html', icon: 'award' },
    { type: 'RESOURCE', title: 'CompTIA Security+', desc: 'Entry-level DoD-approved certification', href: 'resources.html', icon: 'award' },
    { type: 'PAGE', title: 'Security News', desc: 'Latest CVEs, threats, and advisories', href: 'news.html', icon: 'radio' },
    { type: 'PAGE', title: 'About CYBERM', desc: 'Our mission and platform story', href: 'about.html', icon: 'info' },
    { type: 'PAGE', title: 'Contact', desc: 'Get in touch with our team', href: 'contact.html', icon: 'mail' },
];

/* ─────────────────────────────────────────
   SEARCH FUNCTIONALITY
───────────────────────────────────────── */
let searchTimeout = null;

function handleSearch(query) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;

    clearTimeout(searchTimeout);
    if (!query.trim()) {
        resultsEl.style.display = 'none';
        resultsEl.innerHTML = '';
        return;
    }

    searchTimeout = setTimeout(() => {
        const q = query.toLowerCase();
        const matches = SEARCH_INDEX.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            item.type.toLowerCase().includes(q)
        ).slice(0, 8);

        if (!matches.length) {
            resultsEl.innerHTML = `
                <div class="search-result-item" style="color:var(--gray);cursor:default;">
                    <div class="search-result-icon"><i data-lucide="search-x"></i></div>
                    <div>
                        <div class="search-result-title">No results for "${query}"</div>
                        <div class="search-result-type">Try: tools, roadmap, jwt, nmap…</div>
                    </div>
                </div>`;
            resultsEl.style.display = 'block';
            lucide.createIcons();
            return;
        }

        resultsEl.innerHTML = matches.map(item => `
            <a href="${item.href}" class="search-result-item">
                <div class="search-result-icon"><i data-lucide="${item.icon}"></i></div>
                <div style="flex:1;min-width:0;">
                    <div class="search-result-title">${item.title}</div>
                    <div class="search-result-type">${item.type} · ${item.desc}</div>
                </div>
                <i data-lucide="arrow-up-right" style="width:13px;height:13px;color:var(--gray);flex-shrink:0;"></i>
            </a>
        `).join('');
        resultsEl.style.display = 'block';
        lucide.createIcons();
    }, 120);
}

function handleSearchKey(e) {
    if (e.key === 'Escape') {
        const resultsEl = document.getElementById('search-results');
        if (resultsEl) { resultsEl.style.display = 'none'; }
        document.getElementById('dash-search-input').blur();
    }
    if (e.key === 'Enter') {
        const resultsEl = document.getElementById('search-results');
        const firstLink = resultsEl && resultsEl.querySelector('a.search-result-item');
        if (firstLink) firstLink.click();
    }
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    const wrap = document.getElementById('search-wrap');
    const results = document.getElementById('search-results');
    if (wrap && results && !wrap.contains(e.target)) {
        results.style.display = 'none';
    }
});

/* ─────────────────────────────────────────
   AI CHAT
───────────────────────────────────────── */
const AI_RESPONSES = [
    {
        keys: ['sql', 'injection', 'sqli'],
        answer: `SQL injection is a critical web vulnerability that lets attackers manipulate database queries. <br><br>
<strong>Example payload:</strong> <code>' OR '1'='1</code><br><br>
<strong>Impact:</strong> Data theft, authentication bypass, full database access.<br>
<strong>Fix:</strong> Always use parameterised queries / prepared statements. Never concatenate user input into SQL strings.`
    },
    {
        keys: ['siem', 'splunk', 'elk', 'security information'],
        answer: `A SIEM (Security Information and Event Management) aggregates and analyses security data from across your infrastructure.<br><br>
<strong>Core functions:</strong><br>
→ Log collection from firewalls, endpoints, servers<br>
→ Event correlation and alerting<br>
→ Compliance reporting<br><br>
<strong>Popular SIEMs:</strong> Splunk, IBM QRadar, Microsoft Sentinel, and open-source ELK Stack.`
    },
    {
        keys: ['metasploit', 'msfconsole', 'exploit'],
        answer: `Metasploit is the world's most used penetration testing framework with thousands of exploits and payloads.<br><br>
<strong>Basic workflow:</strong><br>
<code>msfconsole</code> → launch<br>
<code>use exploit/...</code> → select module<br>
<code>set RHOSTS &lt;target&gt;</code> → configure<br>
<code>run</code> → execute<br><br>
<strong>Important:</strong> Only use against systems you have explicit permission to test.`
    },
    {
        keys: ['xss', 'cross site scripting', 'cross-site'],
        answer: `Cross-Site Scripting (XSS) allows attackers to inject malicious scripts into web pages viewed by other users.<br><br>
<strong>Types:</strong><br>
→ Stored XSS — persisted in the database<br>
→ Reflected XSS — in URL parameters<br>
→ DOM-based XSS — via JavaScript manipulation<br><br>
<strong>Fix:</strong> Encode output, use Content-Security-Policy headers, avoid <code>innerHTML</code>.`
    },
    {
        keys: ['cert', 'certification', 'oscp', 'security+', 'ejpt', 'pnpt'],
        answer: `Great question! Here's the recommended certification path:<br><br>
→ <strong>eJPT</strong> — Start here. Affordable, practical, beginner-friendly<br>
→ <strong>CompTIA Security+</strong> — Broad knowledge, DoD-approved<br>
→ <strong>PNPT</strong> — Realistic pentest exam, great value<br>
→ <strong>OSCP</strong> — The gold standard for penetration testing<br><br>
Which role are you targeting — red team, blue team, or web security?`
    },
    {
        keys: ['nmap', 'port scan', 'scanning'],
        answer: `Nmap is the go-to network scanner. Key commands:<br><br>
<code>nmap -sV &lt;target&gt;</code> — Service version detection<br>
<code>nmap -sC &lt;target&gt;</code> — Default scripts<br>
<code>nmap -A &lt;target&gt;</code> — Aggressive (OS, version, scripts)<br>
<code>nmap -p- &lt;target&gt;</code> — All 65535 ports<br>
<code>nmap -T4</code> — Faster timing template<br><br>
Combine for a thorough scan: <code>nmap -sC -sV -p- -T4 &lt;target&gt;</code>`
    },
    {
        keys: ['hash', 'sha256', 'md5', 'hashing'],
        answer: `Cryptographic hashes are one-way functions that map data to a fixed-length digest.<br><br>
<strong>Common algorithms:</strong><br>
→ MD5 — 128-bit, broken, don't use for security<br>
→ SHA-1 — 160-bit, deprecated<br>
→ SHA-256 — 256-bit, widely used and secure<br>
→ bcrypt — Designed for passwords (includes salt + work factor)<br><br>
<strong>Try it now:</strong> Use the <a href="utilities.html" style="color:var(--orange);">Hash Calculator</a> utility on CYBERM.`
    },
];

function getAIResponse(msg) {
    const lower = msg.toLowerCase();
    for (const entry of AI_RESPONSES) {
        if (entry.keys.some(k => lower.includes(k))) {
            return entry.answer;
        }
    }
    return `Good question about <em>"${msg}"</em>. Cybersecurity is a deep field — this topic involves understanding both the attacker and defender perspective.<br><br>I'd suggest starting with the relevant CYBERM guide or roadmap stage for a structured answer. Want me to point you somewhere specific?`;
}

function addAIMessage(text, sender) {
    const window_ = document.getElementById('ai-chat-window');
    if (!window_) return;

    const div = document.createElement('div');
    div.className = `ai-msg ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'ai-msg-avatar';
    avatar.textContent = sender === 'bot' ? 'AI' : 'N';
    if (sender === 'user') {
        avatar.style.background = 'var(--gray)';
        avatar.style.marginLeft = 'auto';
    }

    const bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble';
    bubble.innerHTML = text;

    if (sender === 'user') {
        div.style.flexDirection = 'row-reverse';
    }

    div.appendChild(avatar);
    div.appendChild(bubble);
    window_.appendChild(div);
    window_.scrollTop = window_.scrollHeight;
}

function sendAI() {
    const input = document.getElementById('ai-input');
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;

    addAIMessage(msg, 'user');
    input.value = '';

    // Simulate typing delay
    setTimeout(() => {
        addAIMessage(getAIResponse(msg), 'bot');
        lucide.createIcons();
    }, 600);
}

function sendPrompt(text) {
    const input = document.getElementById('ai-input');
    if (input) {
        input.value = text;
        sendAI();
        // Scroll to AI section
        const aiSection = document.getElementById('ai-section');
        if (aiSection) aiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToAI() {
    const aiSection = document.getElementById('ai-section');
    if (aiSection) aiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Enter key for AI input
document.addEventListener('DOMContentLoaded', () => {
    const aiInput = document.getElementById('ai-input');
    if (aiInput) {
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendAI();
        });
    }

    // Animate progress ring on load
    const ringFill = document.getElementById('progress-ring-fill');
    if (ringFill) {
        const circumference = 364.42;
        const progress = 0.68;
        const offset = circumference * (1 - progress);
        setTimeout(() => {
            ringFill.style.strokeDashoffset = offset;
        }, 400);
    }

    // Animate stat bars
    document.querySelectorAll('.stat-fill[data-width]').forEach(bar => {
        const w = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = w; }, 500);
    });
});
