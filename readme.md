🧪 SauceDemo Scraper

A robust web scraping automation tool built with TypeScript and Playwright. This project automates the login process on the Swag Labs (SauceDemo) testing site, extracts product details, and exports them into clean data formats.

✨ Features

🔐 Automated Authentication: Securely logs in using credentials stored in environment variables.

📦 Data Extraction: Scrapes product names, descriptions, and prices with high accuracy.

📊 Multi-Format Export: Automatically generates both JSON and CSV reports.

⚙️ Configurable Execution: Toggle between Headless (background) and Headed (visible) modes via config.

🕒 Visual Debugging: Includes built-in delays and slowMo options for easy process monitoring.

🛠️ Tech Stack

Runtime: Node.js

Language: TypeScript

Automation: Playwright

Config: Dotenv

Runner: ts-node

🚀 Getting Started

1. Prerequisites

Ensure you have Node.js (v14+) and npm installed.

2. Installation

Clone this repository and install the dependencies:

npm install


3. Install Browsers

Download the necessary Chromium binaries for Playwright:

npx playwright install chromium


4. Environment Configuration

Create a .env file in the root directory (refer to .env.example):

SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
HEADLESS=false


🚦 Usage

To start the scraping process, run:

npm start


Script Workflow:

Launches Chromium browser.

Navigates to SauceDemo and logs in.

Pauses briefly (if not in headless mode) for visual verification.

Scrapes the inventory items.

Saves files to the /reports directory.

📁 Project Structure

├── reports/             Generated data (CSV/JSON)
├── scraper.ts           Main logic
├── .env                 Private configuration
├── package.json         Dependencies and scripts
└── tsconfig.json        TypeScript configuration



