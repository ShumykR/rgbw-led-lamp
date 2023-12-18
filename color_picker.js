var $ = document.querySelector.bind(document);

var selector = $('.color-picker .selector');
var hex = $('.color-picker .hex');
var svg = $('.color-picker');

function angleFor(x, y) {
  return Math.atan(y / x);
}

function rtod(r) {
  return Math.round(r * (180 / Math.PI)) + 90;
}

function paddedHex(dec) {
  var hex = "00" + dec.toString(16);
  return hex.slice(-2);
}

function atoc(a) {
  var red = 0, green = 0, blue = 0;
  var colorPC = 255 / 60;
  if (a >= 300 || a <= 60) red = 255;
  if (a >= 60 && a <= 180) green = 255;
  if (a >= 180 && a <= 300) blue = 255;
  if (a > 0 && a < 60) {
    green = Math.round(a * colorPC);
  }
  if (a > 60 && a < 120) {
    red = Math.round((120 - a) * colorPC);
  }
  if (a > 120 && a < 180) {
    blue = Math.round((a - 120) * colorPC);
  }
  if (a > 180 && a < 240) {
    green = Math.round((240 - a) * colorPC);
  }
  if (a > 240 && a < 300) {
    red = Math.round((a - 240) * colorPC);
  }
  if (a > 300 && a < 360) {
    blue = Math.round((360 - a) * colorPC);
  }
  var hexString = '#' + paddedHex(red) + paddedHex(green) + paddedHex(blue);
  return hexString.toUpperCase();
}

function onSVGSelect (e) {
  var x = e.offsetX, y = e.offsetY;
  var angle = angleFor(x - 200, y - 200);
  if (x < 200) {
    angle+=Math.PI;
  }
  var angleInDegrees = rtod(angle);
  var color = atoc(angleInDegrees)
  
  var selectX = Math.cos(angle) * 200;
  var selectY = Math.sin(angle) * 200;
  
  selector.setAttribute('cx', 200 + selectX);
  selector.setAttribute('cy', 200 + selectY);
  selector.setAttribute('fill', color);
  
  hex.setAttribute('fill', color);
  hex.setAttribute('stroke', color);
  hex.textContent = color;
}

function onSVGMouseDown() {
  svg.addEventListener('mousemove', onSVGSelect);
}
function onSVGMouseUp() {
  svg.removeEventListener('mousemove', onSVGSelect, false);
}

/* Mouse events */
svg.addEventListener('click', onSVGSelect);
svg.addEventListener('mousedown', onSVGMouseDown);
svg.addEventListener('mouseup', onSVGMouseUp);

/* Touch events */
window.addEventListener('touchstart', function onWindowTouchStart() {
  svg.removeEventListener('click', onSVGSelect, false);
  svg.removeEventListener('mousedown', onSVGMouseDown, false);
  svg.removeEventListener('mousemove', onSVGSelect, false);
  svg.removeEventListener('mouseup', onSVGMouseUp, false);
  
  svg.addEventListener('touchmove', function onSVGTouchMove(e) {
    var rect = e.target.getBoundingClientRect();
    var touch = e.targetTouches[0];
    
    onSVGSelect.call(svg, {
      offsetX: touch.pageX - rect.left,
      offsetY: touch.pageY - rect.top
    });
  });
  
  window.removeEventListener('touchstart', onWindowTouchStart)
});