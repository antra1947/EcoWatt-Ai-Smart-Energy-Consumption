# EcoWatt AI - API Documentation

## Base URL
```
http://localhost:3000
```

## Main Endpoint

### Energy Prediction
**POST** `/api/predict`

Generates AI-powered energy consumption predictions.

#### Request Body
```json
{
  "location": "Punjab",
  "householdS
#### Request Body
```json

{
  "location": "string",           // City/region name
  "householdSize": number,        // Number of people (1-5+)
  "currentUsage": number,         // Current monthly usage in kWh (optional)
  "appliances": ["string"],       // Array of appliance types
  "preferences": {                // Optional preferences object
    "efficiency": "string",       // low/medium/high
    "budget": "string"           // low/medium/high
  }
  }
```

#### Supported Appliances
- `air_conditioner`
- `heater`
- `refrigerator`
- `washing_machine`
- `dishwasher`
- `tv`
- `computer`

#### Response
```json
{
  "success": true,
  "prediction": 976,              // Monthly consumption in kWh
  "confidence": 0.95,             // Prediction confidence (0-1)
  "billEstimate": 68.32,          // Estimated monthly bill in USD
  "savings": {
    "amount": 215,                // Potential savings in kWh
    "percentage": 22,             // Savings percentage
    "monthlySavings": 32.25,      // Monthly cost savings in USD
    "yearlyImpact": 387,          // Annual cost savings in USD
    "carbonReduction": 75.25      // CO₂ reduction in kg
  },
  "recommendations": [
    {
      "category": "Cooling",
      "suggestion": "Install smart thermostats...",
      "impact": "High",           // High/Medium/Low
      "savings": "$25-40/month"
    }
  ],
  "weatherImpact": 0,             // Weather adjustment in kWh
  "carbonFootprint": 761.25,     // Monthly CO₂ emissions in kg
  "efficiency": 80,               // Efficiency score (0-100)
  "trends": [                     // 12-month forecast
    {
      "month": "Jan",
      "predicted": 627,
      "optimized": 489
    }
  ],
  "timestamp": "2026-01-30T16:22:49.028Z"
}
```

#### Example Request
```bash
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Punjab",
    "householdSize": 3,
    "currentUsage": 500,
    "appliances": ["air_conditioner", "refrigerator", "tv"]
  }'
```

---

### 2. Dashboard Analytics
**GET** `/api/analytics/dashboard`

Retrieves comprehensive analytics data for the dashboard.

#### Response
```json
{
  "currentConsumption": 976,
  "monthlyBill": 68.32,
  "carbonFootprint": 761
}
}