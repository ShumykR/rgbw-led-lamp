const $ = document.querySelector.bind(document);

const [red_input, green_input, blue_input, w_input] = document.querySelectorAll('.rgbw_input');
const [h_range, s_range, v_range, w_range] = document.querySelectorAll('.hsvw_range');

const selector = $('.color-picker .selector');
const hex = $('.color-picker .hex');
const circle = $('svg');

const resolution = 1;


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
  // const colorPC = 255 / 60;
  const colorPC = resolution/60;
  if (a >= 300 || a <= 60) red = 1;
  if (a >= 60 && a <= 180) green = 1;
  if (a >= 180 && a <= 300) blue = 1;
  if (a > 0 && a < 60) {
    green = (a * colorPC);
  }
  if (a > 60 && a < 120) {
    red = ((120 - a) * colorPC);
  }
  if (a > 120 && a < 180) {
    blue = ((a - 120) * colorPC);
  }
  if (a > 180 && a < 240) {
    green = ((240 - a) * colorPC);
  }
  if (a > 240 && a < 300) {
    red = ((a - 240) * colorPC);
  }
  if (a > 300 && a < 360) {
    blue = ((360 - a) * colorPC);
  }
  // return [red, green, blue]
  return [red, green, blue].map((color) => {
    return ((color < 10 ? (color*resolution).toFixed(4) : color*resolution));
  });
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
  const rgb_in_255 = rgb.map(element => {
    return Math.round((element/resolution*255));
  });
  const [red, green, blue] = rgb_in_255;
  const hexString = '#' + paddedHex(red) + paddedHex(green) + paddedHex(blue);
  return hexString.toUpperCase();
}

function RGBtoHSV(rgb) {
  let h, s, v;
  const [r, g, b] = rgb;
  const [min, max] = [Math.min(...rgb), Math.max(...rgb)];

  if (max==r && g>=b) h = 60 * ((g-b)/(max-min)+0);
  else if (max==r && g<b) h = 60 * ((g-b)/(max-min)+360);
  else if (max==g) h = 60 * ((b-r)/(max-min)+120);
  else if (max==b) h = 60 * ((r-g)/(max-min)+240);

  if (max==0) s = 0; else s = 1-(min/max);
  v = max;

  return [s, v];
}

function HSVtoRGB(hsv) {
  let r, g, b;
  const h = hsv[0] / resolution * 359;
  const [s, v] = hsv.slice(-2).map(value => value / resolution * 100);
  let a, Hi, Vmin, Vinc, Vdec;

  Hi = Math.floor(h/60); 
  Vmin = ((100 - s) * v)/100;
  a = (v - Vmin) * (h % 60)/60;
  Vinc = Vmin + a; Vdec = v - a;

  switch (Hi) {

    case 0: r = v; g = Vinc; b = Vmin; break;

    case 1: r = Vdec; g = v; b = Vmin; break;

    case 2: r = Vmin; g = v; b = Vinc; break;

    case 3: r = Vmin; g = Vdec; b = v; break;
    
    case 4: r = Vinc; g = Vmin; b = v; break;

    case 5: r = v; g = Vmin; b = Vdec; break;

    default: break;
  }
  // return [r/100, g/100, b/100]
    return [r, g, b].map((color) => {
      return (color / 100 * resolution).toFixed(4);
  });}

function circleChange (e, angleInDegrees) {
  // console.log(e.offsetX, e.offsetY);
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

  // const color = RGBtoHEX(atoc(degree));
  const color = RGBtoHEX([+red_input.value, +green_input.value, +blue_input.value]);
  
  const selectX = Math.cos(angle) * 200;
  const selectY = Math.sin(angle) * 200;
  
  // circle.style.filter = `brightness(${v_range.value})`;

  selector.setAttribute('cx', 200 + selectX);
  selector.setAttribute('cy', 200 + selectY);
  selector.setAttribute('fill', color);

  hex.setAttribute('fill', color);
  // hex.setAttribute('stroke', color);
  hex.textContent = color;
  console.log(degree)
  return degree;
}

function oncircleSelect(e) {
  const angleInDegrees = circleChange(e, NaN)
  //мій код
  h_range.value = angleInDegrees/359 * resolution
  
  const [red, green, blue] = atoc(angleInDegrees);
  red_input.value = red
  green_input.value = green
  blue_input.value = blue
  // w_input.setAttribute('value', red)
  //мій код
}

function onH_Select(e) {
  const degrees = Math.round(e.target.value * 359);
  console.log(degrees)
  circleChange(e, degrees)

  const [red, green, blue] = HSVtoRGB([h_range.value, s_range.value, v_range.value]);
  red_input.value = red
  green_input.value = green
  blue_input.value = blue
}

function RGB_Change(e) {
  let [red, green, blue] = [+red_input.value, +green_input.value, +blue_input.value];
  const angleInDegrees = circleChange(e, ctoa(red, green, blue));
  [s_range.value, v_range.value] = RGBtoHSV([red, green, blue]);
  h_range.value = angleInDegrees/359 * resolution;
}

addListener(circle, oncircleSelect, oncircleMouseDown, oncircleMouseUp);
h_range.addEventListener('input', onH_Select)
s_range.addEventListener('input', (e) => {
  const [red, green, blue] = HSVtoRGB([h_range.value, s_range.value, v_range.value])
  // console.log(red, green, blue)
  red_input.value = red
  green_input.value = green
  blue_input.value = blue
})
v_range.addEventListener('input', (e) => {
  const [red, green, blue] = HSVtoRGB([h_range.value, s_range.value, v_range.value])
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


/* Mouse events */
function oncircleMouseDown() {
  circle.addEventListener('mousemove', oncircleSelect);
}
function oncircleMouseUp() {
  circle.removeEventListener('mousemove', oncircleSelect, false);
}

function addListener(obj, click_f, down_f, up_f) {
  obj.addEventListener('click', click_f);
  obj.addEventListener('mousedown', down_f);
  obj.addEventListener('mouseup', up_f);
}

/* Touch events */
window.addEventListener('touchstart', function onWindowTouchStart() {
  circle.removeEventListener('click', oncircleSelect, false);
  circle.removeEventListener('mousedown', oncircleMouseDown, false);
  circle.removeEventListener('mousemove', oncircleSelect, false);
  circle.removeEventListener('mouseup', oncircleMouseUp, false);
  
  circle.addEventListener('touchmove', function oncircleTouchMove(e) {
    const rect = e.target.getBoundingClientRect();
    const touch = e.targetTouches[0];
    
    oncircleSelect.call(circle, {
      offsetX: touch.pageX - rect.left,
      offsetY: touch.pageY - rect.top
    });
  });
  
  window.removeEventListener('touchstart', onWindowTouchStart)
});