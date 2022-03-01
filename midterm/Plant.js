/** Plant species that self-generates energy over time. */
class Plant {
  /**
   * Creates a Plant.
   * @param {Env} env Parent ecosystem. 
   * @param {number} [x] X-value of position within the ecosystem.
   * @param {number} [y] Y-value of position within the ecosystem.
   * @param {object} [params] Organism stats.
   */
  constructor(env, x = random(width), y = random(height), params = {}){
    this.env = env
    this.pos = createVector(x, y)

    this.defaults = {
      energy: random(5, 10),
      life: random(5, 10) * 60,
    }
    this.override(this.defaults, params)

    this.constrain()
  }

  override(...params){
    for(let p of params){
      for(let k in p){
        this[k] = k in params ? params[k] : this.defaults[k]
      }
    }
  }

  /** Limits position to the bounds of the ecosystem. */
  constrain(){
    this.pos.x = constrain(this.pos.x, 10, width - 10)
    this.pos.y = constrain(this.pos.y, 10, height - 10)
  }

  /** Moves the organism one moment forward. */
  act(){
    // Generate energy
    if(this.energy < 10) this.energy += .5

    // Reproduce
    // TODO: evolution? (e.g. mutation + genetic mixing)
    while(this.env.plants.length < this.env.max[0] && this.energy >= 5){
      this.env.plants.unshift(new Plant(
        this.env,
        this.pos.x + Env.randsign() * (10 + random(-100, 100)),
        this.pos.y + Env.randsign() * (10 + random(-100, 100)),
        1))

      this.energy -= 1
    }

    this.life--
  }

  /** Draws the organism. */
  draw(){
    noStroke()
    fill(COLORS.plant)

    circle(this.pos.x, this.pos.y, map(this.energy, 0, 10, 2, 20))
  }
}