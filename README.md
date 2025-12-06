# Deploy_LikeAPro_Workshop

## Disaster Mitigation Hub

A comprehensive web application for natural disaster preparedness and response, providing real-time warnings, shelter locations, emergency contacts, and preparedness information.

## Features

### 🚨 Active Disaster Warnings
- Real-time display of active disaster warnings
- Severity levels (moderate, severe)
- Location-based alerts
- Detailed descriptions and timestamps

### 🏠 Emergency Shelters
- Comprehensive list of emergency shelters
- Location-based search using geolocation
- Distance calculation from user's position
- Shelter capacity and facility information
- Contact details for each shelter

### 📞 Emergency Contacts
- Quick access to emergency services
- Multiple contact types (Fire, Police, Medical, etc.)
- 24/7 hotlines for disaster assistance
- Utility emergency numbers

### 📋 Disaster Preparedness Tips
- Category-specific tips for:
  - Earthquakes
  - Hurricanes
  - Floods
  - Wildfires
  - Tornadoes
- Interactive tab navigation
- Actionable safety information

### 🎒 Emergency Kit Checklist
- Comprehensive 15-item checklist
- Persistent state (saved in browser)
- Based on FEMA recommendations
- Track your preparedness progress

## Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Storage**: JSON files
- **Geolocation**: Browser Geolocation API
- **Containerization**: Docker

## Project Structure

```
my-app/
├── app.py                      # Flask application
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container configuration
├── data/
│   └── disasters.json         # Disaster warnings and shelter data
├── templates/
│   └── index.html             # Main HTML template
└── static/
    ├── css/
    │   └── style.css          # Application styles
    └── js/
        └── app.js             # Frontend JavaScript
```

## Running the Application

### Local Development

1. Navigate to the app directory:
```bash
cd my-app
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

4. Open your browser to `http://localhost:8080`

### Using Docker

1. Navigate to the app directory:
```bash
cd my-app
```

2. Build the Docker image:
```bash
docker build -t disaster-mitigation-app .
```

3. Run the container:
```bash
docker run -p 8080:8080 disaster-mitigation-app
```

4. Access the app at `http://localhost:8080`

## API Endpoints

- `GET /` - Main application interface
- `GET /api/warnings` - Get active disaster warnings
- `GET /api/shelters` - Get shelter list (supports ?lat=&lon= for nearest shelters)
- `GET /api/emergency-contacts` - Get emergency contact information
- `GET /api/preparedness-tips` - Get disaster preparedness tips
- `GET /health` - Health check endpoint

## Customization

### Adding Disaster Data

Edit `data/disasters.json` to add or modify:
- Active warnings
- Shelter locations
- Emergency contacts

### Styling

Modify `static/css/style.css` to customize the appearance.

### Adding Features

Extend `app.py` with additional API endpoints and update `static/js/app.js` for frontend functionality.

## Safety Notice

This application is designed for educational and informational purposes. Always follow official emergency management guidance and local authority instructions during actual disaster situations.

## License

MIT License - Feel free to use and modify for your needs.