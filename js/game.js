// game variables and settings

var sv = {
  ballMoving : false,
  targets : [], // targets array
  vMax : 15, // projectile max speed
  g : 8 / 60, // gravity constant
  projR : 6, // projectile radius
  tank : {
    power: 50,
    angle: 45,
    x: 30,
    y: 30,
    draw: drawTank
    }
}

/////// EVENT LISTENERS ///////

////// interactive controls //////

  // sliders
  $('#powerslider').on('input', function(){
    $('#powerclicker').val( $(this).val() )
    sv.tank.power = $(this).val()
    wipe()
    redrawTargets()
  })
  $('#angleslider').on('input', function(){
    $('#angleclicker').val( $(this).val() )
    sv.tank.angle = $(this).val()
    wipe()
    redrawTargets()
  })

  // direct number input for fine tuned control
  $('#powerclicker').on('change', function(){
    $('#powerslider').val($(this).val())
    sv.tank.power = $(this).val()
    wipe()
    redrawTargets()
  })
  $('#angleclicker').on('change', function(){
    $('#angleslider').val($(this).val())
    sv.tank.angle = $(this).val()
    wipe()
    redrawTargets()
  })

  ///////FIRE CANNON/////////
  $('#FIRE').click( function() {
    if (!sv.ballMoving) {
      ball = new Ball()
      renderFrame()
    }
    else {return}
  })
  ///////FIRE CANNON/////////

///// END LIST OF EVENT LISTENERS //////


// CANVAS SECTION
var canvas = $('#game')[0]
var ctx = canvas.getContext('2d')

// change to Cartesian coordinates
ctx.translate(0, canvas.height)
ctx.scale(1,-1)

function drawTank() {
  ctx.save();
  ctx.translate(sv.tank.x, sv.tank.y);
  ctx.beginPath();
  // dome
  ctx.arc(0, 0, 10, 0, Math.PI);
  ctx.stroke();
  // treads
  ctx.moveTo(  0,  0);
  ctx.lineTo(-20,  0);
  ctx.lineTo(-15,-10);
  ctx.lineTo( 15,-10);
  ctx.lineTo( 20,  0);
  ctx.lineTo(  0,  0);
  ctx.stroke();
  // wheels
  ctx.moveTo(0, 0);
  ctx.arc(  0, -5, 5, Math.PI/2, Math.PI/2 + 2*Math.PI);
  ctx.moveTo(-10, 0);
  ctx.arc(-10, -5, 5, Math.PI/2, Math.PI/2 + 2*Math.PI);
  ctx.moveTo(10,0);
  ctx.arc( 10, -5, 5, Math.PI/2, Math.PI/2 + 2*Math.PI);
  ctx.stroke();
  // barrel
  ctx.moveTo(0, 0);
  ctx.rotate(sv.tank.angle * (Math.PI / 180));
  ctx.fillRect(0, -1, 23, 3)
  ctx.restore();
}

function Ball() {
  this.x = sv.tank.x
  this.y = sv.tank.y
  this.r = sv.projR
  this.vNaught = (sv.tank.power / 100) * sv.vMax
  this.vx = this.vNaught * Math.cos(sv.tank.angle * (Math.PI / 180))
  this.vy = this.vNaught * Math.sin(sv.tank.angle * (Math.PI / 180))
  this.color = 'black'
  this.draw = function() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fillStyle = this.color
    ctx.fill()
  }
}

function Target() {
  this.x = 50 + canvas.width * Math.random()
  this.y = canvas.height * Math.random()
  this.r = 14
  this.draw = function() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
    ctx.stroke()
  }
}

function drawTargets(n) {
  for (var i=0; i<n; i++) {
    sv.targets[i] = new Target()
    sv.targets[i].draw()
  }
}

function wipe() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function redrawTargets() {
  for (var i=0; i<sv.targets.length; i++) {
    sv.targets[i].draw()
  }
  sv.tank.draw()
}

function didCollide() {
  for (var i=0; i < sv.targets.length; i++) {
    var quad = Math.pow( ball.x - sv.targets[i].x, 2) + Math.pow( ball.y - sv.targets[i].y, 2)
    var d = Math.sqrt(quad)

    if (d < ball.r + sv.targets[i].r) {
      return [true, i]
    }
  }
  return false
}

function renderFrame() {
  // animate until ball goes out of bounds
  if (ball.x <= canvas.width &&
    ball.x >= 0 &&
    ball.y >= 0 &&
    !didCollide()) {

    sv.ballMoving = true;
    requestAnimationFrame(renderFrame)

    wipe()
    redrawTargets()

    ball.x += ball.vx
    ball.y += ball.vy
    ball.vy -= sv.g
    ball.draw()
  }

  else if (didCollide()) {
    sv.targets.splice( didCollide()[1], 1)
    wipe()
    redrawTargets()
    sv.ballMoving = false
    return
  }

  else {
    wipe()
    redrawTargets()
    sv.ballMoving = false
    return
  }
}

drawTargets(5)
sv.tank.draw()
