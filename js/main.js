const canvas = document.querySelector('#canvas')
const dpi = window.devicePixelRatio
const ctx = canvas.getContext('2d')
const bgColor = 'rgb(96, 186, 195)';
const MODE = 'auto' // 'auto'|'player'


// Initialisaton
const debug = false
let previousTimestamp = 0
let lost = false
canvas.style.backgroundColor = bgColor

const neEV = new Neuroevolution({ // Neuro Evolution
	population: 50,
	network: [2, [2], 1],
	historic: 2
})
const brain = new Brain()
const ground = new Ground()
const player = new Bird(20, ground, true)

const generateBrain = `{"layers":[{"id":0,"neurons":[{"value":0.6243708609271523,"weights":[]},{"value":0.7653178963519267,"weights":[]}]},{"id":1,"neurons":[{"value":0.5251544259730203,"weights":[-1.2542183639657278,1.1548143903319879]},{"value":0.5049521635072105,"weights":[0.3806057520938446,-0.2846266111970974]}]},{"id":2,"neurons":[{"value":0.48635347908950954,"weights":[-0.9300720101297109,0.8591542334783404]}]}]}`

brain.start()
ground.generatePipes(10);


// Events
['load', 'resize'].forEach(event => {
	window.addEventListener(event, e => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	})
})
window.addEventListener('keydown', key => {
	if (key.keyCode == 32) {
		player.jump()
	}
})

function splashScreen() {
	ctx.font = '2em Roboto'
	ctx.fillStyle = '#e5e5e5'
	ctx.fillText(`Score : ${player .passedPipe.length}`, window.innerWidth / 2 - 25, window.innerHeight / 2 - 50)
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
	ctx.fillText(`Bird Best Score: ${brain.bestBird.passedPipe.length}`, 20, 110)
	ctx.fillText(`Bird Current Score: ${brain.currentBestScore}`, 20, 130)
}

function update() {
	if (lost) {
		splashScreen()
		return
	}
	if (MODE == 'auto') {
		brain.update()
	} else if (MODE == 'player') {
		player.update()
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
	} else if (MODE == 'player') {
		player.render(ctx)
	}
	if (MODE == 'auto') {
		displayInformations()
	}
	window.requestAnimationFrame(render)
}


window.requestAnimationFrame(render)


/*
TRAINED BIRD :
"{"layers":[{"id":0,"neurons":[{"value":0.6243708609271523,"weights":[]},{"value":0.7653178963519267,"weights":[]}]},{"id":1,"neurons":[{"value":0.5251544259730203,"weights":[-1.2542183639657278,1.1548143903319879]},{"value":0.5049521635072105,"weights":[0.3806057520938446,-0.2846266111970974]}]},{"id":2,"neurons":[{"value":0.48635347908950954,"weights":[-0.9300720101297109,0.8591542334783404]}]}]}"

*/