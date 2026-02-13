# SkateApp

A comprehensive web application designed to manage weekly hockey drop-in sessions. It automates administrative tasks using AI, tracks player availability, and ensures balanced gameplay.

## Features

### 🏒 Dashboard
- **Real-time Overview**: Visual breakdown of the current week's roster status.
- **Metrics**: Track confirmed skaters, goalie counts, RSVP distribution (In, Out, Pending), fees collected, and Regulars vs Subs breakdown.
- **Charts**: Interactive donut charts powered by Recharts.

### 📋 Roster Management
- **Player Database**: Maintain contact information, preferred positions, skill ratings, player roles (Regular/Sub), and fee payment status.
- **Roster Defaults**:
  - **Max Players**: 20 skaters per session
  - **Max Goalies**: 2 goalies per session
  - **Location**: Skating Edge Arena
- **Admin Controls**:
  - **Inline Editing**: Quickly update skill levels (1-10), positions (Forward, Defense, Goalie), roles (Regular, Sub), and fee status directly from the list.
  - **Privacy**: Player emails are obfuscated for non-admins.
  - **Notes**: Private admin notes for specific players.
  - **CRUD Operations**: Add or remove players easily.
  - **Registration Link**: Copy a shareable public registration link for new players.

### 🤖 AI-Powered Automation (Qwen via DashScope)
- **Smart Invites**: Generate high-energy, unique weekly email drafts using Qwen AI (`qwen-flash` model by default) through the DashScope API.
- **Team Balancing**: Uses AI to generate fair teams ("White" vs "Dark") by analyzing the skill levels and positions of confirmed players.

### 📅 Session Management
- **Event Configuration**: Set date, time, location, max player capacity, and max goalie spots.
- **RSVP Tracking**: Detailed lists of who is in, out, or pending.
- **Bulk Actions**:
  - Reset all statuses for a new week.
  - Auto-decline players who haven't replied.

### 🔐 Security & Access
- **Public Registration**: A dedicated `/register` page (via HashRouter) for new players to self-signup.
- **Admin Mode**: Password-protected area for sensitive operations.
  - **Default Password**: `puck`

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or later.
- A modern web browser.
- A DashScope API key (for AI features) — see [Environment Variables](#environment-variables).
- A [Resend](https://resend.com/) API key (for email sending).

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd SkateApp
    ```

2.  **Environment Variables**:
    Create a `.env` file in the project root with the required variables (see [Environment Variables](#environment-variables) for the full list):
    ```env
    DASHSCOPE_API_KEY=your_dashscope_api_key_here
    RESEND_API_KEY=re_your_resend_api_key_here
    FROM_EMAIL=noreply@yourdomain.com
    ADMIN_SECRET=your_secret_passphrase
    ```

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

5.  **Build for Production**:
    ```bash
    npm run build
    ```
    Output is written to the `dist/` directory.

## Usage Guide

### 1. Admin Login
- Click the **Admin Access** (Lock icon) in the sidebar.
- Enter the password: **`puck`**.
- Once logged in, you will see extra navigation items: **Invites** and **Team Balancer**.

### 2. Managing the Roster
- Navigate to **Roster**.
- To add a player manually: Click **Add Player**.
- To edit skill/position/role/fees: Toggle Admin mode and use the inline controls in the table.

### 3. Weekly Workflow
1.  **Reset**: Go to **Invites** and click "Reset to Pending" to start a new week.
2.  **Configure**: Set the session date, time, location, max players (default: 20), and max goalies (default: 2).
3.  **Invite**: Generate an AI-powered email draft and send it out.
4.  **Track**: Update statuses as players reply. Use the dashboard to monitor numbers.
5.  **Game Day**:
    - Go to **Team Balancer**.
    - Ensure all confirmed players have a skill rating.
    - Click **Generate Balanced Teams**.

## Technology Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (via CDN)
- **AI Integration**: Qwen via DashScope API (OpenAI-compatible endpoint)
- **Email Service**: [Resend](https://resend.com/) (via Netlify Functions)
- **Serverless**: Netlify Functions (esbuild bundler)
- **Charts**: Recharts
- **Routing**: React Router DOM (HashRouter)
- **Icons**: Lucide React

## Email Notification System

The app sends real emails using [Resend](https://resend.com/) through Netlify serverless functions:

### Email Types

1. **Registration Confirmation** (`send-registration-email`)
   - Triggered automatically when a new player signs up via the `/register` page
   - Sends a welcome email with their position and role details

2. **Weekly Skate Announcement** (`send-weekly-announcement`)
   - Triggered by the admin from the **Invites** page → **Send Bulk Invites** button
   - Sends personalized emails to all rostered players with session details (date, time, location, max players, max goalies)
   - Protected by `ADMIN_SECRET` — admin is prompted before sending
   - Supports batch sending (up to 100 emails per batch)

### Email Template Details

Announcement emails include a session details card with:
- 📅 Date
- 🕐 Time
- 📍 Location
- 👥 Max Spots (skater cap)
- 🥅 Goalie Spots (goalie cap)

### Netlify Functions

| Function | Path | Method | Auth |
|---|---|---|---|
| `send-registration-email` | `/.netlify/functions/send-registration-email` | POST | None (public) |
| `send-weekly-announcement` | `/.netlify/functions/send-weekly-announcement` | POST | `ADMIN_SECRET` |
| `ai-generate-email` | `/.netlify/functions/ai-generate-email` | POST | None |
| `ai-balance-teams` | `/.netlify/functions/ai-balance-teams` | POST | None |

Functions are located in `netlify/functions/` and share email templates from `netlify/functions/_shared/email-templates.ts`.

## Deployment

The project includes a `netlify.toml` for one-click deployment to [Netlify](https://www.netlify.com/):
- **Build command**: `npm install && npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`
- **Node version**: 20

SPA fallback redirects and security headers are pre-configured.

### Environment Variables

Set the following in **Netlify Dashboard → Site configuration → Environment variables**:

| Variable | Required | Description |
|---|---|---|
| `DASHSCOPE_API_KEY` | Yes | DashScope API key for Qwen AI features (email generation, team balancing) |
| `RESEND_API_KEY` | Yes | [Resend](https://resend.com/api-keys) API key for email sending |
| `FROM_EMAIL` | Yes | Verified sender address (e.g., `skate@yourdomain.com`) |
| `ADMIN_SECRET` | Yes | Secret passphrase for authorizing bulk email sends |

#### Optional Variables

| Variable | Default | Description |
|---|---|---|
| `DASHSCOPE_BASE_URL` | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` | Override the DashScope API base URL |
| `QWEN_MODEL` | `qwen-flash` | Override the Qwen model used for AI generation |

#### DashScope / Qwen AI Setup

1. Sign up at [DashScope](https://dashscope.aliyun.com/)
2. Generate an API key from the console
3. Add the key as `DASHSCOPE_API_KEY` in Netlify environment variables

#### Resend Setup

1. Create a free account at [resend.com](https://resend.com/)
2. Verify your sending domain (add DNS records as instructed)
3. Generate an API key from the [API Keys page](https://resend.com/api-keys)
4. Add the key as `RESEND_API_KEY` in Netlify environment variables
5. Set `FROM_EMAIL` to an email on your verified domain

> **Note:** Until a domain is verified, Resend allows sending from `onboarding@resend.dev` for testing.

## Session Defaults

The app ships with the following session defaults (configurable per session in the Invites panel):

| Setting | Default Value |
|---|---|
| Location | Skating Edge Arena |
| Max Players | 20 |
| Max Goalies | 2 |
| Time | 8:00 PM |

## Data Persistence

The application uses `localStorage` (`skateapp_players_v3`) to save player data in the user's browser. Clearing browser data will reset the roster to the initial hardcoded list. The app automatically migrates data from the legacy `sk8_players_v2` storage key if present.
