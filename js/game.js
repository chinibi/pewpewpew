// game variables and settings

var sv = {
  ballMoving : false,
  targets : [],
  // trying to calibrate vMax and g so that the canvas represents the tank's entire range
  vMax : 15,
  // gravity. change in vy every frame assuming 60 fps
  g : 8 / 60,
  tank : {
    power: 50,
    angle: 45,
    x: 30,
    y: 30
  }
}

/////// EVENT LISTENERS ///////

////// interactive controls //////
  $('#powerslider').on('input', function(){
    $('#powerclicker').val( $(this).val() )
    sv.tank.power = $(this).val()
  })
  $('#angleslider').on('input', function(){
    $('#angleclicker').val( $(this).val() )
    sv.tank.angle = $(this).val()
  })

  // direct number input
  $('#powerclicker').on('change', function(){
    $('#powerslider').val($(this).val())
    sv.tank.power = $(this).val()
  })
  $('#angleclicker').on('change', function(){
    $('#angleslider').val($(this).val())
    sv.tank.angle = $(this).val()
  })

  // fire cannon
  $('#fire').click( function() {
    if (sv.ballMoving === false) {
      ball = new Ball();
      renderFrame();
    }
    else {return}
  })

///// END LIST OF EVENT LISTENERS //////


// CANVAS SECTION
var canvas = $('#game')[0]
var ctx = canvas.getContext('2d')

// change to Cartesian coordinates
ctx.translate(0, canvas.height);
ctx.scale(1,-1);

function Ball() {
  this.x = 30
  this.y = 30
  this.r = 6
  this.vNaught = (sv.tank.power / 100) * sv.vMax
  this.vx = this.vNaught * Math.cos(sv.tank.angle * (Math.PI / 180));
  this.vy = this.vNaught * Math.sin(sv.tank.angle * (Math.PI / 180));
  this.color = 'black'
  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function Target() {
  this.x = 50 + canvas.width * Math.random()
  this.y = canvas.height * Math.random()
  this.r = 14
  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    ctx.stroke();
  }
}

function drawTargets(n) {
  for (var i=0; i<n; i++) {
    sv.targets[i] = new Target()
    sv.targets[i].draw()
  }
}

function redrawTargets() {
  for (var i=0; i<sv.targets.length; i++) {
    sv.targets[i].draw()
  }
}

function renderFrame() {
  // animate until ball goes out of bounds
  if (ball.x <= canvas.width &&
    ball.x >= 0 &&
    ball.y >= 0) {

    sv.ballMoving = true;
    requestAnimationFrame(renderFrame);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawTargets()

    ball.x += ball.vx
    ball.y += ball.vy
    ball.vy -= sv.g

    ball.draw()
  }

  else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawTargets();
    sv.ballMoving = false;
    return;
  }
}

drawTargets(5)
var ball = new Ball();
ball.draw()
