document.addEventListener('DOMContentLoaded', function() {
    const app = new EcoWattAI();
});

class EcoWattAI {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadDashboard();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = item.dataset.section;
                
                navItems.forEach(nav => nav.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                
                item.classList.add('active');
                document.getElementById(`${targetSection}-section`).classList.add('active');
                
                this.updateHeader(targetSection);
            });
        });
    }

    updateHeader(section) {
        const titles = {
            dashboard: 'Energy Dashboard',
            prediction: 'AI Prediction Engine',
            analytics: 'Advanced Analytics'
        };
        
        document.getElementById('section-title').textContent = titles[section];
    }

    setupEventListeners() {
        const form = document.getElementById('advancedPredictionForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handlePrediction(e));
        }
    }

    async handlePrediction(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const appliances = Array.from(document.querySelectorAll('input[name="appliances"]:checked'))
            .map(checkbox => checkbox.value);
        
        const data = {
            location: formData.get('location'),
            householdSize: parseInt(formData.get('householdSize')),
            currentUsage: parseInt(formData.get('currentUsage')) || 0,
            appliances: appliances
        };

        try {
            this.showLoading();
            
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (result.success) {
                this.displayResults(result);
                this.updateDashboard(result);
            } else {
                alert('Prediction failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error. Please try again.');
        }
    }

    showLoading() {
        const button = document.querySelector('.predict-btn');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        button.disabled = true;
    }

    displayResults(result) {
        document.getElementById('consumptionResult').textContent = `${result.prediction} kWh`;
        document.getElementById('confidenceLevel').textContent = `${result.confidence}%`;
        document.getElementById('billResult').textContent = `Rs ${result.billEstimate}`;
        document.getElementById('savingsResult').textContent = `Rs ${result.savings.monthlySavings}`;
        document.getElementById('carbonResult').textContent = `${result.carbonFootprint} kg CO₂`;
        
        this.displayRecommendations(result.recommendations);
        this.createForecastChart(result.trends);
        
        document.getElementById('predictionResults').style.display = 'block';

        const button = document.querySelector('.predict-btn');
        button.innerHTML = '<i class="fas fa-brain"></i> Generate AI Prediction';
        button.disabled = false;
    }

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendationsList');
        container.innerHTML = '';
        
        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            card.innerHTML = `
                <h4>${rec.category}</h4>
                <p>${rec.suggestion}</p>
                <div class="recommendation-meta">
                    <span class="impact-${rec.impact.toLowerCase()}">${rec.impact} Impact</span>
                    <span>${rec.savings}</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    updateDashboard(result) {
        document.getElementById('current-consumption').textContent = `${result.prediction} kWh`;
        document.getElementById('monthly-bill').textContent = `Rs ${result.billEstimate}`;
        document.getElementById('carbon-footprint').textContent = `${result.carbonFootprint} kg CO₂`;
        document.getElementById('efficiency-score').textContent = `${result.efficiency}%`;
    }

    loadDashboard() {
        this.createTrendChart();
        this.createApplianceChart();
    }

    createTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentData = [650, 580, 520, 480, 520, 680, 750, 720, 600, 550, 580, 620];
        const optimizedData = currentData.map(val => Math.round(val * 0.78));

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Current Consumption',
                    data: currentData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'AI Optimized',
                    data: optimizedData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Energy Consumption (kWh)' }
                    }
                }
            }
        });
    }

    createApplianceChart() {
        const ctx = document.getElementById('applianceChart');
        if (!ctx) return;

        this.charts.appliance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['AC/Heating', 'Refrigerator', 'Lighting', 'Electronics', 'Others'],
                datasets: [{
                    data: [35, 20, 15, 20, 10],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#2563eb', '#8b5cf6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    createForecastChart(trends) {
        const ctx = document.getElementById('forecastChart');
        if (!ctx || !trends) return;

        if (this.charts.forecast) {
            this.charts.forecast.destroy();
        }

        const labels = trends.map(t => t.month);
        const predicted = trends.map(t => t.predicted);
        const optimized = trends.map(t => t.optimized);

        this.charts.forecast = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Predicted Consumption',
                    data: predicted,
                    backgroundColor: 'rgba(239, 68, 68, 0.8)'
                }, {
                    label: 'Optimized Consumption',
                    data: optimized,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Energy Consumption (kWh)' }
                    }
                }
            }
        });
    }
}