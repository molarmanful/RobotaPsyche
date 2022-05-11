/** Parent ecosystem containing/governing all organisms. */
class Env {
  /**
   * Creates an Env.
   * @param {number[]} num Starting numbers of each species.
   * @param {number[]} [org_max=[Infinity, Infinity, Infinity]] Maximum number of each species allowed in the ecosystem (default Infinity).
   */
  constructor(num, org_max = [Infinity, Infinity, Infinity]){
    this.herby_id = 0
    this.pred_id = 0

    this.plants = [...new Array(num[0])].map(_=> new Plant(this))
    this.herbies = [...new Array(num[1])].map(_=> new Herby(this))
    this.preds = [...new Array(num[2])].map(_=> new Pred(this))

    this.num = num
    this.max = org_max
  }

  /**
   * Generates a random sign.
   * @static
   * @returns {number} 1 or -1.
   */
  static randsign(){
    return ~~random(0, 2) ? 1 : -1
  }
  
  /**
   * Sorts an array using an iterator.
   * @static
   * @param {Array} xs Array to sort.
   * @param {Function} f Iterator to execute on each item.
   * @returns {Array} Sorted array.
   */
  static sort(xs, f){
    return xs.slice().sort((a, b) => f(a) - f(b))
  }

  /**
   * Executes a function on each species.
   * @param {Function} f Function to execute on each species.
   */
  sync(f){
    for(let [i, orgs] of [this.plants, this.herbies, this.preds].entries()){
      f(orgs, i)
    }
  }

  /** Disposes of dead organisms. */
  purge(){
    this.sync(orgs => {
      for(let i = Infinity; ~i; i = orgs.findIndex(a => a.isDead())){
        orgs.splice(i, 1)
      }
    })
  }

  /** Moves the ecosystem one moment forward. */
  act(){
    this.purge()
    this.sync((orgs, i)=>{
      while(orgs.length < this.num[i]){
        orgs.unshift(new [Plant, Herby, Pred][i](this))
      }
    })
    this.sync(orgs => orgs.map(a => a.act()))
  }

  /** Draws the ecosystem. */
  draw(){
    this.sync(orgs => orgs.map(a=> a.draw()))
  }
}