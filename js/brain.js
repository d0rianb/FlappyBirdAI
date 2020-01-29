class Brain {
	constructor() {
		this.generation = 0
		this.gen = []
		this.birds = []
		this.alives = this.birds.length
		this.maxScore = 0
		this.bestBird = undefined
		this.bestNetwork = []
		this.currentBestScore = 0
	}

	start() {
		this.birds = []
		this.currentBestScore = 0
		this.gen = neEV.nextGeneration()
		this.gen.forEach(bird => this.birds.push(new Bird(20, ground)))
		this.alives = this.birds.length
		this.generation++
	}

	update() {
		this.birds.forEach((bird, index) => {
			bird.update()
			if (bird.alive) {
				let nextPipe = bird.nextPipe
				let inputs = [
					bird.y / window.innerHeight,
					nextPipe.y / window.innerHeight
				]
				let result = this.gen[index].compute(inputs)
				if (result >= .5) { bird.jump() }
				if (bird.score >= this.currentBestScore) {
					this.currentBestScore = bird.passedPipe.length
				}
				if (bird.score >= this.maxScore) {
					this.maxScore = bird.score
					this.bestBird = bird
					this.bestNetwork = this.saveBest()
				}
			} else {
				neEV.networkScore(this.gen[index], bird.score + 10 * bird.passedPipe.length); //  - bird.lastPipeHeight prend en compte la haiteur a laquelle l'oiseau c'est crashé
				delete this.birds[index]
			}
		})
		this.alives = this.birds.filter(bird => bird.alive).length
		if (this.alives == 0) {
			this.start()
			ground.restart()
		}
	}

	saveBest() {
		let index = this.birds.indexOf(this.bestBird)
		return this.gen[index]
	}

	set(save) {
		this.birds.forEach((bird, i) => {
			this.gen[i].setSave(save)
		})

	}

}