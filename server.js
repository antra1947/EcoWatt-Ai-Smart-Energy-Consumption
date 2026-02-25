const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let modelCache = null;
let historicalData = null;

async function loadHistoricalData() {
    if (!historicalData) {
        try {
            historicalData = await fs.readJson('./data/enhanced_consumption_data.json');
        } catch (error) {
            historicalData = generateFallbackData();
        }
    }
    return historicalData;
}

function generateFallbackData() {
    return {
        regional_averages: { default: 650 },
        seasonal_trends: { spring: 0.9, summer: 1.3, autumn: 0.95, winter: 1.2 },
        peak_hours: [18, 19, 20, 21],
        efficiency_benchmarks: { excellent: 400, good: 600, average: 800, poor: 1200 }
    };
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/predict', async (req, res) => {
    try {
        const { location, appliances, householdSize, currentUsage, preferences } = req.body;
        
        const weatherData = await getEnhancedWeatherData(location);
        const prediction = await generateAdvancedPrediction({
            location,
            appliances,
            householdSize,
            currentUsage,
            preferences,
            weather: weatherData
        });
        
        res.json({
            success: true,
            prediction: prediction.consumption,
            confidence: prediction.confidence,
            billEstimate: prediction.billEstimate,
            savings: prediction.savings,
            recommendations: prediction.recommendations,
            weatherImpact: prediction.weatherImpact,
            carbonFootprint: prediction.carbonFootprint,
            efficiency: prediction.efficiency,
            trends: prediction.trends,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Prediction service temporarily unavailable'
        });
    }
});

async function getEnhancedWeatherData(location) {
    const baseTemp = 20 + Math.random() * 15;
    return {
        temperature: Math.round(baseTemp * 10) / 10,
        humidity: Math.round((40 + Math.random() * 40) * 10) / 10,
        pressure: Math.round((1000 + Math.random() * 50) * 10) / 10,
        windSpeed: Math.round(Math.random() * 10 * 10) / 10,
        cloudiness: Math.round(Math.random() * 100),
        season: getCurrentSeason(),
        location: location || 'Demo City'
    };
}

function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
}

async function generateAdvancedPrediction(data) {
    const baseConsumption = calculateEnhancedBaseConsumption(data);
    const weatherAdjustment = calculateAdvancedWeatherAdjustment(data.weather);
    const applianceConsumption = calculateSmartApplianceConsumption(data.appliances, data.weather);
    const seasonalAdjustment = calculateSeasonalAdjustment(data.weather.season);
    
    const rawConsumption = (baseConsumption + weatherAdjustment + applianceConsumption) * seasonalAdjustment;
    const finalConsumption = Math.max(rawConsumption, 50);
    
    const confidence = calculatePredictionConfidence(data);
    const billEstimate = calculateEnhancedBillEstimate(finalConsumption, data.location);
    const carbonFootprint = calculateCarbonFootprint(finalConsumption, data.location);
    
    return {
        consumption: Math.round(finalConsumption),
        confidence: Math.round(confidence * 100) / 100,
        billEstimate: Math.round(billEstimate * 100) / 100,
        savings: generateAdvancedSavings(finalConsumption, data),
        recommendations: generateIntelligentRecommendations(data),
        weatherImpact: Math.round(weatherAdjustment),
        carbonFootprint: Math.round(carbonFootprint * 100) / 100,
        efficiency: calculateEfficiencyScore(data),
        trends: generateTrendAnalysis(data)
    };
}

function calculateEnhancedBaseConsumption(data) {
    const basePerPerson = 280;
    const householdFactor = Math.pow(data.householdSize, 0.8);
    return basePerPerson * householdFactor;
}

function calculateAdvancedWeatherAdjustment(weather) {
    let adjustment = 0;
    
    if (weather.temperature > 30) adjustment += 180 + (weather.temperature - 30) * 8;
    if (weather.temperature < 5) adjustment += 250 + (5 - weather.temperature) * 12;
    if (weather.temperature > 25 && weather.temperature <= 30) adjustment += (weather.temperature - 25) * 15;
    
    if (weather.humidity > 75) adjustment += 40 + (weather.humidity - 75) * 2;
    if (weather.humidity < 30) adjustment += 20;
    
    return adjustment;
}

function calculateSmartApplianceConsumption(appliances, weather) {
    const enhancedApplianceRates = {
        'air_conditioner': {
            base: 220,
            tempMultiplier: weather.temperature > 25 ? 1 + (weather.temperature - 25) * 0.08 : 0.3
        },
        'heater': {
            base: 200,
            tempMultiplier: weather.temperature < 15 ? 1 + (15 - weather.temperature) * 0.1 : 0.1
        },
        'refrigerator': {
            base: 55,
            tempMultiplier: weather.temperature > 25 ? 1 + (weather.temperature - 25) * 0.02 : 1
        },
        'washing_machine': { base: 35, tempMultiplier: 1 },
        'dishwasher': { base: 28, tempMultiplier: 1 },
        'tv': { base: 18, tempMultiplier: 1 },
        'computer': { base: 25, tempMultiplier: 1 }
    };
    
    return appliances.reduce((total, appliance) => {
        const config = enhancedApplianceRates[appliance];
        if (config) {
            const consumption = config.base * config.tempMultiplier;
            return total + consumption;
        }
        return total + 15;
    }, 0);
}

function calculateSeasonalAdjustment(season) {
    const adjustments = { spring: 0.9, summer: 1.3, autumn: 0.95, winter: 1.2 };
    return adjustments[season] || 1.0;
}

function calculatePredictionConfidence(data) {
    let confidence = 0.85;
    if (data.currentUsage > 0) confidence += 0.1;
    if (data.appliances.length > 3) confidence += 0.05;
    return Math.min(confidence, 0.98);
}

function calculateEnhancedBillEstimate(consumption, location) {
    const rates = {
        'california': 23, 'texas': 10, 'new york': 15, 'florida': 11,
        'default': 12, 'india': 6.5, 'punjab': 5.8, 'delhi': 7.2, 'mumbai': 8.1, 'bangalore': 6.9
    };
    const rate = rates[location?.toLowerCase()] || rates.india;
    return consumption * rate;
}

function calculateCarbonFootprint(consumption, location) {
    const emissionFactors = {
        'california': 0.28, 'texas': 0.45, 'new york': 0.32, 'florida': 0.42,
        'default': 0.35, 'india': 0.82, 'punjab': 0.78, 'delhi': 0.85
    };
    const factor = emissionFactors[location?.toLowerCase()] || emissionFactors.default;
    return consumption * factor;
}

function generateAdvancedSavings(consumption, data) {
    const potentialSavings = Math.round(consumption * 0.22);
    const monthlySavings = potentialSavings * 6.5; // Indian rupee rate
    
    return {
        amount: potentialSavings,
        percentage: 22,
        monthlySavings: Math.round(monthlySavings * 100) / 100,
        yearlyImpact: Math.round(monthlySavings * 12 * 100) / 100,
        carbonReduction: Math.round(potentialSavings * 0.35 * 100) / 100
    };
}

function generateIntelligentRecommendations(data) {
    const recommendations = [];
    
    if (data.appliances.includes('air_conditioner')) {
        recommendations.push({
            category: 'Cooling',
            suggestion: 'Install smart thermostats to optimize AC usage and save 15-20%',
            impact: 'High',
            savings: 'Rs 2000-3200/month'
        });
    }
    
    if (data.weather.temperature > 30) {
        recommendations.push({
            category: 'Weather Adaptation',
            suggestion: 'Use ceiling fans with AC to feel 4°C cooler at higher thermostat settings',
            impact: 'Medium',
            savings: 'Rs 1200-2000/month'
        });
    }
    
    recommendations.push({
        category: 'Smart Technology',
        suggestion: 'Upgrade to LED bulbs and smart switches for 60% lighting energy reduction',
        impact: 'High',
        savings: 'Rs 800-1600/month'
    });
    
    if (data.householdSize > 3) {
        recommendations.push({
            category: 'Behavioral',
            suggestion: 'Implement energy monitoring dashboard for family awareness',
            impact: 'Medium',
            savings: 'Rs 1600-2800/month'
        });
    }
    
    return recommendations;
}

function calculateEfficiencyScore(data) {
    let score = 70;
    
    if (data.appliances.includes('air_conditioner') && data.weather.temperature > 25) score -= 10;
    if (data.appliances.includes('heater') && data.weather.temperature < 15) score -= 8;
    if (data.householdSize <= 2) score += 5;
    if (data.appliances.length <= 4) score += 10;
    
    return Math.max(Math.min(score, 100), 20);
}

function generateTrendAnalysis(data) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseConsumption = data.currentUsage || 600;
    
    return months.map((month, index) => {
        const seasonal = index >= 5 && index <= 7 ? 1.3 : index >= 11 || index <= 1 ? 1.2 : 0.9;
        const variation = (Math.random() - 0.5) * 0.2;
        return {
            month,
            predicted: Math.round(baseConsumption * seasonal * (1 + variation)),
            optimized: Math.round(baseConsumption * seasonal * 0.78 * (1 + variation))
        };
    });
}

app.listen(PORT, () => {
    console.log(`🌱 EcoWatt AI Professional Platform running on port ${PORT}`);
    console.log(`🚀 Visit: http://localhost:${PORT}`);
});