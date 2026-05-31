---
marp: true
theme: default
paginate: true
backgroundColor: #f8fafc
color: #0f172a
style: |
  section {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    padding: 40px 60px;
    font-size: 19px;
  }
  h1 {
    color: #4f46e5;
    font-size: 2.2em;
    margin-bottom: 0.1em;
  }
  h2 {
    color: #0d9488;
    font-size: 1.5em;
    margin-top: 0.2em;
  }
  h3 {
    margin: 0 0 10px 0;
    font-size: 1.15em;
    color: #1e293b;
  }
  footer {
    font-size: 0.5em;
    color: #64748b;
  }
  .lead {
    text-align: center;
    background-color: #0f172a;
    color: #ffffff;
  }
  .lead h1 {
    color: #38bdf8;
    font-size: 3em;
  }
  .lead h2 {
    color: #94a3b8;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }
  .card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    color: #334155;
  }
  .card h3 {
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 6px;
  }
  .card-safe {
    background-color: #ecfdf5;
    border: 2px solid #10b981;
  }
  .card-safe h3 {
    color: #065f46;
  }
  .card-suspicious {
    background-color: #fffbeb;
    border: 2px solid #f59e0b;
  }
  .card-suspicious h3 {
    color: #92400e;
  }
  .card-danger {
    background-color: #fef2f2;
    border: 2px solid #ef4444;
  }
  .card-danger h3 {
    color: #991b1b;
  }
  table {
    font-size: 0.8em;
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }
  th {
    background-color: #4f46e5;
    color: #ffffff;
    padding: 10px;
    text-align: left;
  }
  td {
    padding: 10px;
    border-bottom: 1px solid #cbd5e1;
  }
  ul {
    margin-top: 5px;
    padding-left: 20px;
  }
  li {
    margin-bottom: 5px;
  }
---

<!-- _class: lead -->

# SmartURL
### Intelligent URL Shortening & Analytics Platform

**Technical & Academic Presentation**
React Dashboard | Spring Boot REST API | Security Scanning

---

## Introduction & Project Motivation

<div class="grid-2">
<div class="card" style="border-top: 4px solid #ef4444;">
<h3>THE CHALLENGES</h3>

- **Cluttered Links:** Long, unreadable URLs clutter emails, social media, and SMS messages.
- **Security Vulnerabilities:** Anonymous short links hide malware or phishing pages, exposing users.
- **Lack of Analytics:** Standard redirects offer zero visibility into clicks, devices, or geography.
</div>

<div class="card" style="border-top: 4px solid #10b981;">
<h3>THE SMARTURL SOLUTION</h3>

- **Branding & Control:** Converts long URLs to clean, memorable Base62 strings or custom branded aliases.
- **Pre-Redirection Scanning:** Performs real-time domain checking, keyword filtering, and blacklist lookups.
- **Rich Event Auditing:** Captures click metrics asynchronously and visualizes trends dynamically.
</div>
</div>

---

## Core Platform Features

<div class="grid-2">
<div class="card" style="border-top: 4px solid #4f46e5;">
<h3>1. Secure Authentication</h3>

- **JWT Lifecycles:** 15m access token & 7d HTTPOnly refresh token.
- **Passwords:** BCrypt hashing.
- **Role Checks:** Restricts admin routes.
</div>

<div class="card" style="border-top: 4px solid #0d9488;">
<h3>2. Intelligent Shortening</h3>

- **Base62 Keys:** Generates unique 7-char codes.
- **Custom Aliases:** Custom path names.
- **Bulk Import:** Shortens up to 50 links.
</div>
</div>

<div class="grid-2" style="margin-top: 20px;">
<div class="card" style="border-top: 4px solid #f59e0b;">
<h3>3. Proactive Security Scanning</h3>

- **Obfuscation Checks:** Flags homoglyphs.
- **Phishing Keywords:** Detects paths/keywords.
- **Blacklist Lookup:** DB-level domain match.
</div>

<div class="card" style="border-top: 4px solid #ec4899;">
<h3>4. QR Codes & Analytics</h3>

- **Auto-QR Generation:** Renders 300x300 PNGs.
- **Async Logging:** Thread pool performance.
- **Visual Dashboard:** Recharts tracking.
</div>
</div>

---

## System Architecture & Data Flow

```mermaid
graph TD
    Client[React Frontend] -->|REST API with JWT| Gateway[Spring Security Gateway]
    Gateway --> Auth[Auth Service]
    Gateway --> UrlService[URL Shortening & QR Service]
    Gateway --> Analytics[Analytics Tracker Async]
    Gateway --> Spam[Spam & Phishing Scanner]
    
    UrlService --> DB[(MySQL Database)]
    Auth --> DB
    Analytics --> DB
    Spam --> DB
```

<div class="grid-3" style="font-size: 0.8em; margin-top: 20px;">
<div class="card">
<strong>FRONTEND SPA</strong>
React 19, TS, ShadCN UI, Recharts, Axios
</div>
<div class="card" style="background-color: #e0f2fe;">
<strong>SECURITY GATEWAY</strong>
Bearer Auth, Role-Based Access Control
</div>
<div class="card">
<strong>CORE BACK-END</strong>
Spring Boot, JPA/Hibernate, Thread Pool, MySQL
</div>
</div>

---

## Intelligent Security Scanning

<div class="grid-2">
<div>
<h3>Pre-Creation Threat Evaluation</h3>

Every user-submitted URL undergoes a 5-step automated scan:
1. **Protocol:** Warnings for plain HTTP.
2. **Numerics Check:** Detects direct IP addresses.
3. **Keyword Scanner:** Identifies bait words.
4. **Homoglyphs:** Flags spoofed letters.
5. **Domain Blacklist:** Match against DB table.
</div>

<div>
<div class="card card-safe" style="margin-bottom: 10px;">
<h3>SAFE</h3>
URL passes all rules. Shortcode and Base64 QR code are created.
</div>

<div class="card card-suspicious" style="margin-bottom: 10px;">
<h3>SUSPICIOUS</h3>
Triggers warnings. Visitor is prompted to confirm before redirection.
</div>

<div class="card card-danger">
<h3>HIGH RISK</h3>
Matches blacklist or exploits. Link creation is blocked.
</div>
</div>
</div>

---

## QR Codes & Async Analytics Tracking

<div class="grid-2">
<div class="card" style="border-top: 4px solid #4f46e5;">
<h3>Automated QR Codes</h3>

- **Instant QR Engine:** Renders high-quality 300x300px QR graphic matrices immediately upon link generation.
- **Base64 Storage Model:** Stored natively in the DB as text (base64 string). Reduces downstream API requests.
- **User Download:** Embedded in link cards. Clients can trigger high-res PNG downloads directly in the browser dashboard.
</div>

<div class="card" style="border-top: 4px solid #0d9488;">
<h3>Asynchronous Analytics Engine</h3>

- **Multi-Attribute Logging:** Captures IP, Browser, Operating System (OS), Device types, Country, City, Referrers, and timestamps.
- **Asynchronous Threads:** Event captures run on a dedicated Spring TaskExecutor pool. Keeps redirects extremely fast (<50ms).
- **Dashboard Visuals:** React dashboard pulls aggregated metrics, feeding interactive Recharts.
</div>
</div>

---

## Database Schema Design

| Table Name | Primary Key | Core Columns / Properties | Foreign Keys & Relationships |
| :--- | :--- | :--- | :--- |
| **Users** | `id` (BIGINT) | name, email (Unique), password (BCrypt), role (USER/ADMIN), is_active, created_at | Parent of URLs table (One-to-Many) |
| **URLs** | `id` (BIGINT) | original_url, short_code (Unique), custom_alias, qr_code_data (LONGTEXT), risk_level, total_clicks, created_at | `user_id` (FK to Users.id), Parent of Click Analytics |
| **Click Analytics** | `id` (BIGINT) | ip_address, browser, device, os, country, city, referrer, user_agent, clicked_at | `url_id` (FK to URLs.id) |
| **Blacklisted Domains** | `id` (BIGINT) | domain (Unique), reason, created_at | Independent validation index |

---

## Technology Stack & Tooling

<div class="grid-2">
<div class="card" style="border-top: 4px solid #0d9488;">
<h3>Backend Enterprise Architecture</h3>

- **Spring Boot:** REST API controllers, business logic, and core services.
- **Spring Security:** JWT authentication filter chain and RBAC context.
- **Spring Data JPA:** Hibernate ORM mapping.
- **MySQL Database:** Relational storage with indexing for fast lookups.
- **Maven:** Dependency and build management.
</div>

<div class="card" style="border-top: 4px solid #4f46e5;">
<h3>Frontend Single Page Application</h3>

- **React 19 SPA:** Component-driven dashboard and client layout.
- **TypeScript:** Enforces type safety and strict type interfaces.
- **Vite:** High-performance, hot-module-replacement bundler.
- **Tailwind CSS:** Modern utility-first CSS styling.
- **Recharts & ShadCN:** Sleek, accessible UI elements and charts.
</div>
</div>

---

## Performance & Security Benchmarks

<div class="grid-2">
<div class="card" style="border-top: 4px solid #0d9488;">
<h3>Performance Highlights</h3>

- **Low Redirection Latency:** Redirection resolves within 50ms overhead, optimized by database index matching.
- **Non-Blocking Analytics:** Click logs are pushed asynchronously to a Spring thread pool, protecting DB write locks.
- **HikariCP Connection Pool:** Manages concurrent connections to handle scale spikes gracefully.
</div>

<div class="card" style="border-top: 4px solid #4f46e5;">
<h3>Security Safeguards</h3>

- **Token Expirations:** 15-minute JWT access tokens and secure 7-day refresh tokens.
- **Cryptographic Hashing:** Salted BCrypt password encoding.
- **Input Sanitization:** URL path decoding, normalization, and validation rules to defeat injection vectors.
</div>
</div>

---

<!-- _class: lead -->

# Conclusion
## SmartURL — Project Achievements Summary

- **Enterprise-Grade Architecture:** A complete, production-ready fullstack platform matching modern engineering practices.
- **Redirection with Security:** Successfully blends microsecond redirects with detailed threat scans to safeguard visitors.
- **Actionable Analytics:** Provides immediate data visibility through background thread tracking and React charts.
- **Scalable Tech Stack:** Built on high-stability, highly supported ecosystems: Spring Boot, React, and MySQL.
