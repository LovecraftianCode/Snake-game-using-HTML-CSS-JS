/*
Ideas para implementar en el juego 
- Implementar niveles de dificultad que aumenten la velocidad de la serpiente a medida que el jugador avanza.
- Agregar un sistema de passwords que permitan saltar a niveles superiores o desbloquear skins para la serpiente.
- Agregar obstáculos en el tablero que la serpiente deba evitar en nivles altos de dificultad.
- Agregar sonido para cuando la serpiente come la comida o cuando el juego termina.
*/


//Get the Canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');//El contexto del canvas es el área donde se dibuja el juego

//Declarar la dirección inicial
let direction = 'right';

//Represent the snake as an array of segments
let snake = [
    {x: 150, y: 150},//La cabeza de la serpiente es el primer elemento del array
    {x: 140, y: 150},//Cada segmento de la serpiente es un objeto con coordenadas x e y
    {x: 130, y: 150},//La serpiente comienza con tres segmentos, y cada segmento está a 10 píxeles de distancia del siguiente
    {x: 120, y: 150}, //Segmento 4
    {x: 110, y: 150},//Segmento 5
];

//varibles para el score del juego 
let score = 0;

//Variables para la comida
let foodX, foodY;

//Creando y dibujando la serpiente
function drawSnake() {
    ctx.fillStyle = 'green';//Color de la serpiente
    ctx.strokeStyle = 'darkgreen';//Color del borde de la serpiente
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 10, 10);//Dibuja un rectángulo para cada segmento de la serpiente
        ctx.strokeRect(segment.x, segment.y, 10, 10);//Dibuja el borde del rectángulo
    });
}

//Movimiento de la serpiente
function advanceSnake() {
    const head = {x: snake[0].x, y: snake[0].y};//La cabeza de la serpiente es el primer elemento del array
    //Actualizar la posición de la cabeza según la dirección actual
    switch (direction) {
        case 'right':
            head.x += 10;
            break;
        case 'left':
            head.x -= 10;
            break;
        case 'up':
            head.y -= 10;
            break;
        case 'down':
            head.y += 10;
            break;
    }
    snake.unshift(head);//Agrega la nueva cabeza al inicio del array
    snake.pop();//Elimina el último segmento de la serpiente para simular el movimiento
}

// ========== CONTROLES POR DESLIZAMIENTO (SWIPE) ==========
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    touchStartX = touch.clientX - rect.left;
    touchStartY = touch.clientY - rect.top;
}

function handleTouchEnd(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    touchEndX = touch.clientX - rect.left;
    touchEndY = touch.clientY - rect.top;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Determinar si fue horizontal o vertical (mayor distancia)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
        // Deslizamiento horizontal
        if (deltaX > 0 && direction !== 'left') {
            direction = 'right';
        } else if (deltaX < 0 && direction !== 'right') {
            direction = 'left';
        }
    } else if (Math.abs(deltaY) > 20) {
        // Deslizamiento vertical
        if (deltaY > 0 && direction !== 'up') {
            direction = 'down';
        } else if (deltaY < 0 && direction !== 'down') {
            direction = 'up';
        }
    }
}

// Agregar event listeners para swipe
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchend', handleTouchEnd, false);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);//Limpia el canvas antes de redibujar la serpiente
}

// Control de la dirección de la serpiente (VERSIÓN CORREGIDA)
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const keyPressed = event.keyCode;
    
    // Evita que la serpiente se dé la vuelta sobre sí misma
    if (keyPressed === LEFT_KEY && direction !== 'right') {
        direction = 'left';
    }
    if (keyPressed === UP_KEY && direction !== 'down') {
        direction = 'up';
    }
    if (keyPressed === RIGHT_KEY && direction !== 'left') {
        direction = 'right';
    }
    if (keyPressed === DOWN_KEY && direction !== 'up') {
        direction = 'down';
    }
}

document.addEventListener('keydown', changeDirection);//Agrega un event listener para detectar las teclas presionadas

//Generar comida para la serpiente
function randomTen(min, max) {
    // Asegura que min y max sean múltiplos de 10
    const roundedMin = Math.ceil(min / 10) * 10;
    const roundedMax = Math.floor(max / 10) * 10;
    const randomValue = Math.random() * (roundedMax - roundedMin) + roundedMin;
    return Math.round(randomValue / 10) * 10;
}

function createFood() { 
    foodX = randomTen(0, canvas.width - 10);
    foodY = randomTen(0, canvas.height - 10);
    
    // Verificar si la comida está sobre la serpiente
    let foodOnSnake = false;
    snake.forEach(part => {
        if (part.x === foodX && part.y === foodY) {
            foodOnSnake = true;
        }
    });
    
    if (foodOnSnake) {
        createFood();  // Reintentar
    }
}

createFood();//Genera la comida al inicio del juego

function drawFood() { 
    ctx.fillStyle = 'red'; 
    ctx.strokeStyle = 'darkred';  // ← CORREGIDO
    ctx.fillRect(foodX, foodY, 10, 10); 
    ctx.strokeRect(foodX, foodY, 10, 10);
}


function checkEat() {
    const head = snake[0];
    if (head.x === foodX && head.y === foodY) {
        // Comió la comida
        const newSegment = {x: snake[snake.length-1].x, y: snake[snake.length-1].y};
        snake.push(newSegment);  // Crece la serpiente
        createFood();            // Nueva comida
        score += 10;
        document.getElementById('score').innerHTML = score + " puntos"; // Actualiza el score en el DOM
    }
}

//final del juego?
function didGameEnd() {  
    const head = snake[0];
    
    // Colisión con paredes
    if (head.x < 0 || head.x > canvas.width - 10 || 
        head.y < 0 || head.y > canvas.height - 10) {
        return true;
    }
    
    // Colisión con el cuerpo (empezando desde índice 1 o 4)
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    
    return false;
}

// Guardar el ID del intervalo en una variable
let gameLoop = null;
let gameActive = true;

// FUNCIÓN PARA REINICIAR EL JUEGO

function restartGame() {
    // 1. Detener el juego actual si está corriendo
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    
    // 2. Reiniciar todas las variables
    gameActive = true;
    direction = 'right';
    score = 0;
    snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150},
    ];
    
    // 3. Actualizar el marcador en pantalla
    document.getElementById('score').innerHTML = score;
    
    // Ocultar el botón de restart
    document.getElementById('restartBtn').style.display = 'none';
    
    // 4. Generar nueva comida (asegurando que no esté sobre la serpiente)
    createFood();
    
    // 5. Limpiar el canvas y dibujar el estado inicial
    clearCanvas();
    drawFood();
    drawSnake();
    
    // 6. Iniciar el juego nuevamente
    startGame();
}

function startGame() {
    if (gameLoop) clearInterval(gameLoop); // Limpiar intervalo anterior si existe
    gameLoop = setInterval(() => {
        if (!gameActive) return; // Si el juego terminó, no hacer nada
        
        clearCanvas();
        advanceSnake();
        checkEat();
        drawFood();
        drawSnake();
        
        if (didGameEnd()) {
            gameActive = false;  // Detener el movimiento
            document.getElementById('score').innerHTML = score + " - Game Over!";
            document.getElementById('restartBtn').style.display = 'block'; // Mostrar el botón
            clearInterval(gameLoop);  // ← DETENER el intervalo completamente
            gameLoop = null;
        }
    }, 100);
}

const restartBtn = document.getElementById('restartBtn');
if (restartBtn) {
    restartBtn.addEventListener('click', restartGame);
}

// Iniciar el juego
startGame();
