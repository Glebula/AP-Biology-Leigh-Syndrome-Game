// ==========================================
// GLOBAL VARIABLES AND STATE
// ==========================================

let currentGame = null;
let currentScreen = 'main-menu';

// ==========================================
// SCREEN NAVIGATION
// ==========================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
}

function startGame(gameType) {
    currentGame = gameType;
    showTutorial(gameType);
}

function startGameFromTutorial() {
    if (currentGame === 'defense') {
        showScreen('defense-game');
        initDefenseGame();
    } else if (currentGame === 'energy') {
        showScreen('energy-game');
        resetEnergyGame();
    } else if (currentGame === 'pathway') {
        showScreen('pathway-game');
        initPathwayGame();
    }
}

function endGame(gameType) {
    if (gameType === 'defense') {
        stopDefenseGame();
    } else if (gameType === 'energy') {
        stopEnergyGame();
    }
    showScreen('main-menu');
    currentGame = null;
}

function restartCurrentGame() {
    if (currentGame) {
        startGameFromTutorial();
    }
}

// ==========================================
// TUTORIALS
// ==========================================

function showTutorial(gameType) {
    const tutorials = {
        defense: {
            title: 'Tutorial: Mitochondria Defense',
            content: `
                <h3>🎯 Objective</h3>
                <p>You are a mitochondrion inside a neuron. Your job is to produce ATP (energy) by collecting nutrients
                   while avoiding toxins and mutations that damage your function.</p>

                <h3>🎮 How to Play</h3>
                <ul>
                    <li><strong>Click on GREEN items</strong> (glucose and oxygen) to collect nutrients and produce ATP</li>
                    <li><strong>Avoid RED items</strong> (cyanide and mutations) - clicking them damages your mitochondria</li>
                    <li>Your <strong>ATP level</strong> constantly decreases - you must collect nutrients to maintain it</li>
                    <li>If ATP drops to 0, the neuron fails and symptoms of Leigh Syndrome appear</li>
                    <li>Survive for 60 seconds to win!</li>
                </ul>

                <h3>📚 What You'll Learn</h3>
                <p>This game teaches how mitochondria need specific nutrients (glucose and oxygen) to produce ATP through
                   cellular respiration. Toxins like cyanide and genetic mutations block this process, causing the energy
                   crisis seen in Leigh Syndrome.</p>
            `
        },
        energy: {
            title: 'Tutorial: Energy Meter Challenge',
            content: `
                <h3>🎯 Objective</h3>
                <p>Manage ATP levels while performing everyday tasks. Experience how mitochondrial dysfunction
                   causes rapid energy depletion in Leigh Syndrome patients.</p>

                <h3>🎮 How to Play</h3>
                <ul>
                    <li>Start with a full ATP bar (100 ATP)</li>
                    <li>Tasks appear that require energy (walking, breathing, thinking, etc.)</li>
                    <li>Click the task button to complete it - this uses ATP</li>
                    <li><strong>Normal cells</strong> regenerate ATP quickly between tasks</li>
                    <li><strong>After round 3:</strong> A mutation occurs! ATP regeneration becomes very slow</li>
                    <li>When ATP hits 0, symptoms appear and you lose</li>
                    <li>Try to complete as many tasks as possible!</li>
                </ul>

                <h3>📚 What You'll Learn</h3>
                <p>This game demonstrates how Leigh Syndrome patients struggle with basic activities due to insufficient
                   ATP production. Even simple tasks become exhausting when mitochondria can't keep up with energy demands.</p>
            `
        },
        pathway: {
            title: 'Tutorial: Electron Transport Chain Puzzle',
            content: `
                <h3>🎯 Objective</h3>
                <p>Learn how the Electron Transport Chain (ETC) produces ATP by correctly placing molecules
                   in the five complexes. Discover exactly how Leigh Syndrome disrupts this process.</p>

                <h3>🎮 How to Play</h3>
                <ul>
                    <li><strong>Drag molecules</strong> from the top to the correct complexes in the ETC</li>
                    <li><strong>Complex I</strong> accepts NADH (from glycolysis and Krebs cycle)</li>
                    <li><strong>Complex II</strong> accepts FADH₂ (from Krebs cycle)</li>
                    <li><strong>Complex III</strong> passes electrons through cytochromes</li>
                    <li><strong>Complex IV</strong> requires O₂ as the final electron acceptor</li>
                    <li><strong>Complex V</strong> uses H⁺ (protons) to synthesize ATP</li>
                    <li>Match all molecules correctly to complete the puzzle!</li>
                </ul>

                <h3>📚 What You'll Learn</h3>
                <p>Leigh Syndrome most commonly affects <strong>Complex IV</strong>. When this complex fails,
                   electrons can't reach oxygen, the entire electron transport chain backs up, and ATP production
                   stops - even though all other complexes might be working fine!</p>
            `
        }
    };

    const tutorial = tutorials[gameType];
    document.getElementById('tutorial-title').textContent = tutorial.title;
    document.getElementById('tutorial-content').innerHTML = tutorial.content;
    showScreen('tutorial-screen');
}

// ==========================================
// GAME 1: MITOCHONDRIA DEFENSE
// ==========================================

let defenseGame = {
    canvas: null,
    ctx: null,
    items: [],
    atp: 100,
    score: 0,
    timeLeft: 60,
    gameActive: false,
    animationId: null,
    timerInterval: null,
    spawnInterval: null,
    itemTypes: {
        glucose: { color: '#00ff00', points: 10, atpChange: 15, label: 'Glucose', good: true },
        oxygen: { color: '#00ffff', points: 10, atpChange: 15, label: 'O₂', good: true },
        cyanide: { color: '#ff0000', points: -20, atpChange: -25, label: 'Cyanide', good: false },
        mutation: { color: '#ff00ff', points: -15, atpChange: -20, label: 'Mutation', good: false }
    }
};

function initDefenseGame() {
    defenseGame.canvas = document.getElementById('defense-canvas');
    defenseGame.ctx = defenseGame.canvas.getContext('2d');
    defenseGame.items = [];
    defenseGame.atp = 100;
    defenseGame.score = 0;
    defenseGame.timeLeft = 60;
    defenseGame.gameActive = true;

    updateDefenseUI();

    // Add click listener
    defenseGame.canvas.addEventListener('click', handleDefenseClick);

    // Start game loops
    defenseGame.animationId = requestAnimationFrame(updateDefenseGame);
    defenseGame.timerInterval = setInterval(updateDefenseTimer, 1000);
    defenseGame.spawnInterval = setInterval(spawnDefenseItem, 1000);

    document.getElementById('defense-status').textContent = 'Collect nutrients! Avoid toxins!';
    document.getElementById('defense-status').className = 'status-message info';
}

function spawnDefenseItem() {
    if (!defenseGame.gameActive) return;

    const types = Object.keys(defenseGame.itemTypes);
    const randomType = types[Math.floor(Math.random() * types.length)];
    const itemData = defenseGame.itemTypes[randomType];

    const item = {
        type: randomType,
        x: Math.random() * (defenseGame.canvas.width - 60) + 30,
        y: -30,
        speed: 1 + Math.random() * 2,
        radius: 25,
        data: itemData
    };

    defenseGame.items.push(item);
}

function updateDefenseGame() {
    if (!defenseGame.gameActive) return;

    const ctx = defenseGame.ctx;
    const canvas = defenseGame.canvas;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw items
    defenseGame.items = defenseGame.items.filter(item => {
        item.y += item.speed;

        // Remove items that fell off screen
        if (item.y > canvas.height + 50) {
            return false;
        }

        // Draw item
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = item.data.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.data.label, item.x, item.y + 5);

        return true;
    });

    // Passive ATP drain
    if (Math.random() < 0.01) {
        defenseGame.atp = Math.max(0, defenseGame.atp - 1);
        updateDefenseUI();
    }

    // Check game over
    if (defenseGame.atp <= 0) {
        gameOverDefense(false);
    }

    defenseGame.animationId = requestAnimationFrame(updateDefenseGame);
}

function handleDefenseClick(event) {
    if (!defenseGame.gameActive) return;

    const rect = defenseGame.canvas.getBoundingClientRect();
    const scaleX = defenseGame.canvas.width / rect.width;
    const scaleY = defenseGame.canvas.height / rect.height;
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    // Check if clicked on any item
    for (let i = defenseGame.items.length - 1; i >= 0; i--) {
        const item = defenseGame.items[i];
        const distance = Math.sqrt(
            Math.pow(clickX - item.x, 2) + Math.pow(clickY - item.y, 2)
        );

        if (distance <= item.radius) {
            // Hit!
            defenseGame.score += item.data.points;
            defenseGame.atp = Math.min(100, Math.max(0, defenseGame.atp + item.data.atpChange));

            // Show feedback
            const status = document.getElementById('defense-status');
            if (item.data.good) {
                status.textContent = `+${item.data.atpChange} ATP! Collected ${item.data.label}`;
                status.className = 'status-message success';
            } else {
                status.textContent = `${item.data.atpChange} ATP! Hit ${item.data.label}!`;
                status.className = 'status-message error';
            }

            // Remove item
            defenseGame.items.splice(i, 1);
            updateDefenseUI();
            break;
        }
    }
}

function updateDefenseTimer() {
    if (!defenseGame.gameActive) return;

    defenseGame.timeLeft--;
    updateDefenseUI();

    if (defenseGame.timeLeft <= 0) {
        gameOverDefense(true);
    }
}

function updateDefenseUI() {
    document.getElementById('defense-atp').textContent = Math.round(defenseGame.atp);
    document.getElementById('defense-score').textContent = defenseGame.score;
    document.getElementById('defense-time').textContent = defenseGame.timeLeft;
}

function stopDefenseGame() {
    defenseGame.gameActive = false;
    if (defenseGame.animationId) {
        cancelAnimationFrame(defenseGame.animationId);
    }
    if (defenseGame.timerInterval) {
        clearInterval(defenseGame.timerInterval);
    }
    if (defenseGame.spawnInterval) {
        clearInterval(defenseGame.spawnInterval);
    }
}

function gameOverDefense(won) {
    stopDefenseGame();

    const title = won ? '🎉 Neuron Survived!' : '💔 Neuron Failed';
    const content = won
        ? `<p><strong>Congratulations!</strong> You successfully maintained ATP production for 60 seconds.</p>
           <p>Final Score: <strong>${defenseGame.score}</strong></p>
           <p>Final ATP: <strong>${Math.round(defenseGame.atp)}</strong></p>
           <div class="info-box">
               <p>In healthy cells, mitochondria constantly produce ATP by processing glucose and oxygen.
                  In Leigh Syndrome, mutations prevent this process, causing severe energy deficiency
                  in high-energy organs like the brain.</p>
           </div>`
        : `<p><strong>ATP Depleted!</strong> The neuron has run out of energy.</p>
           <p>Final Score: <strong>${defenseGame.score}</strong></p>
           <div class="info-box">
               <p><strong>Leigh Syndrome Symptoms Appear:</strong></p>
               <ul>
                   <li>Muscle weakness and poor muscle tone</li>
                   <li>Loss of motor skills</li>
                   <li>Difficulty breathing</li>
                   <li>Seizures and neurological problems</li>
               </ul>
               <p>This is what happens when mitochondria can't produce enough ATP to meet the body's needs.</p>
           </div>`;

    document.getElementById('gameover-title').textContent = title;
    document.getElementById('gameover-content').innerHTML = content;
    showScreen('gameover-screen');
}

// ==========================================
// GAME 2: ENERGY METER CHALLENGE
// ==========================================

let energyGame = {
    atp: 100,
    maxAtp: 100,
    tasksCompleted: 0,
    round: 1,
    currentTask: null,
    mutated: false,
    gameActive: false,
    regenInterval: null,
    tasks: [
        { name: 'Walk across the room', cost: 15 },
        { name: 'Breathe deeply', cost: 10 },
        { name: 'Think and solve a problem', cost: 12 },
        { name: 'Pick up an object', cost: 8 },
        { name: 'Speak a sentence', cost: 7 },
        { name: 'Stand up from sitting', cost: 13 },
        { name: 'Climb a few stairs', cost: 20 },
        { name: 'Write your name', cost: 11 },
        { name: 'Chew and swallow food', cost: 9 },
        { name: 'Focus your eyes', cost: 6 }
    ]
};

function startEnergyGame() {
    energyGame.gameActive = true;
    energyGame.atp = 100;
    energyGame.tasksCompleted = 0;
    energyGame.round = 1;
    energyGame.mutated = false;

    updateEnergyUI();
    presentTask();

    // Start ATP regeneration
    energyGame.regenInterval = setInterval(regenerateATP, 500);

    document.getElementById('start-energy-btn').disabled = true;
}

function regenerateATP() {
    if (!energyGame.gameActive) return;

    const regenRate = energyGame.mutated ? 1 : 5; // Much slower regen after mutation
    energyGame.atp = Math.min(energyGame.maxAtp, energyGame.atp + regenRate);
    updateEnergyUI();
}

function presentTask() {
    if (!energyGame.gameActive) return;

    const randomTask = energyGame.tasks[Math.floor(Math.random() * energyGame.tasks.length)];
    energyGame.currentTask = randomTask;

    document.getElementById('current-task').textContent = `Task: ${randomTask.name}`;
    document.getElementById('task-buttons').innerHTML = `
        <button class="task-btn" onclick="performTask()">
            Perform Task (${randomTask.cost} ATP)
        </button>
    `;

    // Check for mutation trigger
    if (energyGame.round === 4 && !energyGame.mutated) {
        triggerMutation();
    }
}

function performTask() {
    if (!energyGame.gameActive || !energyGame.currentTask) return;

    const cost = energyGame.currentTask.cost;

    if (energyGame.atp >= cost) {
        energyGame.atp -= cost;
        energyGame.tasksCompleted++;

        if (energyGame.tasksCompleted % 5 === 0) {
            energyGame.round++;
        }

        updateEnergyUI();

        if (energyGame.mutated) {
            document.getElementById('energy-status').textContent =
                `Task completed, but ATP regeneration is severely impaired! Tasks: ${energyGame.tasksCompleted}`;
            document.getElementById('energy-status').className = 'status-message warning';
        } else {
            document.getElementById('energy-status').textContent =
                `Task completed! ATP regenerating normally. Tasks: ${energyGame.tasksCompleted}`;
            document.getElementById('energy-status').className = 'status-message success';
        }

        setTimeout(presentTask, 1500);
    } else {
        document.getElementById('energy-status').textContent =
            'Not enough ATP! Wait for regeneration...';
        document.getElementById('energy-status').className = 'status-message error';
    }

    if (energyGame.atp <= 0) {
        gameOverEnergy();
    }
}

function triggerMutation() {
    energyGame.mutated = true;

    document.getElementById('energy-status').innerHTML =
        `<strong>⚠️ MUTATION OCCURRED!</strong> Mitochondrial Complex IV damaged! ATP regeneration severely reduced!`;
    document.getElementById('energy-status').className = 'status-message error';

    // Visual effect on meter
    document.getElementById('atp-bar').style.animation = 'pulse 0.5s 3';
}

function updateEnergyUI() {
    const percentage = (energyGame.atp / energyGame.maxAtp) * 100;
    const bar = document.getElementById('atp-bar');

    bar.style.width = percentage + '%';

    // Color coding
    bar.classList.remove('low', 'critical');
    if (percentage < 30) {
        bar.classList.add('critical');
    } else if (percentage < 60) {
        bar.classList.add('low');
    }

    document.getElementById('atp-value').textContent =
        `${Math.round(energyGame.atp)} / ${energyGame.maxAtp}`;
    document.getElementById('energy-tasks').textContent = energyGame.tasksCompleted;
    document.getElementById('energy-round').textContent = energyGame.round;
}

function stopEnergyGame() {
    energyGame.gameActive = false;
    if (energyGame.regenInterval) {
        clearInterval(energyGame.regenInterval);
    }
}

function resetEnergyGame() {
    stopEnergyGame();
    energyGame.atp = 100;
    energyGame.tasksCompleted = 0;
    energyGame.round = 1;
    energyGame.mutated = false;
    updateEnergyUI();
    document.getElementById('current-task').textContent = 'Click Start to Begin';
    document.getElementById('task-buttons').innerHTML = '';
    document.getElementById('energy-status').textContent = '';
    document.getElementById('start-energy-btn').disabled = false;
}

function gameOverEnergy() {
    stopEnergyGame();

    const content = `
        <p><strong>ATP Depleted!</strong> Energy crisis has occurred.</p>
        <p>Tasks Completed: <strong>${energyGame.tasksCompleted}</strong></p>
        <p>Rounds Survived: <strong>${energyGame.round}</strong></p>
        <div class="info-box">
            <p><strong>What happened?</strong></p>
            <p>After the mutation occurred in round 4, your mitochondria could barely regenerate ATP.
               Even simple tasks became impossible to perform - just like in Leigh Syndrome patients.</p>
            <p><strong>Leigh Syndrome Impact:</strong> Patients experience extreme fatigue and weakness
               because their cells cannot produce enough ATP to meet basic energy demands. Simple activities
               that healthy people take for granted become exhausting or impossible.</p>
        </div>
    `;

    document.getElementById('gameover-title').textContent = '💔 Energy Crisis';
    document.getElementById('gameover-content').innerHTML = content;
    showScreen('gameover-screen');
}

// ==========================================
// GAME 3: PATHWAY PUZZLE - ETC
// ==========================================

let pathwayGame = {
    correctPlacements: 0,
    mistakes: 0,
    molecules: ['NADH', 'FADH2', 'Electron', 'O2', 'H+'],
    draggedElement: null
};

function initPathwayGame() {
    pathwayGame.correctPlacements = 0;
    pathwayGame.mistakes = 0;
    updatePathwayUI();
    createMolecules();
    setupDragAndDrop();
}

function createMolecules() {
    const container = document.getElementById('molecules-container');
    container.innerHTML = '';

    pathwayGame.molecules.forEach(molecule => {
        const div = document.createElement('div');
        div.className = 'molecule';
        div.draggable = true;
        div.dataset.molecule = molecule;

        // Display formatting
        let display = molecule;
        if (molecule === 'FADH2') display = 'FADH₂';
        if (molecule === 'O2') display = 'O₂';
        if (molecule === 'H+') display = 'H⁺';

        div.textContent = display;
        container.appendChild(div);
    });
}

function setupDragAndDrop() {
    // Drag start
    document.querySelectorAll('.molecule').forEach(molecule => {
        molecule.addEventListener('dragstart', (e) => {
            if (molecule.classList.contains('placed')) {
                e.preventDefault();
                return;
            }
            pathwayGame.draggedElement = e.target;
            e.target.classList.add('dragging');
        });

        molecule.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    // Drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!zone.classList.contains('filled')) {
                zone.classList.add('drag-over');
            }
        });

        zone.addEventListener('dragleave', (e) => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            if (zone.classList.contains('filled') || !pathwayGame.draggedElement) {
                return;
            }

            const moleculeType = pathwayGame.draggedElement.dataset.molecule;
            const acceptedType = zone.dataset.accepts;

            if (moleculeType === acceptedType) {
                // Correct placement!
                let display = moleculeType;
                if (moleculeType === 'FADH2') display = 'FADH₂';
                if (moleculeType === 'O2') display = 'O₂';
                if (moleculeType === 'H+') display = 'H⁺';

                zone.innerHTML = `<div class="molecule" style="cursor: default;">${display}</div>`;
                zone.classList.add('filled');
                pathwayGame.draggedElement.classList.add('placed');
                pathwayGame.correctPlacements++;

                document.getElementById('pathway-status').textContent =
                    `✓ Correct! ${display} belongs in this complex!`;
                document.getElementById('pathway-status').className = 'status-message success';

                updatePathwayUI();

                // Check if puzzle complete
                if (pathwayGame.correctPlacements === 5) {
                    completePuzzle();
                }
            } else {
                // Wrong placement
                zone.classList.add('error');
                setTimeout(() => zone.classList.remove('error'), 300);
                pathwayGame.mistakes++;

                document.getElementById('pathway-status').textContent =
                    `✗ Incorrect! This molecule doesn't belong in this complex.`;
                document.getElementById('pathway-status').className = 'status-message error';

                updatePathwayUI();
            }

            pathwayGame.draggedElement = null;
        });
    });
}

function updatePathwayUI() {
    document.getElementById('pathway-correct').textContent = pathwayGame.correctPlacements;
    document.getElementById('pathway-mistakes').textContent = pathwayGame.mistakes;
}

function resetPathwayGame() {
    // Clear all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.innerHTML = '';
        zone.classList.remove('filled', 'drag-over', 'error');
    });

    // Reset molecules
    document.querySelectorAll('.molecule').forEach(molecule => {
        molecule.classList.remove('placed', 'dragging');
    });

    pathwayGame.correctPlacements = 0;
    pathwayGame.mistakes = 0;
    updatePathwayUI();

    document.getElementById('pathway-status').textContent = '';
    document.getElementById('pathway-status').className = 'status-message';
}

function completePuzzle() {
    const content = `
        <p><strong>🎉 Puzzle Complete!</strong> You've successfully assembled the Electron Transport Chain!</p>
        <p>Correct Placements: <strong>5/5</strong></p>
        <p>Mistakes: <strong>${pathwayGame.mistakes}</strong></p>

        <div class="info-box">
            <h3>How the ETC Produces ATP:</h3>
            <ol>
                <li><strong>Complex I & II:</strong> Accept electrons from NADH and FADH₂</li>
                <li><strong>Complex III:</strong> Electrons move through cytochromes</li>
                <li><strong>Complex IV:</strong> Electrons combine with O₂ (oxygen) and H⁺ to form water</li>
                <li><strong>Proton Pumping:</strong> As electrons move, H⁺ ions are pumped across the membrane</li>
                <li><strong>Complex V (ATP Synthase):</strong> H⁺ flows back through, driving ATP production</li>
            </ol>
        </div>

        <div class="info-box" style="background: #fff3cd; border-left-color: #ffc107;">
            <h3>⚠️ Leigh Syndrome & Complex IV</h3>
            <p>Most cases of Leigh Syndrome involve mutations in <strong>Complex IV (Cytochrome c Oxidase)</strong>.
               When Complex IV can't accept electrons, the entire chain backs up and stops working.</p>
            <p>Without a functioning ETC, cells can't produce enough ATP. This is especially devastating for
               high-energy organs like the brain, causing the severe neurological symptoms of Leigh Syndrome.</p>
        </div>
    `;

    document.getElementById('gameover-title').textContent = '🧬 ETC Complete!';
    document.getElementById('gameover-content').innerHTML = content;
    showScreen('gameover-screen');
}

// ==========================================
// INITIALIZATION
// ==========================================

// Show main menu on load
window.addEventListener('load', () => {
    showScreen('main-menu');
});
