# Sk8 Manager

A comprehensive web application designed to manage weekly hockey drop-in sessions. It automates administrative tasks using AI, tracks player availability, and ensures balanced gameplay.

## Features

### 🏒 Dashboard
- **Real-time Overview**: Visual breakdown of the current week's roster status.
- **Metrics**: Track fill rates, goalie counts, and RSVP distribution (In, Out, Pending).
- **Charts**: Interactive pie charts powered by Recharts.

### 📋 Roster Management
- **Player Database**: Maintain contact information, preferred positions, and skill ratings.
- **Admin Controls**:
  - **Inline Editing**: Quickly update skill levels (1-10) and positions (Forward, Defense, Goalie) directly from the list.
  - **Privacy**: Player emails are obfuscated for non-admins.
  - **Notes**: Private admin notes for specific players.
  - **CRUD Operations**: Add or remove players easily.

### 🤖 AI-Powered Automation (Gemini)
- **Smart Invites**: Generate high-energy, unique weekly email drafts using Google Gemini.
- **Team Balancing**: Uses AI to generate fair teams ("White" vs "Dark") by analyzing the skill levels and positions of confirmed players.

### 📅 Session Management
- **Event Configuration**: Set date, time, location, and max player capacity.
- **RSVP Tracking**: detailed lists of who is in, out, or pending.
- **Bulk Actions**:
  - Reset all statuses for a new week.
  - Auto-decline players who haven't replied.

### 🔐 Security & Access
- **Public Registration**: A dedicated `/register` page for new players to self-signup.
- **Admin Mode**: Password-protected area for sensitive operations.
  - **Default Password**: `puck`

## Getting Started

### Prerequisites
- A modern web browser.
- A Google Cloud Project with the Gemini API enabled (for AI features).

### Installation & Setup

1.  **Clone the repository** (if running locally).
2.  **Environment Variables**:
    Ensure `process.env.API_KEY` is set with your valid Google Gemini API Key.
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Run Application**:
    ```bash
    npm start
    ```

## Usage Guide

### 1. Admin Login
- Click the **Admin Access** (Lock icon) in the sidebar.
- Enter the password: **`puck`**.
- Once logged in, you will see extra navigation items: "Invites" and "Team Balancer".

### 2. Managing the Roster
- Navigate to **Roster**.
- To add a player manually: Click **Add Player**.
- To edit skill/position: Toggle Admin mode and use the inline controls in the table.

### 3. Weekly Workflow
1.  **Reset**: Go to **Invites** and click "Reset to Pending" (via simulated bulk invite flow) to start a new week.
2.  **Invite**: Generate an email draft and send it out.
3.  **Track**: Update statuses as players reply. Use the dashboard to monitor numbers.
4.  **Game Day**:
    - Go to **Team Balancer**.
    - Ensure all players have a skill rating.
    - Click **Generate Balanced Teams**.

## Technology Stack

- **Framework**: React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Data Persistence

The application currently uses `localStorage` (`sk8_players_v2`) to save player data in the user's browser. Clearing browser data will reset the roster to the initial hardcoded list.
