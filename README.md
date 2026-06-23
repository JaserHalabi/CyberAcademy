# CyberCompanion (Cyber Academy)

**Note: This project is currently a Work In Progress (WIP).**

CyberCompanion is an interactive, offline educational desktop application built with Electron. It is designed to guide users through Web Application Penetration Testing by providing integrated tools, tutorials, and localized vulnerable environments.

Created by **Jaser Halabi**
[LinkedIn Profile](https://www.linkedin.com/in/jaser-halabi/)

---

## 🎯 Features

- **Integrated Vulnerable Environments**: Automatically downloads and spins up Docker containers for intentionally vulnerable web applications, including:
  - OWASP Juice Shop
  - DVWA (Damn Vulnerable Web App)
- **Interactive Lab Mode**: A built-in webview that lets you browse the vulnerable applications directly within the app without needing an external browser.
- **Mini Burp Proxy Interceptor**: A session-level HTTP proxy built directly into the application.
  - Automatically intercepts API, REST, and login requests.
  - Pauses intercepted requests in a queue so you can inspect their headers and body.
  - Modify payloads on the fly and forward them to the target, or drop them entirely.
- **Hydra Brute-Force Simulator**: An integrated terminal simulator designed to mimic the popular `hydra` brute-forcing tool, allowing users to safely practice simulated attacks against `ssh`, `ftp`, and `http-post-form` services.
- **Interactive Step-by-Step Tutorials**: An overlay tutorial engine that guides users step-by-step through specific vulnerabilities (like XSS or Brute Forcing) by pointing directly to elements within the embedded webview.

## 🛠️ Technology Stack

- **Framework**: [Electron](https://www.electronjs.org/)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend / Integration**: Node.js, Docker CLI
- **Packaging**: electron-builder

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be installed and running)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JaserHalabi/CyberAcademy.git
   cd CyberAcademy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

### Building for Production
To build a standalone installer for Windows:
```bash
npm run dist
```
The compiled installer will be available in the `dist/` directory.

## 📝 License
This project is licensed under the MIT License.
