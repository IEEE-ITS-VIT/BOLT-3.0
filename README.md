# BOLT 3.0 — Hackathon Website & Portal

Production website and portal for **BOLT 3.0** (Breakthrough On Locked Technology), the national flagship 24-hour hackathon by the IEEE ITS Student Chapter and SCORE at VIT Vellore, organized alongside ic-ETITE'28.

Live URL: [https://bolt-3-0.vercel.app](https://bolt-3-0.vercel.app)

---

## 1. System Architecture

BOLT 3.0 is part of the three-portal IEEE ITS VIT ecosystem:

| Application | Role | Repository | Default Port | Production Domain |
| :--- | :--- | :--- | :--- | :--- |
| **ic-ETITE'28** | Conference Website, Registrations, Invoices, Gateway | `IEEEITSVIT/ic-etite28` | `3000` | `https://ic-etite28.vercel.app` |
| **BOLT 3.0** (This repo) | Flagship Hackathon, Team Scoring, Rounds, Evaluations | `IEEEITSVIT/BOLT-3.0` | `3001` | `https://bolt-3-0.vercel.app` |
| **TechNext '28** | Technology Expo, Stall Bookings, Industry Showcase | `IEEEITSVIT/TECHNEXT-3.O` | `3002` | `https://technext-3-0.vercel.app` |

### Key Features
- **One Common Login:** Users register once and can access all three portals seamlessly.
- **Events & Rounds:** Multi-round submission tracking, customizable evaluation rubrics, automated qualification thresholds, and certificate generation.
- **Separate Admin Portal:** Managed at `/admin` with scoped permissions (`site_roles` table).
- **Independent Payments:** Integrates VIT payment gateway specifically for hackathon participant fees.
- **Caching & Event Queue:** Powered by Upstash Redis (`lib/cache/redis.ts`) and Upstash QStash/Kafka (`lib/queue/kafka.ts`).

---

## 2. Cloudflare D1 Database & Gateway

All persistent data is stored in the shared Cloudflare D1 database (`ieeeitsvit`), accessed via the HTTPS Gateway Worker (`workers/d1-gateway`).

- **Database Name:** `ieeeitsvit` (or `icetite`)
- **Database ID:** `6d59618c-0ce8-4a86-9773-9918c1733e1e`
- **Cloudflare Account ID:** `dfc2c80c18c70fffd6da339251650e04`

All 15 schema migrations reside in `db/migrations/`. To apply them:
```bash
for file in db/migrations/*.sql; do
  npx wrangler d1 execute ieeeitsvit --remote --file="$file"
done
```

---

## 3. Backups, Recovery & Replicas

The repo includes a dedicated disaster recovery script:
```bash
# Backup live D1 database
./scripts/d1-backup-restore.sh backup ieeeitsvit

# Restore from snapshot
./scripts/d1-backup-restore.sh restore ./backups/d1_ieeeitsvit_<timestamp>.sql ieeeitsvit

# Point-In-Time-Recovery (Time Travel)
./scripts/d1-backup-restore.sh timetravel 2026-11-28T00:00:00Z ieeeitsvit

# Create secondary parallel replica for load testing
./scripts/d1-backup-restore.sh replica-create bolt-test-replica ieeeitsvit
```

---

## 4. Deployment Guide

### Option A: Vercel (Serverless)
1. Import repository into Vercel.
2. In Project Settings -> Environment Variables, configure the variables listed in Section 5.
3. In Integrations, connect Upstash to auto-populate Redis and QStash credentials.
4. Deploy.

### Option B: Docker Container (Any VPS / Linux Server)
```bash
cp .env.example .env.local
docker compose up -d --build
```
Port `3001` is exposed for the containerized application.

### Option C: PM2 / Node.js Standalone
```bash
export STANDALONE=true
npm ci
npm run build
pm2 start .next/standalone/server.js --name "bolt-portal" -- -p 3001
```

---

## 5. Complete Environment Variables Catalog

| Variable | Required | Description | Example / Default |
| :--- | :--- | :--- | :--- |
| `D1_GATEWAY_URL` | Yes | HTTPS endpoint of the D1 Gateway Worker | `https://icetite-d1-gateway.workers.dev` |
| `D1_GATEWAY_SECRET` | Yes | Shared secret with D1 Worker | `64-char-random-secret` |
| `SESSION_SECRET` | Yes | 32+ character key for session encryption | `min-32-char-random-hex-key` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Base URL of BOLT 3.0 | `https://bolt-3-0.vercel.app` |
| `NEXT_PUBLIC_ICETITE_URL`| Yes | Base URL of ic-ETITE'28 | `https://ic-etite28.vercel.app` |
| `NEXT_PUBLIC_TECHNEXT_URL`| Yes | Base URL of TechNext '28 | `https://technext-3-0.vercel.app` |
| `ADMIN_EMAILS` | No | Site admins | `ieeeitsvitscore@gmail.com` |
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash Redis REST URL | `https://...upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN`| Optional | Upstash Redis REST Bearer Token | `AX...` |
| `UPSTASH_KAFKA_REST_URL` | Optional | Upstash QStash / Kafka URL | `https://qstash.upstash.io` |
| `UPSTASH_KAFKA_REST_USERNAME`| Optional| Kafka / QStash Username | `user_...` |
| `UPSTASH_KAFKA_REST_PASSWORD`| Optional| Kafka / QStash Password | `pass_...` |
| `CRON_SECRET` | Yes | Vercel Cron authentication secret | `cron-random-secret` |

---

## 6. Security & Failover Runbook

- **Default Administrator:** `ieeeitsvitscore@gmail.com` maintains immutable super-admin rights.
- **Refund Control:** Requires the hashed authorization password set by `ieeeitsvitscore@gmail.com`.
- **Audit Stream:** High-velocity actions are streamed to `portal-audit-events`.
- **Database Fallback:** The application includes automated retries and exponential backoff to handle network drops gracefully.
