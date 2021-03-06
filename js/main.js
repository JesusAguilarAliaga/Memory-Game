
let audio = new Audio('audio/click.mp3');
let audio2 = new Audio('audio/click2.mp3');
audio.volume = 0.1;
audio2.volume = 0.1;

const                                                                                                /*almacenando clases en constantes*/
        startEasy = document.querySelector('.startEasy'),    
        startNormal = document.querySelector('.startNormal'),
        startHard = document.querySelector('.startHard'),
        reload = document.querySelector('.reload'),
        pairs = document.querySelector('.pairs'),
        boardContainer = document.querySelector('.boardContainer'),
        containerHome = document.querySelector('.containerHome'),
        containerGame = document.querySelector('.screenGameEasy'),
        board = document.querySelector('.board'),
        moves = document.querySelector('.moves'),
        timer = document.querySelector('.timer'),
        back = document.querySelector('.back'),
        win = document.querySelector('.win'),
        card = document.querySelectorAll('.cardFront'),
        cardBack = document.querySelector('.cardBack')


const state = {                                                                         //un objeto que contiene todos los datos del juego
    flippedCards: 0,
    totalMoves: 0,
    totalTime: 60,
    interval: null,
    countFlipped: 0,
    remainingPairs: 0
}

//select images from folder
//figures fruits
const figures = ['๐ฟ', '๐ฅฃ', '๐ฅ', '๐', '๐ฒ', '๐', '๐', '๐'];
const figures1 = ['๐ก', '๐', '๐ซ', '๐ญ', '๐ฆ', '๐ง', '๐จ', '๐ฐ', '๐ช', '๐ฉ', '๐ฎ', '๐ฌ'];
const figures2 = ['๐', '๐', '๐ฅ', '๐ฝ', '๐ฅ', '๐', '๐', '๐', '๐', '๐', '๐ฅฅ', '๐ฅ', '๐', '๐', '๐'];

//event listener for button start                                                           //al hacer click en el nivel seleccionado
startEasy.addEventListener('click', () => {                                                 //llama a la funciรณn con distintos parรกmetros
    generator(4, 4, figures)                                                                //de acuerdo al nivel seleccionado
    audio2.play();
});

startNormal.addEventListener('click', () => {
    audio2.play();
    if(window.matchMedia("(max-width: 720px)").matches){
        generator(6, 4, figures1)
    }else{
        generator(4,6, figures1)
    }
});

startHard.addEventListener('click', () => {
    audio2.play();
    if(window.matchMedia("(max-width: 720px)").matches){
        generator(6, 5, figures2)
    }else{
        generator(5,6, figures2)
    }   
});



//media query for mobile
const resizeWindow = () => {                                                    //al cambiar el tamaรฑo de la pantalla, para que cuadros se adapten a mรณvil
    if(window.matchMedia("(max-width: 720px)").matches){
        audio.volume = 0;
        return 60;
    }else{
        return 100;
    }   
}
//**************/



//main function to generate board
function generator(rows, files, figures){
    containerHome.style.display = 'none';                                       //oculta la pantalla de inicio y muestra la pantalla de juego
    containerGame.style.display = 'block';                                     //
    state.remainingPairs = figures.length                                     //declarando las parejas faltantes

    const shuffle = array => {                   //shuffle function           //shuffle devuelve un array aleatorio a partir del array original
        const clonedArray = [...array]
    
        for (let index = clonedArray.length - 1; index > 0; index--) {
            const randomIndex = Math.floor(Math.random() * (index + 1))
            const original = clonedArray[index]
    
            clonedArray[index] = clonedArray[randomIndex]
            clonedArray[randomIndex] = original
        }
    
        return clonedArray
    }

    const figure = shuffle([...figures, ...figures]);           //aquรญ llamamos a shuffle para que me devuelva dos  pares de arrays aleatorios y los guarda en figure


    const createBoard = () => {             //board creation            //esta funciรณn crea el tablero, hace un map a figures para aรฑadirles a cada una de las tarjetas
        const cards = `                                                 
        ${figure.map(item => 
            `<div class="card">
                <div class="cardFront"><img src="img/ArrowsClockwise.svg" alt=""></div>
                <div class="cardBack"><span class="emoji">${item}</span></div>
            </div>
        `).join('')}`
        boardContainer.innerHTML = cards;                                   //aรฑade el contenido de cards al div boardContainer
        boardContainer.style.gridTemplateColumns = `repeat(${files}, ${resizeWindow()}px)`;             //establece el grid de columnas
        boardContainer.style.gridTemplateRows = `repeat(${rows}, ${resizeWindow()}px)`;                 //establece el grid de filas (fue algo difรญcil de hacer)
    }

    state.interval = setInterval(() => {                                //loop for timer and moves              //hace que cada segundo reste 1 state.totalTime y va actualizando (moves, time, pairs)
        state.totalTime--;

        pairs.innerText = `Remaining pairs: ${state.remainingPairs}`
        moves.innerText = `${state.totalMoves} moves`
        timer.innerText = `You have: ${state.totalTime} seconds`
    }, 1000)

    const flipBackCards = () => {                                      //flip back cards                    //flipBackCards es llamada en la linea 138, y comprueba si las tarjetas coinciden
        document.querySelectorAll('.card:not(.matched)').forEach(card => {                                  //selecciona todas las tarjetas que no estรฉn marcadas como matched
            card.classList.remove('flipped')                                                                //remueve la clase flipped que las asigna la linea 126, si es que no tiene la clase matched
        })
        state.flippedCards = 0                                                                              //reinicia el contador de tarjetas volteadas
    }

    const flipCard = card => {                                     //flip card function                     //flipCard es una funciรณn que se ejecuta cuando se hace click en una tarjeta
        state.flippedCards++                                                                                //incrementa el contador de tarjetas volteadas
        state.totalMoves++                                                                                  //incrementa el contador de movimientos

        if (state.flippedCards <= 2) {                                                                      //comprueba si el contador de tarjetas volteadas es menor o igual a 2
            card.classList.add('flipped')                                                                   //si es asรญ, aรฑade la clase flipped a la tarjeta
        }
    
        if (state.flippedCards === 2) {                                                                     //comprueba si el contador de tarjetas volteadas es igual a 2
            const flippedCards = document.querySelectorAll('.flipped:not(.matched)')                        //selecciona todas las tarjetas que no estรฉn marcadas con la clase matched (las que ya tengan la clase, no las toca)
    
            if (flippedCards[0].innerText === flippedCards[1].innerText) {                                  //comprueba si el contenido de las tarjetas volteadas es igual entre ellas (por esto use emojis, aunque con imรกgenes seria comprobar sus id o clases)	
                flippedCards[0].classList.add('matched')
                flippedCards[1].classList.add('matched')
                state.remainingPairs--                                                                      //cada vez que se encuentran parejas, resta 1 al contador de parejas (state.remainingPairs)
            }
    
            setTimeout(() => {                                                                              //llama a la funciรณn flipBackCards despuรฉs de medio segundo
                flipBackCards()
            }, 500)
        }
        
        if(document.querySelectorAll('.matched').length == figure.length) {                         //win   //comprueba si todas las tarjetas que estรกn marcadas con la clase matched son iguales a las que hay en el array figure(linea 90)
            setTimeout(() => {                                                                              //espera .3s para que se muestre el mensaje de ganar
                if(state.totalTime > 0){                                                                    //solo mostrara el mensaje si el tiempo es mayor que 0
                    pairs.innerText = `Remaining pairs: 0`
                    moves.innerText = `${state.totalMoves} moves`
                    clearInterval(state.interval)
                    boardContainer.style.display = 'none';
                    win.classList.add('winner');
                    win.innerHTML = `
                        <span class="winText">
                            You won! ๐<br />
                            with <span class="highlight">${state.totalMoves}</span> moves<br />
                            in <span class="highlight">${(60 - state.totalTime)}</span> seconds
                        </span>
                    `
            
                    clearInterval(state.loop)
                }
            }, 300)
        }
        

    }

    setInterval(() => {
        if(state.totalTime == 0){                                                                 //lose        //comprueba si el tiempo es 0 cada segundo, si es asรญ, muestra el mensaje Your lose
            setTimeout(() => {
                clearInterval(state.interval)
                boardContainer.style.display = 'none';
                win.classList.add('winner');
                win.innerHTML = `
                <span class="winText">
                You Lose ๐ญ<br />
                Your Time is over</span>
                `
                
                clearInterval(state.loop)
            }, 300)
        };
    }, 1000);

    const attachEventListeners = () => {                                                                    //attachEventListeners trabaja con la interacciรณn en el DOM y aรฑade los eventListeners a cada tarjeta
        document.addEventListener('click', (e) => {
            const eventTarget = e.target
            const eventParent = eventTarget.parentElement                                                   //eventParent almacena el nombre del padre del elemento que se ha pulsado
    
            if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {     //comprueba si el elemento pulsado tiene la clase card y no tiene la clase flipped
                flipCard(eventParent)                                                                       //llama a la funciรณn flipCard que es la que se encarga de comprobar la tarjeta, para darle vuelta
                audio.play();
            }
        })
    }

    setInterval(() => {                                                                                         //nada que ver aquรญ xd
        console.log(state.totalTime + " seconds down, HURRY UP!")
    }, 1000)

    createBoard();                                                                                          //llama a la funciรณn createBoard, que es la que crea el tablero
    attachEventListeners();                                                                                 //llama a la funciรณn attachEventListeners, que es la que aรฑade los eventListeners a cada tarjeta


    //button restart
    /* reload.addEventListener('click', () => {
        location.reload();                                      //tengo una idea de que al recargar de pagina me vuelva a enviar al mismo nivel
    }); */                                                      //pero debo pasar otro parรกmetro a la funciรณn y se harรก mas inentendible (buscare una mejor manera)
    
};


//button back
back.addEventListener('click', () => {                                                                      //al pulsar el botรณn back, se vuelve a la pagina anterior
    containerHome.style.display = 'flex';
    containerGame.style.display = 'none';
    location.reload();
});

//for mobile and desktop, dont touch
window.addEventListener('resize', () => {                                                                   //esto es un apoyo al diseรฑo responsive
    location.reload();
});



console.log(                                                                                                //nada que ver aquรญ xd
    '%cCURIOSITY KILLED THE CAT :p',
    'color: red', // CSS Style
);


