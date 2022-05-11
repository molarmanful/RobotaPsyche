let ENV

let COLORS = {
  bg: '#070707',
  plant: '#34D1BF',
  herby: '#3454D1',
  pred: '#D1345B',
}

function setup(){
  let c = createCanvas(windowWidth, windowHeight)
  c.parent('#canvas')
  rectMode(RADIUS)
  colorMode(HSB)

  ENV = new Env([100, 50, 25], [400, 200, 100])
  // ENV = new Env([100, 50, 25], [400, 200, 100])
}

function draw(){
  clear()
  ENV.act()
  ENV.draw()
}