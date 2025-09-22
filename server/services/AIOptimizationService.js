const User = require('../models/User');
const WasteRequest = require('../models/WasteRequest');

class AIOptimizationService {
  constructor() {
    this.algorithms = {
      NEAREST_NEIGHBOR: 'nearest_neighbor',
      GENETIC_ALGORITHM: 'genetic_algorithm',
      SIMULATED_ANNEALING: 'simulated_annealing',
      MACHINE_LEARNING: 'machine_learning'
    };
  }

  // ==================== ROUTE OPTIMIZATION ====================

  /**
   * Optimize collection routes using AI algorithms
   * @param {Array} requests - Array of waste requests
   * @param {Array} collectors - Array of available collectors
   * @param {Object} options - Optimization parameters
   */
  async optimizeRoutes(requests, collectors, options = {}) {
    try {
      const {
        algorithm = this.algorithms.NEAREST_NEIGHBOR,
        maxDistance = 50000, // 50km
        maxRequestsPerCollector = 10,
        timeWindow = { start: 8, end: 18 }, // 8h-18h
        prioritizeUrgent = true
      } = options;

      console.log(`🤖 Starting route optimization with ${algorithm} for ${requests.length} requests`);

      // Pre-process data
      const processedRequests = await this.preprocessRequests(requests);
      const availableCollectors = await this.filterAvailableCollectors(collectors);

      let optimizedRoutes;
      
      switch (algorithm) {
        case this.algorithms.NEAREST_NEIGHBOR:
          optimizedRoutes = await this.nearestNeighborOptimization(processedRequests, availableCollectors, options);
          break;
        case this.algorithms.GENETIC_ALGORITHM:
          optimizedRoutes = await this.geneticAlgorithmOptimization(processedRequests, availableCollectors, options);
          break;
        case this.algorithms.MACHINE_LEARNING:
          optimizedRoutes = await this.mlBasedOptimization(processedRequests, availableCollectors, options);
          break;
        default:
          optimizedRoutes = await this.nearestNeighborOptimization(processedRequests, availableCollectors, options);
      }

      // Calculate optimization metrics
      const metrics = this.calculateOptimizationMetrics(optimizedRoutes);
      
      console.log('📊 Optimization Results:', {
        totalRoutes: optimizedRoutes.length,
        totalDistance: metrics.totalDistance,
        averageEfficiency: metrics.averageEfficiency,
        estimatedTime: metrics.estimatedTime
      });

      return {
        success: true,
        routes: optimizedRoutes,
        metrics,
        algorithm,
        optimizedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Route optimization failed:', error);
      return {
        success: false,
        error: error.message,
        routes: []
      };
    }
  }

  // ==================== NEAREST NEIGHBOR ALGORITHM ====================

  async nearestNeighborOptimization(requests, collectors, options) {
    const routes = [];
    const unassignedRequests = [...requests];
    
    for (const collector of collectors) {
      if (unassignedRequests.length === 0) break;

      const route = {
        collectorId: collector._id,
        collectorName: `${collector.firstName} ${collector.lastName}`,
        startLocation: collector.lastLocation?.coordinates || [4.0511, 9.7679], // Default Douala
        requests: [],
        totalDistance: 0,
        estimatedTime: 0,
        efficiency: 0
      };

      let currentLocation = route.startLocation;
      let requestsInRoute = 0;
      const maxRequests = options.maxRequestsPerCollector || 10;

      while (unassignedRequests.length > 0 && requestsInRoute < maxRequests) {
        // Find nearest request
        let nearestRequest = null;
        let minDistance = Infinity;
        let nearestIndex = -1;

        for (let i = 0; i < unassignedRequests.length; i++) {
          const request = unassignedRequests[i];
          const distance = this.calculateDistance(currentLocation, request.coordinates);
          
          // Apply urgency multiplier
          let adjustedDistance = distance;
          if (options.prioritizeUrgent && request.urgency === 'urgent') {
            adjustedDistance *= 0.5; // Prioritize urgent requests
          } else if (request.urgency === 'high') {
            adjustedDistance *= 0.7;
          }

          if (adjustedDistance < minDistance && distance <= options.maxDistance) {
            minDistance = adjustedDistance;
            nearestRequest = request;
            nearestIndex = i;
          }
        }

        if (nearestRequest) {
          route.requests.push(nearestRequest);
          route.totalDistance += this.calculateDistance(currentLocation, nearestRequest.coordinates);
          currentLocation = nearestRequest.coordinates;
          unassignedRequests.splice(nearestIndex, 1);
          requestsInRoute++;
        } else {
          break; // No more reachable requests
        }
      }

      if (route.requests.length > 0) {
        // Calculate route metrics
        route.estimatedTime = this.estimateRouteTime(route);
        route.efficiency = this.calculateRouteEfficiency(route);
        routes.push(route);
      }
    }

    return routes;
  }

  // ==================== GENETIC ALGORITHM ====================

  async geneticAlgorithmOptimization(requests, collectors, options) {
    const populationSize = 50;
    const generations = 100;
    const mutationRate = 0.1;
    const crossoverRate = 0.8;

    console.log('🧬 Starting Genetic Algorithm optimization...');

    // Initialize population
    let population = this.initializePopulation(requests, collectors, populationSize);
    
    for (let generation = 0; generation < generations; generation++) {
      // Evaluate fitness
      population = population.map(individual => ({
        ...individual,
        fitness: this.calculateFitness(individual)
      }));

      // Sort by fitness (higher is better)
      population.sort((a, b) => b.fitness - a.fitness);

      // Create new generation
      const newPopulation = [];
      
      // Keep best individuals (elitism)
      const eliteCount = Math.floor(populationSize * 0.2);
      for (let i = 0; i < eliteCount; i++) {
        newPopulation.push({ ...population[i] });
      }

      // Generate offspring
      while (newPopulation.length < populationSize) {
        const parent1 = this.tournamentSelection(population);
        const parent2 = this.tournamentSelection(population);
        
        let offspring1, offspring2;
        if (Math.random() < crossoverRate) {
          [offspring1, offspring2] = this.crossover(parent1, parent2);
        } else {
          offspring1 = { ...parent1 };
          offspring2 = { ...parent2 };
        }

        if (Math.random() < mutationRate) {
          offspring1 = this.mutate(offspring1);
        }
        if (Math.random() < mutationRate) {
          offspring2 = this.mutate(offspring2);
        }

        newPopulation.push(offspring1);
        if (newPopulation.length < populationSize) {
          newPopulation.push(offspring2);
        }
      }

      population = newPopulation;

      if (generation % 20 === 0) {
        console.log(`Generation ${generation}: Best fitness = ${population[0]?.fitness || 0}`);
      }
    }

    // Return best solution
    const bestSolution = population[0];
    return this.convertToRouteFormat(bestSolution, collectors);
  }

  // ==================== MACHINE LEARNING OPTIMIZATION ====================

  async mlBasedOptimization(requests, collectors, options) {
    console.log('🧠 Starting ML-based optimization...');

    // Feature extraction
    const features = this.extractFeatures(requests, collectors);
    
    // Predict optimal assignments using trained model
    // In production, this would use a real ML model (TensorFlow.js, etc.)
    const predictions = this.mockMLPredictions(features);
    
    // Convert predictions to routes
    const routes = this.convertPredictionsToRoutes(predictions, requests, collectors);
    
    // Apply post-processing optimizations
    return this.postProcessRoutes(routes);
  }

  // ==================== DEMAND PREDICTION ====================

  async predictDemand(timeRange = '7d', zone = null) {
    try {
      // Analyze historical data
      const historicalData = await this.getHistoricalData(timeRange, zone);
      
      // Apply time series analysis
      const predictions = this.timeSeriesAnalysis(historicalData);
      
      // Factor in external variables (weather, events, etc.)
      const adjustedPredictions = this.adjustForExternalFactors(predictions);
      
      return {
        success: true,
        predictions: adjustedPredictions,
        confidence: 0.85,
        factors: ['historical_patterns', 'seasonal_trends', 'weather_forecast']
      };
    } catch (error) {
      console.error('❌ Demand prediction failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== COLLECTOR PERFORMANCE ANALYSIS ====================

  async analyzeCollectorPerformance(collectorId, timeRange = '30d') {
    try {
      const collector = await User.findById(collectorId);
      if (!collector) throw new Error('Collector not found');

      // Get performance data
      const performanceData = await this.getCollectorPerformanceData(collectorId, timeRange);
      
      // AI analysis
      const analysis = {
        efficiency: this.calculateEfficiencyScore(performanceData),
        strengths: this.identifyStrengths(performanceData),
        weaknesses: this.identifyWeaknesses(performanceData),
        recommendations: this.generateRecommendations(performanceData),
        predictedPerformance: this.predictFuturePerformance(performanceData),
        trainingNeeds: this.identifyTrainingNeeds(performanceData)
      };

      return {
        success: true,
        collectorId,
        analysis,
        analyzedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Performance analysis failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  calculateDistance(coord1, coord2) {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = coord1[1] * Math.PI / 180;
    const lat2Rad = coord2[1] * Math.PI / 180;
    const deltaLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const deltaLng = (coord2[0] - coord1[0]) * Math.PI / 180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  estimateRouteTime(route) {
    // Base time per request (loading, unloading, etc.)
    const baseTimePerRequest = 15; // minutes
    
    // Travel time (assuming 30 km/h average speed)
    const travelTime = (route.totalDistance / 1000) / 30 * 60; // minutes
    
    // Processing time
    const processingTime = route.requests.length * baseTimePerRequest;
    
    return travelTime + processingTime;
  }

  calculateRouteEfficiency(route) {
    if (route.requests.length === 0) return 0;
    
    // Efficiency based on distance per request and time
    const distancePerRequest = route.totalDistance / route.requests.length;
    const timePerRequest = route.estimatedTime / route.requests.length;
    
    // Lower distance and time per request = higher efficiency
    const distanceScore = Math.max(0, 100 - (distancePerRequest / 1000) * 2);
    const timeScore = Math.max(0, 100 - timePerRequest * 2);
    
    return (distanceScore + timeScore) / 2;
  }

  calculateOptimizationMetrics(routes) {
    const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
    const totalTime = routes.reduce((sum, route) => sum + route.estimatedTime, 0);
    const totalRequests = routes.reduce((sum, route) => sum + route.requests.length, 0);
    const averageEfficiency = routes.reduce((sum, route) => sum + route.efficiency, 0) / routes.length;

    return {
      totalDistance: Math.round(totalDistance),
      totalTime: Math.round(totalTime),
      totalRequests,
      averageEfficiency: Math.round(averageEfficiency * 100) / 100,
      routesCount: routes.length,
      averageRequestsPerRoute: Math.round((totalRequests / routes.length) * 100) / 100
    };
  }

  async preprocessRequests(requests) {
    return requests.map(request => ({
      ...request,
      coordinates: request.coordinates || [4.0511, 9.7679], // Default coordinates
      urgencyWeight: this.getUrgencyWeight(request.urgency),
      estimatedDuration: this.estimateCollectionDuration(request)
    }));
  }

  async filterAvailableCollectors(collectors) {
    return collectors.filter(collector => 
      collector.userType === 'collecteur' && 
      collector.onDuty === true &&
      collector.lastLocation?.coordinates
    );
  }

  getUrgencyWeight(urgency) {
    switch (urgency) {
      case 'urgent': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 2;
    }
  }

  estimateCollectionDuration(request) {
    const baseTime = 10; // minutes
    const weightFactor = (request.estimatedWeight || 10) / 10; // minutes per 10kg
    return baseTime + weightFactor * 2;
  }

  // Mock implementations for advanced algorithms
  initializePopulation(requests, collectors, size) {
    // Mock implementation
    return Array.from({ length: size }, () => ({
      assignments: this.randomAssignment(requests, collectors),
      fitness: 0
    }));
  }

  randomAssignment(requests, collectors) {
    // Mock random assignment
    return requests.map(request => ({
      requestId: request._id,
      collectorId: collectors[Math.floor(Math.random() * collectors.length)]._id
    }));
  }

  calculateFitness(individual) {
    // Mock fitness calculation
    return Math.random() * 100;
  }

  tournamentSelection(population) {
    const tournamentSize = 3;
    const tournament = [];
    for (let i = 0; i < tournamentSize; i++) {
      tournament.push(population[Math.floor(Math.random() * population.length)]);
    }
    return tournament.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    );
  }

  crossover(parent1, parent2) {
    // Mock crossover
    return [{ ...parent1 }, { ...parent2 }];
  }

  mutate(individual) {
    // Mock mutation
    return { ...individual };
  }

  convertToRouteFormat(solution, collectors) {
    // Mock conversion
    return [];
  }

  extractFeatures(requests, collectors) {
    // Mock feature extraction
    return {
      requestCount: requests.length,
      collectorCount: collectors.length,
      averageDistance: 5000
    };
  }

  mockMLPredictions(features) {
    // Mock ML predictions
    return { assignments: [] };
  }

  convertPredictionsToRoutes(predictions, requests, collectors) {
    // Mock conversion
    return [];
  }

  postProcessRoutes(routes) {
    // Mock post-processing
    return routes;
  }

  async getHistoricalData(timeRange, zone) {
    // Mock historical data
    return [];
  }

  timeSeriesAnalysis(data) {
    // Mock time series analysis
    return { nextWeek: 150, nextMonth: 600 };
  }

  adjustForExternalFactors(predictions) {
    // Mock external factor adjustment
    return predictions;
  }

  async getCollectorPerformanceData(collectorId, timeRange) {
    // Mock performance data
    return {
      completedCollections: 45,
      averageTime: 25,
      customerRating: 4.5,
      efficiency: 0.85
    };
  }

  calculateEfficiencyScore(data) {
    return data.efficiency * 100;
  }

  identifyStrengths(data) {
    return ['punctuality', 'customer_service'];
  }

  identifyWeaknesses(data) {
    return ['route_optimization'];
  }

  generateRecommendations(data) {
    return [
      'Focus on route planning to reduce travel time',
      'Continue excellent customer service practices'
    ];
  }

  predictFuturePerformance(data) {
    return {
      nextMonth: {
        efficiency: data.efficiency * 1.05,
        collections: data.completedCollections * 1.1
      }
    };
  }

  identifyTrainingNeeds(data) {
    return ['route_optimization', 'time_management'];
  }
}

module.exports = new AIOptimizationService();
