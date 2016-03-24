function drawEverything() {
  if (!isGameOver()) {
    if (typeof(ball) !== 'undefined') {moveShot()}
    tankBlownUp()
    refresh()
    requestAnimationFrame(drawEverything)
  }
}

// game variables and settings

var sv = {
  ballMoving : false,
  targets : [], // targets array
  vMax : 15, // projectile max speed
  g : 8 / 60, // gravity constant
  projR : 6, // projectile radius
  turnArrowSpeed: 10, // speed turn arrow floats up and down
  active: 0, // whose turn is it
  winner: null, // who won
  player0 : {
    power: 50,
    angle: 45,
    score: 0,
    x: 30,
    y: 30,
    r: 23,
    vx: 0,
    vy: 0,
    draw: drawTank
    },
  player1 : {
    power: 50,
    angle: 45,
    score: 0,
    x: 770,
    y: 30,
    r: 23,
    vx: 0,
    vy: 0,
    draw: drawTank
    },
  targetValues : [
     [ 1, 14, 'green'],
     [ 2,  9, 'orange'],
     [ 4,  5, 'blue'],
     [-2, 12, 'black'],
     [10,  2, 'red']
     ]
}

var player = [sv.player0, sv.player1]

/////// EVENT LISTENERS ///////

////// interactive controls //////

  // sliders
  $('#powerslider').on('input', function(){
    $('#powerclicker').val( $(this).val() )
    player[sv.active].power = $(this).val()
    refresh()
  })
  $('#angleslider').on('input', function(){
    $('#angleclicker').val( $(this).val() )
    player[sv.active].angle = $(this).val()
    refresh()
  })

  // direct number input for fine tuned control
  $('#powerclicker').on('change', function(){
    $('#powerslider').val($(this).val())
    player[sv.active].power = $(this).val()
    refresh()
  })
  $('#angleclicker').on('change', function(){
    $('#angleslider').val($(this).val())
    player[sv.active].angle = $(this).val()
    refresh()
  })

  //reset button
  $('#reset').on('click', resetGame)

  ///////FIRE CANNON/////////
  $('#FIRE').click(function() {
    if (!sv.ballMoving && sv.active !== null) {
      sv.ballMoving = true
      ball = new Ball()
      console.log([ball.vx, ball.vy])
    }
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
  ctx.fillText(sv.player0.score.toString(), 30, -550);
  ctx.fillText(sv.player1.score.toString(), 740, -550);
  ctx.restore();
}

function drawTank(x, y, t) {
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
  if (t===0) {
    ctx.rotate(player[0].angle * (Math.PI / 180))
  }
  else if (t == 1) {
    ctx.rotate( (-player[1].angle * (Math.PI / 180) + Math.PI))
  }
  ctx.fillRect(0, -1.5, 23, 3)
  ctx.restore();
  // turn indicator
  // if (t == sv.active) {
  //   ctx.save();
  //   ctx.translate(x, y);
  //   ctx.beginPath();
  //   ctx.moveTo(0, 28);
  //   ctx.lineTo(5, 45);
  //   ctx.lineTo(-5, 45);
  //   ctx.fillStyle = 'blue'
  //   ctx.fill();
  //   ctx.restore();
  // }
}

function TurnArrow() {
  this.x = player[sv.active].x
  this.y = player[sv.active].y
  this.phase = 0
  this.angularVelocity = (2*Math.PI) / 60
  this.draw = function () {
    var time = new Date();
    ctx.save();
    if (sv.active != null) {
      ctx.translate(player[sv.active].x, -10*Math.cos(2*Math.PI * time.getSeconds() + (2*Math.PI/1000) * time.getMilliseconds()) + player[sv.active].y + 20)
    }
    ctx.beginPath();
    ctx.moveTo(0, 28);
    ctx.lineTo(5, 45);
    ctx.lineTo(-5, 45);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.restore();
  }
}

function Ball() {
  this.x = player[sv.active].x
  this.y = player[sv.active].y
  this.r = sv.projR
  this.vNaught = (player[sv.active].power / 100) * sv.vMax
  var mod = (sv.active === 0 ? 1 : -1)
  this.vx = mod * this.vNaught * Math.cos(player[sv.active].angle * (Math.PI / 180))
  this.vy = this.vNaught * Math.sin(player[sv.active].angle * (Math.PI / 180))
  this.color = 'black'
  this.draw = function() {
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.restore()
  }
}

function Target(arr) {
  this.x = 50 + (canvas.width-50-14) * Math.random()
  this.y = 64 + (canvas.height-120) * Math.random()
  this.r = arr[1]
  this.value = arr[0]
  this.color = arr[2]
  this.draw = function() {
    if (arr[1]) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.restore()
    }
  }
}

function drawTargets(n) {
  for (var i=0; i<n; i++) {
    var randomIndex = Math.floor(sv.targetValues.length * Math.random())
    sv.targets[i] = new Target(sv.targetValues[randomIndex])
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
  sv.player0.draw(player[0].x, player[0].y, 0)
  sv.player1.draw(player[1].x, player[1].y, 1)
  arrow.draw()
  scoreboard()
  if (typeof(ball) !== 'undefined') {ball.draw()}
}

var addToScore;
var collideType;
function didCollide() {
  // hit target?
  for (var i=0; i < sv.targets.length; i++) {
    var quad = Math.pow( ball.x - sv.targets[i].x, 2) + Math.pow( ball.y - sv.targets[i].y, 2)
    var d = Math.sqrt(quad)

    if (d < ball.r + sv.targets[i].r) {
      console.log([true, i, sv.targets[i].value])
      addToScore = sv.targets[i].value
      collideType = 'target'
      return [true, i]
    }
  }

  // hit tank?
  if (ball.vy < 0) {
    for (var j=0; j<2; j++) {
      quad = Math.pow( ball.x - player[j].x, 2) + Math.pow( ball.y - player[j].y, 2)
      d = Math.sqrt(quad)

      if (d < ball.r + player[j].r) {
        player[j].vx = (ball.vx<0 ? -100/60:100/60)
        player[j].vy = 200/60
        collideType = 'tank'
        console.log('tank hit detected')
        return [true, j]
      }
    }
  }
}

function moveShot() {
  // animate until ball goes out of bounds
  if (ball.x <= canvas.width &&
    ball.x >= 0 &&
    ball.y >= 0 &&
    !didCollide()) {

    sv.ballMoving = true;

    ball.x += ball.vx
    ball.y += ball.vy
    ball.vy -= sv.g
    ball.draw()
  }

  else if (collideType == 'target') {
    sv.targets.splice( didCollide()[1], 1)
    player[sv.active].score += addToScore
    ball = undefined
    sv.ballMoving = false
    nextTurn()
    return
  }

  else {
    ball = undefined
    sv.ballMoving = false
    nextTurn()
    return
  }
}

function tankBlownUp() {
  for (var i=0; i<2; i++) {
    if (player[i].y >= 30) {
      player[i].x += player[i].vx
      player[i].y += player[i].vy
      player[i].vy -= sv.g

      // bounce off the walls
      if (player[i].x <= 10 || player[i].x >= 790) {
        player[i].vx = -player[i].vx
      }
    }
    else if (player[i].y < 30) {
      player[i].y = 30
      player[i].vx = 0
      player[i].vy = 0
    }
  }
}

// this will indicate points awarded on target hit. call it before the destroyed target is spliced from targets array
function Number(points) {
  this.x = sv.targets[didCollide()[1]].x
  this.y = sv.targets[didCollide()[1]].y - canvas.height
  this.draw = function() {
    ctx.save()
    ctx.scale(1, -1)
    ctx.translate(this.x, this.y-canvas.height)
    ctx.font = '10px lucida grande'
    ctx.filltext(points.toString(), this.x, this.y)
  }
}

function nextTurn() {
  sv.active = (sv.active == 0 ? 1 : 0)
  $('#powerclicker').val( player[sv.active].power )
  $('#powerslider').val( player[sv.active].power )
  $('#angleclicker').val( player[sv.active].angle )
  $('#angleslider').val( player[sv.active].angle )
  arrow = new TurnArrow()
  collideType = null
  refresh()
  isGameOver()
}

function isGameOver() {
  if (sv.targets.length === 0) {
    sv.winner = (sv.player0.score >= sv.player1.score ? 0 : 1)
    sv.active = null
    ctx.save();
    ctx.scale(1,-1)
    ctx.textAlign = 'center'
    ctx.font = '28px lucida grande'
    ctx.fillText('player '+(sv.winner+1)+' wins', 400, -400)
    ctx.restore();
    return true
  }
  else {return false}
}

function resetGame() {
  wipe()
  sv.ballMoving = false
  sv.targets = []
  sv.active = 0
  sv.winner = null
  for (var i=0; i<2; i++) {
    player[i].power = 50
    player[i].angle = 45
    player[i].score = 0
    player[i].x = (i==0 ? 30 : 770)
    player[i].y = 30
  }
  $('#powerclicker').val( player[sv.active].power )
  $('#powerslider').val( player[sv.active].power )
  $('#angleclicker').val( player[sv.active].angle )
  $('#angleslider').val( player[sv.active].angle )
  drawTargets(10)
  drawEverything()
}

var arrow = new TurnArrow()
drawTargets(1)
scoreboard()
sv.player0.draw(sv.player0.x, sv.player0.y, 0)
sv.player1.draw(sv.player1.x, sv.player1.y, 1)
drawEverything()
