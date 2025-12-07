// --- CONFIGURAZIONE GIOCO ---
const GAME_DURATION = 30; // Tempo in secondi
const LEVEL_GOALS = [
    { level: 1, tapsNeeded: 50 },
    { level: 2, tapsNeeded: 75 },
    { level: 3, tapsNeeded: 100 },
    { level: 4, tapsNeeded: 125 },
    { level: 5, tapsNeeded: 150 } // Livello finale
];

// --- STATO DEL GIOCO ---
let currentLevel = 1;
let tapsOnCurrentLevel = 0;
let timeLeft = GAME_DURATION;
let gameRunning = false;
let timerInterval;

// --- RIFERIMENTI DOM (corretti per l'HTML aggiornato) ---
const tapButton = document.getElementById('tapButton');
const liquidElement = document.querySelector('.liquid');
const timerValueDisplay = document.getElementById('timeValue'); // Correzione ID
const levelDisplay = document.getElementById('currentLevel');
const messageDisplay = document.getElementById('message');

// Funzione per avviare o resettare il gioco
function startGame() {
    // Reset dello stato
    currentLevel = 1;
    tapsOnCurrentLevel = 0;
    timeLeft = GAME_DURATION;
    gameRunning = true;

    // Reset UI
    messageDisplay.textContent = '';
    tapButton.disabled = false;
    tapButton.textContent = '+'; // Ripristina il testo del bottone
    updateUI();

    // Avvio del timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        
        // Aggiorna il timer nella UI immediatamente
        timerValueDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            gameOver(false); // Tempo scaduto
        }
    }, 1000);
}

// Funzione che aggiorna l'interfaccia utente (UI)
function updateUI() {
    const currentGoal = LEVEL_GOALS.find(g => g.level === currentLevel);
    if (!currentGoal) {
        return; 
    }

    // Calcola la percentuale di riempimento
    const fillPercentage = Math.min(100, (tapsOnCurrentLevel / currentGoal.tapsNeeded) * 100);

    // Aggiorna l'altezza del liquido
    liquidElement.style.height = `${fillPercentage}%`;

    // Aggiorna il testo del Livello
    levelDisplay.textContent = currentLevel;
}

// Funzione gestita al click del bottone
function handleTap() {
    if (!gameRunning) {
        startGame(); // Avvia il gioco al primo tap
        return;
    }

    tapsOnCurrentLevel++;
    updateUI();

    const currentGoal = LEVEL_GOALS.find(g => g.level === currentLevel);

    // Controlla se il livello è stato completato
    if (tapsOnCurrentLevel >= currentGoal.tapsNeeded) {
        levelComplete();
    }
}

// Funzione chiamata quando un livello è completato
function levelComplete() {
    // Aggiorna l'altezza al 100% prima di resettare l'animazione
    liquidElement.style.height = '100%'; 

    const nextLevel = currentLevel + 1;
    
    // Controlla se hai completato l'ultimo livello
    if (nextLevel > LEVEL_GOALS.length) {
        gameOver(true); // Vittoria!
        return;
    }

    // Passa al livello successivo
    currentLevel = nextLevel;
    tapsOnCurrentLevel = 0; // Azzera i tap per il nuovo livello
    
    // Feedback visivo
    messageDisplay.textContent = `Livello Completato! Passa al Livello ${currentLevel}!`;
    messageDisplay.style.color = '#4caf50'; // Verde
    
    // Ritorna il liquido a 0% per il nuovo livello (avverrà nella prossima updateUI)
    setTimeout(updateUI, 300); // Lieve ritardo per far vedere il livello completo prima che scenda
}

// Funzione di fine gioco
function gameOver(isWin) {
    gameRunning = false;
    clearInterval(timerInterval);
    
    tapButton.disabled = true;
    tapButton.textContent = 'RICOMINCIA';

    if (isWin) {
        messageDisplay.textContent = "🏆 HAI VINTO! Complimenti!";
        messageDisplay.style.color = '#00e676'; 
        liquidElement.style.height = '100%'; // Pieno
    } else {
        // Solo se il tempo è scaduto O il gioco non è mai iniziato
        if (timeLeft <= 0 && currentLevel <= LEVEL_GOALS.length) {
            messageDisplay.textContent = "⌛ TEMPO SCADUTO! Prova Ancora.";
            messageDisplay.style.color = '#f44336'; 
        } else if (currentLevel === 1) {
             messageDisplay.textContent = "Clicca (+) per Iniziare!";
        }
        
    }
    
    // Ricollega handleTap (che include la logica di startGame) per il riavvio.
    tapButton.onclick = handleTap; 
}


// --- INIZIALIZZAZIONE ---
// 1. Aggancia la funzione handleTap al click del bottone
tapButton.addEventListener('click', handleTap);

// 2. Imposta lo stato iniziale
// Chiamo updateUI una volta e setto il timer
updateUI();
timerValueDisplay.textContent = GAME_DURATION;
