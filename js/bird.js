class Bird {
    constructor(radius, ground, player = false) {
        this.radius = radius
        this.x = window.innerWidth / 2
        this.y = window.innerHeight / 2
        this.ground = ground
        this.gravity = 0
        this.velocity = 0.3
        this.up = -6
        this.alive = true
        this.player = player
        this.score = 0
        this.nextPipe = undefined
        this.passedPipe = []
    }

    jump() {
        this.gravity = this.up
    }

    dist(pipe) {
        if (!pipe) return Infinity
        return pipe.x + pipe.width - this.x - this.radius / 2
    }

    detectCollision() {
        this.ground.pipes.forEach(pipe => {
            let dist = this.dist(pipe)
            let nextPipeDist = this.nextPipe ? this.dist(this.nextPipe) : Infinity
            if (nextPipeDist < 0) {
                nextPipeDist = Infinity
                if (!this.passedPipe.includes(this.nextPipe)) {
                    this.passedPipe.push(this.nextPipe)
                    this.nextPipe.focus = false
                }
            }
            if (dist > 0 && dist < nextPipeDist) { this.nextPipe = pipe }
        })
        if (DEBUG) { this.nextPipe.focus = true }
        let nextPipeDist = this.dist(this.nextPipe)

        if (nextPipeDist <= this.nextPipe.width && nextPipeDist >= 0) {
            if (this.y - this.radius / 2 <= this.nextPipe.y - this.nextPipe.gap || this.y + this.radius / 2 >= this.nextPipe.y + this.nextPipe.gap) {
                if (this.player) { lost = true }
                this.alive = false
                this.lastPipeHeight = Math.abs(this.y - this.nextPipe.y)
            }
        }
    }

    update() {
        this.detectCollision()
        if (this.y + this.radius / 2 <= window.innerHeight - this.ground.y && this.y - this.radius / 2 >= 0) {
            this.gravity += this.velocity
            this.y += this.gravity
            this.score++
        } else {
            if (this.player) { lost = true }
            this.alive = false
        }
    }

    render(ctx) {
        let birdImg = new Image()
        birdImg.src = 'ressources/bird.png'

        if (DEBUG) {
            ctx.fillStyle = '#eee'
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
            ctx.fill()
        } else {
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.rotate(Math.PI / 2 * this.gravity / 20)
            ctx.drawImage(birdImg, 0, 0, 35, 28)
            ctx.restore()
        }
    }
}

class CheatedBird extends Bird {
    constructor(radius, ground) {
        super(radius, ground, false)
        this.neEv = new Neuroevolution({
            population: 1,
            network: [2, [2], 1]
        })
        this.network = this.neEv.nextGeneration()[0]
        this.network.setSave(smartBrain)
    }

    update() {
        this.detectCollision()
        let inputs = [
            this.y / window.innerHeight,
            this.nextPipe.y / window.innerHeight
        ]
        let result = this.network.compute(inputs)
        if (result >= .5) { this.jump() }
        if (this.y + this.radius / 2 <= window.innerHeight - this.ground.y && this.y - this.radius / 2 >= 0) {
            this.gravity += this.velocity
            this.y += this.gravity
            this.score++
        } else {
            this.alive = false
        }
    }

    render(ctx) {
        let birdImg = new Image()
        birdImg.src = 'ressources/bird-enemy.png'

        if (DEBUG) {
            ctx.fillStyle = '#9ee'
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
            ctx.fill()
        } else {
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.rotate(Math.PI / 2 * this.gravity / 20)
            ctx.drawImage(birdImg, 0, 0, 35, 28)
            ctx.restore()
        }
    }
}