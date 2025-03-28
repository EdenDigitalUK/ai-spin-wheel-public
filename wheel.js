document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const generateBtn = document.getElementById('generate-btn');
    const manualBtn = document.getElementById('manual-btn');
    const spinBtn = document.getElementById('spin-btn');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const promptInput = document.getElementById('prompt');
    const manualOptions = document.getElementById('manual-options');
    const wheelCanvas = document.getElementById('wheel');
    const resultElement = document.getElementById('result');
    const wheelNameInput = document.getElementById('wheel-name');
    const savedWheelsList = document.getElementById('saved-wheels-list');
    const loadingOverlay = document.getElementById('loading');
    
    // Canvas Context and Setup
    const ctx = wheelCanvas.getContext('2d');
    
    // Ensure canvas dimensions match attributes
    wheelCanvas.width = parseInt(wheelCanvas.getAttribute('width'));
    wheelCanvas.height = parseInt(wheelCanvas.getAttribute('height'));
    
    // Wheel Properties
    let options = [];
    let colors = [];
    let isSpinning = false;
    let currentRotation = 0;
    let wheelRadius = wheelCanvas.width / 2;
    
    // Predefined Colors for Wheel Segments
    const colorPalette = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#F77FBE', '#627SCD', '#FFC154', '#47B39C',
        '#B558F6', '#EC6B56', '#FFC154', '#47B39C', '#36A2EB'
    ];
    
    // Generate a random color from the palette
    function getRandomColor(index) {
        return colorPalette[index % colorPalette.length];
    }
    
    // Draw the wheel with the current options
    function drawWheel() {
        // Clear the canvas
        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
        
        // If no options, draw empty wheel
        if (options.length === 0) {
            ctx.beginPath();
            ctx.arc(wheelRadius, wheelRadius, wheelRadius - 5, 0, Math.PI * 2);
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 10;
            ctx.stroke();
            ctx.fillStyle = '#f5f5f5';
            ctx.fill();
            ctx.closePath();
            
            // Add text
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Generate options to create a wheel', wheelRadius, wheelRadius);
            return;
        }
        
        // Draw segments
        const anglePerSegment = (Math.PI * 2) / options.length;
        
        for (let i = 0; i < options.length; i++) {
            const startAngle = i * anglePerSegment + currentRotation;
            const endAngle = (i + 1) * anglePerSegment + currentRotation;
            
            // Draw segment
            ctx.beginPath();
            ctx.moveTo(wheelRadius, wheelRadius);
            ctx.arc(wheelRadius, wheelRadius, wheelRadius - 5, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i];
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw text for each segment
            ctx.save();
            ctx.translate(wheelRadius, wheelRadius);
            ctx.rotate(startAngle + anglePerSegment / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'black';
            ctx.font = options.length > 10 ? 'bold 12px Arial' : 'bold 14px Arial';
            ctx.shadowColor = 'rgba(255,255,255,0.7)';
            ctx.shadowBlur = 3;
            
            // Calculate text position based on wheel size
            const textDistance = wheelRadius * 0.8;
            
            // Shorten text if too long
            let displayText = options[i];
            const maxLength = options.length > 10 ? 12 : 20;
            if (displayText.length > maxLength) {
                displayText = displayText.substring(0, maxLength - 3) + '...';
            }
            
            ctx.fillText(displayText, textDistance, 5);
            ctx.restore();
        }
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(wheelRadius, wheelRadius, wheelRadius * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Draw pointer at 3 o'clock position (right edge)
        const pointerLength = 30;
        const pointerX = wheelCanvas.width - 5;
        const pointerY = wheelRadius;

        // Draw pointer pointing inward (flipped horizontally)
        ctx.beginPath();
        ctx.moveTo(pointerX - pointerLength/2, pointerY); // tip (moved halfway out)
        ctx.lineTo(pointerX, pointerY - 15); // top base
        ctx.lineTo(pointerX, pointerY + 15); // bottom base
        ctx.closePath();

        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    // Sound control
    let soundEnabled = true;
    let audioContext;
    let gainNode;
    let oscillators = [];
    let lfo;
    
    // Initialize sound on first user interaction
    function initSound() {
        if (!audioContext) {
            try {
                console.log('Initializing AudioContext...');
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('AudioContext created successfully');
                
                gainNode = audioContext.createGain();
                gainNode.gain.value = 0;
                gainNode.connect(audioContext.destination);
                console.log('Gain node setup complete');
            } catch (error) {
                console.error('Failed to initialize audio:', error);
                soundEnabled = false;
                document.getElementById('sound-btn').textContent = '🔇 Sound Error';
            }
        }
    }
    
    // Spin the wheel
    function spinWheel() {
        if (isSpinning || options.length === 0) {
            console.log('Spin prevented - already spinning or no options');
            return;
        }
        
        isSpinning = true;
        spinBtn.disabled = true;
        resultElement.textContent = 'Spinning...';
        console.log('Starting spin with', options.length, 'options');
        console.log('Sound enabled:', soundEnabled);
        
        // Play spinning sound if enabled
        if (soundEnabled) {
            console.log('Initializing sound for spin');
            initSound();
            if (audioContext) {
                // Clear any existing oscillators
                oscillators.forEach(osc => osc.stop());
                oscillators = [];
                
                // Create multiple oscillators for richer sound
                const baseFreq = 220;
                
                // Create 3 detuned oscillators
                for (let i = 0; i < 3; i++) {
                    const osc = audioContext.createOscillator();
                    osc.type = 'sine';
                    // Slightly detune each oscillator
                    osc.frequency.value = baseFreq * (1 + (i * 0.01)); 
                    osc.connect(gainNode);
                    osc.start();
                    oscillators.push(osc);
                }
                
                // Create LFO for subtle pitch variation
                if (lfo) lfo.stop();
                lfo = audioContext.createOscillator();
                lfo.frequency.value = 0.5; // Slow modulation
                const lfoGain = audioContext.createGain();
                lfoGain.gain.value = 10; // Small pitch variation
                lfo.connect(lfoGain);
                
                // Apply modulation to oscillators
                oscillators.forEach(osc => {
                    lfoGain.connect(osc.frequency);
                });
                
                lfo.start();
                
                gainNode.gain.value = 0.2; // Lower volume for multiple oscillators
                console.log('Multi-oscillator sound started successfully');
            } else {
                console.log('AudioContext not available');
            }
        }
        
        // Random number of rotations (3-5 full rotations + random angle)
        const rotations = 3 + Math.random() * 2;
        const targetRotation = currentRotation + (Math.PI * 2 * rotations);
        const spinDuration = 5000; // 5 seconds
        const startTime = Date.now();
        const startRotation = currentRotation;
        
        function animate() {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / spinDuration, 1);
            
            // Easing function for natural slowdown
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
            drawWheel();
            
            if (progress < 1) {
                console.log('Animating frame, progress:', progress, 'rotation:', currentRotation);
                // Fade out sound as spinning slows
                if (soundEnabled && gainNode && oscillators) {
                    // Vary frequency based on spin progress
                    const freq = 220 + (880 * progress); // Rising pitch
                    oscillators.forEach((osc, i) => {
                        osc.frequency.value = freq * (1 + (i * 0.01));
                    });
                    
                    // Fade out volume as spinning slows
                    gainNode.gain.value = 0.2 * (1 - progress);
                }
                drawWheel(); // Explicitly draw before next frame
                const frameId = requestAnimationFrame(animate);
                console.log('Requested frame ID:', frameId);
            } else {
                console.log('Spin complete - final rotation:', currentRotation);
                // Stop sound
                if (soundEnabled && oscillators) {
                    oscillators.forEach(osc => osc.stop());
                    lfo.stop();
                }
                finishSpin();
            }
        }
        
        function finishSpin() {
            isSpinning = false;
            spinBtn.disabled = false;
            
            // Calculate the winning segment (0 radians = 3 o'clock position)
            const anglePerSegment = (Math.PI * 2) / options.length;
            const normalizedRotation = currentRotation % (Math.PI * 2);
            const winningIndex = Math.floor(((Math.PI * 2 - normalizedRotation) % (Math.PI * 2)) / anglePerSegment);
            
            resultElement.textContent = options[winningIndex % options.length];
        }
        
        animate();
    }
    
    // Update the wheel with new options
    function updateWheel(newOptions) {
        options = newOptions;
        colors = [];
        
        // Generate colors for each option
        for (let i = 0; i < options.length; i++) {
            colors.push(getRandomColor(i));
        }
        
        // Enable buttons
        spinBtn.disabled = options.length === 0;
        saveBtn.disabled = options.length === 0;
        
        drawWheel();
    }
    
    // Generate options from AI
    async function generateOptions() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }
        
        loadingOverlay.classList.remove('hidden');
        
        try {
            const response = await fetch('/.netlify/functions/generate-options', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate options');
            }
            
            const data = await response.json();
            
            if (data.options && data.options.length > 0) {
                updateWheel(data.options);
            } else {
                alert('No options were generated. Please try a different prompt.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating options: ' + error.message);
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    }
    
    // Use manually entered options
    function useManualOptions() {
        const text = manualOptions.value.trim();
        if (!text) {
            alert('Please enter at least one option');
            return;
        }
        
        const newOptions = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        if (newOptions.length === 0) {
            alert('Please enter at least one valid option');
            return;
        }
        
        updateWheel(newOptions);
    }
    
    // Save current wheel
    function saveWheel() {
        const name = wheelNameInput.value.trim();
        if (!name) {
            alert('Please enter a name for your wheel');
            return;
        }
        
        if (options.length === 0) {
            alert('Cannot save an empty wheel');
            return;
        }
        
        const wheel = {
            name,
            options,
            colors
        };
        
        // Get existing saved wheels
        let savedWheels = JSON.parse(localStorage.getItem('savedWheels') || '{}');
        
        // Add/update this wheel
        savedWheels[name] = wheel;
        
        // Save back to localStorage
        localStorage.setItem('savedWheels', JSON.stringify(savedWheels));
        
        // Update the dropdown
        updateSavedWheelsList();
        
        alert(`Wheel "${name}" saved successfully!`);
    }
    
    // Load a saved wheel
    function loadWheel() {
        const selectedWheel = savedWheelsList.value;
        if (!selectedWheel) {
            alert('Please select a wheel to load');
            return;
        }
        
        // Get saved wheels
        const savedWheels = JSON.parse(localStorage.getItem('savedWheels') || '{}');
        const wheel = savedWheels[selectedWheel];
        
        if (!wheel) {
            alert('Could not find the selected wheel');
            return;
        }
        
        // Update the current wheel
        options = wheel.options;
        colors = wheel.colors;
        wheelNameInput.value = wheel.name;
        
        // Update buttons
        spinBtn.disabled = options.length === 0;
        saveBtn.disabled = options.length === 0;
        
        // Draw the wheel
        drawWheel();
    }
    
    // Update the saved wheels dropdown
    function updateSavedWheelsList() {
        // Clear existing options except the default
        while (savedWheelsList.options.length > 1) {
            savedWheelsList.remove(1);
        }
        
        // Get saved wheels
        const savedWheels = JSON.parse(localStorage.getItem('savedWheels') || '{}');
        
        // Add options for each saved wheel
        for (const wheelName in savedWheels) {
            const option = document.createElement('option');
            option.value = wheelName;
            option.textContent = wheelName;
            savedWheelsList.appendChild(option);
        }
    }
    
    // Toggle sound on/off
    function toggleSound() {
        soundEnabled = !soundEnabled;
        const soundBtn = document.getElementById('sound-btn');
        
        if (soundEnabled) {
            try {
                initSound();
                if (audioContext && audioContext.state === 'running') {
                    soundBtn.textContent = '🔊 Sound On';
                } else {
                    soundBtn.textContent = '🔇 Sound Error';
                    soundEnabled = false;
                }
            } catch (error) {
                console.error('Error enabling sound:', error);
                soundBtn.textContent = '🔇 Sound Error';
                soundEnabled = false;
            }
        } else {
            soundBtn.textContent = '🔇 Sound Off';
        }
    }

    // Event Listeners
    generateBtn.addEventListener('click', generateOptions);
    manualBtn.addEventListener('click', useManualOptions);
    spinBtn.addEventListener('click', () => {
        if (soundEnabled) {
            if (!audioContext) {
                initSound();
            }
            spinWheel();
        } else {
            spinWheel();
        }
    });
    saveBtn.addEventListener('click', saveWheel);
    loadBtn.addEventListener('click', loadWheel);
    document.getElementById('sound-btn').addEventListener('click', toggleSound);
    
    // Initialize the wheel
    drawWheel();
    updateSavedWheelsList();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target === promptInput) {
            generateOptions();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        drawWheel();
    });
});
