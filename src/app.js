const gameData = {
    currentLevel: 1,
    levels: [
        {
            id: 1,
            title: null,
            x: 0,
            y: 0,
            completed: false,
            unlocked: true,
            connections: [2, 3],
            puzzle: {
                description: `Se essa mensagem chegou até você, então eles me localizaram.
O silêncio agora é minha única proteção. Preciso desaparecer... por enquanto.
Durante esse tempo, darei forma ao que poderá ser nossa última esperança.
Vou tentar me comunicar de formas menos convencionais, para eles não conseguirem me achar.

Se você acredita ter a força necessária para se unir à resistência, digite: #NovoUnderground
Mas saiba: ao atravessar esse limiar, estará por sua conta. Sem nenhuma ajuda.

Boa sorte. – RFD`,
                image: null,
                answer: '#novounderground',
                hint: null
            }
        },
        {
            id: 2,
            title: null,
            x: -100,
            y: -120,
            completed: false,
            unlocked: false,
            connections: [4],
            puzzle: {
                description: '',
                image: null,
                answer: '',
                hint: null
            }
        },
        {
            id: 3,
            title: null,
            x: 100,
            y: -120,
            completed: false,
            unlocked: false,
            connections: [5],
            puzzle: {
                description: '',
                image: '/files/cartaz.png',
                answer: '',
                hint: null
            }
        },
        {
            id: 4,
            title: null,
            x: -220,
            y: -250,
            completed: false,
            unlocked: false,
            connections: [6],
            puzzle: {
                description: '',
                image: '',
                answer: '',
                hint: null
            }
        },
        {
            id: 5,
            title: null,
            x: 220,
            y: -250,
            completed: false,
            unlocked: false,
            connections: [7],
            puzzle: {
                description: '',
                image:  '',
                answer: '',
                hint: null
            }
        },
        {
            id: 6,
            title: null,
            x: -320,
            y: -400,
            completed: false,
            unlocked: false,
            connections: [],
            puzzle: {
                description: '',
                image: null,
                answer: '',
                hint: null
            }
        },
        {
            id: 7,
            title: null,
            x: 320,
            y: -400,
            completed: false,
            unlocked: false,
            connections: [],
            puzzle: {
                description: '',
                image: null,
                answer: '',
                hint: null
            }
        },
    ]
};

function loadGameData() {
    const savedData = localStorage.getItem('enigmaGameData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        gameData.levels.forEach((level, index) => {
            if (parsedData.levels[index]) {
                level.completed = parsedData.levels[index].completed;
                level.unlocked = parsedData.levels[index].unlocked;
            }
        });
        gameData.currentLevel = parsedData.currentLevel;
    }
    
    updateLevelConnections();
}

function saveGameData() {
    localStorage.setItem('enigmaGameData', JSON.stringify(gameData));
}

function updateLevelConnections() {
    gameData.levels.forEach(level => {
        if (level.completed) {
            level.connections.forEach(connectedId => {
                const connectedLevel = gameData.levels.find(l => l.id === connectedId);
                if (connectedLevel) {
                    connectedLevel.unlocked = false;
                }
            });
        }
    });
    saveGameData();
}

function createLevelNodes() {
    const levelsContainer = document.getElementById('levels-container');
    levelsContainer.innerHTML = '';
    
    gameData.levels.forEach(level => {
        level.connections.forEach(connectedId => {
            const connectedLevel = gameData.levels.find(l => l.id === connectedId);
            if (connectedLevel) {
                createPath(level, connectedLevel);
            }
        });
    });
    
    gameData.levels.forEach(level => {
        createLevelNode(level);
    });
}

function createPath(fromLevel, toLevel) {
    const container = document.getElementById('levels-container');
    
    const fromCenterX = fromLevel.x + 25;
    const fromCenterY = fromLevel.y + 25;
    const toCenterX = toLevel.x + 25;
    const toCenterY = toLevel.y + 25;
    
    const horizontalPath = document.createElement('div');
    horizontalPath.className = 'path';
    
    const horizontalLength = Math.abs(toCenterX - fromCenterX);
    horizontalPath.style.width = `${horizontalLength}px`;
    
    const startX = Math.min(fromCenterX, toCenterX);
    horizontalPath.style.position = 'absolute';
    horizontalPath.style.left = `${startX}px`;
    horizontalPath.style.top = `${fromCenterY}px`;
    horizontalPath.style.height = '2px';
    
    const verticalPath = document.createElement('div');
    verticalPath.className = 'path';
    
    const verticalLength = Math.abs(toCenterY - fromCenterY);
    verticalPath.style.height = `${verticalLength}px`;
    
    verticalPath.style.position = 'absolute';
    verticalPath.style.left = `${toCenterX}px`;
    verticalPath.style.top = `${Math.min(fromCenterY, toCenterY)}px`;
    verticalPath.style.width = '2px';

    if (fromLevel.completed && toLevel.completed) {
        horizontalPath.style.background = 'linear-gradient(to bottom,rgb(76, 175, 80),rgb(76, 175, 80))';
        verticalPath.style.background = 'linear-gradient(to top,rgb(76, 175, 80),rgb(150, 255, 136))';
    } 
    else if (!fromLevel.completed && !toLevel.completed) {
        verticalPath.style.background = 'linear-gradient(to top,rgb(255, 255, 255),rgb(230, 230, 230), rgb(175, 175, 175))';
    }

  container.appendChild(horizontalPath);
  container.appendChild(verticalPath);
}

function createLevelNode(level) {
    const node = document.createElement('div');
    node.className = `level-node`;
    node.dataset.id = level.id;
    node.style.left = `${level.x}px`;
    node.style.top = `${level.y}px`;
    
    if (level.completed) {
        node.classList.add('level-completed');
    } else if (level.unlocked) {
        node.classList.add('level-unlocked');
    } else {
        node.title = 'level indisponível'
        node.classList.add('level-locked');
    }
    
    node.textContent = '?';
    
    if (level.unlocked && !level.completed) {
        const isNewlyUnlocked = level.connections.some(connId => {
            const connLevel = gameData.levels.find(l => l.id === connId);
            return connLevel && connLevel.completed;
        });
        
        if (isNewlyUnlocked) {
            const newLabel = document.createElement('div');
            newLabel.className = 'new-label';
            newLabel.textContent = 'NEW';
            node.appendChild(newLabel);
        }
    }
    
    node.addEventListener('click', () => {
        if (level.unlocked) {
            selectLevel(level);
        }
    });
    
    document.getElementById('levels-container').appendChild(node);
}

function selectLevel(level) {
    const previousSelected = document.querySelector('.level-selected');
    if (previousSelected) {
        previousSelected.classList.remove('level-selected');
    }
    
    const levelNode = document.querySelector(`.level-node[data-id="${level.id}"]`);
    if (levelNode) {
        levelNode.classList.add('level-selected');
    }

    let callback = null
    
    gameData.currentLevel = level.id;
    saveGameData();
    
    if (level.id == 5){
        callback = function () {
            document.querySelector('.puzzle-title').style.opacity = 0.2;
            document.getElementById('puzzleContainer').style.backgroundImage = "url('/files/background.png')";
            document.getElementById('puzzleContainer').style.backgroundRepeat = 'repeat';
            document.getElementById('puzzleContainer').style.backgroundSize = '200px';
        }
    } else {
        document.querySelector('.puzzle-title').style.opacity = 1;
        document.getElementById('puzzleContainer').style.backgroundImage = '';
        document.getElementById('puzzleContainer').style.backgroundRepeat = '';
        document.getElementById('puzzleContainer').style.backgroundSize = '';
    }


    showPuzzleScreen(level, callback);
}

function showPuzzleScreen(level, callback) {
    if (callback) callback();

    const mapContainer = document.querySelector('.map-container');
    const puzzleContainer = document.querySelector('.puzzle-container');
    
    mapContainer.style.display = 'none';
    puzzleContainer.style.display = 'flex';
    
    const puzzleTitle = document.querySelector('.puzzle-title');
    const puzzleDescription = document.querySelector('.puzzle-description');
    const puzzleImage = document.querySelector('.puzzle-image');
    const puzzleInput = document.querySelector('.puzzle-input');
    
    puzzleDescription.innerHTML = '';
    puzzleTitle.textContent = '';
    puzzleInput.value = '';

    const titleText = level.title;
    const descriptionText = level.puzzle.description;
    const typingSpeed = 50;

    const paragraph = document.createElement('div');
    paragraph.style.whiteSpace = 'pre-line';
    puzzleDescription.appendChild(paragraph);

    let titleIndex = 0;
    let descriptionIndex = 0;

    function typeTitle() {
        if (titleIndex < titleText.length) {
            puzzleTitle.textContent += titleText.charAt(titleIndex);
            titleIndex++;
            setTimeout(typeTitle, typingSpeed);
        } else {
            setTimeout(typeDescription, 500);
        }
    }

    function typeDescription() {
        if (descriptionIndex < descriptionText.length) {
            paragraph.textContent += descriptionText.charAt(descriptionIndex);
            descriptionIndex++;
            setTimeout(typeDescription, typingSpeed);
        }
    }

    if (titleText) {
        typeTitle();
    } else {
        typeDescription();
    }

    if (level.puzzle.image) {
        puzzleImage.src = level.puzzle.image;
        puzzleImage.style.display = 'block';
    } else {
        puzzleImage.style.display = 'none';
    }
}

function backToMap() {
    document.querySelector('.map-container').style.display = 'block';
    document.querySelector('.puzzle-container').style.display = 'none';
    loadGameData();
}

function showHint() {
    const level = gameData.levels.find(l => l.id === gameData.currentLevel);
    if (level && level.puzzle.hint) {
        showMessage(level.puzzle.hint);
    }
}

function checkAnswer() {
    const level = gameData.levels.find(l => l.id === gameData.currentLevel);
    const input = document.querySelector('.puzzle-input').value.trim().toLowerCase();
    
    if (level && input === level.puzzle.answer.toLowerCase()) {
        level.completed = true;
        updateLevelConnections();
        showMessage('Reposta correta, proxima fase.', () => {
            backToMap();
            createLevelNodes();
            document.querySelector('.puzzle-input').value = '';
        });
    } else {
        showMessage('Resposta incorreta, tente novamente.');
    }
}

function showMessage(text, callback) {
    const message = document.querySelector('.message');
    const messageText = document.querySelector('.message-text');
    
    messageText.textContent = text;
    message.style.display = 'block';
    
    document.querySelector('.message-ok').onclick = () => {
        message.style.display = 'none';
        if (callback) callback();
    };
}

function init() {
    loadGameData();
    createLevelNodes();
    
    document.getElementById('puzzle-hint').addEventListener('click', backToMap);
    document.querySelector('.puzzle-submit').addEventListener('click', checkAnswer);
    document.querySelector('.puzzle-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
        
    setTimeout(() => {
        selectLevel(gameData.levels.at((gameData.currentLevel - 1)))
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }, 1500);
}

window.addEventListener('load', init);