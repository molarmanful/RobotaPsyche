let ENV

let COLORS = {
  bg: '#070707',
  plant: '#34D1BF',
  herby: '#3454D1',
  pred: '#D1345B',
}

function setup(){
  // createCanvas(windowWidth, windowHeight)
  createCanvas(800, 800)
  rectMode(RADIUS)

  ENV = new Env([100, 50, 10], [400, 200, 100])
}

function draw(){
  background(COLORS.bg)
  ENV.act()
  ENV.draw()
}