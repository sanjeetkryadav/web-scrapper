import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 1. Load environment variables
dotenv.config();

// Interface for the scraped product data
interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
}

// Configuration
const BASE_URL = 'https://www.saucedemo.com';
const OUTPUT_DIR = 'reports';
const JSON_FILE = path.join(OUTPUT_DIR, 'products.json');
const CSV_FILE = path.join(OUTPUT_DIR, 'products.csv');

async function main() {
    // 2. Validate Environment Variables
    const username = process.env.SAUCE_USERNAME;
    const password = process.env.SAUCE_PASSWORD;
    // Check if HEADLESS is exactly 'true' (string), otherwise default to false
    const isHeadless = process.env.HEADLESS === 'true';

    if (!username || !password) {
        console.error('❌ Error: SAUCE_USERNAME or SAUCE_PASSWORD is missing in the .env file.');
        process.exit(1);
    }

    console.log(`🚀 Starting scraper...`);
    console.log(`> Headless mode: ${isHeadless}`);
    console.log(`> Target User: ${username}`);
    
    // 3. Launch Browser
    const browser: Browser = await chromium.launch({ headless: isHeadless, slowMo:1000 });
    const context = await browser.newContext();
    const page: Page = await context.newPage();

    try {
        // 4. Navigate and Login
        console.log(`Maps to ${BASE_URL}`);
        await page.goto(BASE_URL);

        console.log('Logging in...');
        await page.fill('#user-name', username);
        await page.fill('#password', password);
        await page.click('#login-button');

        // Wait for inventory to load to ensure login was successful
        try {
            await page.waitForSelector('.inventory_list', { timeout: 5000 });
            console.log('✅ Login successful. Inventory loaded.');
        } catch (e) {
            console.error('❌ Login failed. Inventory list not found. Check your credentials.');
            throw e;
        }
         // Optional: wait for a second to ensure page is fully loaded

        // 5. Scrape Data
        console.log('Scraping products...');
        
        const products: Product[] = await page.$$eval('.inventory_item', (items) => {
            return items.map((item, index) => {
                const name = item.querySelector('.inventory_item_name')?.textContent?.trim() || 'N/A';
                const description = item.querySelector('.inventory_item_desc')?.textContent?.trim() || 'N/A';
                const price = item.querySelector('.inventory_item_price')?.textContent?.trim() || 'N/A';

                return {
                    id: index + 1,
                    name,
                    description,
                    price
                };
            });
        });

        console.log(`Successfully scraped ${products.length} products.`);

        // 6. Save Data
        if (!fs.existsSync(OUTPUT_DIR)){
            fs.mkdirSync(OUTPUT_DIR);
        }

        // Save as JSON
        fs.writeFileSync(JSON_FILE, JSON.stringify(products, null, 2), 'utf-8');
        console.log(`✅ JSON report saved to: ${JSON_FILE}`);

        // Save as CSV
        const csvHeader = 'ID,Name,Description,Price\n';
        const csvRows = products.map(p => {
            // Escape double quotes by doubling them (" -> "") and wrap fields in quotes
            const safeName = `"${p.name.replace(/"/g, '""')}"`;
            const safeDesc = `"${p.description.replace(/"/g, '""')}"`;
            const safePrice = `"${p.price}"`; 
            return `${p.id},${safeName},${safeDesc},${safePrice}`;
        }).join('\n');

        fs.writeFileSync(CSV_FILE, csvHeader + csvRows, 'utf-8');
        console.log(`✅ CSV report saved to: ${CSV_FILE}`);

    } catch (error) {
        console.error('❌ An error occurred during execution:', error);
    } finally {
        await browser.close();
        console.log('Browser closed.');
    }
}

main();