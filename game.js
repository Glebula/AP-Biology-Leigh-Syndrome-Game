// ==========================================
// GLOBAL STATE
// ==========================================

let currentChapter = 0;
let storyProgress = {
    introStep: 0,
    chapter1Complete: false,
    chapter2Complete: false,
    chapter3Complete: false,
    chapter4Complete: false,
    chapter5Complete: false
};

// ==========================================
// SCREEN NAVIGATION
// ==========================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function returnToMenu() {
    showScreen('main-menu');
}

// ==========================================
// STORY FLOW
// ==========================================

const introDialogues = [
    "Hi, I'm Maya. I'm 16 years old, and I live at 67 Maple Street.",
    "I have Leigh Syndrome - a rare genetic disorder that affects my mitochondria.",
    "You've probably learned that mitochondria are the 'powerhouses' of cells, right?",
    "Well, mine don't work properly. They can't produce enough ATP - the energy my cells need.",
    "Come with me, and I'll show you what life is like when your cells can't make energy...",
    "Let's start with a normal morning in my life."
];

let currentDialogueIndex = 0;

function startStory() {
    currentDialogueIndex = 0;
    showScreen('story-intro');
    displayIntroDialogue();
}

function displayIntroDialogue() {
    const textElement = document.getElementById('intro-text');
    if (currentDialogueIndex < introDialogues.length) {
        textElement.textContent = introDialogues[currentDialogueIndex];
    }
}

function nextIntroDialogue() {
    currentDialogueIndex++;
    if (currentDialogueIndex < introDialogues.length) {
        displayIntroDialogue();
    } else {
        // Start Chapter 1
        startChapter(1);
    }
}

function startChapter(chapterNum) {
    currentChapter = chapterNum;
    switch(chapterNum) {
        case 1:
            showScreen('chapter1');
            initChapter1();
            break;
        case 2:
            showScreen('chapter2');
            initChapter2();
            break;
        case 3:
            showScreen('chapter3');
            initChapter3();
            break;
        case 4:
            showScreen('chapter4');
            initChapter4();
            break;
        case 5:
            showScreen('chapter5');
            initChapter5();
            break;
    }
}

// ==========================================
// CHAPTER 1: MAYA'S MORNING
// ==========================================

let chapter1 = {
    energy: 100,
    taskIndex: 0,
    tasks: [
        {
            name: "Wake Up",
            description: "The alarm goes off. It's 6:30 AM. You need to get ready for school.",
            choices: [
                { text: "Jump out of bed quickly", energy: -20, thought: "Ugh... that took way more energy than it should have. I'm already tired." },
                { text: "Take it slow, sit up gradually", energy: -10, thought: "Good choice. I need to conserve energy. Even sitting up makes my muscles ache." }
            ]
        },
        {
            name: "Get Dressed",
            description: "Time to put on your school clothes.",
            choices: [
                { text: "Rush to get dressed", energy: -25, thought: "Why is everything so exhausting? My arms feel like lead..." },
                { text: "Take breaks between each piece of clothing", energy: -12, thought: "This takes forever, but I need to pace myself." }
            ]
        },
        {
            name: "Breakfast Decision",
            description: "Mom made breakfast, but climbing down the stairs will use energy.",
            choices: [
                { text: "Skip breakfast to save energy", energy: 0, thought: "But now I won't have any fuel... this is a lose-lose situation." },
                { text: "Go downstairs for breakfast", energy: -18, thought: "The stairs are getting harder every day. But I need to eat." }
            ]
        },
        {
            name: "Prepare for School",
            description: "You need to pack your bag and get ready to leave.",
            choices: [
                { text: "Pack everything you might need", energy: -20, thought: "My backpack feels like it weighs a ton..." },
                { text: "Pack only essentials", energy: -10, thought: "I'll have to make do with less. Every ounce matters." }
            ]
        },
        {
            name: "Getting to School",
            description: "Time to head to school. It's only 8:00 AM and you're already exhausted.",
            choices: [
                { text: "Walk to school", energy: -35, thought: "I don't think I can make it... everything is spinning..." },
                { text: "Ask mom for a ride", energy: -5, thought: "I hate feeling dependent, but I have to save energy for classes." }
            ]
        }
    ]
};

function initChapter1() {
    chapter1.energy = 100;
    chapter1.taskIndex = 0;
    updateChapter1UI();
    presentChapter1Task();
}

function presentChapter1Task() {
    if (chapter1.taskIndex >= chapter1.tasks.length) {
        completeChapter1();
        return;
    }

    const task = chapter1.tasks[chapter1.taskIndex];
    document.getElementById('current-activity').textContent = task.name;
    document.getElementById('activity-description').textContent = task.description;

    const choicesContainer = document.getElementById('activity-choices');
    choicesContainer.innerHTML = '';

    task.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text + ` (${choice.energy} energy)`;
        button.onclick = () => makeChapter1Choice(index);
        choicesContainer.appendChild(button);
    });
}

function makeChapter1Choice(choiceIndex) {
    const task = chapter1.tasks[chapter1.taskIndex];
    const choice = task.choices[choiceIndex];

    chapter1.energy = Math.max(0, chapter1.energy + choice.energy);
    document.getElementById('maya-thoughts').textContent = choice.thought;

    updateChapter1UI();

    if (chapter1.energy <= 0) {
        // Energy depleted
        setTimeout(() => {
            alert("You've run out of energy before even getting to school...\n\nThis is the reality for people with Leigh Syndrome - simple morning tasks can be overwhelming.");
            initChapter1(); // Restart
        }, 2000);
        return;
    }

    // Move to next task
    chapter1.taskIndex++;
    setTimeout(presentChapter1Task, 2000);
}

function updateChapter1UI() {
    const energy = chapter1.energy;
    const bar = document.getElementById('maya-energy-bar');
    const value = document.getElementById('maya-energy');
    const status = document.getElementById('energy-status-text');

    bar.style.width = energy + '%';
    value.textContent = energy;

    bar.classList.remove('low', 'critical');
    if (energy < 30) {
        bar.classList.add('critical');
        status.textContent = "Extremely exhausted... can barely move...";
    } else if (energy < 60) {
        bar.classList.add('low');
        status.textContent = "Getting very tired...";
    } else {
        status.textContent = "Feeling okay... for now.";
    }
}

function completeChapter1() {
    storyProgress.chapter1Complete = true;
    document.getElementById('maya-thoughts').textContent =
        `I made it to school with ${chapter1.energy} energy left. Most students arrive at 100%. This is my normal.`;

    setTimeout(() => {
        if (confirm("Chapter 1 Complete!\n\nYou experienced a morning in Maya's life.\n\nReady to see what's happening inside her cells?\n\n(Click OK to continue to Chapter 2)")) {
            startChapter(2);
        } else {
            returnToMenu();
        }
    }, 3000);
}

// ==========================================
// CHAPTER 2: INSIDE THE CELL
// ==========================================

let chapter2 = {
    canvas: null,
    ctx: null,
    particles: [],
    atp: 0,
    atpRate: 0.4,  // ATP per second - severely impaired due to Leigh Syndrome
    baseRate: 0.4,  // Baseline impaired rate (healthy = 30-50 ATP/sec!)
    timeLeft: 20,
    gameActive: false,
    animationId: null,
    timerInterval: null,
    spawnInterval: null,
    atpProductionInterval: null,
    rateDecayInterval: null
};

function initChapter2() {
    chapter2.canvas = document.getElementById('cell-canvas');
    chapter2.ctx = chapter2.canvas.getContext('2d');
    chapter2.particles = [];
    chapter2.atp = 0;
    chapter2.atpRate = 0.4;
    chapter2.timeLeft = 20;
    chapter2.gameActive = true;

    updateChapter2UI();

    chapter2.canvas.addEventListener('click', handleCellClick);
    chapter2.animationId = requestAnimationFrame(updateCellGame);
    chapter2.timerInterval = setInterval(updateCellTimer, 1000);
    chapter2.spawnInterval = setInterval(spawnCellParticle, 800);

    // Continuous ATP production based on current rate
    chapter2.atpProductionInterval = setInterval(() => {
        if (!chapter2.gameActive) return;
        chapter2.atp += chapter2.atpRate / 10; // Divide by 10 because interval is 100ms
        updateChapter2UI();
    }, 100);

    // Gradually return rate to baseline
    chapter2.rateDecayInterval = setInterval(() => {
        if (!chapter2.gameActive) return;
        if (chapter2.atpRate > chapter2.baseRate) {
            chapter2.atpRate = Math.max(chapter2.baseRate, chapter2.atpRate - 0.02);
        } else if (chapter2.atpRate < chapter2.baseRate) {
            chapter2.atpRate = Math.min(chapter2.baseRate, chapter2.atpRate + 0.02);
        }
        updateChapter2UI();
    }, 200);
}

function spawnCellParticle() {
    if (!chapter2.gameActive) return;

    const types = [
        { name: 'Glucose', color: '#00ff00', good: true, rateChange: 0.3 },
        { name: 'O₂', color: '#00ffff', good: true, rateChange: 0.3 },
        { name: 'Mutation', color: '#ff0000', good: false, rateChange: -0.2 },
        { name: 'Toxin', color: '#ff6600', good: false, rateChange: -0.15 }
    ];

    const type = types[Math.floor(Math.random() * types.length)];

    const particle = {
        x: Math.random() * (chapter2.canvas.width - 40) + 20,
        y: -30,
        speed: 1 + Math.random() * 1.5,
        radius: 20,
        ...type
    };

    chapter2.particles.push(particle);
}

function updateCellGame() {
    if (!chapter2.gameActive) return;

    const ctx = chapter2.ctx;
    const canvas = chapter2.canvas;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw mitochondria outline
    ctx.strokeStyle = '#764ba2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(canvas.width/2, canvas.height/2, 300, 150, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(118, 75, 162, 0.1)';
    ctx.fill();

    // Draw particles
    chapter2.particles = chapter2.particles.filter(p => {
        p.y += p.speed;

        if (p.y > canvas.height + 50) return false;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(p.name, p.x, p.y + 5);

        return true;
    });

    chapter2.animationId = requestAnimationFrame(updateCellGame);
}

function handleCellClick(event) {
    if (!chapter2.gameActive) return;

    const rect = chapter2.canvas.getBoundingClientRect();
    const scaleX = chapter2.canvas.width / rect.width;
    const scaleY = chapter2.canvas.height / rect.height;
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    for (let i = chapter2.particles.length - 1; i >= 0; i--) {
        const p = chapter2.particles[i];
        const dist = Math.sqrt((clickX - p.x) ** 2 + (clickY - p.y) ** 2);

        if (dist <= p.radius) {
            // Modify ATP production rate
            chapter2.atpRate = Math.max(0.05, chapter2.atpRate + p.rateChange);
            chapter2.particles.splice(i, 1);
            updateChapter2UI();

            const status = document.getElementById('cell-status');
            if (p.good) {
                status.textContent = 'Boosted! +ATP/sec';
                status.style.color = '#22c55e';
            } else {
                status.textContent = 'Damaged! -ATP/sec';
                status.style.color = '#ef4444';
            }
            break;
        }
    }
}

function updateCellTimer() {
    if (!chapter2.gameActive) return;
    chapter2.timeLeft--;
    updateChapter2UI();

    if (chapter2.timeLeft <= 0) {
        completeChapter2();
    }
}

function updateChapter2UI() {
    document.getElementById('atp-produced').textContent = Math.floor(chapter2.atp);
    document.getElementById('cell-timer').textContent = chapter2.timeLeft + 's';

    // Update status to show current synthesis rate
    const statusElement = document.getElementById('cell-status');
    const rateDisplay = chapter2.atpRate.toFixed(2);

    // Color code based on rate (remember: healthy = 30-50 ATP/sec, Maya's impaired = 0.4)
    if (chapter2.atpRate >= 0.9) {
        statusElement.textContent = `Boosted! ${rateDisplay} ATP/sec`;
        statusElement.style.color = '#22c55e';
    } else if (chapter2.atpRate >= 0.6) {
        statusElement.textContent = `Improved ${rateDisplay} ATP/sec`;
        statusElement.style.color = '#3b82f6';
    } else if (chapter2.atpRate >= 0.3) {
        statusElement.textContent = `Impaired... ${rateDisplay} ATP/sec`;
        statusElement.style.color = '#fbbf24';
    } else {
        statusElement.textContent = `Critical! ${rateDisplay} ATP/sec`;
        statusElement.style.color = '#ef4444';
    }
}

function completeChapter2() {
    chapter2.gameActive = false;
    clearInterval(chapter2.timerInterval);
    clearInterval(chapter2.spawnInterval);
    clearInterval(chapter2.atpProductionInterval);
    clearInterval(chapter2.rateDecayInterval);
    cancelAnimationFrame(chapter2.animationId);

    const totalATP = Math.floor(chapter2.atp);
    const avgRate = (totalATP / 20).toFixed(2);

    // Context: Healthy mitochondria produce 600-1000 ATP in 20 seconds (30-50 per second)
    // Maya's impaired mitochondria produce 8-20 ATP in 20 seconds (0.4-1.0 per second)
    const message = totalATP < 15
        ? `You produced only ${totalATP} ATP in 20 seconds (${avgRate} ATP/sec average).\n\nHealthy mitochondria produce 30-50 ATP per SECOND - that's 600-1,000 ATP in 20 seconds!\n\nMaya's cells produce only ${((totalATP/600)*100).toFixed(1)}% of normal. This is why she's always exhausted - her cells are starving for energy.`
        : `You produced ${totalATP} ATP in 20 seconds (${avgRate} ATP/sec average)!\n\nThat's better than Maya's cells usually manage, but still only ${((totalATP/600)*100).toFixed(1)}% of what healthy mitochondria produce (600-1,000 ATP in 20 seconds).\n\nLet's see what the doctor says about this...`;

    setTimeout(() => {
        if (confirm(message + "\n\nContinue to Chapter 3?")) {
            startChapter(3);
        } else {
            returnToMenu();
        }
    }, 1500);
}

// ==========================================
// CHAPTER 3: THE DOCTOR VISIT
// ==========================================

const doctorDialogues = [
    {
        doctor: "Maya, I want to explain what's happening in your cells. Your genetic test results show a mutation in the gene for Complex IV of the electron transport chain.",
        maya: "Complex IV? What does that mean?",
        diagram: true
    },
    {
        doctor: "Let me show you. Your cells have tiny structures called mitochondria. Inside them, there are 5 complexes that work together to produce ATP - the energy molecule.",
        maya: "And one of mine is broken?",
        diagram: true
    },
    {
        doctor: "Yes. Complex IV is supposed to take electrons and combine them with oxygen to make water. But your mutation means it can't do this efficiently.",
        maya: "So what happens to the electrons?",
        diagram: true
    },
    {
        doctor: "They get stuck. The whole chain backs up. It's like a traffic jam - even though Complexes I, II, III, and V might be working fine, they can't do their jobs if Complex IV is blocked.",
        maya: "That's why I'm always tired... my cells can't make enough energy.",
        diagram: true
    },
    {
        doctor: "Exactly. And your brain and muscles need the most energy, which is why Leigh Syndrome affects them the most. But understanding this helps us manage your symptoms better.",
        maya: "I understand now. Thank you, Dr. Martinez.",
        diagram: true
    }
];

let doctorDialogueIndex = 0;

function initChapter3() {
    doctorDialogueIndex = 0;
    showDoctorDialogue();
}

function showDoctorDialogue() {
    if (doctorDialogueIndex >= doctorDialogues.length) {
        completeChapter3();
        return;
    }

    const dialogue = doctorDialogues[doctorDialogueIndex];
    document.getElementById('doctor-dialogue').textContent = dialogue.doctor;
    document.getElementById('maya-response').textContent = dialogue.maya || "";

    if (dialogue.diagram) {
        document.getElementById('diagram-area').innerHTML = `
            <div style="background: #f8f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="text-align: center; color: #667eea; font-weight: bold;">
                    [Electron Transport Chain Diagram]<br>
                    Complex I → Complex II → Complex III → <span style="color: #ef4444;">Complex IV (MUTATED)</span> → Complex V<br>
                    <span style="color: #ef4444;">⚠️ Electrons can't flow properly!</span>
                </p>
            </div>
        `;
    }
}

function nextDoctorDialogue() {
    doctorDialogueIndex++;
    showDoctorDialogue();
}

function completeChapter3() {
    if (confirm("Chapter 3 Complete!\n\nYou now understand the science behind Maya's condition.\n\nReady to experience a day at school?\n\n(Chapter 4)")) {
        startChapter(4);
    } else {
        returnToMenu();
    }
}

// ==========================================
// CHAPTER 4: SCHOOL DAY
// ==========================================

let chapter4 = {
    energy: 80,
    scenarioIndex: 0,
    time: "8:00 AM",
    scenarios: [
        {
            time: "8:00 AM",
            period: "First Period - Math (Room 67)",
            title: "First Class",
            description: "You made it to school but already used energy this morning. Math class in Room 67 requires concentration.",
            choices: [
                { text: "Focus intensely on the lesson", energy: -25, consequence: "You understand the material but feel dizzy from the effort." },
                { text: "Take notes slowly, rest between problems", energy: -15, consequence: "You miss some details but conserve energy for later." }
            ]
        },
        {
            time: "9:30 AM",
            period: "Passing Period",
            title: "Changing Classes",
            description: "You need to walk to your next class across the building.",
            choices: [
                { text: "Walk quickly to get a good seat", energy: -20, consequence: "You're out of breath and your muscles are burning." },
                { text: "Walk slowly, arrive a bit late", energy: -10, consequence: "You conserve energy but feel embarrassed arriving late." }
            ]
        },
        {
            time: "10:00 AM",
            period: "PE Class",
            title: "Physical Education",
            description: "PE class. The teacher wants everyone to run laps.",
            choices: [
                { text: "Try to participate", energy: -40, consequence: "You collapse after one lap. The nurse is called. This was too much." },
                { text: "Sit out with doctor's note", energy: -5, consequence: "You watch from the sidelines. Some students whisper and stare." }
            ]
        },
        {
            time: "11:30 AM",
            period: "Lunch",
            title: "Lunchtime Decision",
            description: "Lunch break. You're exhausted but need to eat.",
            choices: [
                { text: "Get lunch from cafeteria", energy: -15, consequence: "Standing in line is exhausting, but you get food." },
                { text: "Skip lunch to rest", energy: +10, consequence: "You rest, but now you're hungry and have no fuel for afternoon classes." }
            ]
        },
        {
            time: "1:00 PM",
            period: "Afternoon Classes",
            title: "Final Period",
            description: "Last class of the day. You're running on empty.",
            choices: [
                { text: "Push through to the end", energy: -20, consequence: "You make it, but barely. Everything hurts." },
                { text: "Call mom to pick you up early", energy: 0, consequence: "You leave early. You're safe, but feel defeated." }
            ]
        }
    ]
};

function initChapter4() {
    chapter4.energy = 80;
    chapter4.scenarioIndex = 0;
    updateChapter4UI();
    presentSchoolScenario();
}

function presentSchoolScenario() {
    if (chapter4.scenarioIndex >= chapter4.scenarios.length) {
        completeChapter4();
        return;
    }

    const scenario = chapter4.scenarios[chapter4.scenarioIndex];
    document.getElementById('school-time').textContent = scenario.time;
    document.getElementById('school-period').textContent = scenario.period;
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('scenario-desc').textContent = scenario.description;

    const choicesContainer = document.getElementById('scenario-choices');
    choicesContainer.innerHTML = '';

    scenario.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.onclick = () => makeSchoolChoice(index);
        choicesContainer.appendChild(button);
    });

    document.getElementById('consequence-display').textContent = '';
}

function makeSchoolChoice(choiceIndex) {
    const scenario = chapter4.scenarios[chapter4.scenarioIndex];
    const choice = scenario.choices[choiceIndex];

    chapter4.energy = Math.max(0, Math.min(100, chapter4.energy + choice.energy));
    document.getElementById('consequence-display').textContent = choice.consequence;

    updateChapter4UI();

    if (chapter4.energy <= 0) {
        setTimeout(() => {
            alert("Energy completely depleted.\n\nYou had to go home early. This happens to Maya several times a month.");
            initChapter4();
        }, 2000);
        return;
    }

    chapter4.scenarioIndex++;
    setTimeout(presentSchoolScenario, 3000);
}

function updateChapter4UI() {
    const energy = chapter4.energy;
    const bar = document.getElementById('school-energy-bar');
    const value = document.getElementById('school-energy');

    bar.style.width = energy + '%';
    value.textContent = energy;

    bar.classList.remove('low', 'critical');
    if (energy < 30) {
        bar.classList.add('critical');
    } else if (energy < 60) {
        bar.classList.add('low');
    }
}

function completeChapter4() {
    const message = chapter4.energy > 40
        ? `You made it through the school day with ${chapter4.energy} energy remaining!\n\nMost students finish the day at 70-80% energy.\n\nFor Maya, just surviving school is an achievement.`
        : `You barely made it through the school day...\n\nRemaining energy: ${chapter4.energy}\n\nAnd Maya still has homework, dinner, and basic self-care to do tonight.`;

    setTimeout(() => {
        if (confirm(message + "\n\nReady to learn more about the Electron Transport Chain?\n\n(Chapter 5)")) {
            startChapter(5);
        } else {
            returnToMenu();
        }
    }, 2000);
}

// ==========================================
// CHAPTER 5: ETC INTERACTIVE
// ==========================================

let chapter5 = {
    correctPlacements: 0,
    molecules: ['NADH', 'FADH2', 'Electron', 'O2', 'H+'],
    draggedElement: null
};

function initChapter5() {
    chapter5.correctPlacements = 0;
    createMolecules();
    setupDragAndDrop();
}

function createMolecules() {
    const container = document.getElementById('etc-molecules');
    container.innerHTML = '';

    chapter5.molecules.forEach(molecule => {
        const div = document.createElement('div');
        div.className = 'molecule';
        div.draggable = true;
        div.dataset.molecule = molecule;

        let display = molecule;
        if (molecule === 'FADH2') display = 'FADH₂';
        if (molecule === 'O2') display = 'O₂';
        if (molecule === 'H+') display = 'H⁺';

        div.textContent = display;
        container.appendChild(div);
    });
}

function setupDragAndDrop() {
    document.querySelectorAll('.molecule').forEach(molecule => {
        molecule.addEventListener('dragstart', (e) => {
            if (molecule.classList.contains('placed')) {
                e.preventDefault();
                return;
            }
            chapter5.draggedElement = e.target;
            e.target.classList.add('dragging');
        });

        molecule.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!zone.classList.contains('filled')) {
                zone.classList.add('drag-over');
            }
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            if (zone.classList.contains('filled') || !chapter5.draggedElement) return;

            const moleculeType = chapter5.draggedElement.dataset.molecule;
            const acceptedType = zone.dataset.accepts;

            if (moleculeType === acceptedType) {
                let display = moleculeType;
                if (moleculeType === 'FADH2') display = 'FADH₂';
                if (moleculeType === 'O2') display = 'O₂';
                if (moleculeType === 'H+') display = 'H⁺';

                zone.innerHTML = `<div class="molecule" style="cursor: default; margin: 0;">${display}</div>`;
                zone.classList.add('filled');
                chapter5.draggedElement.classList.add('placed');
                chapter5.correctPlacements++;

                if (chapter5.correctPlacements === 5) {
                    setTimeout(completeChapter5, 1000);
                }
            } else {
                zone.classList.add('error');
                setTimeout(() => zone.classList.remove('error'), 300);
            }

            chapter5.draggedElement = null;
        });
    });
}

function resetETC() {
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.innerHTML = '';
        zone.classList.remove('filled', 'drag-over', 'error');
    });

    document.querySelectorAll('.molecule').forEach(molecule => {
        molecule.classList.remove('placed', 'dragging');
    });

    chapter5.correctPlacements = 0;
    document.getElementById('etc-results').textContent = '';
}

function completeChapter5() {
    document.getElementById('etc-results').innerHTML = `
        <div style="background: #d1fae5; padding: 20px; border-radius: 10px; border-left: 4px solid #22c55e;">
            <strong>🎉 Perfect! You've completed the Electron Transport Chain!</strong>
            <p style="margin-top: 10px;">In healthy cells, this process produces 32-34 ATP molecules per glucose molecule.</p>
            <p>But remember: Maya's Complex IV is mutated, so her cells produce far less ATP - causing all the symptoms you experienced in her story.</p>
        </div>
    `;

    setTimeout(() => {
        if (confirm("All chapters complete!\n\nYou've experienced Maya's life and learned the science behind Leigh Syndrome.\n\nView Maya's final message?")) {
            showScreen('story-end');
        } else {
            returnToMenu();
        }
    }, 3000);
}

// ==========================================
// INITIALIZATION
// ==========================================

window.addEventListener('load', () => {
    showScreen('main-menu');
});
