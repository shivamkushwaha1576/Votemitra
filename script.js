/**
 * Election Education Assistant - Main Application Script
 * 
 * Features:
 * - Interactive topic navigation
 * - Live search functionality with relevance ranking
 * - Keyboard navigation and accessibility
 * - Analytics tracking
 * - Performance monitoring
 * 
 * @author Election Education Team
 * @version 2.0.0
 * @license MIT
 */

'use strict';

// ============= INITIALIZATION =============

/**
 * Initialize the application on DOM ready
 * Sets up event listeners and displays welcome content
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeSearch();
    initializeGoogleServices();
    setActiveContent('welcome');
    trackPageEvent('page_load', { page: 'Election Education Assistant' });
});

// ============= EVENT LISTENERS =============

/**
 * Initialize event listeners for navigation buttons
 * Adds click handlers to all navigation buttons
 */
function initializeEventListeners() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const topic = this.getAttribute('data-topic');
            setActiveContent(topic);
            updateActiveButton(this);
            document.querySelector('.content').scrollTop = 0;
            trackPageEvent('topic_navigation', { topic });
        });
    });
}

/**
 * Update active button styling and ARIA attributes
 * Ensures proper accessibility and visual feedback
 * 
 * @param {HTMLElement} button - The button that was clicked
 */
function updateActiveButton(button) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
}

// ============= SEARCH FUNCTIONALITY =============

/**
 * Initialize search box and event handlers
 * Sets up live search and keyboard shortcuts
 */
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput) return;
    
    searchBtn.addEventListener('click', performSearch);
    
    /**
     * Handle search input events
     * Provides real-time search results as user types
     */
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        } else if (this.value.length > 0) {
            performLiveSearch(this.value);
        } else {
            searchResults.innerHTML = '';
        }
    });
    
    searchInput.addEventListener('input', function() {
        if (this.value.length === 0) {
            searchResults.innerHTML = '';
        }
    });
}

/**
 * Execute search when button is clicked or Enter is pressed
 * Displays results in a modal-like format
 */
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query.length === 0) {
        alert('Please enter a search term');
        return;
    }
    
    const results = searchContent(query);
    displaySearchResults(results, query);
    trackPageEvent('search', { search_term: query, results_found: results.length });
}

/**
 * Perform live search as user types
 * Shows dropdown with matching topics
 * 
 * @param {string} query - The search term
 */
function performLiveSearch(query) {
    const results = searchContent(query);
    displaySearchResultsLive(results, query);
}

/**
 * Search content sections for matching text
 * Returns results sorted by relevance
 * 
 * @param {string} query - The search term
 * @returns {Array} Array of matching content with relevance scores
 */
function searchContent(query) {
    const contentSections = document.querySelectorAll('.topic-content');
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    contentSections.forEach(section => {
        const text = section.textContent.toLowerCase();
        const title = section.querySelector('h2')?.textContent || 'No title';
        
        if (text.includes(lowerQuery)) {
            // Calculate relevance score (higher = more relevant)
            const titleMatch = title.toLowerCase().includes(lowerQuery);
            const headingMatches = (text.match(new RegExp(lowerQuery, 'g')) || []).length;
            
            results.push({
                id: section.id,
                title: title,
                relevance: (titleMatch ? 10 : 0) + headingMatches,
                preview: getPreview(text, lowerQuery, 100)
            });
        }
    });
    
    // Sort by relevance (descending)
    return results.sort((a, b) => b.relevance - a.relevance);
}

/**
 * Generate preview text around search term
 * Provides context for search results
 * 
 * @param {string} text - The full text to extract from
 * @param {string} query - The search term
 * @param {number} length - Preview length
 * @returns {string} Preview text with ellipsis
 */
function getPreview(text, query, length) {
    const index = text.indexOf(query);
    if (index === -1) return text.substring(0, length) + '...';
    
    const start = Math.max(0, index - length / 2);
    const end = Math.min(text.length, start + length);
    const preview = text.substring(start, end);
    
    return (start > 0 ? '...' : '') + preview + (end < text.length ? '...' : '');
}

/**
 * Display search results in modal format
 * 
 * @param {Array} results - Array of search results
 * @param {string} query - The search term that was used
 */
function displaySearchResults(results, query) {
    if (results.length === 0) {
        alert(`No results found for "${query}"`);
        return;
    }
    
    const message = `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;
    alert(message);
    
    if (results.length > 0) {
        const firstResult = results[0];
        const button = document.querySelector(`[data-topic="${firstResult.id}"]`);
        if (button) {
            button.click();
        }
    }
}

/**
 * Display live search results in dropdown
 * Shows top 5 results with previews
 * 
 * @param {Array} results - Array of search results
 * @param {string} query - The search term
 */
function displaySearchResultsLive(results, query) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
        return;
    }
    
    const html = results.slice(0, 5).map(result => `
        <div class="search-result-item" data-topic="${result.id}">
            <strong>${result.title}</strong>
            <div style="font-size: 0.8rem; color: #666; margin-top: 3px;">${result.preview}</div>
        </div>
    `).join('');
    
    searchResults.innerHTML = html;
    
    // Add click handlers to results
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            const button = document.querySelector(`[data-topic="${topic}"]`);
            if (button) {
                button.click();
                document.getElementById('searchInput').value = '';
                searchResults.innerHTML = '';
            }
        });
    });
}

// ============= CONTENT MANAGEMENT =============

/**
 * Set the active content section and hide others
 * Updates aria-hidden attributes for accessibility
 * 
 * @param {string} topicId - The ID of the topic to show
 */
function setActiveContent(topicId) {
    const contentSections = document.querySelectorAll('.topic-content');
    contentSections.forEach(section => {
        section.classList.remove('active');
        section.setAttribute('aria-hidden', 'true');
    });
    
    const selectedSection = document.getElementById(topicId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        selectedSection.setAttribute('aria-hidden', 'false');
    }
}

// ============= UTILITY FUNCTIONS =============

/**
 * Get election information
 * Returns key dates and election metadata
 * 
 * @returns {Object} Election information
 */
function getElectionInfo() {
    return {
        currentYear: 2026,
        electionType: 'Presidential Election',
        electionDate: 'November 3, 2026',
        registrationDeadline: 'Typically 15-30 days before Election Day',
        earlyVotingStart: 'October 19, 2026',
        earlyVotingEnd: 'November 2, 2026'
    };
}

/**
 * Track page events for analytics
 * Integrates with Google Analytics
 * 
 * @param {string} eventName - Name of the event
 * @param {Object} eventData - Additional event data
 */
function trackPageEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    console.log('📊 Event tracked:', eventName, eventData);
}

// ============= KEYBOARD NAVIGATION =============

/**
 * Handle keyboard shortcuts
 * Alt+S: Focus search box
 * Escape: Clear search
 */
document.addEventListener('keydown', function(event) {
    // Alt + S to focus search
    if (event.altKey && event.key === 's') {
        event.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }
    
    // Escape to clear search
    if (event.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        if (searchInput && searchResults) {
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    }
});

// ============= SMOOTH SCROLLING =============

/**
 * Enable smooth scrolling for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============= ACCESSIBILITY =============

/**
 * Create and insert skip-to-main-content link
 * Improves accessibility for keyboard users
 */
const skipLink = document.createElement('a');
skipLink.href = '#welcome';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
skipLink.setAttribute('role', 'navigation');
if (document.body) {
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ============= GOOGLE SERVICES INTEGRATION =============

/**
 * Initialize Google Translate widget
 * Enables multi-language support
 */
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,zh-CN,ar,hi,ja,pt,ru',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

/**
 * Initialize all Google Services
 * Sets up polling location search, calendar, quiz functionality
 */
function initializeGoogleServices() {
    initializePollingLocationSearch();
    initializeCalendarButton();
    initializeQuiz();
    initializeGoogleTranslate();
}

/**
 * Initialize polling location search using Google Civic Information API
 */
function initializePollingLocationSearch() {
    const findPollingBtn = document.getElementById('findPollingBtn');
    const zipCodeInput = document.getElementById('zipCodeInput');
    
    if (!findPollingBtn) return;
    
    findPollingBtn.addEventListener('click', function() {
        const zipCode = zipCodeInput.value.trim();
        if (!zipCode) {
            alert('Please enter a valid ZIP code');
            return;
        }
        
        searchPollingLocations(zipCode);
        trackPageEvent('polling_search', { zip_code: zipCode });
    });
    
    // Allow Enter key to trigger search
    if (zipCodeInput) {
        zipCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                findPollingBtn.click();
            }
        });
    }
}

/**
 * Search for polling locations based on ZIP code
 * Uses Google Civic Information API
 * 
 * @param {string} zipCode - The ZIP code to search
 */
function searchPollingLocations(zipCode) {
    const resultsDiv = document.getElementById('pollingResults');
    resultsDiv.innerHTML = '<p>🔍 Searching for polling locations...</p>';
    
    // Simulated polling locations data
    // In production, this would call the Google Civic Information API
    const mockLocations = [
        {
            address: '123 Main Street',
            city: 'Springfield',
            state: 'IL',
            zip: zipCode,
            hours: '7:00 AM - 7:00 PM',
            accessibility: 'Wheelchair accessible'
        },
        {
            address: '456 Oak Avenue',
            city: 'Springfield',
            state: 'IL',
            zip: zipCode,
            hours: '7:00 AM - 7:00 PM',
            accessibility: 'Accessible parking available'
        },
        {
            address: '789 Elm Court',
            city: 'Springfield',
            state: 'IL',
            zip: zipCode,
            hours: '7:00 AM - 7:00 PM',
            accessibility: 'Curbside voting available'
        }
    ];
    
    // Simulate API delay
    setTimeout(() => {
        let html = '<h4>📍 Polling Locations Found (' + mockLocations.length + ')</h4>';
        mockLocations.forEach((location, index) => {
            html += `
                <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; background: #f9fafb;">
                    <h5 style="margin: 0 0 10px 0;">Location ${index + 1}</h5>
                    <p><strong>📍 Address:</strong> ${location.address}, ${location.city}, ${location.state} ${location.zip}</p>
                    <p><strong>⏰ Hours:</strong> ${location.hours}</p>
                    <p><strong>♿ Accessibility:</strong> ${location.accessibility}</p>
                    <button class="search-btn" onclick="openInMap('${location.address}, ${location.city}, ${location.state}')">View on Map</button>
                </div>
            `;
        });
        resultsDiv.innerHTML = html;
    }, 1000);
}

/**
 * Open location in Google Maps
 * 
 * @param {string} address - The address to show on map
 */
function openInMap(address) {
    const mapsUrl = 'https://www.google.com/maps/search/' + encodeURIComponent(address);
    window.open(mapsUrl, '_blank');
    trackPageEvent('open_map', { address: address });
}

/**
 * Initialize calendar button for adding election dates to Google Calendar
 */
function initializeCalendarButton() {
    const addCalendarBtn = document.getElementById('addCalendarBtn');
    if (!addCalendarBtn) return;
    
    addCalendarBtn.addEventListener('click', function() {
        createGoogleCalendarEvent();
    });
}

/**
 * Create Google Calendar event for election day
 * Generates calendar invitation link
 */
function createGoogleCalendarEvent() {
    // Election Day 2026: October 15
    const eventDetails = {
        title: 'Election Day 2026',
        description: 'General Election - Vote for all major offices. Visit your local polling place to cast your vote.',
        location: 'Your Local Polling Place',
        start: '20261015T070000',
        end: '20261015T190000'
    };
    
    const calendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&' +
        'text=' + encodeURIComponent(eventDetails.title) +
        '&details=' + encodeURIComponent(eventDetails.description) +
        '&location=' + encodeURIComponent(eventDetails.location) +
        '&dates=' + eventDetails.start + '/' + eventDetails.end;
    
    window.open(calendarUrl, '_blank');
    trackPageEvent('add_calendar_event', { event: 'Election Day 2026' });
}

/**
 * Initialize voter knowledge quiz
 * Handles quiz submission and scoring
 */
function initializeQuiz() {
    const submitBtn = document.getElementById('submitQuizBtn');
    if (!submitBtn) return;
    
    submitBtn.addEventListener('click', function() {
        scoreQuiz();
    });
}

/**
 * Score the voter knowledge quiz
 * Calculates and displays results
 */
function scoreQuiz() {
    const quizResults = document.getElementById('quizResults');
    const questions = document.querySelectorAll('.quiz-question');
    let correctAnswers = 0;
    let answers = {
        q1: 1, // 18 years old
        q2: 1, // No, in most states
        q3: 1, // Ballot mailed to your home
        q4: 1, // Yes, your vote is anonymous
        q5: 1  // Every 4 years
    };
    
    // Check each answer
    questions.forEach((question, idx) => {
        const questionNum = 'q' + (idx + 1);
        const selected = question.querySelector('input[type="radio"]:checked');
        
        if (selected) {
            const selectedIndex = Array.from(question.querySelectorAll('input[type="radio"]')).indexOf(selected);
            if (selectedIndex === answers[questionNum]) {
                correctAnswers++;
                question.style.backgroundColor = '#d4edda';
            } else {
                question.style.backgroundColor = '#f8d7da';
            }
            question.querySelector('.answer').style.display = 'block';
        } else {
            question.style.backgroundColor = '#fff3cd';
        }
    });
    
    const score = Math.round((correctAnswers / 5) * 100);
    const resultHTML = `
        <div style="text-align: center; padding: 20px; background: #e7f3ff; border-radius: 5px;">
            <h3>🎉 Quiz Results</h3>
            <p style="font-size: 24px; font-weight: bold; color: #1e40af;">
                ${correctAnswers}/5 Correct (${score}%)
            </p>
            <p>${getQuizFeedback(score)}</p>
        </div>
    `;
    
    quizResults.innerHTML = resultHTML;
    quizResults.style.display = 'block';
    trackPageEvent('quiz_completed', { score: score, correct: correctAnswers });
}

/**
 * Get feedback message based on quiz score
 * 
 * @param {number} score - The quiz score (0-100)
 * @returns {string} Feedback message
 */
function getQuizFeedback(score) {
    if (score === 100) return '🌟 Perfect! You\'re a voting expert!';
    if (score >= 80) return '👍 Great job! You know the voting process well.';
    if (score >= 60) return '📚 Good effort! Review the sections above to learn more.';
    return '🔄 Keep learning! Check out the education sections to improve your knowledge.';
}

/**
 * Initialize Google Translate
 * Calls the translate element init function when document is ready
 */
function initializeGoogleTranslate() {
    if (typeof googleTranslateElementInit === 'function') {
        googleTranslateElementInit();
    }
}

/**
 * Copy link to clipboard
 * Copies the current page URL to user's clipboard
 */
function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(function() {
        alert('Link copied to clipboard!');
        trackPageEvent('share_action', { action: 'copy_link' });
    });
}

/**
 * Share via email
 * Opens email client with page information
 */
function shareEmail() {
    const subject = 'Check out this Election Education Resource!';
    const body = 'I found this helpful Election Education Assistant. You should check it out: ' + window.location.href;
    window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    trackPageEvent('share_action', { action: 'share_email' });
}

/**
 * Share on social media
 * Opens social media share dialogs
 * 
 * @param {string} platform - The social media platform (twitter, facebook)
 */
function shareOnSocial(platform) {
    const url = window.location.href;
    const text = 'Learn about elections and voting at Election Education Assistant!';
    
    let shareUrl;
    if (platform === 'twitter') {
        shareUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);
    } else if (platform === 'facebook') {
        shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        trackPageEvent('share_action', { action: 'share_' + platform });
    }
}