/** Carnivore species that eats herbies for energy. */
class Pred extends Herby {
  /**
   * Creates a Pred.
   * @param {Env} env Parent ecosystem. 
   * @param {number} [x] X-value of position within the ecosystem.
   * @param {number} [y] Y-value of position within the ecosystem.
   * @param {number} [energy] Energy level.
   * @param {number} [life] Amount of time (in frames) before certain death.
   * @param {number[]} [speeds=[2, 8]] Minimum and maximum base speeds.
   * @param {number} [eff=10] Energy efficiency during movement.
   */
  constructor(env, x, y,
    energy = random(10, 20),
    life = random(15, 30) * 60,
    speeds = [2, 8],
    eff = 10
  ){
    super(env, x, y, energy, life)
    this.id = this.env.pred_id++
  }

  inFOV(org){
    let h = this.vel.heading()
    let c = p5.Vector.sub(org.pos, this.pos).heading()
    let u = c - PI / 8 
    let v = c + PI / 8
    return u <= h && h <= v
  }

  isClose(org, d = 20){
    return super.isClose(org, d)
  }

  act(){
    let foods = this.env.herbies.filter(a => this.isClose(a) && a.energy > 0)
    let homies = this.env.preds.filter(a => this.id != a.id)
    let squad = homies.filter(a => this.isClose(a))
    let mates = squad.filter(a => a.energy >= 20)

    // Idle energy drain
    this.energy -= .01

    // Eat if food is close
    if(foods.length && this.energy < 40){
      let best = Env.sort(foods, a => a.energy).reverse()
      let e = min(4, best[0].energy, 40 - this.energy)

      this.energy += e
      best[0].energy -= e
    }

    // Reproduce if energy is 20+ and another pred with 20+ energy is close
    // Halves energy of both parents
    if(this.env.preds.length < this.env.max[2] && this.energy >= 20 && mates.length){
      let best = Env.sort(mates, a => this.pos.dist(a.pos))[0]

      this.env.preds.unshift(new Pred(
        this.env,
        this.pos.x + Env.randsign() * (10 + random(-10, 10)),
        this.pos.y + Env.randsign() * (10 + random(-10, 10)),
        this.energy / 2))

      this.energy /= 2
      best.energy /= 2
    }

    // If there is spare energy, move towards the nearest food/mate
    if(this.energy > this.speeds[0] / this.eff){
      let herbies = this.env.herbies.filter(a => a.energy > 0 && this.inFOV(a))
      let foods = Env.sort(herbies, a => this.pos.dist(a.pos))
      homies = homies.filter(a => !this.isClose(a))
      let squad = Env.sort(homies, a => this.pos.dist(a.pos))
      let mates = Env.sort(squad.filter(a => a.energy >= 20), a => this.pos.dist(a.pos))

      if(this.energy >= 20 && mates[0]) this.move(mates[0].pos)
      else if(foods[0]) this.move(foods[0].pos, !this.isClose(foods[0], 200) || this.energy < this.speeds[1] / this.eff)
      else if(squad[0]) this.move(squad[0].pos)
      else this.vel.setHeading(this.vel.heading() + PI / 12)
    }

    this.constrain()

    this.life--
  }

  draw(){
    noStroke()

    push()
    translate(this.pos.x, this.pos.y)
    rotate(this.vel.heading())
    scale(map(this.energy, 0, 40, 2, 10))
    fill(COLORS.pred)
    triangle(-1, -1, -1, 1, 1, 0)
    pop()
  }
}