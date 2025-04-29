from flask import Flask, render_template, request, jsonify
import pandas as pd
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def home():
    return render_template('dashboard.html')

@app.route('/upload', methods=['POST'])
def handle_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    try:
        # Validate file
        if not file.filename.lower().endswith(('.csv', '.xlsx')):
            return jsonify({'error': 'Only CSV and Excel files allowed'}), 400

        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        
        # Process file with error checking
        try:
            if filepath.endswith('.csv'):
                df = pd.read_csv(filepath)
            else:
                df = pd.read_excel(filepath)
        except Exception as e:
            return jsonify({'error': f'File parsing failed: {str(e)}'}), 400

        # Validate columns
        required_columns = ['Date', 'Views', 'Likes', 'Subscribers']
        missing = [col for col in required_columns if col not in df.columns]
        if missing:
            return jsonify({'error': f'Missing columns: {", ".join(missing)}'}), 400

        # Convert dates with error handling
        try:
            df['Date'] = pd.to_datetime(df['Date'])
        except Exception as e:
            return jsonify({'error': f'Date conversion failed: {str(e)}'}), 400

        # Validate numeric columns
        numeric_cols = ['Views', 'Likes', 'Subscribers']
        for col in numeric_cols:
            if not pd.api.types.is_numeric_dtype(df[col]):
                return jsonify({'error': f'Column {col} contains non-numeric values'}), 400

        # Check for empty data
        if df.empty:
            return jsonify({'error': 'Uploaded file contains no data'}), 400

        try:
            return jsonify({
                'data': df.head(1000).to_dict(orient='records'),
                'summary': {
                    'total_views': df['Views'].sum(),
                    'avg_likes': df['Likes'].mean(),
                    'sub_growth': int(df['Subscribers'].iloc[-1]) - int(df['Subscribers'].iloc[0])
                },
                'columns': list(df.columns)
            })
        except Exception as e:
            return jsonify({'error': f'Data processing failed: {str(e)}'}), 400
    except Exception as e:
        logger.exception("Unexpected error during file upload")
        return jsonify({'error': 'Internal server error - check logs'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
