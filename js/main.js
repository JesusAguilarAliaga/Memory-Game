/* const startEasy = document.querySelector('.startEasy');                    
const startNormal = document.querySelector('.startNormal');
const startHard = document.querySelector('.startHard');
const reload = document.querySelector('.reload');
const pairs = document.querySelector('.pairs');
 */
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
        cardBack = document.querySelectorAll('.cardBack')


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
const figures = ['🍿', '🥣', '🥗', '🍜', '🍲', '🍛', '🍝', '🍚'];
const figures1 = ['🍡', '🎂', '🍫', '🍭', '🍦', '🍧', '🍨', '🍰', '🍪', '🍩', '🍮', '🍬'];
const figures2 = ['🍎', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🍅', '🍄', '🥥', '🥝', '🍋', '🍊', '🍍'];

//event listener for button start                                                           //al hacer click en el nivel seleccionado
startEasy.addEventListener('click', () => {                                                 //llama a la función con distintos parámetros
    generator(4, 4, figures)                                                                //de acuerdo al nivel seleccionado
});

startNormal.addEventListener('click', () => {
    if(window.matchMedia("(max-width: 720px)").matches){
        generator(6, 4, figures1)
    }else{
        generator(4,6, figures1)
    }
});

startHard.addEventListener('click', () => {
    if(window.matchMedia("(max-width: 720px)").matches){
        generator(6, 5, figures2)
    }else{
        generator(5,6, figures2)
    }   
});



//media query for mobile
const resizeWindow = () => {                                                    //al cambiar el tamaño de la pantalla, para que cuadros se adapten a móvil
    if(window.matchMedia("(max-width: 720px)").matches){
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

    const figure = shuffle([...figures, ...figures]);           //aquí llamamos a shuffle para que me devuelva dos  pares de arrays aleatorios y los guarda en figure


    const createBoard = () => {             //board creation            //esta función crea el tablero, hace un map a figures para añadirles a cada una de las tarjetas
        const cards = `                                                 
        ${figure.map(item => 
            `<div class="card">
                <div class="cardFront"><img src="img/ArrowsClockwise.svg" alt=""></div>
                <div class="cardBack"><span class="emoji">${item}</span></div>
            </div>
        `).join('')}`
        boardContainer.innerHTML = cards;                                   //añade el contenido de cards al div boardContainer
        boardContainer.style.gridTemplateColumns = `repeat(${files}, ${resizeWindow()}px)`;             //establece el grid de columnas
        boardContainer.style.gridTemplateRows = `repeat(${rows}, ${resizeWindow()}px)`;                 //establece el grid de filas (fue algo difícil de hacer)
    }

    state.interval = setInterval(() => {                                //loop for timer and moves              //hace que cada segundo reste 1 state.totalTime y va actualizando (moves, time, pairs)
        state.totalTime--;

        pairs.innerText = `Remaining pairs: ${state.remainingPairs}`
        moves.innerText = `${state.totalMoves} moves`
        timer.innerText = `You have: ${state.totalTime} seconds`
    }, 1000)

    const flipBackCards = () => {                                      //flip back cards                    //flipBackCards es llamada en la linea 138, y comprueba si las tarjetas coinciden
        document.querySelectorAll('.card:not(.matched)').forEach(card => {                                  //selecciona todas las tarjetas que no estén marcadas como matched
            card.classList.remove('flipped')                                                                //remueve la clase flipped que las asigna la linea 126, si es que no tiene la clase matched
        })
        state.flippedCards = 0                                                                              //reinicia el contador de tarjetas volteadas
    }

    const flipCard = card => {                                     //flip card function                     //flipCard es una función que se ejecuta cuando se hace click en una tarjeta
        state.flippedCards++                                                                                //incrementa el contador de tarjetas volteadas
        state.totalMoves++                                                                                  //incrementa el contador de movimientos

        if (state.flippedCards <= 2) {                                                                      //comprueba si el contador de tarjetas volteadas es menor o igual a 2
            card.classList.add('flipped')                                                                   //si es así, añade la clase flipped a la tarjeta
        }
    
        if (state.flippedCards === 2) {                                                                     //comprueba si el contador de tarjetas volteadas es igual a 2
            const flippedCards = document.querySelectorAll('.flipped:not(.matched)')                        //selecciona todas las tarjetas que no estén marcadas con la clase matched (las que ya tengan la clase, no las toca)
    
            if (flippedCards[0].innerText === flippedCards[1].innerText) {                                  //comprueba si el contenido de las tarjetas volteadas es igual entre ellas (por esto use emojis, aunque con imágenes seria comprobar sus id o clases)	
                flippedCards[0].classList.add('matched')
                flippedCards[1].classList.add('matched')
                state.remainingPairs--                                                                      //cada vez que se encuentran parejas, resta 1 al contador de parejas (state.remainingPairs)
            }
    
            setTimeout(() => {                                                                              //llama a la función flipBackCards después de medio segundo
                flipBackCards()
            }, 500)
        }
        
        if(document.querySelectorAll('.matched').length == figure.length) {                         //win   //comprueba si todas las tarjetas que están marcadas con la clase matched son iguales a las que hay en el array figure(linea 90)
            setTimeout(() => {                                                                              //espera .3s para que se muestre el mensaje de ganar
                if(state.totalTime > 0){                                                                    //solo mostrara el mensaje si el tiempo es mayor que 0
                    pairs.innerText = `Remaining pairs: 0`
                    moves.innerText = `${state.totalMoves} moves`
                    clearInterval(state.interval)
                    boardContainer.style.display = 'none';
                    win.classList.add('winner');
                    win.innerHTML = `
                        <span class="winText">
                            You won! 😁<br />
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
        if(state.totalTime == 0){                                                                 //lose        //comprueba si el tiempo es 0 cada segundo, si es así, muestra el mensaje Your lose
            setTimeout(() => {
                clearInterval(state.interval)
                boardContainer.style.display = 'none';
                win.classList.add('winner');
                win.innerHTML = `
                <span class="winText">
                You Lose 😭<br />
                Your Time is over</span>
                `
                
                clearInterval(state.loop)
            }, 300)
        };
    }, 1000);

    const attachEventListeners = () => {                                                                    //attachEventListeners trabaja con la interacción en el DOM y añade los eventListeners a cada tarjeta
        document.addEventListener('click', (e) => {                                                         
            const eventTarget = e.target
            const eventParent = eventTarget.parentElement                                                   //eventParent almacena el nombre del padre del elemento que se ha pulsado
    
            if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {     //comprueba si el elemento pulsado tiene la clase card y no tiene la clase flipped
                flipCard(eventParent)                                                                       //llama a la función flipCard que es la que se encarga de comprobar la tarjeta, para darle vuelta
            }
        })
    }

    setInterval(() => {                                                                                         //nada que ver aquí xd
        console.log(state.totalTime + " seconds down, HURRY UP!")
    }, 1000)

    createBoard();                                                                                          //llama a la función createBoard, que es la que crea el tablero
    attachEventListeners();                                                                                 //llama a la función attachEventListeners, que es la que añade los eventListeners a cada tarjeta


    //button restart
    /* reload.addEventListener('click', () => {
        location.reload();                                      //tengo una idea de que al recargar de pagina me vuelva a enviar al mismo nivel
    }); */                                                      //pero debo pasar otro parámetro a la función y se hará mas inentendible (buscare una mejor manera)
    
};


//button back
back.addEventListener('click', () => {                                                                      //al pulsar el botón back, se vuelve a la pagina anterior
    containerHome.style.display = 'flex';
    containerGame.style.display = 'none';
    location.reload();
});

//for mobile and desktop, dont touch
window.addEventListener('resize', () => {                                                                   //esto es un apoyo al diseño responsive
    location.reload();
});






console.log(                                                                                                //nada que ver aquí xd
    '%cCURIOSITY KILLED THE CAT :p',
    'color: red', // CSS Style
);


