/** Carnivore species that eats herbies for energy. */
class Pred extends Herby {
  /**
   * Creates a Pred.
   * @param {Env} env Parent ecosystem. 
   * @param {number} [x] X-value of position within the ecosystem.
   * @param {number} [y] Y-value of position within the ecosystem.
   * @param {object} [params] Organism stats.
   */
  constructor(env, x, y, params = {}){
    super(env, x, y, params)
    this.defaults = {
      maxe: random(20, 40),
      maxl: random(30, 60),
      mins: random(0, 2),
      maxs: random(4, 8),
      fov: random(PI / 8, PI / 4),
      vis: random(5, 10),
      color: color(COLORS.pred),
      eff: random(10, 20),
    }
    this.defaults.energy = random(this.defaults.maxe / 2, this.defaults.maxe)
    this.defaults.life = random(this.defaults.maxl / 2, this.defaults.maxl) * 60
    this.defaults.hue = hue(this.defaults.color) + random(-20, 20)
    this.override({...this.defaults, ...params})

    this.id = this.env.pred_id++

    this.constrain()
  }

  dcoeff(){
    return map(this.energy, 0, 40, 4, 20)
  }

  /**
   * Checks if organism is within pred sightlines.
   * @param {Plant|Herby|Pred} org Organism to check.
   * @param {number} [vis] Max. distance from pred to check.
   */
  inFOV(org, vis = this.vis){
    let h = this.vel.heading()
    let c = p5.Vector.sub(org.pos, this.pos).heading()
    let u = c - this.fov
    let v = c + this.fov
    return u <= h && h <= v && this.isClose(org, this.dcoeff() * vis)
  }

  isClose(org, d){
    return super.isClose(org, d)
  }

  act(){
    if(!this.isDead()){
      let foods = this.env.herbies.filter(a => this.isClose(a) && a.energy > 0)
      let homies = this.env.preds.filter(a => this.id != a.id)
      let squad = homies.filter(a => this.isClose(a))
      let mates = squad.filter(a => a.energy >= 20)

      // Idle energy drain
      this.energy -= .01

      // Eat if food is close
      if(foods.length && this.energy < this.maxe){
        let best = Env.sort(foods, a => a.energy).reverse()
        let e = min(80, best[0].energy, this.maxe - this.energy)

        this.energy += e
        best[0].energy -= e
        best[0].life -= e
      }

      // Reproduce if energy is 20+ and another pred with 20+ energy is close
      // Halves energy of both parents
      if(this.env.preds.length < this.env.max[2] && this.energy >= 20 && mates.length){
        let best = Env.sort(mates, a => this.pos.dist(a.pos))[0]

        this.env.preds.unshift(new Pred(
          this.env,
          this.pos.x + Env.randsign() * this.dcoeff(),
          this.pos.y + Env.randsign() * this.dcoeff(),
          {
            maxe: this.mix(this.maxe, best.maxe),
            maxl: this.mix(this.maxl, best.maxl),
            mins: this.mix(this.mins, best.maxs),
            maxs: this.mix(this.maxs, best.maxs),
            fov: this.mix(this.fov, best.fov),
            vis: this.mix(this.vis, best.vis),
            hue: this.mix(this.hue, this.hue),
            eff: this.mix(this.eff, best.eff),
            energy: this.energy / 2,
          }))

        this.energy /= 2
        best.energy /= 2
      }

      // If there is spare energy, move towards the nearest food/mate
      if(this.energy > this.mins / this.eff){
        let herbies = this.env.herbies.filter(a => this.inFOV(a, this.vis * 2) && !this.isDead())
        let foods = Env.sort(herbies, a => this.pos.dist(a.pos))
        squad = homies.filter(a => !this.isClose(a, this.dcoeff * this.vis))
        let alphas = Env.sort(homies, a => a.energy).reverse()
        let mates = Env.sort(squad.filter(a => a.energy >= 20), a => this.pos.dist(a.pos))

        if(this.energy >= 20 && mates[0]) this.move(mates[0].pos)
        else if(foods[0]) this.move(foods[0].pos, this.inFOV(foods[0]) || this.energy < this.maxs / this.eff)
        else if(alphas[0] && alphas[0].goal) this.move(alphas[0].goal)
        else if(this.vel.mag() == 0) this.vel = createVector(random(), random())
        else {
          let v = this.vel.copy()
          v.setMag(this.maxs)
          v.setHeading(this.vel.heading() + PI / 6)
          this.move(p5.Vector.add(this.pos, v))
        }
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
    scale(this.dcoeff())
    fill(color(this.hue, brightness(this.color), saturation(this.color)))
    triangle(-1, -1, -1, 1, 1, 0)
    pop()
  }
}