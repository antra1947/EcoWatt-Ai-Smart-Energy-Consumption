import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

def load_data():
    """Load and prepare training data"""
    with open('data/historical_consumption.json', 'r') as f:
        data = json.load(f)
    
    # Generate synthetic training data based on patterns
    np.random.seed(42)
    n_samples = 1000
    
    # Features: household_size, temperature, humidity, num_appliances, season
    household_sizes = np.random.randint(1, 6, n_samples)
    temperatures = np.random.normal(22, 8, n_samples)
    humidity = np.random.normal(60, 15, n_samples)
    num_appliances = np.random.randint(2, 8, n_samples)
    seasons = np.random.randint(0, 4, n_samples)  # 0=spring, 1=summer, 2=autumn, 3=winter
    
    # Calculate target consumption based on realistic patterns
    base_consumption = household_sizes * 300  # Base per person
    
    # Temperature effects
    temp_effect = np.where(temperatures > 30, 150, 
                  np.where(temperatures < 10, 200, 0))
    
    # Humidity effects  
    humidity_effect = np.where(humidity > 70, 50, 0)
    
    # Appliance effects
    appliance_effect = num_appliances * 25
    
    # Seasonal effects
    seasonal_multipliers = [0.9, 1.3, 0.95, 1.2]  # spring, summer, autumn, winter
    seasonal_effect = [seasonal_multipliers[s] for s in seasons]
    
    # Calculate total consumption with some noise
    consumption = (base_consumption + temp_effect + humidity_effect + appliance_effect) * seasonal_effect
    consumption += np.random.normal(0, 50, n_samples)  # Add noise
    consumption = np.maximum(consumption, 100)  # Minimum consumption
    
    # Create DataFrame
    df = pd.DataFrame({
        'household_size': household_sizes,
        'temperature': temperatures,
        'humidity': humidity,
        'num_appliances': num_appliances,
        'season': seasons,
        'consumption': consumption
    })
    
    return df

def train_model():
    """Train the energy consumption prediction model"""
    print("Loading training data...")
    df = load_data()
    
    # Prepare features and target
    features = ['household_size', 'temperature', 'humidity', 'num_appliances', 'season']
    X = df[features]
    y = df['consumption']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Random Forest model
    print("Training Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Performance:")
    print(f"Mean Absolute Error: {mae:.2f} kWh")
    print(f"R² Score: {r2:.3f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nFeature Importance:")
    print(feature_importance)
    
    # Save model
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/energy_consumption_model.pkl')
    
    # Save model metadata
    metadata = {
        'model_type': 'RandomForestRegressor',
        'features': features,
        'mae': mae,
        'r2_score': r2,
        'feature_importance': feature_importance.to_dict('records'),
        'training_samples': len(X_train),
        'test_samples': len(X_test)
    }
    
    with open('models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\nModel saved to models/energy_consumption_model.pkl")
    print(f"Metadata saved to models/model_metadata.json")
    
    return model, metadata

def predict_consumption(household_size, temperature, humidity, num_appliances, season):
    """Make prediction using trained model"""
    try:
        model = joblib.load('models/energy_consumption_model.pkl')
        
        # Prepare input
        input_data = np.array([[household_size, temperature, humidity, num_appliances, season]])
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        
        return max(prediction, 100)  # Minimum consumption
        
    except FileNotFoundError:
        print("Model not found. Please train the model first.")
        return None

if __name__ == "__main__":
    print("EcoWatt AI - Energy Consumption Model Training")
    print("=" * 50)
    
    model, metadata = train_model()
    
    print("\nTesting prediction...")
    # Test prediction
    test_prediction = predict_consumption(
        household_size=3,
        temperature=25,
        humidity=60,
        num_appliances=5,
        season=1  # summer
    )
    
    if test_prediction:
        print(f"Test prediction for 3-person household in summer: {test_prediction:.0f} kWh")
    
    print("\nTraining completed successfully!")