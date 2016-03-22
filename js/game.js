// game variables and settings

var sv = {
  ballMoving : false,
  targets : [], // targets array
  vMax : 15, // projectile max speed
  g : 8 / 60, // gravity constant
  projR : 6, // projectile radius
  active: 0, // whose turn is it
  // tank : {
  //   power: 50,
  //   angle: 45,
  //   x: 30,
  //   y: 30,
  //   draw: drawTank
  //   },
  player0 : {
    power: 50,
    angle: 45,
    score: 0,
    x: 30,
    y: 30,
    angle: 45,
    draw: drawTank
    },
  player1 : {
    power: 50,
    angle: 45,
    score: 0,
    x: 30,
    y: 30,
    angle: 45,
    draw: drawTank
    },
  player : [sv.player0, sv.player1]
}

arr = [sv.player0, sv.player1]

/////// EVENT LISTENERS ///////

////// interactive controls //////

  // sliders
  $('#powerslider').on('input', function(){
    $('#powerclicker').val( $(this).val() )
    sv.player[sv.active].power = $(this).val()
    refresh()
  })
  $('#angleslider').on('input', function(){
    $('#angleclicker').val( $(this).val() )
    sv.player[sv.active].angle = $(this).val()
    refresh()
  })

  // direct number input for fine tuned control
  $('#powerclicker').on('change', function(){
    $('#powerslider').val($(this).val())
    sv.player[sv.active].power = $(this).val()
    refresh()
  })
  $('#angleclicker').on('change', function(){
    $('#angleslider').val($(this).val())
    sv.player[sv.active].angle = $(this).val()
    refresh()
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

function scoreboard() {
  ctx.save();
  ctx.scale(1,-1)
  ctx.font = "36px lucida grande";
  ctx.fillText("Player 1: " + sv.player0.score.toString(), 30, -550);
  ctx.fillText("Player 2: " + sv.player1.score.toString(), 580, -550);
  ctx.restore();
}

function drawTank(x, y, player) {
  ctx.save();
  ctx.translate(x, y);
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
  var normRot = ctx.rotate(sv.player[player].angle * (Math.PI / 180))
  var rvrsRot = ctx.rotate((-sv.player[player].angle * (Math.PI / 180) + Math.PI));
  player === 0 ? normRot : rvrsRot
  ctx.fillRect(0, -1.5, 23, 3)
  ctx.restore();
}

function Ball() {
  this.x = sv.player[sv.active].x
  this.y = sv.player[sv.active].y
  this.r = sv.projR
  this.vNaught = (sv.player[sv.active].power / 100) * sv.vMax
  this.vx = this.vNaught * Math.cos(sv.player[sv.active].angle * (Math.PI / 180))
  this.vy = this.vNaught * Math.sin(sv.player[sv.active].angle * (Math.PI / 180))
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
  this.x = 50 + (canvas.width-50-14) * Math.random()
  this.y = 64 + (canvas.height-120) * Math.random()
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

function refresh() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (var i=0; i<sv.targets.length; i++) {
    sv.targets[i].draw()
  }
  player1.draw(player1.x, player1.y, 1)
  player2.draw(player2.x, player2.y, 2)
  scoreboard()
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

    refresh()

    ball.x += ball.vx
    ball.y += ball.vy
    ball.vy -= sv.g
    ball.draw()
  }

  else if (didCollide()) {
    sv.targets.splice( didCollide()[1], 1)
    refresh()
    sv.ballMoving = false
    sv.active = (sv.active == 0 ? 1 : 0)
    return
  }

  else {
    refresh()
    sv.ballMoving = false
    sv.active = (sv.active == 0 ? 1 : 0)
    return
  }
}

drawTargets(5)
scoreboard()
sv.player0.draw(sv.player0.x, sv.player0.y, 0)
sv.player1.draw(sv.player1.x, sv.player1.y, 1)
