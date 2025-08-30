// Global variables
const learningModules = {
    'ai-basics': {
        title: 'AI Basics Module',
        questions: [
            {
                question: 'What is machine learning?',
                options: {
                    A: 'AI that learns from data',
                    B: 'Robots taking over the world',
                    C: 'Computer programming'
                },
                correct: 'A',
                explanation: 'Machine learning is a subset of AI that enables systems to learn from data.'
            },
            {
                question: 'Which of these is a common AI task?',
                options: {
                    A: 'Natural language processing',
                    B: 'Cooking food',
                    C: 'Driving cars manually'
                },
                correct: 'A',
                explanation: 'Natural language processing is a common AI task involving understanding human language.'
            }
        ]
    },
    'misinformation': {
        title: 'Spotting Misinformation',
        questions: [
            {
                question: 'What should you do when you encounter suspicious content?',
                options: {
                    A: 'Share it immediately',
                    B: 'Verify with multiple sources',
                    C: 'Ignore it completely'
                },
                correct: 'B',
                explanation: 'Verifying with multiple sources helps confirm the accuracy of information.'
            },
            {
                question: 'Which is a sign of misinformation?',
                options: {
                    A: 'Emotional or sensational language',
                    B: 'Peer-reviewed research',
                    C: 'Official government reports'
                },
                correct: 'A',
                explanation: 'Emotional or sensational language is often used in misinformation to provoke reactions.'
            }
        ]
    },
    'ethics': {
        title: 'AI Ethics',
        questions: [
            {
                question: 'Why is algorithmic bias a concern?',
                options: {
                    A: 'It makes computers faster',
                    B: 'It can perpetuate discrimination',
                    C: 'It improves accuracy'
                },
                correct: 'B',
                explanation: 'Algorithmic bias can lead to unfair treatment of certain groups.'
            },
            {
                question: 'What is important for AI transparency?',
                options: {
                    A: 'Keeping algorithms secret',
                    B: 'Explaining how decisions are made',
                    C: 'Ignoring user concerns'
                },
                correct: 'B',
                explanation: 'Transparency involves explaining AI decision-making processes.'
            }
        ]
    }
};

let currentModule = null;
let currentQuestionIndex = 0;
let userProgress = {
    'ai-basics': { completed: false, score: 0 },
    'misinformation': { completed: false, score: 0 },
    'ethics': { completed: false, score: 0 }
};

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// AI Simulator Functions
async function runAISimulation() {
    const input = document.getElementById('ai-input').value.trim();
    const algorithmType = document.getElementById('algorithm-type').value;
    const outputResult = document.getElementById('output-result');
    const analysisList = document.getElementById('analysis-list');
    
    if (!input) {
        outputResult.innerHTML = '<p style="color: #dc3545;">Please enter some text or upload an image to analyze.</p>';
        return;
    }
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
        outputResult.innerHTML = '<p style="color: #dc3545;">Please login to use AI simulation features.</p>';
        return;
    }
    
    outputResult.innerHTML = '<p>Processing with AI algorithm...</p>';
    analysisList.innerHTML = '';
    
    try {
        const response = await fetch('http://localhost:5000/api/ai-simulate', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ input, algorithmType })
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                updateAuthUI();
                outputResult.innerHTML = '<p style="color: #dc3545;">Session expired. Please login again.</p>';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        outputResult.innerHTML = `
            <div style="background: #e8f4f8; padding: 1rem; border-radius: 5px; border-left: 4px solid #79A6D2;">
                <h4 style="margin-bottom: 0.5rem; color: #333;">AI Output:</h4>
                <p style="margin: 0;">${data.output}</p>
            </div>
        `;
        
        analysisList.innerHTML = '';
        data.analysis.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.style.padding = '0.5rem 0';
            li.style.borderBottom = '1px solid #eee';
            analysisList.appendChild(li);
        });
    } catch (error) {
        outputResult.innerHTML = `<p style="color: #dc3545;">Error processing AI simulation: ${error.message}</p>`;
    }
}

function simulateRecommendationSystem(input) {
    const responses = [
        `Based on your interest in "${input}", we recommend exploring content about digital literacy and critical thinking skills.`,
        `Users interested in "${input}" often find value in our media literacy resources and fact-checking guides.`,
        `Our algorithm suggests you might enjoy learning about AI ethics and responsible technology use.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function simulateChatbotResponse(input) {
    const responses = {
        'climate change': 'Climate change is a scientifically proven phenomenon. Would you like to learn about reliable sources for environmental information?',
        'vaccine': 'Vaccines undergo rigorous testing and are proven safe and effective. Would you like fact-checking resources about healthcare topics?',
        'election': 'Election integrity is maintained through multiple verification processes. Would you like to learn about identifying election misinformation?',
        'default': `I understand you're asking about "${input}". This is an important topic. Would you like me to help you find reliable information sources and fact-checking tools?`
    };
    
    const lowerInput = input.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
        if (lowerInput.includes(key)) {
            return response;
        }
    }
    return responses.default;
}

function simulateImageGeneration(input) {
    return `Generated image based on description: "${input}". This demonstrates how AI can create visual content from text prompts, which can be used for both creative and potentially misleading purposes.`;
}

// FactShield Functions
async function runFactCheck() {
    const input = document.getElementById('factcheck-input').value.trim();
    const output = document.getElementById('factcheck-output');
    const reasoning = document.getElementById('reasoning-content');
    
    if (!input) {
        output.innerHTML = '<p style="color: #dc3545;">Please enter content to verify.</p>';
        return;
    }
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
        output.innerHTML = '<p style="color: #dc3545;">Please login to use FactShield features.</p>';
        return;
    }
    
    output.innerHTML = '<p>Analyzing content with FactShield...</p>';
    reasoning.innerHTML = '';
    
    try {
        const response = await fetch('http://localhost:5000/api/fact-check', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: input })
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                updateAuthUI();
                output.innerHTML = '<p style="color: #dc3545;">Session expired. Please login again.</p>';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        output.innerHTML = `
            <div style="background: ${result.verified ? '#d4edda' : '#f8d7da'}; 
                        color: ${result.verified ? '#155724' : '#721c24'};
                        padding: 1rem; border-radius: 5px; border-left: 4px solid ${result.verified ? '#28a745' : '#dc3545'};">
                <h4 style="margin-bottom: 0.5rem;">${result.verified ? '✅ Verified Content' : '⚠️ Potential Misinformation'}</h4>
                <p style="margin: 0;">${result.message}</p>
            </div>
        `;
        
        reasoning.innerHTML = `
            <h5>Analysis Breakdown:</h5>
            <ul style="list-style: none; padding: 0;">
                ${result.reasoning.map(r => `<li style="padding: 0.3rem 0; border-bottom: 1px solid #ddd;">• ${r}</li>`).join('')}
            </ul>
            <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 5px;">
                <strong>Media Literacy Tip:</strong> ${result.tip}
            </div>
        `;
    } catch (error) {
        output.innerHTML = `<p style="color: #dc3545;">Error during fact-checking: ${error.message}</p>`;
    }
}

function analyzeContent(input) {
    const lowerInput = input.toLowerCase();
    const commonMisinfoPatterns = [
        'cure cancer', 'secret government', 'they don\'t want you to know',
        'miracle', 'instant results', 'big pharma hiding'
    ];
    
    const reliableIndicators = [
        'according to study', 'research shows', 'peer-reviewed',
        'scientific consensus', 'verified by', 'fact-checked'
    ];
    
    let verified = true;
    let reasoning = [];
    let message = 'This content appears to be reliable.';
    
    // Check for common misinformation patterns
    if (commonMisinfoPatterns.some(pattern => lowerInput.includes(pattern))) {
        verified = false;
        message = 'This content shows signs of potential misinformation.';
        reasoning.push('Contains phrases commonly used in misleading content');
    }
    
    // Check for reliable indicators
    if (reliableIndicators.some(indicator => lowerInput.includes(indicator))) {
        reasoning.push('Includes references to research and verification');
    } else if (!verified) {
        reasoning.push('Lacks references to credible sources');
    }
    
    // Check emotional language
    const emotionalWords = ['shocking', 'amazing', 'unbelievable', 'secret'];
    const emotionalCount = emotionalWords.filter(word => lowerInput.includes(word)).length;
    if (emotionalCount > 2) {
        verified = false;
        reasoning.push('Uses excessive emotional language, which is common in misleading content');
    }
    
    const tips = [
        'Check multiple reliable sources before sharing information',
        'Look for citations and references to credible research',
        'Be cautious of content that triggers strong emotional responses',
        'Verify claims with fact-checking organizations',
        'Consider the source and their potential biases'
    ];
    
    return {
        verified,
        message,
        reasoning,
        tip: tips[Math.floor(Math.random() * tips.length)]
    };
}

// Learning Path Functions

function selectModule(moduleId) {
    currentModule = moduleId;
    currentQuestionIndex = 0;
    displayQuestion();
    updateProgress();
    updateModuleSelection();
    clearBadge();
}

function displayQuestion() {
    const moduleDisplay = document.getElementById('module-display');
    const module = learningModules[currentModule];
    if (!module) {
        moduleDisplay.innerHTML = '<p>Select a module to start learning...</p>';
        return;
    }
    const questionObj = module.questions[currentQuestionIndex];
    let optionsHtml = '';
    for (const [key, value] of Object.entries(questionObj.options)) {
        optionsHtml += `<button class="quiz-btn" data-answer="${key}">${key}) ${value}</button>`;
    }
    moduleDisplay.innerHTML = `
        <div style="padding: 2rem;">
            <h2 style="color: #79A6D2; margin-bottom: 1rem;">${module.title}</h2>
            <div class="quiz">
                <h4>Question ${currentQuestionIndex + 1} of ${module.questions.length}</h4>
                <p>${questionObj.question}</p>
                ${optionsHtml}
                <div class="feedback" id="feedback"></div>
                <button id="next-btn" style="margin-top: 1rem; display: none;">Next Question</button>
            </div>
        </div>
    `;

    const buttons = moduleDisplay.querySelectorAll('.quiz-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.getAttribute('data-answer');
            checkAnswer(answer);
        });
    });

    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < learningModules[currentModule].questions.length) {
            displayQuestion();
            updateProgress();
        } else {
            completeModule();
        }
    });
}

function checkAnswer(answer) {
    const feedbackEl = document.getElementById('feedback');
    const module = learningModules[currentModule];
    const questionObj = module.questions[currentQuestionIndex];
    if (answer === questionObj.correct) {
        userProgress[currentModule].score += 10;
        feedbackEl.textContent = `✅ Correct! ${questionObj.explanation}`;
        feedbackEl.style.color = 'green';
    } else {
        feedbackEl.textContent = `❌ Incorrect. ${questionObj.explanation}`;
        feedbackEl.style.color = 'red';
    }
    document.querySelectorAll('.quiz-btn').forEach(btn => btn.disabled = true);
    document.getElementById('next-btn').style.display = 'inline-block';
    updateProgress();
}

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const module = learningModules[currentModule];
    const progressPercent = ((currentQuestionIndex) / module.questions.length) * 100;
    if (progressBar && progressText) {
        progressBar.value = progressPercent;
        progressText.textContent = `Progress: ${Math.round(progressPercent)}%`;
    }
}

function completeModule() {
    userProgress[currentModule].completed = true;
    const feedbackEl = document.getElementById('feedback');
    feedbackEl.textContent = '🎉 Congratulations! You\'ve completed this module!';
    feedbackEl.style.color = '#D4AC0D'; // gentle yellow
    showBadge(currentModule);
    updateProgress();
}

function showBadge(moduleId) {
    const badgeContainer = document.getElementById('badge-container');
    badgeContainer.innerHTML = `
        <div style="font-size: 2rem; color: #D4AC0D;">
            🏅 Badge earned for completing ${learningModules[moduleId].title}!
        </div>
    `;
}

function clearBadge() {
    const badgeContainer = document.getElementById('badge-container');
    badgeContainer.innerHTML = '';
}

function updateModuleSelection() {
    const modules = document.querySelectorAll('.module');
    modules.forEach(mod => {
        if (mod.textContent.toLowerCase().includes(currentModule.replace('-', ' '))) {
            mod.style.backgroundColor = '#D4AC0D';
            mod.style.color = 'white';
        } else {
            mod.style.backgroundColor = 'white';
            mod.style.color = '#333';
        }
    });
}


// Community Functions
function createDiscussion() {
    const title = document.getElementById('discussion-title').value.trim();
    const content = document.getElementById('discussion-content').value.trim();
    
    if (!title || !content) {
        alert('Please fill in both title and content for your discussion.');
        return;
    }
    
    const discussionList = document.querySelector('.discussion-list');
    const newDiscussion = document.createElement('div');
    newDiscussion.className = 'discussion-item';
    newDiscussion.innerHTML = `
        <h4>${title}</h4>
        <p>${content}</p>
        <small>Posted just now</small>
    `;
    
    discussionList.prepend(newDiscussion);
    
    // Clear inputs
    document.getElementById('discussion-title').value = '';
    document.getElementById('discussion-content').value = '';
    
    alert('Discussion posted successfully!');
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('AIRENA Application Loaded');
    
    // Add event listeners for smooth interactions
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Authentication UI elements
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');

    // Logout functionality
    logoutLink.addEventListener('click', () => {
        localStorage.removeItem('accessToken');
        updateAuthUI();
    });

    // Update UI based on auth state
    function updateAuthUI() {
        const token = localStorage.getItem('accessToken');
        if (token) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            logoutLink.style.display = 'inline';
        } else {
            loginLink.style.display = 'inline';
            registerLink.style.display = 'inline';
            logoutLink.style.display = 'none';
        }
    }

    updateAuthUI();

    // Initialize first module
    selectModule('ai-basics');
});

// Export functionality for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAISimulation,
        runFactCheck,
        selectModule,
        checkAnswer,
        createDiscussion
    };
}
