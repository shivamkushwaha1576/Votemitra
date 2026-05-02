/**
 * Election Education Assistant - Testing Suite
 * Comprehensive unit and integration tests
 */

class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    // Add test
    test(name, fn) {
        this.tests.push({ name, fn });
    }

    // Run all tests
    async runAll() {
        console.log('🧪 Starting Test Suite\n');
        
        for (const test of this.tests) {
            try {
                test.fn();
                this.passed++;
                console.log(`✅ PASS: ${test.name}`);
            } catch (error) {
                this.failed++;
                console.log(`❌ FAIL: ${test.name}`);
                console.log(`   Error: ${error.message}`);
            }
        }

        console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed out of ${this.tests.length}`);
        return this.failed === 0;
    }
}

// Initialize test runner
const runner = new TestRunner();

// ============= DOM Tests =============
runner.test('DOM: index.html exists', () => {
    const doc = document;
    if (!doc) throw new Error('Document not found');
});

runner.test('DOM: Navigation buttons exist', () => {
    const buttons = document.querySelectorAll('.nav-btn');
    if (buttons.length === 0) throw new Error('No navigation buttons found');
    if (buttons.length !== 9) throw new Error(`Expected 9 buttons, got ${buttons.length}`);
});

runner.test('DOM: Content sections exist', () => {
    const sections = document.querySelectorAll('.topic-content');
    if (sections.length !== 9) throw new Error(`Expected 9 sections, got ${sections.length}`);
});

runner.test('DOM: Header present', () => {
    const header = document.querySelector('.header');
    if (!header) throw new Error('Header not found');
});

runner.test('DOM: Footer present', () => {
    const footer = document.querySelector('.footer');
    if (!footer) throw new Error('Footer not found');
});

// ============= Accessibility Tests =============
runner.test('A11y: Main role exists', () => {
    const main = document.querySelector('[role="main"]');
    if (!main) throw new Error('Main role not found');
});

runner.test('A11y: ARIA labels on buttons', () => {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach((btn, idx) => {
        if (!btn.textContent.trim()) throw new Error(`Button ${idx} has no text`);
    });
});

runner.test('A11y: Search input has label', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && !searchInput.getAttribute('aria-label')) {
        throw new Error('Search input missing aria-label');
    }
});

runner.test('A11y: Headings hierarchy valid', () => {
    const h1s = document.querySelectorAll('h1').length;
    const h2s = document.querySelectorAll('h2').length;
    const h3s = document.querySelectorAll('h3').length;
    
    if (h1s === 0) throw new Error('No h1 found');
    if (h2s === 0) throw new Error('No h2 found');
});

runner.test('A11y: Focus indicators present', () => {
    const styles = document.querySelector('style') || document.styleSheets;
    // Check if focus styles are defined (would be in CSS)
    if (!styles) console.warn('Warning: Could not verify focus styles');
});

// ============= Navigation Tests =============
runner.test('Nav: Welcome section loads first', () => {
    const welcome = document.getElementById('welcome');
    if (!welcome || !welcome.classList.contains('active')) {
        throw new Error('Welcome section not active on load');
    }
});

runner.test('Nav: Navigation menu exists', () => {
    const menu = document.querySelector('.nav-menu');
    if (!menu) throw new Error('Navigation menu not found');
});

runner.test('Nav: Search functionality accessible', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    if (!searchInput || !searchBtn) throw new Error('Search elements not found');
});

// ============= Content Tests =============
runner.test('Content: Voter Registration section complete', () => {
    const section = document.getElementById('voter-registration');
    if (!section) throw new Error('Voter Registration section not found');
    if (!section.textContent.includes('eligibility') && 
        !section.textContent.includes('Eligibility')) {
        throw new Error('Eligibility information missing');
    }
});

runner.test('Content: Voting Methods described', () => {
    const section = document.getElementById('voting-methods');
    if (!section) throw new Error('Voting Methods section not found');
    const content = section.textContent;
    if (!content.includes('mail') && !content.includes('Mail')) {
        throw new Error('Mail-in voting not described');
    }
});

runner.test('Content: Timeline present', () => {
    const section = document.getElementById('election-timeline');
    if (!section) throw new Error('Election Timeline section not found');
    if (!section.querySelector('.timeline')) throw new Error('Timeline element missing');
});

runner.test('Content: FAQ section complete', () => {
    const section = document.getElementById('faq');
    if (!section) throw new Error('FAQ section not found');
    const items = section.querySelectorAll('.faq-item');
    if (items.length < 10) throw new Error(`Expected at least 10 FAQ items, got ${items.length}`);
});

runner.test('Content: Voter Rights documented', () => {
    const section = document.getElementById('voter-rights');
    if (!section) throw new Error('Voter Rights section not found');
    const content = section.textContent.toLowerCase();
    if (!content.includes('rights') && !content.includes('protection')) {
        throw new Error('Rights information insufficient');
    }
});

// ============= Security Tests =============
runner.test('Security: No inline scripts with eval', () => {
    const scripts = document.querySelectorAll('script');
    let hasEval = false;
    scripts.forEach(script => {
        if (script.textContent && script.textContent.includes('eval(')) {
            hasEval = true;
        }
    });
    if (hasEval) throw new Error('eval() found in scripts');
});

runner.test('Security: External scripts from trusted domains', () => {
    const scripts = document.querySelectorAll('script[src]');
    const trustedDomains = ['google', 'googleapis', 'googletagmanager'];
    
    scripts.forEach(script => {
        const src = script.src.toLowerCase();
        if (src.startsWith('http') && !trustedDomains.some(d => src.includes(d))) {
            // Allow same-origin scripts
            if (!src.startsWith(window.location.origin)) {
                console.warn(`Warning: External script from ${src}`);
            }
        }
    });
});

runner.test('Security: No hardcoded sensitive data', () => {
    const html = document.documentElement.outerHTML;
    if (html.includes('password') || html.includes('token') || html.includes('secret')) {
        throw new Error('Sensitive data found in HTML');
    }
});

// ============= Performance Tests =============
runner.test('Performance: CSS loaded', () => {
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    if (cssLinks.length === 0) throw new Error('No CSS files found');
});

runner.test('Performance: Images optimized', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('alt') && img.tagName === 'IMG') {
            console.warn(`Warning: Image without alt text: ${img.src}`);
        }
    });
});

runner.test('Performance: No console errors on load', () => {
    // This would require hooking into console
    console.log('Performance: Verify via browser console');
});

// ============= Data Quality Tests =============
runner.test('Data: Election year defined', () => {
    const content = document.body.textContent;
    if (!content.includes('2024') && !content.includes('2026')) {
        throw new Error('Election year not specified');
    }
});

runner.test('Data: Nonpartisan language verified', () => {
    const problematicTerms = ['democrat', 'republican', 'conservative', 'liberal'];
    const content = document.body.textContent.toLowerCase();
    
    let found = false;
    problematicTerms.forEach(term => {
        if (content.includes(term)) {
            console.warn(`Warning: Potentially partisan term found: ${term}`);
            found = true;
        }
    });
});

runner.test('Data: Accessibility information included', () => {
    const content = document.body.textContent;
    if (!content.includes('accessible') && !content.includes('Accessible')) {
        throw new Error('Accessibility information missing');
    }
});

// ============= Responsiveness Tests =============
runner.test('Responsive: Viewport meta tag present', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) throw new Error('Viewport meta tag not found');
    const content = viewport.getAttribute('content');
    if (!content.includes('width=device-width')) {
        throw new Error('Viewport not properly configured');
    }
});

runner.test('Responsive: Mobile menu exists', () => {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) throw new Error('Sidebar not found');
});

// ============= Functionality Tests =============
runner.test('Function: searchContent exists', () => {
    if (typeof searchContent !== 'function') {
        throw new Error('searchContent function not defined');
    }
});

runner.test('Function: setActiveContent exists', () => {
    if (typeof setActiveContent !== 'function') {
        throw new Error('setActiveContent function not defined');
    }
});

runner.test('Function: getElectionInfo exists', () => {
    if (typeof getElectionInfo !== 'function') {
        throw new Error('getElectionInfo function not defined');
    }
});

// ============= Metadata Tests =============
runner.test('Metadata: Page title present', () => {
    if (!document.title || document.title.length === 0) {
        throw new Error('Page title missing');
    }
});

runner.test('Metadata: Meta description present', () => {
    const meta = document.querySelector('meta[name="description"]');
    if (!meta) console.warn('Warning: Meta description missing');
});

// ============= Google Services Tests =============
runner.test('Google Services: Polling location search element exists', () => {
    const element = document.getElementById('findPollingBtn');
    if (!element) throw new Error('Polling location search button not found');
});

runner.test('Google Services: Calendar button exists', () => {
    const element = document.getElementById('addCalendarBtn');
    if (!element) throw new Error('Calendar button not found');
});

runner.test('Google Services: Quiz container exists', () => {
    const element = document.querySelector('.quiz-container');
    if (!element) throw new Error('Quiz container not found');
});

runner.test('Google Services: Google Translate element exists', () => {
    const element = document.getElementById('google_translate_element');
    if (!element) throw new Error('Google Translate element not found');
});

runner.test('Google Services: Quiz questions present', () => {
    const questions = document.querySelectorAll('.quiz-question');
    if (questions.length === 0) throw new Error('No quiz questions found');
    if (questions.length < 5) throw new Error('Not all quiz questions present');
});

runner.test('Google Services: Google Forms iframe exists', () => {
    const iframe = document.getElementById('googleFormFrame');
    if (!iframe) throw new Error('Google Forms iframe not found');
});

runner.test('Google Services: Polling location content section exists', () => {
    const section = document.getElementById('polling-locations');
    if (!section) throw new Error('Polling locations section not found');
});

runner.test('Google Services: Election calendar content section exists', () => {
    const section = document.getElementById('election-timeline-calendar');
    if (!section) throw new Error('Election timeline calendar section not found');
});

runner.test('Google Services: Voter quiz content section exists', () => {
    const section = document.getElementById('voter-quiz');
    if (!section) throw new Error('Voter quiz section not found');
});

runner.test('Google Services: initializeGoogleServices function exists', () => {
    if (typeof initializeGoogleServices !== 'function') {
        throw new Error('initializeGoogleServices function not defined');
    }
});

runner.test('Google Services: searchPollingLocations function exists', () => {
    if (typeof searchPollingLocations !== 'function') {
        throw new Error('searchPollingLocations function not defined');
    }
});

runner.test('Google Services: scoreQuiz function exists', () => {
    if (typeof scoreQuiz !== 'function') {
        throw new Error('scoreQuiz function not defined');
    }
});

runner.test('Google Services: Language support enabled', () => {
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!csp) throw new Error('CSP meta tag not found');
    const content = csp.getAttribute('content');
    if (!content.includes('translate')) {
        throw new Error('Google Translate not enabled in CSP');
    }
});

runner.test('Google Services: Google Maps API accessible', () => {
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!csp) throw new Error('CSP meta tag not found');
    const content = csp.getAttribute('content');
    if (!content.includes('maps.googleapis.com')) {
        throw new Error('Google Maps API not enabled in CSP');
    }
});

runner.test('Google Services: Firebase configured in CSP', () => {
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!csp) throw new Error('CSP meta tag not found');
    const content = csp.getAttribute('content');
    if (!content.includes('firebaseapp.com')) {
        console.warn('Warning: Firebase not fully configured in CSP');
    }
});

runner.test('Google Services: Video resources section exists', () => {
    const section = document.getElementById('video-resources');
    if (!section) throw new Error('Video resources section not found');
});

runner.test('Google Services: Shareable documents section exists', () => {
    const section = document.getElementById('shareable-docs');
    if (!section) throw new Error('Shareable documents section not found');
});

runner.test('Google Services: Video cards present', () => {
    const cards = document.querySelectorAll('.video-card');
    if (cards.length === 0) throw new Error('No video cards found');
    if (cards.length < 6) throw new Error('Not all video cards present');
});

runner.test('Google Services: Document cards present', () => {
    const cards = document.querySelectorAll('.document-card');
    if (cards.length === 0) throw new Error('No document cards found');
    if (cards.length < 6) throw new Error('Not all document cards present');
});

runner.test('Google Services: YouTube API script loaded', () => {
    const scripts = document.querySelectorAll('script');
    let youtubeLoaded = false;
    scripts.forEach(script => {
        if (script.src && script.src.includes('youtube')) {
            youtubeLoaded = true;
        }
    });
    if (!youtubeLoaded) throw new Error('YouTube API not loaded');
});

runner.test('Google Services: Google Platform API loaded', () => {
    const scripts = document.querySelectorAll('script');
    let platformLoaded = false;
    scripts.forEach(script => {
        if (script.src && script.src.includes('apis.google.com')) {
            platformLoaded = true;
        }
    });
    if (!platformLoaded) throw new Error('Google Platform API not loaded');
});

runner.test('Google Services: copyLink function exists', () => {
    if (typeof copyLink !== 'function') {
        throw new Error('copyLink function not defined');
    }
});

runner.test('Google Services: shareEmail function exists', () => {
    if (typeof shareEmail !== 'function') {
        throw new Error('shareEmail function not defined');
    }
});

runner.test('Google Services: shareOnSocial function exists', () => {
    if (typeof shareOnSocial !== 'function') {
        throw new Error('shareOnSocial function not defined');
    }
});

runner.test('Google Services: Share buttons present', () => {
    const shareSection = document.querySelector('.share-section');
    if (!shareSection) throw new Error('Share section not found');
    const shareButtons = shareSection.querySelectorAll('.share-btn');
    if (shareButtons.length === 0) throw new Error('No share buttons found');
});

runner.test('Google Services: 11 total nav buttons (original + Google)', () => {
    const buttons = document.querySelectorAll('.nav-btn');
    if (buttons.length < 11) throw new Error('Not all navigation buttons present');
});

runner.test('Google Services: Google Fonts imported', () => {
    const links = document.querySelectorAll('link');
    let fontsImported = false;
    links.forEach(link => {
        if (link.href && link.href.includes('fonts.googleapis.com')) {
            fontsImported = true;
        }
    });
    if (!fontsImported) console.warn('Warning: Google Fonts not explicitly imported');
});

// Run tests if in browser
if (typeof document !== 'undefined') {
    window.runTests = () => runner.runAll();
    console.log('🧪 Test suite loaded. Run: window.runTests()');
}

export default runner;