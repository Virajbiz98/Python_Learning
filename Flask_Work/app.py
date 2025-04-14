from flask import Flask, render_template, request, jsonify
import os
import boto3
import json

# Agent ID and Alias ID
Agent_ID = "QQVZ5RSGVC"
Alias_ID = "LNKD6INB56"

# AWS kottasaya set karanna
os.environ["AWS_REGION"] = "us-west-2"  # United States (Oregon)

# Update the static_folder to point to the correct location
app = Flask(__name__,
            template_folder=os.path.join('hotel_website', 'templates'),
            static_folder=os.path.join('hotel_website', 'static'))

# Bedrock runtime client setup
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.environ["AWS_REGION"]
)

hotel_data = {
        'name': 'K D M Grand Royal Hotel',
        'location': 'New York, USA',
        'rooms': [
            {
                'name': 'Luxury Suite',
                'price': 499,
                'size': '75 m²',
                'features': ['King-size bed', 'Ocean view', 'Private balcony', 'Luxury bathroom', 'Mini bar']
            },
            {
                'name': 'Presidential Suite',
                'price': 899,
                'size': '120 m²',
                'features': ['Master bedroom', 'Living room', 'Executive lounge access', 'Butler service', 'Private dining']
            },
            {
                'name': 'Standard Room',
                'price': 299,
                'size': '45 m²',
                'features': ['Queen-size bed', 'City view', 'Work desk', 'Rain shower', 'Coffee maker']
            },
            {
                'name': 'Single Room',
                'price': 199,
                'size': '30 m²',
                'features': ['Single bed', 'Garden view', 'Work corner', 'En-suite bathroom', 'Smart TV']
            }
        ],
        'amenities': [
            {'name': 'Infinity Pool', 'icon': 'swimming-pool', 'description': 'Stunning rooftop pool with city views'},
            {'name': 'Luxury Spa', 'icon': 'spa', 'description': 'World-class treatments and facilities'},
            {'name': 'Fitness Center', 'icon': 'dumbbell', 'description': '24/7 state-of-the-art equipment'},
            {'name': 'Fine Dining', 'icon': 'utensils', 'description': 'Award-winning restaurants'},
            {'name': 'Business Center', 'icon': 'business-time', 'description': 'Full-service business facilities'}
        ],
        'images': ['hotel1.jpg', 'hotel2.jpg']
    }

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html', hotel=hotel_data, bot_response=None)

@app.route('/ask_bot', methods=['POST'])
def ask_bot():
    user_input = request.form['user_input']
    session_id = "MYSESSION"

    try:
        # Invoke the Bedrock agent
        bot_response = invoke_agent(Agent_ID, Alias_ID, session_id, user_input)
        return render_template('index.html', hotel=hotel_data, bot_response=bot_response)
    except Exception as e:
        return render_template('index.html', hotel=hotel_data, bot_response=f"Error: {str(e)}")

def invoke_agent(agent_id, agent_alias_id, session_id, user_input):
    """Invokes the Bedrock agent."""
    url = f'https://bedrock-agent-runtime.{os.environ["AWS_REGION"]}.amazonaws.com/agents/{agent_id}/agentAliases/{agent_alias_id}/sessions/{session_id}/text'

    payload = {
        "inputText": user_input,
        "enableTrace": True
    }

    response = bedrock_runtime.invoke_model(
        modelId='ai21.j2-ultra-v1',  # foundation model eka
        contentType='application/json',
        accept='application/json',
        body=json.dumps(payload)
    )

    response_body = json.loads(response['body'].read().decode('utf-8'))
    return response_body['completion']  # or adjust depending on actual response structure

if __name__ == '__main__':
    app.run(debug=True, port=5002)