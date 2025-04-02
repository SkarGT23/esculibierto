document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const messageElement = document.getElementById("message");
    const resultsButton = document.getElementById("resultsButton");
    const gameResults = document.getElementById("gameResults");
    const resultsList = document.getElementById("resultsList");
    const inputContainer = document.getElementById("inputContainer");
    const scoreInput = document.getElementById("scoreInput");
    const submitScore = document.getElementById("submitScore");

    // Configuración inicial
    const gridSize = 20;
    let snake = [{ x: 200, y: 200 }];
    let food = { x: 100, y: 100 };
    let specialFood = null;
    let blackApple = null;
    let direction = { x: 0, y: 0 };
    let score = 0;
    let redFoodCount = 0;
    let gameInterval = null;
    let isGameRunning = false;
    let startTime = null;
    let currentLevel = 0;

    // Configuración de niveles
    const levels = [
        { score: 0, blockedWalls: [] },
        { score: 20, blockedWalls: ['top', 'bottom'] },
        { score: 40, blockedWalls: ['left', 'right'] },
        { score: 60, blockedWalls: ['top', 'bottom', 'left', 'right'] }
    ];

    // Base de datos de resultados
    let gameResultsData = [
        { score: 10, duration: '5:30', comment: 'la Ayalga' },
        { score: 20, duration: '4:45', comment: 'el Trasgo' },
        { score: 30, duration: '6:10', comment: '¡la Llavandera!' },
        { score: 40, duration: '3:50', comment: 'el Nuberu' },
        { score: 50, duration: '7:00', comment: '¡el Sumiciu!' },
        { score: 60, duration: '5:30', comment: 'el Diañu Burlón' },
        { score: 70, duration: '4:45', comment: 'el Busgosu' },
        { score: 80, duration: '6:10', comment: '¡el Ventolín!' },
        { score: 90, duration: '3:50', comment: 'los Espumerus' },
        { score: 100, duration: '7:00', comment: '¡la Guaxa!' },
        { score: 110, duration: '6:10', comment: '¡la Xana!' },
        { score: 120, duration: '3:50', comment: 'la Güestia' },
        { score: 130, duration: '7:00', comment: '¡El Cuelebre!' }
    ];

    // Mensajes de motivación
    const messages = [
        "¡ECHA UN CULIN MANIN!",
        "SIGUE ASI COLLACIU!!",
        "CALLA HO! MIRALU!!",
        "ANDE VAS GUAJE!",
        "TAS JUGANDOTE LA VIDA!",
        "COLLACIU!!",
        "QUE FATU YES!",
        "GAYU DIVORCIATE!"
    ];

    let displayedMessages = [];

    // Función para dibujar las paredes bloqueadas
    function drawBlockedWalls() {
        const currentLevelConfig = levels.find(l => score >= l.score);
        if (!currentLevelConfig) return;

        // Crear un degradado brillante para las paredes
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#ff0000');    // Rojo base
        gradient.addColorStop(0.5, '#ff3333');  // Rojo más brillante
        gradient.addColorStop(1, '#ff0000');    // Rojo base

        ctx.strokeStyle = gradient;
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 8;

        currentLevelConfig.blockedWalls.forEach(wall => {
            ctx.beginPath();
            switch (wall) {
                case 'top':
                    ctx.moveTo(0, 0);
                    ctx.lineTo(canvas.width, 0);
                    break;
                case 'bottom':
                    ctx.moveTo(0, canvas.height);
                    ctx.lineTo(canvas.width, canvas.height);
                    break;
                case 'left':
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, canvas.height);
                    break;
                case 'right':
                    ctx.moveTo(canvas.width, 0);
                    ctx.lineTo(canvas.width, canvas.height);
                    break;
            }
            ctx.stroke();
        });

        // Restaurar configuración del contexto
        ctx.shadowBlur = 0;
    }

    // Función para verificar colisión con paredes bloqueadas
    function checkWallCollision(head) {
        const currentLevelConfig = levels.find(l => score >= l.score);
        if (!currentLevelConfig) return false;

        return currentLevelConfig.blockedWalls.some(wall => {
            switch (wall) {
                case 'top':
                    return head.y <= 0;
                case 'bottom':
                    return head.y >= canvas.height - gridSize;
                case 'left':
                    return head.x <= 0;
                case 'right':
                    return head.x >= canvas.width - gridSize;
                default:
                    return false;
            }
        });
    }

    // Función para obtener el personaje basado en la puntuación
    function getCharacterForScore(score) {
        for (let i = gameResultsData.length - 1; i >= 0; i--) {
            if (score >= gameResultsData[i].score) {
                return gameResultsData[i].comment;
            }
        }
        return 'la Ayalga';
    }

    // Función para formatear el tiempo
    function formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Manejo de resultados
    resultsButton.addEventListener('click', () => {
        gameResults.style.display = gameResults.style.display === 'none' ? 'block' : 'none';
        if (gameResults.style.display === 'block') {
            updateResultsList();
        }
    });

    function updateResultsList() {
        resultsList.innerHTML = '';
        const storedResults = JSON.parse(localStorage.getItem('snakeGameResults') || '[]');
        storedResults.sort((a, b) => b.score - a.score);
        
        storedResults.slice(0, 10).forEach((result, index) => {
            const li = document.createElement('li');
            let medal = '';
            
            // Añadir medallas para los tres primeros lugares
            if (index === 0) {
                medal = '🥇 ';
            } else if (index === 1) {
                medal = '🥈 ';
            } else if (index === 2) {
                medal = '🥉 ';
            }
            
            // Crear elementos para el nombre y la información
            const nameSpan = document.createElement('span');
            nameSpan.className = 'player-name';
            nameSpan.textContent = `${medal}${result.name}`;
            
            const infoSpan = document.createElement('span');
            infoSpan.className = 'score-info';
            infoSpan.textContent = `Puntuación: ${result.score} | Tiempo: ${result.duration} | ${result.character}`;
            
            // Añadir los elementos al li
            li.appendChild(nameSpan);
            li.appendChild(infoSpan);
            
            resultsList.appendChild(li);
        });
    }

    // Función para guardar resultado
    function saveResult(score, duration) {
        const character = getCharacterForScore(score);
        const nameInput = document.getElementById('nameInput');
        const playerNameInput = document.getElementById('playerName');
        const errorMessage = document.querySelector('.error-message');
        const submitButton = document.getElementById('submitName');
        const overlay = document.querySelector('.overlay');

        // Mostrar el overlay y el diálogo de entrada de nombre
        overlay.style.display = 'block';
        nameInput.style.display = 'block';
        playerNameInput.value = '';
        errorMessage.style.display = 'none';

        // Validar entrada de solo letras
        playerNameInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
            if (!/^[A-Z]*$/.test(this.value)) {
                errorMessage.style.display = 'block';
                submitButton.disabled = true;
            } else {
                errorMessage.style.display = 'none';
                submitButton.disabled = false;
            }
        });

        // Manejar el envío del nombre
        submitButton.onclick = function() {
            const playerName = playerNameInput.value.toUpperCase();
            if (playerName.length >= 1 && playerName.length <= 10 && /^[A-Z]+$/.test(playerName)) {
                const results = JSON.parse(localStorage.getItem('snakeGameResults') || '[]');
                results.push({ 
                    name: playerName,
                    score: score, 
                    duration: duration, 
                    character: character 
                });
                results.sort((a, b) => b.score - a.score);
                localStorage.setItem('snakeGameResults', JSON.stringify(results.slice(0, 10)));
                nameInput.style.display = 'none';
                overlay.style.display = 'none';
                updateResultsList();
            } else {
                errorMessage.style.display = 'block';
            }
        };
    }

    // Función para mostrar mensaje sin mover la pantalla
    function showMessage(text, color = '#0ff', duration = 2000) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.style.color = color;
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, duration);
    }

    // Dibuja la serpiente
    function drawSnake() {
        snake.forEach(segment => {
            const gradient = ctx.createLinearGradient(segment.x, segment.y, segment.x + gridSize, segment.y + gridSize);
            gradient.addColorStop(0, '#00ff00');
            gradient.addColorStop(1, '#00b300');
            ctx.fillStyle = gradient;
            ctx.strokeStyle = "#00ff00";
            ctx.lineWidth = 2;
            ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
            ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
        });
    }

    // Dibuja la comida
    function drawFood() {
        const gradient = ctx.createRadialGradient(
            food.x + gridSize/2, food.y + gridSize/2, 2,
            food.x + gridSize/2, food.y + gridSize/2, gridSize/2
        );
        gradient.addColorStop(0, '#ff0000');
        gradient.addColorStop(1, '#b30000');
        ctx.fillStyle = gradient;
        ctx.strokeStyle = "#ff4d4d";
        ctx.lineWidth = 2;
        ctx.fillRect(food.x, food.y, gridSize, gridSize);
        ctx.strokeRect(food.x, food.y, gridSize, gridSize);
    }

    // Dibuja la comida especial
    function drawSpecialFood() {
        if (specialFood) {
            ctx.fillStyle = "#00ff00";
            ctx.strokeStyle = "#008000";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(specialFood.x + gridSize/2, specialFood.y);
            ctx.lineTo(specialFood.x + gridSize*0.75, specialFood.y + gridSize*0.75);
            ctx.lineTo(specialFood.x + gridSize*0.25, specialFood.y + gridSize*0.75);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    // Dibuja la manzana negra
    function drawBlackApple() {
        if (blackApple) {
            ctx.fillStyle = "#000000";
            ctx.strokeStyle = "#333333";
            ctx.lineWidth = 2;
            ctx.fillRect(blackApple.x, blackApple.y, gridSize, gridSize);
            ctx.strokeRect(blackApple.x, blackApple.y, gridSize, gridSize);
        }
    }

    // Mueve la serpiente
    function moveSnake() {
        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        // Verificar colisión con paredes según el nivel
        const currentLevelConfig = levels.find(l => score >= l.score);
        if (currentLevelConfig) {
            if (currentLevelConfig.blockedWalls.includes('top') && head.y < 0) {
                endGame();
                return;
            }
            if (currentLevelConfig.blockedWalls.includes('bottom') && head.y >= canvas.height) {
                endGame();
                return;
            }
            if (currentLevelConfig.blockedWalls.includes('left') && head.x < 0) {
                endGame();
                return;
            }
            if (currentLevelConfig.blockedWalls.includes('right') && head.x >= canvas.width) {
                endGame();
                return;
            }
        }

        // Atravesar paredes solo si no están bloqueadas
        if (head.x >= canvas.width) {
            if (!currentLevelConfig || !currentLevelConfig.blockedWalls.includes('right')) {
                head.x = 0;
            }
        }
        if (head.x < 0) {
            if (!currentLevelConfig || !currentLevelConfig.blockedWalls.includes('left')) {
                head.x = canvas.width - gridSize;
            }
        }
        if (head.y >= canvas.height) {
            if (!currentLevelConfig || !currentLevelConfig.blockedWalls.includes('bottom')) {
                head.y = 0;
            }
        }
        if (head.y < 0) {
            if (!currentLevelConfig || !currentLevelConfig.blockedWalls.includes('top')) {
                head.y = canvas.height - gridSize;
            }
        }

        snake.unshift(head);

        // Colisión con comida
        if (head.x === food.x && head.y === food.y) {
            score++;
            document.getElementById("score").textContent = `Puntuación: ${score}`;
            redFoodCount++;
            showMessage(messages[Math.floor(Math.random() * messages.length)]);

            // Verificar cambio de nivel
            const newLevel = levels.findIndex(l => score >= l.score);
            if (newLevel !== currentLevel) {
                currentLevel = newLevel;
                if (currentLevel > 0) {
                    const walls = levels[currentLevel].blockedWalls;
                    showMessage(`¡NIVEL ${currentLevel}! ¡${walls.length === 4 ? 'TODAS LAS PAREDES BLOQUEADAS!' : 
                        walls.includes('top') && walls.includes('bottom') ? '¡ARRIBA Y ABAJO BLOQUEADOS!' :
                        walls.includes('left') && walls.includes('right') ? '¡IZQUIERDA Y DERECHA BLOQUEADOS!' : 
                        '¡NUEVAS PAREDES BLOQUEADAS!'}`, '#ff3333', 3000);
                }
            }

            if (redFoodCount >= 9) {
                generateSpecialFood();
                redFoodCount = 0;
            }

            if (Math.random() < 0.3) {
                generateBlackApple();
            }

            generateFood();
        } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
            score += 5;
            document.getElementById("score").textContent = `Puntuación: ${score}`;
            specialFood = null;
            showMessage("¡BONUS +5 PUNTOS!", '#00ff00');
        } else if (blackApple && head.x === blackApple.x && head.y === blackApple.y) {
            score = Math.max(0, score - 5);
            document.getElementById("score").textContent = `Puntuación: ${score}`;
            blackApple = null;
            showMessage("¡CUIDADO CON LA MANZANA NEGRA! -5 PUNTOS", '#ff0000');
        } else {
            snake.pop();
        }
    }

    // Genera comida en posición aleatoria
    function generateFood() {
        const getRandomPosition = () => ({
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        });

        let newFood;
        do {
            newFood = getRandomPosition();
        } while (
            snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
            (specialFood && specialFood.x === newFood.x && specialFood.y === newFood.y) ||
            (blackApple && blackApple.x === newFood.x && blackApple.y === newFood.y)
        );

        food = newFood;
    }

    // Genera comida especial
    function generateSpecialFood() {
        const getRandomPosition = () => ({
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        });

        let newSpecialFood;
        do {
            newSpecialFood = getRandomPosition();
        } while (
            snake.some(segment => segment.x === newSpecialFood.x && segment.y === newSpecialFood.y) ||
            (food.x === newSpecialFood.x && food.y === newSpecialFood.y) ||
            (blackApple && blackApple.x === newSpecialFood.x && blackApple.y === newSpecialFood.y)
        );

        specialFood = newSpecialFood;
    }

    // Genera manzana negra
    function generateBlackApple() {
        const getRandomPosition = () => ({
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        });

        let newBlackApple;
        do {
            newBlackApple = getRandomPosition();
        } while (
            snake.some(segment => segment.x === newBlackApple.x && segment.y === newBlackApple.y) ||
            (food.x === newBlackApple.x && food.y === newBlackApple.y) ||
            (specialFood && specialFood.x === newBlackApple.x && specialFood.y === newBlackApple.y)
        );

        blackApple = newBlackApple;
    }

    // Detecta colisiones
    function checkCollision() {
        const head = snake[0];
        return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }

    // Valida dirección
    function isDirectionValid(newDirection) {
        return !(direction.x + newDirection.x === 0 && direction.y + newDirection.y === 0);
    }

    // Resetea el juego
    function resetGame() {
        snake = [{ x: 200, y: 200 }];
        direction = { x: 0, y: 0 };
        score = 0;
        redFoodCount = 0;
        currentLevel = 0;
        document.getElementById("score").textContent = "Puntuación: 0";
        generateFood();
        specialFood = null;
        blackApple = null;
        startTime = null;
    }

    // Termina el juego
    function endGame() {
        if (!isGameRunning) return;
        
        isGameRunning = false;
        clearInterval(gameInterval);
        
        // Ocultar los controles
        document.getElementById('controls').style.display = 'none';
        
        const endTime = Date.now();
        const duration = Math.floor((endTime - startTime) / 1000);
        const formattedDuration = formatTime(duration);
        
        saveResult(score, formattedDuration);
    }

    // Bucle principal del juego
    function gameLoop() {
        if (checkCollision()) {
            endGame();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBlockedWalls();
        moveSnake();
        drawSnake();
        drawFood();
        drawSpecialFood();
        drawBlackApple();
    }

    // Control de teclas
    document.addEventListener("keydown", event => {
        if (!isGameRunning) return;

        switch (event.key) {
            case "ArrowUp":
                if (isDirectionValid({ x: 0, y: -gridSize })) {
                    direction = { x: 0, y: -gridSize };
                }
                break;
            case "ArrowDown":
                if (isDirectionValid({ x: 0, y: gridSize })) {
                    direction = { x: 0, y: gridSize };
                }
                break;
            case "ArrowLeft":
                if (isDirectionValid({ x: -gridSize, y: 0 })) {
                    direction = { x: -gridSize, y: 0 };
                }
                break;
            case "ArrowRight":
                if (isDirectionValid({ x: gridSize, y: 0 })) {
                    direction = { x: gridSize, y: 0 };
                }
                break;
        }
    });

    // Inicia el juego
    function startGame() {
        if (isGameRunning) return;
        
        // Mostrar los controles
        document.getElementById('controls').style.display = 'block';
        
        resetGame();
        direction = { x: gridSize, y: 0 };
        isGameRunning = true;
        startTime = Date.now();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 100);
    }

    document.getElementById("startButton").addEventListener("click", startGame);
});
