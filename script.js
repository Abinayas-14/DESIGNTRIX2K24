 

   (function($){
  var canvas = $('#bg').children('canvas'),
    background = canvas[0],
    foreground1 = canvas[1],
    foreground2 = canvas[2],
    config = {
      circle: {
        amount: 18,
        layer: 3,
        color: [157, 97, 207],
        alpha: 0.3
      },
      line: {
        amount: 12,
        layer: 3,
        color: [255, 255, 255],
        alpha: 0.3
      },
      speed: 0.5,
      angle: 20
    };

  if (background.getContext){
    var bctx = background.getContext('2d'),
      fctx1 = foreground1.getContext('2d'),
      fctx2 = foreground2.getContext('2d'),
      M = window.Math, // Cached Math
      degree = config.angle/360*M.PI*2,
      circles = [],
      lines = [],
      wWidth, wHeight, timer;
    
    requestAnimationFrame = window.requestAnimationFrame || 
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(callback, element) { setTimeout(callback, 1000 / 60); };

    cancelAnimationFrame = window.cancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      clearTimeout;

    var setCanvasHeight = function(){
      wWidth = $(window).width();
      wHeight = $(window).height(),

      canvas.each(function(){
        this.width = wWidth;
        this.height = wHeight;
      });
    };

    var drawCircle = function(x, y, radius, color, alpha){
      var gradient = fctx1.createRadialGradient(x, y, radius, x, y, 0);
      gradient.addColorStop(0, 'rgba('+color[0]+','+color[1]+','+color[2]+','+alpha+')');
      gradient.addColorStop(1, 'rgba('+color[0]+','+color[1]+','+color[2]+','+(alpha-0.1)+')');

      fctx1.beginPath();
      fctx1.arc(x, y, radius, 0, M.PI*2, true);
      fctx1.fillStyle = gradient;
      fctx1.fill();
    };

    var drawLine = function(x, y, width, color, alpha){
      var endX = x+M.sin(degree)*width,
        endY = y-M.cos(degree)*width,
        gradient = fctx2.createLinearGradient(x, y, endX, endY);
      gradient.addColorStop(0, 'rgba('+color[0]+','+color[1]+','+color[2]+','+alpha+')');
      gradient.addColorStop(1, 'rgba('+color[0]+','+color[1]+','+color[2]+','+(alpha-0.1)+')');

      fctx2.beginPath();
      fctx2.moveTo(x, y);
      fctx2.lineTo(endX, endY);
      fctx2.lineWidth = 3;
      fctx2.lineCap = 'round';
      fctx2.strokeStyle = gradient;
      fctx2.stroke();
    };

    var drawBack = function(){
      bctx.clearRect(0, 0, wWidth, wHeight);

      var gradient = [];
      
      gradient[0] = bctx.createRadialGradient(wWidth*0.3, wHeight*0.1, 0, wWidth*0.3, wHeight*0.1, wWidth*0.9);
      gradient[0].addColorStop(0, 'rgb(44,12,36)');//
    

      bctx.translate(wWidth, 0);
      bctx.scale(-1,1);
      bctx.beginPath();
      bctx.fillStyle = gradient[0];
      bctx.fillRect(0, 0, wWidth, wHeight);

   
    };

    var animate = function(){
      var sin = M.sin(degree),
        cos = M.cos(degree);

      if (config.circle.amount > 0 && config.circle.layer > 0){
        fctx1.clearRect(0, 0, wWidth, wHeight);
        for (var i=0, len = circles.length; i<len; i++){
          var item = circles[i],
            x = item.x,
            y = item.y,
            radius = item.radius,
            speed = item.speed;

          if (x > wWidth + radius){
            x = -radius;
          } else if (x < -radius){
            x = wWidth + radius
          } else {
            x += sin*speed;
          }

          if (y > wHeight + radius){
            y = -radius;
          } else if (y < -radius){
            y = wHeight + radius;
          } else {
            y -= cos*speed;
          }

          item.x = x;
          item.y = y;
          drawCircle(x, y, radius, item.color, item.alpha);
        }
      }

      if (config.line.amount > 0 && config.line.layer > 0){
        fctx2.clearRect(0, 0, wWidth, wHeight);
        for (var j=0, len = lines.length; j<len; j++){
          var item = lines[j],
            x = item.x,
            y = item.y,
            width = item.width,
            speed = item.speed;

          if (x > wWidth + width * sin){
            x = -width * sin;
          } else if (x < -width * sin){
            x = wWidth + width * sin;
          } else {
            x += sin*speed;
          }

          if (y > wHeight + width * cos){
            y = -width * cos;
          } else if (y < -width * cos){
            y = wHeight + width * cos;
          } else {
            y -= cos*speed;
          }
          
          item.x = x;
          item.y = y;
          drawLine(x, y, width, item.color, item.alpha);
        }
      }

      timer = requestAnimationFrame(animate);
    };

    var createItem = function(){
      circles = [];
      lines = [];

      if (config.circle.amount > 0 && config.circle.layer > 0){
        for (var i=0; i<config.circle.amount/config.circle.layer; i++){
          for (var j=0; j<config.circle.layer; j++){
            circles.push({
              x: M.random() * wWidth,
              y: M.random() * wHeight,
              radius: M.random()*(20+j*5)+(20+j*5),
              color: config.circle.color,
              alpha: M.random()*0.2+(config.circle.alpha-j*0.1),
              speed: config.speed*(1+j*0.5)
            });
          }
        }
      }

      if (config.line.amount > 0 && config.line.layer > 0){
        for (var m=0; m<config.line.amount/config.line.layer; m++){
          for (var n=0; n<config.line.layer; n++){
            lines.push({
              x: M.random() * wWidth,
              y: M.random() * wHeight,
              width: M.random()*(20+n*5)+(20+n*5),
              color: config.line.color,
              alpha: M.random()*0.2+(config.line.alpha-n*0.1),
              speed: config.speed*(1+n*0.5)
            });
          }
        }
      }

      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(animate);
      drawBack();
    };

    $(document).ready(function(){
      setCanvasHeight();
      createItem();
    });
    $(window).resize(function(){
      setCanvasHeight();
      createItem();
    });
  }
})(jQuery);
  


var words = ['   In the realm of the department','Computer Science and Design presents', 'National Level Technical Symposium'];
var part;
var i = 0;
var offset = 0;
var len = words.length;
var forwards = true;
var skip_count = 0;
var skip_delay = 15;
var speed = 70;

var wordflick = function () {
  setInterval(function () {
    if (forwards) {
      if (offset >= words[i].length) {
        ++skip_count;
        if (skip_count == skip_delay) {
          forwards = false;
          skip_count = 0;
        }
      }
    } else {
      if (offset == 0) {
        forwards = true;
        i++;
        offset = 0;
        if (i >= len) {
          i = 0;
        }
      }
    }
    part = words[i].substr(0, offset);
    if (skip_count == 0) {
      if (forwards) {
        offset++;
      } else {
        offset--;
      }
    }
    document.querySelector('.word').textContent = part;
  }, speed);
};

document.addEventListener("DOMContentLoaded", function () {
  wordflick();
});
document.addEventListener('DOMContentLoaded', () => {

    // Create a custom date and time (Year, Month, Day, Hour, Minute, Second)
    var customDate = new Date(2024, 1, 5, 9, 0, 0); // September is month 8 (0-based index), 30th at 12:00:00 PM
  
    // Convert the custom date to a Unix timestamp in seconds
    var customTimestamp = customDate.getTime() / 1000;
  
    // Set up FlipDown with the custom timestamp
    var flipdown = new FlipDown(customTimestamp)
  
      // Start the countdown
      .start()
  
      // Do something when the countdown ends
      .ifEnded(() => {
        console.log('The countdown has ended!');
      });
  
    // Display the FlipDown version
    var ver = document.getElementById('ver');
    ver.innerHTML = flipdown.version;
  });
  
  
  
  "use strict";
  
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  
  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
  
  var FlipDown = function () {
    function FlipDown(uts) {
      var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "flipdown";
      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  
      _classCallCheck(this, FlipDown);
  
      if (typeof uts !== "number") {
        throw new Error("FlipDown: Constructor expected unix timestamp, got ".concat(_typeof(uts), " instead."));
      }
  
      if (_typeof(el) === "object") {
        opt = el;
        el = "flipdown";
      }
  
      this.version = "0.3.2";
      this.initialised = false;
      this.now = this._getTime();
      this.epoch = uts;
      this.countdownEnded = false;
      this.hasEndedCallback = null;
      this.element = document.getElementById(el);
      this.rotors = [];
      this.rotorLeafFront = [];
      this.rotorLeafRear = [];
      this.rotorTops = [];
      this.rotorBottoms = [];
      this.countdown = null;
      this.daysRemaining = 0;
      this.clockValues = {};
      this.clockStrings = {};
      this.clockValuesAsString = [];
      this.prevClockValuesAsString = [];
      this.opts = this._parseOptions(opt);
  
      this._setOptions();
  
      console.log("FlipDown ".concat(this.version, " (Theme: ").concat(this.opts.theme, ")"));
    }
  
    _createClass(FlipDown, [{
      key: "start",
      value: function start() {
        if (!this.initialised) this._init();
        this.countdown = setInterval(this._tick.bind(this), 1000);
        return this;
      }
    }, {
      key: "ifEnded",
      value: function ifEnded(cb) {
        this.hasEndedCallback = function () {
          cb();
          this.hasEndedCallback = null;
        };
  
        return this;
      }
    }, {
      key: "_getTime",
      value: function _getTime() {
        return new Date().getTime() / 1000;
      }
    }, {
      key: "_hasCountdownEnded",
      value: function _hasCountdownEnded() {
        if (this.epoch - this.now < 0) {
          this.countdownEnded = true;
  
          if (this.hasEndedCallback != null) {
            this.hasEndedCallback();
            this.hasEndedCallback = null;
          }
  
          return true;
        } else {
          this.countdownEnded = false;
          return false;
        }
      }
    }, {
      key: "_parseOptions",
      value: function _parseOptions(opt) {
        var headings = ["Days", "Hours", "Minutes", "Seconds"];
  
        if (opt.headings && opt.headings.length === 4) {
          headings = opt.headings;
        }
  
        return {
          theme: opt.hasOwnProperty("theme") ? opt.theme : "dark",
          headings: headings
        };
      }
    }, {
      key: "_setOptions",
      value: function _setOptions() {
        this.element.classList.add("flipdown__theme-".concat(this.opts.theme));
      }
    }, {
      key: "_init",
      value: function _init() {
        this.initialised = true;
  
        if (this._hasCountdownEnded()) {
          this.daysremaining = 0;
        } else {
          this.daysremaining = Math.floor((this.epoch - this.now) / 86400).toString().length;
        }
  
        var dayRotorCount = this.daysremaining <= 2 ? 2 : this.daysremaining;
  
        for (var i = 0; i < dayRotorCount + 6; i++) {
          this.rotors.push(this._createRotor(0));
        }
  
        var dayRotors = [];
  
        for (var i = 0; i < dayRotorCount; i++) {
          dayRotors.push(this.rotors[i]);
        }
  
        this.element.appendChild(this._createRotorGroup(dayRotors, 0));
        var count = dayRotorCount;
  
        for (var i = 0; i < 3; i++) {
          var otherRotors = [];
  
          for (var j = 0; j < 2; j++) {
            otherRotors.push(this.rotors[count]);
            count++;
          }
  
          this.element.appendChild(this._createRotorGroup(otherRotors, i + 1));
        }
  
        this.rotorLeafFront = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-leaf-front"));
        this.rotorLeafRear = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-leaf-rear"));
        this.rotorTop = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-top"));
        this.rotorBottom = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-bottom"));
  
        this._tick();
  
        this._updateClockValues(true);
  
        return this;
      }
    }, {
      key: "_createRotorGroup",
      value: function _createRotorGroup(rotors, rotorIndex) {
        var rotorGroup = document.createElement("div");
        rotorGroup.className = "rotor-group";
        var dayRotorGroupHeading = document.createElement("div");
        dayRotorGroupHeading.className = "rotor-group-heading";
        dayRotorGroupHeading.setAttribute("data-before", this.opts.headings[rotorIndex]);
        rotorGroup.appendChild(dayRotorGroupHeading);
        appendChildren(rotorGroup, rotors);
        return rotorGroup;
      }
    }, {
      key: "_createRotor",
      value: function _createRotor() {
        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var rotor = document.createElement("div");
        var rotorLeaf = document.createElement("div");
        var rotorLeafRear = document.createElement("figure");
        var rotorLeafFront = document.createElement("figure");
        var rotorTop = document.createElement("div");
        var rotorBottom = document.createElement("div");
        rotor.className = "rotor";
        rotorLeaf.className = "rotor-leaf";
        rotorLeafRear.className = "rotor-leaf-rear";
        rotorLeafFront.className = "rotor-leaf-front";
        rotorTop.className = "rotor-top";
        rotorBottom.className = "rotor-bottom";
        rotorLeafRear.textContent = v;
        rotorTop.textContent = v;
        rotorBottom.textContent = v;
        appendChildren(rotor, [rotorLeaf, rotorTop, rotorBottom]);
        appendChildren(rotorLeaf, [rotorLeafRear, rotorLeafFront]);
        return rotor;
      }
    }, {
      key: "_tick",
      value: function _tick() {
        this.now = this._getTime();
        var diff = this.epoch - this.now <= 0 ? 0 : this.epoch - this.now;
        this.clockValues.d = Math.floor(diff / 86400);
        diff -= this.clockValues.d * 86400;
        this.clockValues.h = Math.floor(diff / 3600);
        diff -= this.clockValues.h * 3600;
        this.clockValues.m = Math.floor(diff / 60);
        diff -= this.clockValues.m * 60;
        this.clockValues.s = Math.floor(diff);
  
        this._updateClockValues();
  
        this._hasCountdownEnded();
      }
    }, {
      key: "_updateClockValues",
      value: function _updateClockValues() {
        var _this = this;
  
        var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        this.clockStrings.d = pad(this.clockValues.d, 2);
        this.clockStrings.h = pad(this.clockValues.h, 2);
        this.clockStrings.m = pad(this.clockValues.m, 2);
        this.clockStrings.s = pad(this.clockValues.s, 2);
        this.clockValuesAsString = (this.clockStrings.d + this.clockStrings.h + this.clockStrings.m + this.clockStrings.s).split("");
        this.rotorLeafFront.forEach(function (el, i) {
          el.textContent = _this.prevClockValuesAsString[i];
        });
        this.rotorBottom.forEach(function (el, i) {
          el.textContent = _this.prevClockValuesAsString[i];
        });
  
        function rotorTopFlip() {
          var _this2 = this;
  
          this.rotorTop.forEach(function (el, i) {
            if (el.textContent != _this2.clockValuesAsString[i]) {
              el.textContent = _this2.clockValuesAsString[i];
            }
          });
        }
  
        function rotorLeafRearFlip() {
          var _this3 = this;
  
          this.rotorLeafRear.forEach(function (el, i) {
            if (el.textContent != _this3.clockValuesAsString[i]) {
              el.textContent = _this3.clockValuesAsString[i];
              el.parentElement.classList.add("flipped");
              var flip = setInterval(function () {
                el.parentElement.classList.remove("flipped");
                clearInterval(flip);
              }.bind(_this3), 500);
            }
          });
        }
  
        if (!init) {
          setTimeout(rotorTopFlip.bind(this), 500);
          setTimeout(rotorLeafRearFlip.bind(this), 500);
        } else {
          rotorTopFlip.call(this);
          rotorLeafRearFlip.call(this);
        }
  
        this.prevClockValuesAsString = this.clockValuesAsString;
      }
    }]);
  
    return FlipDown;
  }();
  
  function pad(n, len) {
    n = n.toString();
    return n.length < len ? pad("0" + n, len) : n;
  }
  
  function appendChildren(parent, children) {
    children.forEach(function (el) {
      parent.appendChild(el);
    });
  }
  function toggleMenu(menu){
    menu.classList.toggle('open');
  }


    $('button').on('click', function(){  
  function random(max){
      return Math.random() * (max - 0) + 0;
  }

  var c = document.createDocumentFragment();
  for (var i=0; i<100; i++) {
    var styles = 'transform: translate3d(' + (random(500) - 250) + 'px, ' + (random(200) - 150) + 'px, 0) rotate(' + random(360) + 'deg);\
                  background: hsla('+random(360)+',100%,50%,1);\
                  animation: bang 700ms ease-out forwards;\
                  opacity: 0';
      
    var e = document.createElement("i");
    e.style.cssText = styles.toString();
    c.appendChild(e);
}
// document.body.appendChild(c);
  $(this).append(c);
})
 