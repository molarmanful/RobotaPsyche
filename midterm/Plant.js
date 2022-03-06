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
      color: color(COLORS.plant),
    }
    this.defaults.energy = random(this.defaults.maxe / 2, this.defaults.maxe)
    this.defaults.life = random(this.defaults.maxl / 2, this.defaults.maxl) * 60
    this.defaults.hue = hue(this.defaults.color) + random(-20, 20)
    this.override({...this.defaults, ...params})

    this.constrain()
  }

  /** Adds new parameters to organism. */
  override(params){
    for(let k in params){
      this[k] = params[k]
    }
  }

  /**
   * Converts energy value to physical size.
   * @returns {number} Physical size relative to energy.
   */
  dcoeff(){
    return this.energy * 2
  }

  /** Checks if organism is dead. */
  isDead(){
    return this.energy <= 0 || this.life <= 0
  }

  /** Limits position to the bounds of the ecosystem. */
  constrain(){
    this.pos.x = constrain(this.pos.x, this.maxe, width - this.maxe)
    this.pos.y = constrain(this.pos.y, this.maxe, height - this.maxe)
  }

  /** Moves the organism one moment forward. */
  act(){
    if(!this.isDead()){
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
            hue: this.mix(this.hue, this.hue),
            energy: 1,
          }))

        this.energy -= 1
      }

      this.life--
    }
  }

  /**
   * Generates new potentially mutated value from 2 parent values.
   * @param {number} a Parent value 1.
   * @param {number} b Parent value 2.
   * @param {number} [i=.1] Max. amount in percent to alter value by if mutation occurs.
   */
  mix(a, b, i = .1){
    return (random() > .5 ? a : b) * (random() > .9 ? random(1 - i, 1 + i) : 1)
  }

  /** Draws the organism. */
  draw(){
    noStroke()
    fill(color(this.hue, brightness(this.color), saturation(this.color)))
    circle(this.pos.x, this.pos.y, this.dcoeff())
  }
}