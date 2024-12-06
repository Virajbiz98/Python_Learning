# ~ How to write  better functions 


# 1. Shrt and concise
# 2. specify a return type
# 3.make as simple and reusable as posible
# 4. Document all your functions 
# 5. Handle errors appropriately 

# from datetime import datetime
# def get_time() -> str: 
#     """
#     A function that gets the crrent time in the users locale and returns it as a string.

#     :Example:
#     >>> get_time()
#     "21:56:27"
#     """
#     now: datetime = datetime.now()
#     return f'{now:%X}'

# print(get_time())

from collections.abc import Iterable 

def get_total_discount(prices: Iterable[float], percent:float) -> float:
    """
    Calculate the total price after applying a discount.

    This function calculate the total sum of prices in the provided list and then  applise a discount based on the given discount rate. If the discount rate is invalid (e.g., negative or greater than 1 ), the function raises a ValueError .

    :param prices: A list of item prices.
    :type prices: list[float]
    :param percent: the discount rate to apply. Default is 0.1 (10%).
    :type percent:  the total price after applying the discount.
    :rtype:float 
    :raises valueError: the discount_rate is not between 0 and 1 inclusive, or prices contain non-numeric values.

    :Example:
    >>> get_total_discount([100.0, 50.0, 25.0],  0.2)
    140.0 

    """
    # validate input 
    if not (0 <= percent <= 1):
        raise ValueError(f"invalid discount rate: {percent}. Must be between 0 an 1 inclusive.")

    if not all(isinstance(price, (int, float)) and price >= 0 for price in prices):
        raise ValueError("All prices must be non-negative numbers.")

    total: float = sum(prices)
    return total * (1 - percent)

def main() -> None:
    print(get_total_discount([100.0, 50.0, 25.0],  0.2))

if __name__ == '__main__':
    main()