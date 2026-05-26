# Apex Media v2.0

## Quick start

```bash
npm run dev
```

Open http://localhost:5173/ or http://127.0.0.1:5173/

## Demo accounts

| Role | Username | Password | Email |
|------|----------|----------|-------|
| Admin | `admin` | `admin123` | `admin0@gmail.com` |

New sign-ups receive **5 USDT** and a unique referral code.

## Navigation

Dashboard · VIP Products · Referral · Wallet · Me (+ **Admin** if email is `admin0@gmail.com`)

## Features

- **Global state:** `balance`, `vipLevel`, `totalDeposited`, `totalWithdrawn`, `referralCount` — synced on every page via React context
- **Hourly earnings:** `balance += hourlyRate` each hour for active VIP (checked every minute)
- **Buy VIP:** Deducts price from balance; alerts *"Insufficient balance."* if needed
- **Referrals:** Registration with code increments inviter's `referralCount`
- **Wallet:** TRC-20 + BEP-20 addresses, TXID deposit form, Total In/Out
- **Me:** Profile, withdrawal address, full transaction history, Log Out

## VIP products

| Tier | Price | Hourly | Daily | 60-Day |
|------|-------|--------|-------|--------|
| VIP1 | $25 | $0.06 | $1.50 | $90 |
| VIP2 | $65 | $0.16 | $3.90 | $234 |
| VIP3 | $205 | $0.51 | $12.30 | $738 |
| VIP4 | $550 | $1.37 | $33.00 | $1,980 |
| VIP5 | $885 | $2.21 | $53.10 | $3,186 |
