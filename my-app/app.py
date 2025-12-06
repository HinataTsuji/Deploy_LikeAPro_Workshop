from flask import Flask, render_template, jsonify, request
import os
import json
from datetime import datetime
import math

app = Flask(__name__)

# Load disaster and shelter data
def load_data():
    try:
        with open('data/disasters.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "active_warnings": [],
            "shelters": [],
            "emergency_contacts": []
        }

# Calculate distance between two coordinates (Haversine formula)
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/warnings')
def get_warnings():
    """Get active disaster warnings"""
    data = load_data()
    return jsonify(data.get('active_warnings', []))

@app.route('/api/shelters')
def get_shelters():
    """Get all shelters or find nearest shelters"""
    data = load_data()
    shelters = data.get('shelters', [])
    
    # If user provides location, find nearest shelters
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    
    if lat is not None and lon is not None:
        # Calculate distance for each shelter
        for shelter in shelters:
            shelter['distance'] = calculate_distance(
                lat, lon,
                shelter['latitude'], shelter['longitude']
            )
        # Sort by distance
        shelters = sorted(shelters, key=lambda x: x['distance'])[:10]
    
    return jsonify(shelters)

@app.route('/api/emergency-contacts')
def get_emergency_contacts():
    """Get emergency contact information"""
    data = load_data()
    return jsonify(data.get('emergency_contacts', []))

@app.route('/api/preparedness-tips')
def get_preparedness_tips():
    """Get disaster preparedness tips"""
    tips = {
        "earthquake": [
            "Drop, Cover, and Hold On during shaking",
            "Stay away from windows and heavy furniture",
            "Have an emergency kit with water, food, and first aid supplies",
            "Identify safe spots in each room"
        ],
        "hurricane": [
            "Board up windows and secure outdoor items",
            "Stock up on non-perishable food and water",
            "Know your evacuation route",
            "Keep important documents in waterproof containers"
        ],
        "flood": [
            "Move to higher ground immediately",
            "Never walk or drive through flood waters",
            "Turn off utilities if instructed",
            "Monitor weather updates constantly"
        ],
        "wildfire": [
            "Create defensible space around your home",
            "Have evacuation bags ready",
            "Keep important documents in a safe place",
            "Monitor air quality and wear N95 masks if needed"
        ],
        "tornado": [
            "Seek shelter in a basement or interior room",
            "Stay away from windows",
            "Cover yourself with mattress or blankets",
            "Listen to weather radio for updates"
        ]
    }
    return jsonify(tips)

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

# DON'T TOUCH THIS
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)