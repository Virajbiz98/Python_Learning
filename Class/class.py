
class Investment:

    def __init__(self, name, amount, annual_return):
        
        self.name = name 
        self.amount = amount 
        self.annual_return = annual_return 

    def calculate_return(self, years):

        return self.amount*((1 + self.annual_return / 100) ** years -1)

class InvestmentApp:

    def __init__(self):
        
        self.investments = []

    def add_investment(self):
         
        name = input("Enter investment name: ").strip()

        try:
            amount = float(input("Enter investment amount: "))

            annual_return = float(input("Enter annual return rate (in %): "))

            self.investments.append(Investment(name, amount, annual_return))

            print(f"Investment '{name}' added successfully.")

        except ValueError:

            print("Invalid input. Please enter numeric value for amount and annual return.")

    def view_portfolio(self):

        if not self.investments:
            print("No investments in portfolio.")

            return 

        print("\nYour portfolio:")

        for i, inv in enumerate(self.investments, 1):
            print((f"{i}. {inv.name}) - Amount: ${inv.amount:.2f}, Annual Return: {inv.annual_return:. 2f}%"))  

    def calculater_future_value(self):

        if not self.investments:

            print("No investments to calculate returns.")

            return 

        try:

            years = int(input("Enter number of years for future value calculations: "))

            print("\nFuture value of Investments: ")

            for inv in self.investments:

                future_value = inv.amount * ((1 + inv.annual_return / 100) ** years)

                print(f"{inv.name}: ${future_value:.2f} after {years} years.")

        except ValueError:

            print("Invalid input. Pleas enter a valid number of years.")

    def run(self):

        while True:

            print("\nInvestments App Menu:")

            print("1. Add Investment")

            print("2. View Portfolio")

            print("3. Calculate Future Value")

            print("4. Exit")

            choice = input("Choose an option: ").strip()

            if choice == "1":

                self.add_investment()

            elif choice == '2':

                self.view_portfolio()

            elif choice == '3':

                self.calculater_future_value()

            elif choice == '4':

                print("Exiting the Investment App. Goodbye!")

                break
            else:

                print("Invalid choice. Pleas selct a valid option.")

if __name__ == '__main__':

    app = InvestmentApp()

    app.run()







        
