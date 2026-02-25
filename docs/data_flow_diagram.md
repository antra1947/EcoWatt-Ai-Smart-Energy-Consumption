# EcoWatt AI - Data Flow Diagram

## System Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │    │  Weather API    │    │ Historical Data │
│                 │    │                 │    │                 │
│ • Location      │    │ • Temperature   │    │ • Monthly Usage │
│ • Household     │    │ • Humidity      │    │ • Appliance     │
│ • Appliances    │    │ • Season        │    │   Patterns      │
│ • Current Usage │    │                 │    │ • Seasonal Data │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    Data Processing      │
                    │                         │
                    │ • Input Validation      │
                    │ • Feature Engineering   │
                    │ • Data Normalization    │
                    └─────────────┬───────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │     AI Model Engine     │
                    │                         │
                    │ • Random Forest Model   │
                    │ • Feature Importance    │
                    │ • Prediction Algorithm  │
                    └─────────────┬───────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Results Processing    │
                    │                         │
                    │ • Consumption Forecast  │
                    │ • Bill Calculation      │
                    │ • Savings Analysis      │
                    │ • Recommendations       │
                    └─────────────┬───────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Frontend Display      │
                    │                         │
                    │ • Interactive Charts    │
                    │ • Result Cards          │
                    │ • Recommendations List  │
                    │ • Data Visualization    │
                    └─────────────────────────┘
```

## Detailed Component Flow

### 1. Input Collection Layer
- **User Interface**: Web form collecting user preferences
- **Data Validation**: Server-side input sanitization
- **Weather Integration**: Real-time weather data fetching

### 2. Data Processing Layer
- **Feature Engineering**: Converting raw inputs to model features
- **Data Normalization**: Scaling values for optimal model performance
- **Historical Context**: Incorporating past consumption patterns

### 3. AI Prediction Engine
- **Model Loading**: Loading pre-trained Random Forest model
- **Feature Processing**: Preparing input vector for prediction
- **Prediction Generation**: Computing energy consumption forecast

### 4. Results Enhancement
- **Bill Calculation**: Converting kWh to monetary estimates
- **Savings Analysis**: Identifying optimization opportunities
- **Recommendation Engine**: Generating personalized energy tips

### 5. Visualization Layer
- **Chart Generation**: Creating interactive consumption graphs
- **Result Display**: Formatting predictions for user consumption
- **Responsive Design**: Ensuring cross-device compatibility

## Data Sources and Attribution

### Primary Datasets
1. **Synthetic Energy Consumption Data**
   - Generated based on residential energy usage patterns
   - Incorporates seasonal variations and appliance-specific consumption
   - 1000+ training samples with realistic noise and variations

2. **Appliance Energy Database**
   - Based on Energy Star ratings and manufacturer specifications
   - Covers major household appliances with average consumption rates
   - Includes seasonal adjustment factors

3. **Weather Impact Correlations**
   - Derived from energy consumption research studies
   - Temperature and humidity impact coefficients
   - Regional climate adjustment factors

### Model Training Pipeline
```
Raw Data → Feature Engineering → Model Training → Validation → Deployment
    ↓              ↓                   ↓             ↓           ↓
Historical    Normalization      Random Forest   Cross-Val   Web API
Patterns      Encoding           Training        Testing     Integration
```

## Performance Metrics

- **Model Accuracy**: ~85% R² score on test data
- **Prediction Speed**: <100ms response time
- **Data Processing**: Real-time feature engineering
- **Scalability**: Handles 100+ concurrent predictions

## Security and Privacy

- **Data Protection**: No personal data storage
- **Input Sanitization**: Server-side validation
- **API Security**: Rate limiting and error handling
- **Privacy First**: Location data used only for weather context

