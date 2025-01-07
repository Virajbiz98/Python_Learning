import requests
from bs4 import BeautifulSoup
import csv 

query = "web scrapin with python"
url = f"https://www.google.com/search?q={query.replace(' ', '+')}"

headers = {
     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, "lxml")

    with open("google_search.csv", "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Title", "Link"])

        for result in soup.find_all("div", class_='tF2Cxc'):
            title = result.find('h3').text
            link = result.find('a')['href']
            writer.writerow([title, link])

            print(f"Title:{title}")
            print(f"Link: {link}")
            print("-" * 50)

    print("Data saved to google_search.csv")
else:
    print(f"Faild to fetch Google results. Status code: {response.status_code}")
