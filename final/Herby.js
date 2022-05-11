/** Herbivore species that eats plants for energy. */
class Herby extends Plant {
  /**
   * Creates an Herby.
   * @param {Env} env Parent ecosystem. 
   * @param {number} [x] X-value of position within the ecosystem.
   * @param {number} [y] Y-value of position within the ecosystem.
   * @param {object} [params] Organism stats.
   */
  constructor(env, x, y, params = {}){
    super(env, x, y, params)

    this.defaults = {
      maxe: random(80, 160),
      maxl: random(60, 120),
      mins: random(0, 1),
      maxs: random(2, 4),
      color: color(COLORS.herby),
      eff: random(20, 40),
    }
    this.defaults.energy = random(this.defaults.maxe / 2, this.defaults.maxe)
    this.defaults.life = random(this.defaults.maxl / 2, this.defaults.maxl) * 60
    this.defaults.hue = hue(this.defaults.color) + random(-20, 20)
    this.override({...this.defaults, ...params})

    this.goal = null

    this.id = this.env.herby_id++
    this.vel = createVector(random(), random())

    this.constrain()
  }

  dcoeff(){
    return map(this.energy, 0, 160, 6, 30)
  }

  /**
   * Checks if another organism is close enough.
   * @param {Plant|Herby|Pred} org Organism to check.
   * @param {number} d Distance to check.
   * @returns {boolean} Whether organism is close enough.
   */
  isClose(org, d){
    if(d === undefined) d = this.dcoeff() + org.dcoeff()
    return this.pos.dist(org.pos) <= d 
  }

  /**
   * Moves the organism towards a target position.
   * @param {Vector} pos Target position.
   * @param {boolean} [safe=true] Whether to conserve energy (i.e. during fight/flight scenarios).
   */
  // TODO: physics-based movement, momentum conserves energy
  // TODO: collision?
  move(pos, safe = true){
    this.goal = pos

    let maxSpeed = safe ? this.mins : this.maxs
    let target = p5.Vector.sub(pos, this.pos)
    
    target.setMag(maxSpeed)
    let steer = p5.Vector.sub(target, this.vel)
    steer.limit(1)
    this.pos.add(this.vel)
    this.vel.add(steer)
    this.energy -= this.vel.mag() / this.eff
  }

  act(){
    if(!this.isDead()){
      let preds = this.env.preds.filter(a => this.isClose(a, this.maxe))
      let hunters = preds.filter(a => this.isClose(a, this.maxe / 3))

      let panic = false

      // Idle energy drain
      this.energy -= .1

      // Flight response
      if(preds.length && this.energy > this.maxs / this.eff){
        let best = Env.sort(preds, a => a.energy)[0]

        let v = this.vel.copy()
        v.setMag(this.maxs)
        v.setHeading(p5.Vector.sub(this.pos, best.pos).heading())
        this.move(p5.Vector.add(this.pos, v), false)
        if(hunters.length){
          hunters.map(a => a.energy -= .1)
          this.energy -= this.mins
        }
        panic = true
      }

      let foods = this.env.plants.filter(a => this.isClose(a) && !a.isDead())
      let homies = this.env.herbies.filter(a => this.id != a.id)
      let squad = homies.filter(a => this.isClose(a))
      let mates = squad.filter(a => a.energy >= 80)

      // Eat if food is close
      if(foods.length && this.energy < this.maxe){
        let best = Env.sort(foods, a => a.energy).reverse()
        let e = min(5, best[0].energy, this.maxe - this.energy)

        this.energy += e
        best[0].energy -= e
      }

      // Reproduce if energy is 80+ and another herby with 80+ energy is close
      // Halves energy of both parents
      if(this.env.herbies.length < this.env.max[1] && this.energy >= 80 && mates.length){
        let best = Env.sort(mates, a => this.pos.dist(a.pos))[0]

        this.env.herbies.unshift(new Herby(
          this.env,
          this.pos.x + Env.randsign() * this.dcoeff(),
          this.pos.y + Env.randsign() * this.dcoeff(),
          {
            maxe: this.mix(this.maxe, best.maxe),
            maxl: this.mix(this.maxl, best.maxl),
            mins: this.mix(this.mins, best.maxs),
            maxs: this.mix(this.maxs, best.maxs),
            hue: this.mix(this.hue, this.hue),
            eff: this.mix(this.eff, best.eff),
            energy: this.energy / 2,
          }))

        this.energy /= 2
        best.energy /= 2
      }

      // If there is spare energy, move towards the nearest food/mate
      // TODO: make herby account for food/mate density when deciding where to move
      if(!panic && this.energy > this.mins / this.eff){
        let foods = Env.sort(this.env.plants.filter(a => !a.isDead()), a => this.pos.dist(a.pos))
        squad = homies.filter(a => this.isClose(a, this.maxe))
        let alphas = Env.sort(homies, a => a.energy).reverse()
        let mates = Env.sort(squad.filter(a => a.energy >= 80), a => this.pos.dist(a.pos))

        if(this.energy >= 80 && mates[0]) this.move(mates[0].pos)
        else if(foods[0]) this.move(foods[0].pos)
        else if(alphas[0]) this.move(alphas[0].goal || alphas[0].pos)
      }

      this.constrain()

      this.life--
    }
  }

  draw(){
    noStroke()

    push()
    translate(this.pos.x, this.pos.y)
    rotate(this.vel.heading())
    fill(color(this.hue, brightness(this.color), saturation(this.color)))
    square(0, 0, this.dcoeff())
    pop()
  }
}