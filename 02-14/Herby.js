/** Herbivore species that eats plants for energy. */
class Herby extends Plant {
  /**
   * Creates an Herby.
   * @param {Env} env Parent ecosystem. 
   * @param {number} [x] X-value of position within the ecosystem.
   * @param {number} [y] Y-value of position within the ecosystem.
   * @param {number} [energy] Energy level.
   * @param {number} [life] Amount of time (in frames) before certain death.
   * @param {number[]} [speeds=[1, 4]] Minimum and maximum base speeds.
   * @param {number} [eff=20] Energy efficiency during movement.
   */
  constructor(
    env, x, y,
    energy = random(10, 20),
    life = random(30, 60) * 60,
    speeds = [1, 4],
    eff = 20
  ){
    super(env, x, y, energy, life)
    this.id = this.env.herby_id++
    this.vel = createVector(0, 0)

    this.speeds = speeds
    this.eff = eff
  }

  /**
   * Checks if another organism is close enough.
   * @param {Plant|Herby|Pred} org Organism to check.
   * @param {number} d Distance to check.
   * @returns {boolean} Whether organism is close enough.
   */
  isClose(org, d = 10){
    return this.pos.dist(org.pos) <= this.energy + d 
  }

  /**
   * Moves the organism towards a target position.
   * @param {Vector} pos Target position.
   * @param {boolean} [safe=true] Whether to conserve energy (i.e. during fight/flight scenarios).
   */
  // TODO: physics-based movement, momentum conserves energy
  // TODO: collision?
  move(pos, safe = true){
    let maxSpeed = safe ? this.speeds[0] : this.speeds[1]
    this.vel = p5.Vector.sub(pos, this.pos)
    if(this.vel.mag() > maxSpeed) this.vel.setMag(maxSpeed)
    this.pos.add(this.vel)
    this.energy -= this.vel.mag() / this.eff
  }

  act(){
    let foods = this.env.plants.filter(a => this.isClose(a) && a.energy > 0)
    let homies = this.env.herbies.filter(a => this.id != a.id)
    let squad = homies.filter(a => this.isClose(a))
    let mates = squad.filter(a => a.energy >= 20)
    let preds = this.env.preds.filter(a => this.isClose(a, 80))

    // Idle energy drain
    this.energy -= .01

    // Flight response
    if(preds.length && this.energy > this.speeds[1] / this.eff){
      let best = Env.sort(preds, a => a.energy)[0]

      this.move(p5.Vector.sub(this.pos, best.pos).mult(this.speeds[1]), false)
    }

    else {
      // Eat if food is close
      if(foods.length && this.energy < 20){
        let best = Env.sort(foods, a => a.energy).reverse()
        let e = min(1, best[0].energy, 20 - this.energy)

        this.energy += e
        best[0].energy -= e
      }

      // Reproduce if energy is 10+ and another herby with 10+ energy is close
      // Halves energy of both parents
      if(this.env.herbies.length < this.env.max[1] && this.energy >= 10 && mates.length){
        let best = Env.sort(mates, a => this.pos.dist(a.pos))[0]

        this.env.herbies.unshift(new Herby(
          this.env,
          this.pos.x + Env.randsign() * (10 + random(-10, 10)),
          this.pos.y + Env.randsign() * (10 + random(-10, 10)),
          this.energy / 2))

        this.energy /= 2
        best.energy /= 2
      }

      // If there is spare energy, move towards the nearest food/mate
      // TODO: make herby account for food/mate density when deciding where to move
      if(this.energy > this.speeds[0] / this.eff){
        let foods = Env.sort(this.env.plants.filter(a => a.energy > 0), a => this.pos.dist(a.pos))
        homies = homies.filter(a => !this.isClose(a))
        let squad = Env.sort(homies, a => this.pos.dist(a.pos))
        let mates = Env.sort(squad.filter(a => a.energy >= 10), a => this.pos.dist(a.pos))

        if(this.energy >= 10 && mates[0]) this.move(mates[0].pos)
        else if(foods[0]) this.move(foods[0].pos)
        else if(foods[0]) this.move(foods[0].pos)
      }
    }

    this.constrain()

    this.life--
  }

  draw(){
    noStroke()

    push()
    translate(this.pos.x, this.pos.y)
    rotate(this.vel.heading())
    fill(COLORS.herby)
    square(0, 0, map(this.energy, 0, 20, 5, 20))
    pop()
  }
}