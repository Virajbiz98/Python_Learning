import requests 
from bs4 import BeautifulSoup
import pandas as pd 

# url = "https://books.toscrape.com/catalogue/page-1.html"

# page = requests.get(url)
# # print(page.text)

# soup = BeautifulSoup(page.text,"html.parser")

# print(soup.title.text)

current_page = 1

data = []

proceed = True 

while(proceed):
    print("Currently scraping page: " + str(current_page))

    url = "https://books.toscrape.com/catalogue/page-"+str(current_page)+".html"

    page = requests.get(url)
# print(page.text)

    soup = BeautifulSoup(page.text,"html.parser")
    # if soup.title.text == "404 Not Found":
    if "404" in soup.title.text:

        proceed = False 
    else:
        all_books = soup.find_all("li", class_="col-xs-6 col-sm-4 col-md-3 col-lg-3")

        for book in all_books:
            item = {}

            item['Title']  = book.find("img").attrs["alt"]

            item['Link'] = "https://books.toscrape.com/catalogue/"+ book.find("a").attrs["href"]
            item['Price'] = book.find('p', class_="price_color").text[2:]

            item['Stock'] = book.find("p", class_="instock availability").text.strip()

            # print(item['Stock'])

            data.append(item)

    current_page += 1
    # proceed = False

df = pd.DataFrame(data)
df.to_csv("books.csv")
print("CSV saved!")

df.to_excel("books.xlsx")
print("Excel saved!")


     


