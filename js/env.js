const maxPipeGap = 250
const pipeGap = 360

class Ground {
	constructor() {
		this.x = Infinity
		this.y = 80
		this.speed = 5
		this.pipes = []
	}

	restart() {
		this.pipes = []
		this.speed = 5
		this.generatePipes(10)
	}

	generatePipes(number) {
		for (let i = 0; i < number; i++) {
			this.pipes.push(new Pipe(window.innerWidth + i * pipeGap, Math.random() * 500 + 150, this.pipes.length))
		}
	}

	managePipes() {
		this.pipes = this.pipes.filter(pipe => pipe.x + pipe.width >= 0)
		if (this.pipes.length < 3) {
			this.generatePipes(10)
		}
	}

	update() {
		this.pipes.forEach(pipe => {
			pipe.x -= this.speed
		})
		this.managePipes()
	}

	render(ctx) {
		let groundImg = new Image()
		groundImg.src = 'ressources/ground.png'
		let groundTexture = ctx.createPattern(groundImg, 'repeat')
		ctx.fillStyle = groundTexture
		ctx.fillRect(0, window.innerHeight - this.y, window.innerWidth, this.y)
	}
}

class Pipe {
	constructor(x, y, id) {
		this.id = id
		this.x = x
		this.y = y
		this.width = 80
		this.focus = false
		this.gap = Math.random() * 10 + 60
	}

	render(ctx) {
		let pipeImg = new Image()
		pipeImg.src = 'ressources/pipe-bottom.png'
		this.focus ? pipeImg.src = 'ressources/pipe-bottom-focus.png' : null
		ctx.drawImage(pipeImg, this.x, 0, this.width, this.y - this.gap) // Pipe Top
		ctx.drawImage(pipeImg, this.x, this.y + this.gap, this.width, window.innerHeight) // Pipe Bottom

		let pipeTopImg = new Image()
		pipeTopImg.src = 'ressources/pipe-top.png'
		this.focus ? pipeTopImg.src = 'ressources/pipe-top-focus.png' : null
		ctx.drawImage(pipeTopImg, this.x - 3, this.y - this.gap - 45, this.width + 6, 45)
		ctx.drawImage(pipeTopImg, this.x - 3, this.y + this.gap, this.width + 6, 45)
	}
}