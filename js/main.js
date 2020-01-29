const DEBUG = true
const canvas = document.querySelector('#canvas')
const dpi = window.devicePixelRatio
const ctx = canvas.getContext('2d')
const bgColor = 'rgb(96, 186, 195)'

const birdRadius = 19
// const smartBrain = { "layers": [{ "id": 0, "neurons": [{ "value": 0.6243708609271523, "weights": [] }, { "value": 0.7653178963519267, "weights": [] }] }, { "id": 1, "neurons": [{ "value": 0.5251544259730203, "weights": [-1.2542183639657278, 1.1548143903319879] }, { "value": 0.5049521635072105, "weights": [0.3806057520938446, -0.2846266111970974] }] }, { "id": 2, "neurons": [{ "value": 0.48635347908950954, "weights": [-0.9300720101297109, 0.8591542334783404] }] }] }
const smartBrain = { "neurons": [2, 2, 1], "weights": [0.19516375343064896, -0.39550168472661973, -0.7534904325710081, 0.44023942951581274, 0.5557702209319282, -0.582633625152837] }
const MODE = 'versus' // 'auto'|'player'|'versus'


// Initialisaton
let populationNumber = 0
let previousTimestamp = 0
let lost = false

canvas.style.backgroundColor = bgColor

if (MODE == 'auto') {
	populationNumber = 75
}

const neEV = new Neuroevolution({ // Neuro Evolution
	population: populationNumber,
	network: [2, [2], 1],
	historic: 2,
	elitism: 0.3,
	randomBehaviour: 0.27
})

const brain = new Brain()
const ground = new Ground()
const player = new Bird(birdRadius, ground, true)
let enemy;

if (MODE == 'auto') {
	brain.start()
} else if (MODE == 'versus') {
	enemy = new CheatedBird(birdRadius, ground);

}

ground.generatePipes(10);


// Events
['load', 'resize'].forEach(event => {
	window.addEventListener(event, e => {
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
	})
})
window.addEventListener('keydown', key => {
	if (key.keyCode == 32) { // Space Bar
		player.jump()
	}
})

function splashScreen() {
	ctx.font = '2em Roboto'
	ctx.fillStyle = '#e5e5e5'
	ctx.fillText(`Score : ${player.passedPipe.length}`, window.innerWidth / 2 - 25, window.innerHeight / 2 - 50)
}

function frameRate(timestamp) {
	let fps = Math.round(1e3 / (timestamp - previousTimestamp))
	previousTimestamp = timestamp
	ctx.font = '1em Roboto'
	ctx.fillStyle = '#e5e5e5'
	ctx.fillText(`${fps} fps`, 20, 30)
}

function displayInformations() {
	ctx.font = '1em Roboto'
	ctx.fillStyle = '#e5e5e5'
	ctx.fillText(`Génération n° : ${brain.generation}`, 20, 50)
	ctx.fillText(`Alives : ${brain.alives}/${brain.gen.length}`, 20, 70)
	ctx.fillText(`Score Max : ${brain.maxScore}`, 20, 90)
	ctx.fillText(`Birds Best Score: ${brain.bestBird.passedPipe.length}`, 20, 110)
	ctx.fillText(`Birds Current Score: ${brain.currentBestScore}`, 20, 130)
}

function displayScore() {
	ctx.font = '1em Roboto'
	ctx.fillStyle = '#e5e5e5'
	ctx.fillText(`Score : ${player.passedPipe.length}`, 20, 50)
}

function update() {
	if (lost) return
	if (MODE == 'auto') {
		brain.update()
	} else if (MODE == 'player' || MODE == 'versus') {
		player.update()
	}
	if (MODE == 'versus') {
		enemy.update()
	}
	ground.update()
}

function render(timestamp) {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
	update()
	frameRate(timestamp)
	ground.pipes.forEach(pipe => pipe.render(ctx))
	ground.render(ctx)
	if (MODE == 'auto') {
		brain.birds.forEach(bird => bird.render(ctx))
		displayInformations()
	} else if (MODE == 'player' || MODE == 'versus') {
		player.render(ctx)
		displayScore()
	}
	if (MODE == 'versus') {
		enemy.render(ctx)
	}

	if (lost) {
		splashScreen()
		return
	}
	window.requestAnimationFrame(render)
}


window.requestAnimationFrame(render)


/*
TRAINED BIRD :
"{"layers":[{"id":0,"neurons":[{"value":0.6243708609271523,"weights":[]},{"value":0.7653178963519267,"weights":[]}]},{"id":1,"neurons":[{"value":0.5251544259730203,"weights":[-1.2542183639657278,1.1548143903319879]},{"value":0.5049521635072105,"weights":[0.3806057520938446,-0.2846266111970974]}]},{"id":2,"neurons":[{"value":0.48635347908950954,"weights":[-0.9300720101297109,0.8591542334783404]}]}]}"

*/