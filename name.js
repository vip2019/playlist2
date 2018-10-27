//!!!!!!!!!!!!!!!!!!!/!/!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!/!/!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  Built by Addison Rodomista
//  Insta:  @rodomeista
//!!!!!!!!!!!!!!!!/!/!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!/!/!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

$(document).ready(function(event) {
  window.e1 = new Equalizer("eq1", 75, 200, 0.8, 0.2, 3, 2, "#dadfe1");
  window.e1.start();
})

var Equalizer = function(_canvas, _numBars, _height, _barRatio, _paddingRatio, _growSpeed, _shrinkSpeed, _color) {

  //---------------------------------------
  // Private Variables
  //---------------------------------------

  if (_barRatio > 1 || _paddingRatio > 1) {
    console.error("There was a problem with the ratio value provided. They must be less than or equal to 1. Given Values:", _barRatio, _paddingRatio);
    return;
  }

  var animating = false;

  var midPoint = 0;

  var maxBarHeight = _height;
  var maxBarSmall = 50;
  var minBarHeight = 20;

  var barRatio = _barRatio;
  var paddingRatio = _paddingRatio;

  var barPadding = 10;
  var barWidth = 10;

  var totalBars = _numBars;

  var barColor = _color;

  var canvas = document.getElementById(_canvas);
  var ctx = canvas.getContext("2d");

  var bar = [];

  var width = canvas.width;

  var speed = {
    grow: _growSpeed,
    shrink: _shrinkSpeed
  };

  // var mousePos = {
  //   x: 0,
  //   y: 0
  // };

  var resizeTimeOut = false;

  //-----------------------------
  // Bind function calls to dom
  //-----------------------------
  init();

  //-----------------------------
  // init() 
  // - Begins the animation sequence 
  //-----------------------------
  function init() {
    initBars();
    bindResizeEvents();
    // bindMouseMove();
  }

  function start() {
    animating = true;
    update();
  }

  function initBars() {
    resize($(window).width());
    var barHeight = 0,
      x = 0,
      y = 0;

    midpoint = width / 2;

    for (var i = 0; i < totalBars; i++) {
      x = (i + i) * barPadding + (barWidth * i);

      barHeight = randomizeHeight(x);
      y = getHeight(barHeight);

      bar.push({
        height: barHeight,
        buffHeight: barHeight,
        direction: -1,
        x: x,
        y: y
      });
    }
  }

  //-----------------------------
  // bindResizeEvents() 
  // - used to bind resizeEvents
  //-----------------------------
  function bindResizeEvents() {
    $(window).on('resize', function(e) {
      if (resizeTimeOut !== false)
        clearTimeout(resizeTimeOut);

      resizeTimeOut = setTimeout(function() {
        resize($(this).width());
      }, 200);
    });
  }

  //-----------------------------
  // stop() 
  // - Stops the animation sequence 
  //-----------------------------
  // function stop() {
  //   animating = false;
  // }

  //-----------------------------
  // draw() 
  // - Draw the contents of an individual frame 
  //-----------------------------
  function draw() {
    for (var index = 0; index < bar.length; index++) {

      ctx.fillStyle = barColor;
      ctx.clearRect(bar[index].x, bar[index].y, barWidth, bar[index].height);
      bar[index].y = getHeight(bar[index].height);
      bar[index].x = (index + index) * barPadding + (barWidth * index);

//       if (mousePos.x >= bar[index].x - barWidth * 10 &&
//         mousePos.x < bar[index].x + barWidth * 10 &&
//         Math.abs(mousePos.y - maxBarHeight / 2) < 100) {
//         bar[index].direction = -1;

//       }

      if (bar[index].height < bar[index].buffHeight && bar[index].direction > 0) {
        bar[index].height += speed.grow;
      } else if (bar[index].direction > 0) {
        bar[index].direction = -1;
      }

      // If increasing grow it 
      if (bar[index].height > bar[index].buffHeight / 1.25 && bar[index].direction < 0) {
        bar[index].height -= speed.shrink;
      } else if (bar[index].direction < 0) {
        bar[index].buffHeight = randomizeHeight(bar[index].x);
        bar[index].direction = 1;
      }

      ctx.fillRect(bar[index].x, bar[index].y, barWidth, bar[index].height);
    }

    var grd = ctx.createLinearGradient(146.000, 0.000, 154.000, 4000.000);
    /*         var grd = ctx.createLinearGradient(146.000, 0.000, 154.000, 600.000);*/

    // Add colors
    grd.addColorStop(0.000, 'rgba(255, 255, 255, 0.000)');
    grd.addColorStop(1.000, 'rgba(0, 0, 0, 1.000)');

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 400, width, 400);

  }

  //-----------------------------
  // update() 
  // - Redraws Canvas each frame
  //-----------------------------
  function update() {
    if (!animating) return;
    draw();
    requestAnimationFrame(update);
  }

  //-----------------------------
  // getHeight() 
  // - Returns the height in relation to the maxBarHeight
  //-----------------------------
  function getHeight(_height) {
    return Math.round((maxBarHeight - _height) / 2);
  }

  //-----------------------------
  // bindMouseMove() 
  // - bind the mouse move event to the canvas
  //-----------------------------
  // function bindMouseMove() {
  //   canvas.addEventListener('mousemove', function(e) {
  //     mousePos = getMousePos(e);
  //   });
  // }

  //-----------------------------
  // getMousePos() 
  // - Return the mouse position
  //-----------------------------
  // function getMousePos(e) {
  //   var rect = canvas.getBoundingClientRect();
  //   return {
  //     x: e.clientX - rect.left,
  //     y: e.clientY - rect.top
  //   };
  // }

  //-----------------------------
  // randomizeHeight() 
  // - Calculate a new maxheight to reach when increasing in size
  //-----------------------------
  function randomizeHeight(pos) {
    var maxVal,
      temp;

    if (pos > midPoint) {
      pos = pos - midPoint;
      temp = Math.abs((pos / midPoint) - 1);
    } else {
      temp = (pos / midPoint);
      if (temp == 0) temp = 0.01;
    }

    maxVal = temp * maxBarHeight;
    return Math.floor((Math.random() * maxVal) + minBarHeight);
  }

  //-----------------------------
  // resize() 
  // - Handles resizing the canvas elements according to a specified canvas width
  //-----------------------------
  function resize(_width) {
    width = _width;
    canvas.width = _width;
    midPoint = _width / 2;
    totalWidth = Math.abs(_width / totalBars);
    barWidth = Math.ceil(totalWidth * barRatio);
    barPadding = Math.ceil(totalWidth * paddingRatio);
  }

  //-----------------------------
  // setSpeed() 
  // - set speed values used to grow or shrink the size 
  //-----------------------------
  function setSpeed(_grow, _shrink) {
    speed.grow = _grow;
    speed.shrink = _shrink;
  }

  //---------------------------------------
  // Publicly Accessible Variables / Functions 
  //---------------------------------------
  return ({
    start: start,
    stop: stop
  });
}
