// Global state
let userLocation = null;
let tipsData = {};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadWarnings();
    loadShelters();
    loadEmergencyContacts();
    loadPreparednessData();
    initializeLocationButton();
    initializeTabs();
    loadChecklistState();
});

// Load active warnings
async function loadWarnings() {
    const container = document.getElementById('warnings-container');
    try {
        const response = await fetch('/api/warnings');
        const warnings = await response.json();
        
        if (warnings.length === 0) {
            container.innerHTML = '<p class="no-data">✅ No active warnings in your area. Stay prepared!</p>';
            return;
        }
        
        container.innerHTML = warnings.map(warning => `
            <div class="warning-item ${warning.severity === 'severe' ? 'severe' : ''}">
                <h3>${warning.type}</h3>
                <div class="warning-meta">
                    <strong>Area:</strong> ${warning.area} | 
                    <strong>Severity:</strong> ${warning.severity.toUpperCase()} |
                    <strong>Issued:</strong> ${formatDate(warning.issued)}
                </div>
                <p>${warning.description}</p>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="error">Error loading warnings. Please try again later.</p>';
        console.error('Error loading warnings:', error);
    }
}

// Load shelters
async function loadShelters(lat = null, lon = null) {
    const container = document.getElementById('shelters-container');
    container.innerHTML = '<p class="loading">Loading shelters...</p>';
    
    try {
        let url = '/api/shelters';
        if (lat !== null && lon !== null) {
            url += `?lat=${lat}&lon=${lon}`;
        }
        
        const response = await fetch(url);
        const shelters = await response.json();
        
        if (shelters.length === 0) {
            container.innerHTML = '<p class="no-data">No shelters found in the database.</p>';
            return;
        }
        
        container.innerHTML = shelters.map(shelter => `
            <div class="shelter-item">
                <h3>${shelter.name}</h3>
                <p>${shelter.address}</p>
                <div class="shelter-info">
                    <span>📞 ${shelter.phone}</span>
                    <span>👥 Capacity: ${shelter.capacity}</span>
                    ${shelter.distance ? `<span class="distance-badge">📍 ${shelter.distance.toFixed(1)} km away</span>` : ''}
                </div>
                ${shelter.facilities ? `<p style="margin-top: 0.5rem; color: #6b7280;">Facilities: ${shelter.facilities.join(', ')}</p>` : ''}
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="error">Error loading shelters. Please try again later.</p>';
        console.error('Error loading shelters:', error);
    }
}

// Load emergency contacts
async function loadEmergencyContacts() {
    const container = document.getElementById('contacts-container');
    try {
        const response = await fetch('/api/emergency-contacts');
        const contacts = await response.json();
        
        if (contacts.length === 0) {
            container.innerHTML = '<p class="no-data">No emergency contacts available.</p>';
            return;
        }
        
        const grid = document.createElement('div');
        grid.className = 'contact-grid';
        grid.innerHTML = contacts.map(contact => `
            <div class="contact-item">
                <h3>${contact.name}</h3>
                <p class="phone">${contact.phone}</p>
                ${contact.description ? `<p style="font-size: 0.9rem; color: #6b7280;">${contact.description}</p>` : ''}
            </div>
        `).join('');
        
        container.innerHTML = '';
        container.appendChild(grid);
    } catch (error) {
        container.innerHTML = '<p class="error">Error loading emergency contacts. Please try again later.</p>';
        console.error('Error loading contacts:', error);
    }
}

// Load preparedness tips
async function loadPreparednessData() {
    try {
        const response = await fetch('/api/preparedness-tips');
        tipsData = await response.json();
        displayTips('earthquake'); // Default
    } catch (error) {
        document.getElementById('tips-container').innerHTML = '<p class="error">Error loading tips.</p>';
        console.error('Error loading tips:', error);
    }
}

// Display tips for specific disaster type
function displayTips(disasterType) {
    const tipsList = document.getElementById('tips-list');
    const tips = tipsData[disasterType] || [];
    
    tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
}

// Initialize tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Display corresponding tips
            displayTips(btn.dataset.disaster);
        });
    });
}

// Initialize location button
function initializeLocationButton() {
    const btn = document.getElementById('get-location-btn');
    const status = document.getElementById('location-status');
    
    btn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            status.textContent = '❌ Geolocation not supported';
            status.style.color = 'var(--danger-color)';
            return;
        }
        
        status.textContent = '📍 Getting location...';
        status.style.color = '#6b7280';
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                status.textContent = '✅ Location acquired';
                status.style.color = 'var(--success-color)';
                loadShelters(userLocation.lat, userLocation.lon);
            },
            (error) => {
                status.textContent = '❌ Could not get location';
                status.style.color = 'var(--danger-color)';
                console.error('Geolocation error:', error);
            }
        );
    });
}

// Save and load checklist state
document.querySelectorAll('.checklist input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', saveChecklistState);
});

function saveChecklistState() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const state = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem('emergencyKitChecklist', JSON.stringify(state));
}

function loadChecklistState() {
    const savedState = localStorage.getItem('emergencyKitChecklist');
    if (savedState) {
        const state = JSON.parse(savedState);
        const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
        checkboxes.forEach((cb, index) => {
            if (state[index]) {
                cb.checked = true;
            }
        });
    }
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}
