import requests 

response = requests.get('http://appi.covid19api.com/total/country/sri-lanka')
content = response.json()

print("Total cases=", len(content))

# how to create virtual envarement
# virtualenv venv #(venv =  envarment name)

# how to activate it 
# venv\Scripts\activate 
