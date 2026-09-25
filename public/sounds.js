// =====================================================
// SISTEMA DE SONIDOS - EXUS CORE
// No necesita archivos MP3
// =====================================================

let audioContext = null;
let ambientStarted = false;

// Crear sistema de audio
function initAudio() {
    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}

// -----------------------------------------------------
// SONIDO DE SALTO
// -----------------------------------------------------

function jumpSound() {
    initAudio();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "square";

    oscillator.frequency.setValueAtTime(
        180,
        audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        500,
        audioContext.currentTime + 0.12
    );

    gain.gain.setValueAtTime(
        0.12,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.15
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(
        audioContext.currentTime + 0.15
    );
}

// -----------------------------------------------------
// PASOS
// -----------------------------------------------------

function footstepsSound() {
    initAudio();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "triangle";

    oscillator.frequency.setValueAtTime(
        80,
        audioContext.currentTime
    );

    gain.gain.setValueAtTime(
        0.08,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.08
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(
        audioContext.currentTime + 0.08
    );
}

// -----------------------------------------------------
// SONIDO DE PRUEBA
// -----------------------------------------------------

function testSound() {
    initAudio();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sawtooth";

    oscillator.frequency.setValueAtTime(
        220,
        audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        660,
        audioContext.currentTime + 0.25
    );

    gain.gain.setValueAtTime(
        0.15,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.3
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(
        audioContext.currentTime + 0.3
    );
}

// -----------------------------------------------------
// FUNCIONES QUE USA game.js
// -----------------------------------------------------

export function playSound(name) {

    if (name === "jump") {
        jumpSound();
    }

    if (name === "footsteps") {
        footstepsSound();
    }

    if (name === "test") {
        testSound();
    }
}

// -----------------------------------------------------
// AMBIENTE
// -----------------------------------------------------

export function startAmbient() {

    initAudio();

    if (ambientStarted) return;

    ambientStarted = true;

    // Sonido inicial para comprobar que el audio funciona
    testSound();

    console.log("🔊 AUDIO EXUS CORE ACTIVADO");
}

export function stopSound(name) {

    console.log("🔇 Deteniendo sonido:", name);
}