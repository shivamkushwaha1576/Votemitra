/**
 * Performance Optimization Report
 * Election Education Assistant
 */

const performanceMetrics = {
    pageLoadTime: 0,
    resourceTiming: {},
    recommendations: []
};

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
    if (!window.performance || !window.performance.timing) return;
    
    window.addEventListener('load', function() {
        calculateMetrics();
        logMetrics();
    });
}

/**
 * Calculate performance metrics
 */
function calculateMetrics() {
    const timing = performance.timing;
    const navigation = performance.navigation;
    
    performanceMetrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    performanceMetrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
    performanceMetrics.timeToFirstByte = timing.responseStart - timing.navigationStart;
    performanceMetrics.domProcessing = timing.domContentLoadedEventEnd - timing.domLoading;
    performanceMetrics.resourceTiming = {
        scripts: performance.getEntriesByType('script').length,
        stylesheets: performance.getEntriesByType('link').length,
        images: performance.getEntriesByType('img').length
    };
    
    // Generate recommendations
    generateRecommendations();
}

/**
 * Generate performance recommendations
 */
function generateRecommendations() {
    const metrics = performanceMetrics;
    
    if (metrics.pageLoadTime > 3000) {
        metrics.recommendations.push({
            priority: 'HIGH',
            issue: 'Page load time > 3s',
            suggestion: 'Implement code splitting or lazy loading'
        });
    }
    
    if (metrics.resourceTiming.scripts > 5) {
        metrics.recommendations.push({
            priority: 'MEDIUM',
            issue: 'Too many script files',
            suggestion: 'Combine scripts using bundler'
        });
    }
    
    if (metrics.domProcessing > 1000) {
        metrics.recommendations.push({
            priority: 'MEDIUM',
            issue: 'DOM processing slow',
            suggestion: 'Optimize JavaScript execution'
        });
    }
}

/**
 * Log performance metrics
 */
function logMetrics() {
    console.log('📊 Performance Metrics:');
    console.log(`⏱️  Page Load Time: ${performanceMetrics.pageLoadTime}ms`);
    console.log(`⏱️  DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);
    console.log(`⏱️  Time to First Byte: ${performanceMetrics.timeToFirstByte}ms`);
    console.log(`⏱️  DOM Processing: ${performanceMetrics.domProcessing}ms`);
    
    if (performanceMetrics.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        performanceMetrics.recommendations.forEach(rec => {
            console.log(`[${rec.priority}] ${rec.issue}: ${rec.suggestion}`);
        });
    } else {
        console.log('\n✅ Performance is optimal!');
    }
}

/**
 * Generate performance report
 */
function getPerformanceReport() {
    return {
        metrics: performanceMetrics,
        timestamp: new Date().toISOString(),
        browser: navigator.userAgent,
        url: window.location.href
    };
}

/**
 * Measure Core Web Vitals (if available)
 */
function measureCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('📊 Largest Contentful Paint (LCP):', lastEntry.renderTime || lastEntry.loadTime);
            });
            observer.observe({entryTypes: ['largest-contentful-paint']});
        } catch (e) {
            console.warn('LCP not supported');
        }
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceMonitoring);
} else {
    initPerformanceMonitoring();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { performanceMetrics, calculateMetrics, getPerformanceReport };
}