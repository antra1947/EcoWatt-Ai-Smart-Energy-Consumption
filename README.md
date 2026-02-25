# EcoWatt AI - Smart Energy Consumption Forecaster

An AI-driven web application that predicts future electricity consumption, estimates monthly bills, and provides energy-saving recommendations.

## 🌟 Features

- **AI-Powered Predictions**: Uses Random Forest ML model for accurate energy forecasting
- **Weather Integration**: Considers temperature and humidity in predictions
- **Bill Estimation**: Calculates monthly electricity costs
- **Energy Saving Tips**: Provides personalized recommendations
- **Interactive Dashboard**: Real-time charts and visualizations
- **Data Flow Visualization**: Clear diagram showing system architecture

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **AI/ML**: Python + scikit-learn
- **Charts**: Chart.js
- **Data**: JSON-based storage

## 📊 Datasets Used

### Historical Energy Consumption Data
- **Source**: Simulated realistic data based on residential energy consumption patterns
- **Content**: Monthly consumption patterns, daily usage cycles, seasonal variations
- **Size**: 1000+ data points for training

### Appliance Consumption Database
- **Source**: Energy efficiency standards and manufacturer specifications
- **Content**: Power consumption data for common household appliances
- **Appliances**: AC, Heater, Refrigerator, Washing Machine, Dishwasher, TV, Computer

### Weather Correlation Data
- **Source**: Energy consumption studies and weather impact research
- **Content**: Temperature and humidity effects on energy usage
- **Patterns**: Seasonal multipliers and weather-based adjustments

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Step 1: Install Node.js Dependencies
```bash
npm install
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Train the AI Model
```bash
cd ml
python train_model.py
```

### Step 4: Start the Server
```bash
npm start
```

### Step 5: Access the Application
Open your browser and go to: `http://localhost:3000`

## 📈 How It Works

### Data Flow Diagram
```
User Input (Location, Appliances, Household Size)
           ↓
Weather Data Integration (Temperature, Humidity)
           ↓
AI Model Processing (Random Forest Algorithm)
           ↓
Prediction Results (Consumption, Bill, Savings)
```

## 🎯 Project Objectives

1. **Predict Future Electricity Consumption**: Accurate monthly forecasting
2. **Estimate Monthly Bills**: Cost calculations based on usage
3. **Provide Energy-Saving Suggestions**: Actionable recommendations
4. **Sustainability Focus**: Aligns with UN SDG 7 (Affordable and Clean Energy)