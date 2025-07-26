import scrapy

class ProductsSpider(scrapy.Spider):
    # This is the name given to the spider. This name is used to run the scrapy crawler.
    # This name must be unique within the project.
    name = "products"

    # These are the URLs where Scrapy will start scraping.
    # You should replace 'https://www.example.com/products' with the actual URL
    # of the website you want to scrape prices from.
    start_urls = [
        'https://www.example.com/products' # Replace this with your actual URL
    ]

    # This method handles the response received from each URL that is scraped.
    # 'response' contains the HTML content of the page we requested.
    def parse(self, response):
        # Using the 'div.product-item' CSS selector to find every div element
        # that contains a product item.
        # You need to adjust this selector to match the main container class/id
        # of a product on your target website.
        for product in response.css('div.product-item'):
            # Extracting the product name.
            # Using 'h2.product-name' CSS selector to get the text of the product name.
            # Adjust this selector to match the element containing the product name
            # on your target website.
            name = product.css('h2.product-name::text').get()

            # Extracting the product price.
            # Using 'span.product-price' CSS selector to get the text of the product price.
            # Adjust this selector to match the element containing the price
            # on your target website.
            price = product.css('span.product-price::text').get()

            # Extracting the product description (optional).
            description = product.css('p.product-description::text').get()

            # Yielding the extracted data as a dictionary.
            # Scrapy will save the yielded data to the specified output file (CSV, JSON).
            yield {
                'name': name,
                'price': price,
                'description': description, # Optional field
                'url': response.url # URL of the page where this product was found
            }

        # Finding the link to the next page.
        # This CSS selector ('a.next-button::attr(href)') needs to be
        # adjusted to match the next page button's selector on your target website.
        next_page = response.css('a.next-button::attr(href)').get()

        # If a 'next_page' link is found, follow it.
        if next_page is not None:
            # 'response.follow()' creates a new request and sends it.
            # 'callback=self.parse' tells Scrapy to handle the content of the new page
            # using the same 'parse' method. This allows continuous navigation through pages.
            yield response.follow(next_page, callback=self.parse)