// forked from yuqq.js's "Pendulum Wave" http://jsdo.it/yuqq.js/qjtB

var DOT_SIZE = 20;
// ‥‥‥‥‥‥‥‥‥‥‥‥‥□□□
// ‥‥‥‥‥‥〓〓〓〓〓‥‥□□□
// ‥‥‥‥‥〓〓〓〓〓〓〓〓〓□□
// ‥‥‥‥‥■■■□□■□‥■■■
// ‥‥‥‥■□■□□□■□□■■■
// ‥‥‥‥■□■■□□□■□□□■
// ‥‥‥‥■■□□□□■■■■■‥
// ‥‥‥‥‥‥□□□□□□□■‥‥
// ‥‥■■■■■〓■■■〓■‥‥‥
// ‥■■■■■■■〓■■■〓‥‥■
// □□■■■■■■〓〓〓〓〓‥‥■
// □□□‥〓〓■〓〓□〓〓□〓■■
// ‥□‥■〓〓〓〓〓〓〓〓〓〓■■
// ‥‥■■■〓〓〓〓〓〓〓〓〓■■
// ‥■■■〓〓〓〓〓〓〓‥‥‥‥‥
// ‥■‥‥〓〓〓〓‥‥‥‥‥‥‥‥
var dataSet = [
    "BK","BK","BK","BK","BK","BK","BK","BK","BK","BK","BK","BK","BK","BG","BG","BG",
    "BK","BK","BK","BK","BK","BK","RD","RD","RD","RD","RD","BK","BK","BG","BG","BG",
    "BK","BK","BK","BK","BK","RD","RD","RD","RD","RD","RD","RD","RD","RD","BG","BG",
    "BK","BK","BK","BK","BK","BR","BR","BR","BG","BG","BR","BG","BK","RD","RD","RD",
    "BK","BK","BK","BK","BR","BG","BR","BG","BG","BG","BR","BG","BG","RD","RD","RD",
    "BK","BK","BK","BK","BR","BG","BR","BR","BG","BG","BG","BR","BG","BG","BG","RD",
    "BK","BK","BK","BK","BR","BR","BG","BG","BG","BG","BR","BR","BR","BR","RD","BK",
    "BK","BK","BK","BK","BK","BK","BG","BG","BG","BG","BG","BG","BG","RD","BK","BK",
    "BK","BK","RD","RD","RD","RD","RD","BL","RD","RD","RD","BL","RD","BK","BK","BK",
    "BK","RD","RD","RD","RD","RD","RD","RD","BL","RD","RD","RD","BL","BK","BK","BR",
    "BG","BG","RD","RD","RD","RD","RD","RD","BL","BL","BL","BL","BL","BK","BK","BR",
    "BG","BG","BG","BK","BL","BL","RD","BL","BL","YL","BL","BL","YL","BL","BR","BR",
    "BK","BG","BK","BR","BL","BL","BL","BL","BL","BL","BL","BL","BL","BL","BR","BR",
    "BK","BK","BR","BR","BR","BL","BL","BL","BL","BL","BL","BL","BL","BL","BR","BR",
    "BK","BR","BR","BR","BL","BL","BL","BL","BL","BL","BL","BK","BK","BK","BK","BK",
    "BK","BR","BK","BK","BL","BL","BL","BL","BK","BK","BK","BK","BK","BK","BK","BK"
];

function getRgbColor(colorType)
{
    var colorHash = {
        "BK":"#000000", // black
        "WH":"#FFFFFF", // white
        "BG":"#FFCCCC", // beige
        "BR":"#800000", // brown
        "RD":"#FF0000", // red
        "YL":"#FFFF00", // yellow
        "GN":"#00FF00", // green
        "WT":"#00FFFF", // water
        "BL":"#0000FF", // blue
        "PR":"#800080"  // purple
    };
    return colorHash[colorType];
}

function getGradientColor( rgb, pattern )
{
    var result = "";
    rgb = rgb.replace("#", "");
    var r = parseInt( "0x" + rgb.substr( 0, 2 ), 16 );
    var g = parseInt( "0x" + rgb.substr( 2, 2 ), 16 );
    var b = parseInt( "0x" + rgb.substr( 4, 2 ), 16 );
    var a = 0;
    
    switch ( pattern )
    {
        case 1:
            r = 255;
            g = 255;
            b = 255;
            a = 1;
            break;
        case 2:
            r += 85;
            g += 85;
            b += 85;
            a = 1;
            break;
        case 3:
            a = 1;
            break;
        case 4:
            a = 0;
            break;
    }
    result = "rgba( " + r + ", " + g + ", " + b + ", " + a + ")";
    return result;
}

var PendulumNumber = 256;
var MaxStringLength = 300;
var MinStringLength = 200;
var StartAngle = 0.2;
var PendulumRadius = 5;
var g = 9.8127;
var dt = 200;
var k = 0;

setTimeout(function() {

    var cvs = {
        'elem': undefined,
        'width': 0,
        'height': 0,
        'ctx': undefined,
        'left': 0,
        'top': 0,
        'pos_x': 0,
        'pos_y': 0
    };

    cvs.elem = document.getElementById('canvas');
    if (!cvs.elem || !cvs.elem.getContext) {
        return alert('require canvas support');
    };
    (function() {
        var b = document.body;
        var d = document.documentElement;
        cvs.width = Math.max(b.clientWidth, b.scrollWidth, d.scrollWidth, d.clientWidth);
        cvs.height = Math.max(b.clientHeight, b.scrollHeight, d.scrollHeight, d.clientHeight);
    })();
    cvs.elem.height = cvs.height;
    cvs.elem.width = cvs.width;
    cvs.ctx = cvs.elem.getContext('2d');
    cvs.left = cvs.elem.getBoundingClientRect ? cvs.elem.getBoundingClientRect().left : 0;
    cvs.top = cvs.elem.getBoundingClientRect ? cvs.elem.getBoundingClientRect().top : 0;

    setTimeout(function() {
        drawStaticObject();
        requestAnimationFrame(render);
    }, 0);

    var theta = [];
    var omega = [];
    var r = [];
    var colors = [];

    function hsv2rgb(hue, sat, val) {
        var red, grn, blu, i, f, p, q, t;
        hue %= 360;
        if (val == 0) {
            return 'rgb(0,0,0)';
        }
        sat /= 100;
        val /= 100;
        hue /= 60;
        i = Math.floor(hue);
        f = hue - i;
        p = val * (1 - sat);
        q = val * (1 - (sat * f));
        t = val * (1 - (sat * (1 - f)));
        if (i == 0) {
            red = val;
            grn = t;
            blu = p;
        }
        else if (i == 1) {
            red = q;
            grn = val;
            blu = p;
        }
        else if (i == 2) {
            red = p;
            grn = val;
            blu = t;
        }
        else if (i == 3) {
            red = p;
            grn = q;
            blu = val;
        }
        else if (i == 4) {
            red = t;
            grn = p;
            blu = val;
        }
        else if (i == 5) {
            red = val;
            grn = p;
            blu = q;
        }
        red = Math.floor(red * 255);
        grn = Math.floor(grn * 255);
        blu = Math.floor(blu * 255);
        return 'rgb(' + [red, grn, blu].join(',') + ')';
    }

    (function() {
        var color;
        var delta = (MaxStringLength - MinStringLength) / PendulumNumber;
        for (var i = 0; i < PendulumNumber; i++) {
            theta[i] = (-8 + i % 16) * 0.05;
            omega[i] = 0;
            r[i] = MinStringLength + i * delta;
            color = dataSet[i];
            colors[i] = getRgbColor( color );
        }
    })();

    function clearCanvas() {
        cvs.ctx.clearRect(0, 0, cvs.width, cvs.height);
    }

    function drawPendulum() {
        var pos_x = cvs.width / 2;
        var pos_y = -150;

        for (var i = 0; i < PendulumNumber; i++) {
            omega[i] -= (g / r[i] * Math.sin(theta[i]) + k * omega[i]) * dt / 1000;
            theta[i] += omega[i];
            var x = r[i] * Math.sin(theta[i]);
            var y = r[i] * Math.cos(theta[i]) * 1.5;
            if ( dataSet[i] != "BK" ) {
                cvs.ctx.beginPath();
                cvs.ctx.moveTo(pos_x, pos_y);
                cvs.ctx.lineWidth = 0.1;
                cvs.ctx.lineTo(pos_x + x, pos_y + y);
                cvs.ctx.strokeStyle = colors[i];
                cvs.ctx.stroke();
                cvs.ctx.closePath();
                cvs.ctx.beginPath();
/*
                cvs.ctx.arc(pos_x + x, pos_y + y, PendulumRadius, 0, 2 * Math.PI, false);
                cvs.ctx.fillStyle = colors[i];
                cvs.ctx.fill();
*/
                var radius = (DOT_SIZE / 2 ) - 2;
                var gradient = cvs.ctx.createRadialGradient(pos_x + x, pos_y + y, 0, pos_x + x, pos_y + y, radius);
                gradient.addColorStop(0,    getGradientColor(colors[i], 1));
                gradient.addColorStop(0.2,  getGradientColor(colors[i], 2));
                gradient.addColorStop(0.95, getGradientColor(colors[i], 3));
                gradient.addColorStop(1,    getGradientColor(colors[i], 4));
                cvs.ctx.fillStyle = gradient;
                cvs.ctx.fillRect(pos_x + x - radius, pos_y + y - radius, pos_x + x + radius, pos_y + y + radius);
                cvs.ctx.closePath();
            }
        }

    }

    function drawStaticObject() {

    }

    function render() {
        clearCanvas();
        drawPendulum();
        requestAnimationFrame(render);
    }

}, 0);

(function(w, r) {
    w['r' + r] = w['r' + r] || w['webkitR' + r] || w['mozR' + r] || w['msR' + r] || w['oR' + r] ||
    function(c) {
        w.setTimeout(c, 1000 / 60);
    };
})(window, 'requestAnimationFrame');