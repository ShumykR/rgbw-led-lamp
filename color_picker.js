const $ = document.querySelector.bind(document);

const [red_input, green_input, blue_input, w_input] = document.querySelectorAll('.rgbw_input');
const [h_range, s_range, v_range, w_range] = document.querySelectorAll('.hsvw_range');

const selector = $('.color-picker .selector');
const hex = $('.color-picker .hex');
const svg = $('.color-picker');


function angleFor(x, y) {
  return Math.atan(y / x);
}

function rtod(r) {
  return Math.round(r * (180 / Math.PI)) + 90;
}

function dtor(degrees)
{
  var pi = Math.PI;
  return (degrees-90) * (pi/180);
}

function paddedHex(dec) {
  const hex = "00" + dec.toString(16);
  return hex.slice(-2);
}

function atoc(a) {
  let red = 0, green = 0, blue = 0;
  const colorPC = 255 / 60;
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
  return [red, green, blue]
}

function ctoa(r, g, b) {
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;

  if (max === min) {
    h = 0; // achromatic
  } else {
    const d = max - min;
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return Math.round(h * 360);
}

//мій код
function RGBtoHEX(rgb) {
  const [red, green, blue] = rgb;
  const hexString = '#' + paddedHex(red) + paddedHex(green) + paddedHex(blue);
  return hexString.toUpperCase();
}

function HSVtoRGB(hsv) {
  let r, g, b;
  const [h, s, v] = hsv;
  let a, Hi, Vmin, Vinc, Vdec;
  Hi = Math.floor(h/60); Vmin = ((100 - s) * v)/100;
  a = (v - Vmin) * (h % 60)/60;
  Vinc = Vmin + a; Vdec = v - a;
  switch (Hi) {
    case 0:
      r = v; g = Vinc; b = Vmin;
      break;

    case 1:
      r = Vdec; g = v; b = Vmin;
      break;

    case 2:
      r = Vmin; g = v; b = Vinc;
      break;

    case 3:
      r = Vmin; g = Vdec; b = v;
      break;
    
    case 4:
      r = Vinc; g = Vmin; b = v;
      break;

    case 5:
      r = v; g = Vmin; b = Vdec;
      break;

    default:
      break;
  }
  return [Math.round(r*2.55), Math.round(g*2.55), Math.round(b*2.55)]
}

function SVGChange (e, angleInDegrees) {
  const x = e.offsetX, y = e.offsetY;
  let angle, degree;

  if (isNaN(angleInDegrees)) {
    angle = angleFor(x - 200, y - 200);

    if (x < 200) {
      angle += Math.PI;
    }
    degree = rtod(angle);
    
  } else {
    angle = dtor(angleInDegrees);
    degree = angleInDegrees
  }

  const color = RGBtoHEX(atoc(degree))
  
  const selectX = Math.cos(angle) * 200;
  const selectY = Math.sin(angle) * 200;
  
  selector.setAttribute('cx', 200 + selectX);
  selector.setAttribute('cy', 200 + selectY);
  selector.setAttribute('fill', color);
  
  hex.setAttribute('fill', color);
  hex.setAttribute('stroke', color);
  hex.textContent = color;
  console.log(degree)
  return degree;
}

function onSVGSelect(e) {
  const angleInDegrees = SVGChange(e, NaN)
  //мій код
  h_range.value = angleInDegrees

  const [red, green, blue] = atoc(angleInDegrees);
  red_input.value = red
  green_input.value = green
  blue_input.value = blue
  // w_input.setAttribute('value', red)
  //мій код
}

function onSVGMouseDown() {
  svg.addEventListener('mousemove', onSVGSelect);
}
function onSVGMouseUp() {
  svg.removeEventListener('mousemove', onSVGSelect, false);
}

function onH_Select(e) {
  const degrees = e.target.value
  SVGChange(e, degrees)

  const [red, green, blue] = atoc(degrees);
  red_input.value = red
  green_input.value = green
  blue_input.value = blue
}

function RGB_Change(e) {
  let [red, green, blue] = [+red_input.value, +green_input.value, +blue_input.value];
  SVGChange(e, ctoa(red, green, blue))
}

function addListener(obj, click_f, down_f, up_f) {
  obj.addEventListener('click', click_f);
  obj.addEventListener('mousedown', down_f);
  obj.addEventListener('mouseup', up_f);
}

/* Mouse events */
addListener(svg, onSVGSelect, onSVGMouseDown, onSVGMouseUp);
h_range.addEventListener('input', onH_Select)
s_range.addEventListener('input', (e) => {
  const [red, green, blue] = HSVtoRGB([h_range.value, s_range.value*100, v_range.value*100])
  console.log(red, green, blue)
  red_input.value = red
  green_input.value = green
  blue_input.value = blue
})
v_range.addEventListener('input', (e) => {
  const [red, green, blue] = HSVtoRGB([h_range.value, s_range.value*100, v_range.value*100])
  // console.log(red, green, blue)  
  red_input.value = red
  green_input.value = green
  blue_input.value = blue
})
w_range.addEventListener('input', (e) => {
  w_value = e.target.value
  w_input.value = w_value
})

red_input.addEventListener('input', RGB_Change)
green_input.addEventListener('input', RGB_Change)
blue_input.addEventListener('input', RGB_Change)
w_input.addEventListener('input', (e) => {
  w_range.value = e.target.value
})

/* Touch events */
window.addEventListener('touchstart', function onWindowTouchStart() {
  svg.removeEventListener('click', onSVGSelect, false);
  svg.removeEventListener('mousedown', onSVGMouseDown, false);
  svg.removeEventListener('mousemove', onSVGSelect, false);
  svg.removeEventListener('mouseup', onSVGMouseUp, false);
  
  svg.addEventListener('touchmove', function onSVGTouchMove(e) {
    const rect = e.target.getBoundingClientRect();
    const touch = e.targetTouches[0];
    
    onSVGSelect.call(svg, {
      offsetX: touch.pageX - rect.left,
      offsetY: touch.pageY - rect.top
    });
  });
  
  window.removeEventListener('touchstart', onWindowTouchStart)
});