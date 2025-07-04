from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import sqlite3
from selenium.webdriver.chrome.options import Options
import random
from selenium.common.exceptions import WebDriverException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Predefined categories and keywords
CATEGORIES = {
    "Technology": ["tech", "coding", "programming", "software", "it"],
    "Gaming": ["gaming", "esports", "game", "players"],
    "Education": ["education", "study", "learning", "school", "university", "college", "academic"],
    "Lifestyle": ["lifestyle", "fashion", "travel", "food", "health"],
    "Business": ["business", "entrepreneur", "startup", "marketing"]
}

# Country keywords
COUNTRY_KEYWORDS = {
    "Sri Lanka": ["sri lanka", "lanka", "sl", "ceylon"],
    "India": ["india", "indian", "bharat"],
    "USA": ["usa", "america", "united states"],
    "UK": ["uk", "united kingdom", "britain", "england", "scotland", "wales"],
    "Canada": ["canada", "canadian"]
}

# Random user agents to avoid detection
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
]

# Function to categorize group based on name
def categorize_group(text):
    text = text.lower()
    for category, keywords in CATEGORIES.items():
        if any(keyword in text for keyword in keywords):
            return category
    return "Other"

# Function to check if group belongs to any of the selected countries
def is_country_specific(text, countries):
    if not countries:
        return True, "Global"  # No country filter, include all
    text = text.lower()
    for country in countries:
        country_key = country.lower()
        for key in COUNTRY_KEYWORDS:
            if country_key == key.lower():
                country_keys = COUNTRY_KEYWORDS[key]
                if any(keyword in text for keyword in country_keys):
                    return True, key  # Return True and the matched country
    return False, None

# Setup SQLite database
def setup_database():
    conn = sqlite3.connect("fb_groups.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS groups 
                 (name TEXT, link TEXT, category TEXT, country TEXT, UNIQUE(link))''')
    conn.commit()
    return conn

# Setup Selenium WebDriver
def setup_driver():
    options = Options()
    options.add_argument("--headless")  # Run in headless mode
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument(f"user-agent={random.choice(USER_AGENTS)}")
    # Optional: Add proxy to bypass network issues (replace with your proxy if available)
    # options.add_argument("--proxy-server=http://your-proxy:port")
    options.add_argument("--disable-blink-features=AutomationControlled")  # Avoid detection
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

# Main scraping function with retry logic
def scrape_groups(countries=None, category_filter=None, max_retries=5):
    attempt = 0
    while attempt < max_retries:
        try:
            driver = setup_driver()
            conn = setup_database()
            driver.set_page_load_timeout(30)  # Timeout for page load
            driver.get("https://www.facebook.com/groups/")

            # Wait for page to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "body"))
            )

            # Scroll to load more groups
            for _ in range(5):  # Increased to 5 for more groups
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(3)

            # Find group elements
            groups = driver.find_elements(By.CSS_SELECTOR, "a[href*='/groups/']")
            if not groups:
                print("No groups found. Check if page loaded correctly or try manual browser access.")
            
            for group in groups:
                try:
                    name = group.text.strip()
                    link = group.get_attribute("href")
                    if name and link and "join" in link:  # Filter valid group links
                        # Check if group matches any country
                        is_valid, matched_country = is_country_specific(name, countries)
                        if is_valid:
                            category = categorize_group(name)  # Categorize based on name
                            # Apply category filter if specified
                            if not category_filter or category.lower() == category_filter.lower() or (category_filter.lower() in name.lower()):
                                # Save to database
                                try:
                                    conn.cursor().execute("INSERT INTO groups (name, link, category, country) VALUES (?, ?, ?, ?)",
                                                        (name, link, category, matched_country or "Global"))
                                    conn.commit()
                                    print(f"Saved: {name} | Category: {category} | Country: {matched_country or 'Global'} | Link: {link}")
                                except sqlite3.IntegrityError:
                                    print(f"Duplicate link skipped: {link}")
                            else:
                                print(f"Skipped (category mismatch): {name}")
                        else:
                            print(f"Skipped (country mismatch): {name}")
                except Exception as e:
                    print(f"Error processing group: {e}")

            # Clean up
            driver.quit()
            conn.close()
            return  # Success, exit function
        except (WebDriverException, TimeoutException) as e:
            attempt += 1
            print(f"Attempt {attempt} failed: {e}")
            if attempt < max_retries:
                print(f"Retrying in 5 seconds...")
                time.sleep(5)
            else:
                print(f"Scraping failed after {max_retries} attempts: {e}")

# Run the scraper with user input
if __name__ == "__main__":
    try:
        countries_input = input("Enter countries to filter groups (e.g., Sri Lanka,India,USA,UK,Canada or leave blank for all): ").strip()
        countries = [c.strip() for c in countries_input.split(",")] if countries_input else []
        category_filter = input("Enter category to filter (e.g., Gaming, Education, or leave blank for all): ").strip()
        scrape_groups(countries, category_filter)
    except Exception as e:
        print(f"Scraping failed: {e}")