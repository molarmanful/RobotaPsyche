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
      maxe: random(5, 10),
      maxl: random(5, 10),
    }
    this.defaults.energy = random(this.defaults.maxe / 2, this.defaults.maxe)
    this.defaults.life = random(this.defaults.maxl / 2, this.defaults.maxl) * 60
    this.override({...this.defaults, ...params})

    this.constrain()
  }

  /** Adds new parameters to organism. */
  override(params){
    for(let k in params){
      this[k] = params[k]
    }
  }

  dcoeff(){
    return this.energy * 2
  }

  /** Limits position to the bounds of the ecosystem. */
  constrain(){
    this.pos.x = constrain(this.pos.x, this.maxe, width - this.maxe)
    this.pos.y = constrain(this.pos.y, this.maxe, height - this.maxe)
  }

  /** Moves the organism one moment forward. */
  act(){
    // Generate energy
    if(this.energy < this.maxe) this.energy += .5

    // Reproduce
    while(this.env.plants.length < this.env.max[0] && this.energy >= 5){
      this.env.plants.unshift(new Plant(
        this.env,
        this.pos.x + Env.randsign() * random(1, 10) * this.dcoeff(),
        this.pos.y + Env.randsign() * random(1, 10) * this.dcoeff(),
        {
          maxe: this.mix(this.maxe, this.maxe),
          maxl: this.mix(this.maxl, this.maxl),
          energy: 1,
        }))

      this.energy -= 1
    }

    this.life--
  }

  mix(a, b, i = .1){
    return (random() > .5 ? a : b) * (random() > .9 ? random(1 - i, 1 + i) : 1)
  }

  /** Draws the organism. */
  draw(){
    noStroke()
    fill(COLORS.plant)

    circle(this.pos.x, this.pos.y, this.dcoeff())
  }
}