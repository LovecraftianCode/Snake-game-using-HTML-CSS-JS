# 🐍 Snake Game - Clásico de la Viborita

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)

> **El clásico juego de Snake (la viborita)** desarrollado con HTML5 Canvas, JavaScript puro y CSS.  
> *¡Come la comida, crece y evita chocar con las paredes o tu propio cuerpo!*

## 🎮 Demo en vivo

<img width="612" height="826" alt="Grabación 2026-05-07 181157" src="https://github.com/user-attachments/assets/58764897-ab33-46ff-b817-ddfe709449e4" />

**¡Juega ahora!** → [Snake Game en GitHub Pages](https://lovecraftiancode.github.io/Snake-game-using-HTML-CSS-JS/)

## Tabla de Contenidos
- [Sobre este proyecto](#sobre-este-proyecto)
- [Características del juego](#características-del-juego)
- [Controles](#controles)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Conceptos aprendidos](#conceptos-aprendidos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Explicación del código](#explicación-del-código)
- [Cómo ejecutar localmente](#cómo-ejecutar-localmente)
- [Próximas mejoras](#próximas-mejoras)
- [Autor](#autor)

## Sobre este proyecto

Este proyecto es mi versión personal del clásico juego **Snake**. El código base y la lógica fundamental fueron desarrollados siguiendo el excelente tutorial de **[Panayiotis Nicolaou]**(https://www.freecodecamp.org/news/think-like-a-programmer-how-to-build-snake-using-only-javascript-html-and-css-7b1479c3339e) para freeCodeCamp. A partir de esa base, he añadido mejoras como controles táctiles para móviles, un diseño responsive y un botón de reinicio, entre otras características.

- Manipulación del **canvas de HTML5**
- Manejo de **eventos de teclado y táctiles**
- **Lógica de juego** en tiempo real con `setInterval`
- **Detección de colisiones** en un sistema de coordenadas 2D
- **Diseño responsive** que funciona en PC y dispositivos móviles

**Objetivo:** Crear un juego completamente funcional sin usar frameworks ni librerías externas, solo JavaScript puro, CSS3 y HTML5.

## Características del juego

| Característica | Descripción |
|----------------|-------------|
| **Movimiento fluido** | La serpiente se mueve en cuadrícula de 10x10 píxeles |
| **Sistema de puntuación** | +10 puntos por cada comida recolectada |
| **Detección de colisiones** | Con paredes y con el propio cuerpo |
| **Reinicio instantáneo** | Botón para empezar una nueva partida |
| **Controles táctiles** | Deslizamiento (swipe) en dispositivos móviles |
| **Controles por teclado** | Flechas direccionales en PC |
| **Diseño neón** | Bordes rojos sobre fondo negro |

## Controles

| Dispositivo | Acción | Control |
|-------------|--------|---------|
| **PC** | Moverse hacia arriba | Flecha arriba |
| **PC** | Moverse hacia abajo | Flecha abajo |
| **PC** | Moverse hacia izquierda | Flecha izquierda |
| **PC** | Moverse hacia derecha | Flecha derecha |
| **Móvil** | Moverse en cualquier dirección | Deslizar el dedo sobre el canvas |
| **Ambos** | Reiniciar partida | Botón "Restart Game" |

## Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| **HTML5 Canvas** | Renderizado del juego (serpiente, comida, bordes) |
| **CSS3** | Estilos, diseño responsive, media queries |
| **JavaScript ES6+** | Lógica del juego, eventos, manipulación del canvas |
| **Git & GitHub Pages** | Control de versiones y despliegue |

## Conceptos aprendidos

### Renderizado con Canvas
```javascript
// Dibujar un segmento de la serpiente
ctx.fillStyle = 'green';
ctx.fillRect(x, y, 10, 10);
ctx.strokeStyle = 'darkgreen';
ctx.strokeRect(x, y, 10, 10);
```

### Movimiento de la serpiente
```javascript
function advanceSnake() {
    // Crear nueva cabeza según la dirección
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch (direction) {
        case 'right': head.x += 10; break;
        case 'left':  head.x -= 10; break;
        case 'up':    head.y -= 10; break;
        case 'down':  head.y += 10; break;
    }
    
    // Agregar nueva cabeza y eliminar la cola
    snake.unshift(head);
    snake.pop();
}
```

### Detección de colisiones
```javascript
function didGameEnd() {
    const head = snake[0];
    
    // Colisión con paredes
    if (head.x < 0 || head.x > canvas.width - 10 || 
        head.y < 0 || head.y > canvas.height - 10) {
        return true;
    }
    
    // Colisión con el cuerpo
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}
```

### Controles táctiles (swipe)

```javascript
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);

function handleTouchEnd(e) {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Determinar dirección del deslizamiento
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
        // Deslizamiento horizontal
        direction = deltaX > 0 ? 'right' : 'left';
    } else if (Math.abs(deltaY) > 20) {
        // Deslizamiento vertical
        direction = deltaY > 0 ? 'down' : 'up';
    }
}
```

### Comida y crecimiento
```javascript
function checkEat() {
    const head = snake[0];
    if (head.x === foodX && head.y === foodY) {
        // Agregar un nuevo segmento al final
        const newSegment = {x: snake[snake.length-1].x, y: snake[snake.length-1].y};
        snake.push(newSegment);
        
        // Generar nueva comida
        createFood();
        
        // Aumentar puntuación
        score += 10;
        document.getElementById('score').innerHTML = score + " puntos";
    }
}
```

### Bucle del juego

```javascript
function startGame() {
    gameLoop = setInterval(() => {
        if (!gameActive) return;
        
        clearCanvas();      // 1. Limpiar
        advanceSnake();     // 2. Mover
        checkEat();         // 3. Verificar comida
        drawFood();         // 4. Dibujar comida
        drawSnake();        // 5. Dibujar serpiente
        
        if (didGameEnd()) {
            gameActive = false;
            // Mostrar Game Over
        }
    }, 100);  // Velocidad del juego
}
```

### Reinicio del juego
```javascript
function restartGame() {
    // Detener el juego actual
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    
    // Reiniciar variables
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
    
    // Actualizar UI y empezar de nuevo
    document.getElementById('score').innerHTML = score;
    document.getElementById('restartBtn').style.display = 'none';
    createFood();
    clearCanvas();
    drawFood();
    drawSnake();
    startGame();
}
```

## Estructura del proyecto
```Bash
snake-game/
│
├── README.md                 # Documentación del proyecto
├── index.html                # Estructura HTML (canvas + controles)
├── styles.css                # Estilos CSS y responsive design
└── script.js                 # Lógica completa del juego
```
## Explicación del código

### Variables principales del juego

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `snake` | Array | Almacena los segmentos de la serpiente |
| `direction` | String | Dirección actual (`'right'`, `'left'`, `'up'`, `'down'`) |
| `score` | Number | Puntuación actual del jugador |
| `foodX`, `foodY` | Number | Coordenadas de la comida |
| `gameActive` | Boolean | Estado del juego (activo o terminado) |
| `gameLoop` | Number | ID del intervalo para detener el juego |

### Eventos soportados

| Evento | Dispositivo | Función |
|--------|-------------|---------|
| `keydown` | PC | `changeDirection()` |
| `touchstart` | Móvil | `handleTouchStart()` |
| `touchend` | Móvil | `handleTouchEnd()` |
| `click` | Ambos | `restartGame()` |

### Conceptos clave aplicados

| Concepto | Implementación |
|----------|----------------|
| Manipulación del Canvas | `fillRect()`, `strokeRect()`, `clearRect()` |
| Eventos de teclado | `keydown` con códigos 37-40 |
| Eventos táctiles | `touchstart`, `touchend`, prevención de scroll |
| Animación con intervalo | `setInterval` para actualizar el juego |
| Colisiones AABB | Detección por coordenadas en cuadrícula |
| Diseño responsive | `@media (max-width: 768px)` |
| Arrays y objetos | Almacenamiento de segmentos de la serpiente |

## Cómo ejecutar localmente

Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Opcional: VS Code con Live Server

```Bash
# 1. Clonar el repositorio
git clone https://github.com/lovecraftiancode/Snake-game-using-HTML-CSS-JS.git
cd Snake-game-using-HTML-CSS-JS

# 2. Opción A: Abrir directamente
# Haz doble clic en index.html

# 3. Opción B: Con Live Server (recomendado)
npx live-server

# 4. ¡A jugar!
```

## Próximas mejoras

- Niveles de dificultad - Velocidad progresiva según la puntuación
- High score local - Guardar la mejor puntuación en localStorage
- Obstáculos - Paredes internas en niveles avanzados
- Skins para la serpiente - Diferentes colores o diseños
- Efectos de sonido - Al comer comida o game over
- Sistema de passwords - Desbloquear niveles o skins
- Pausa del juego - Botón para pausar/reanudar

## Autor

LovecraftianCode - @LovecraftianCode
Proyecto realizado como práctica de JavaScript, Canvas y desarrollo de juegos
Inspirado en el clásico juego de Nokia (1997)
