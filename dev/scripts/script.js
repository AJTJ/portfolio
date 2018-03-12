'use strict';

console.log('js is linked up');


let instance = new TypeIt('#element', {
   speed: 50,
   breakLines: false,
   lifeLike: true
})
// .options({ speed: 100 })
.type('Hello, my name is Aaron Janke and I\'m a Web Developer')
.pause(4000)
.options({ speed: 200})
.delete()
.type('Thanks for dropping by. :)')
;

//EVERYTHING TO DO WITH SMOOTH SCROLL

/*!
 * jQuery Smooth Scroll - v2.2.0 - 2017-05-05
 * https://github.com/kswedberg/jquery-smooth-scroll
 * Copyright (c) 2017 Karl Swedberg
 * Licensed MIT
 */

(function (factory) {
   if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['jquery'], factory);
   } else if (typeof module === 'object' && module.exports) {
      // CommonJS
      factory(require('jquery'));
   } else {
      // Browser globals
      factory(jQuery);
   }
}(function ($) {

   var version = '2.2.0';
   var optionOverrides = {};
   var defaults = {
      exclude: [],
      excludeWithin: [],
      offset: 0,

      // one of 'top' or 'left'
      direction: 'top',

      // if set, bind click events through delegation
      //  supported since jQuery 1.4.2
      delegateSelector: null,

      // jQuery set of elements you wish to scroll (for $.smoothScroll).
      //  if null (default), $('html, body').firstScrollable() is used.
      scrollElement: null,

      // only use if you want to override default behavior
      scrollTarget: null,

      // automatically focus the target element after scrolling to it
      autoFocus: false,

      // fn(opts) function to be called before scrolling occurs.
      // `this` is the element(s) being scrolled
      beforeScroll: function () { },

      // fn(opts) function to be called after scrolling occurs.
      // `this` is the triggering element
      afterScroll: function () { },

      // easing name. jQuery comes with "swing" and "linear." For others, you'll need an easing plugin
      // from jQuery UI or elsewhere
      easing: 'swing',

      // speed can be a number or 'auto'
      // if 'auto', the speed will be calculated based on the formula:
      // (current scroll position - target scroll position) / autoCoeffic
      speed: 400,

      // coefficient for "auto" speed
      autoCoefficient: 2,

      // $.fn.smoothScroll only: whether to prevent the default click action
      preventDefault: true
   };

   var getScrollable = function (opts) {
      var scrollable = [];
      var scrolled = false;
      var dir = opts.dir && opts.dir === 'left' ? 'scrollLeft' : 'scrollTop';

      this.each(function () {
         var el = $(this);

         if (this === document || this === window) {
            return;
         }

         if (document.scrollingElement && (this === document.documentElement || this === document.body)) {
            scrollable.push(document.scrollingElement);

            return false;
         }

         if (el[dir]() > 0) {
            scrollable.push(this);
         } else {
            // if scroll(Top|Left) === 0, nudge the element 1px and see if it moves
            el[dir](1);
            scrolled = el[dir]() > 0;

            if (scrolled) {
               scrollable.push(this);
            }
            // then put it back, of course
            el[dir](0);
         }
      });

      if (!scrollable.length) {
         this.each(function () {
            // If no scrollable elements and <html> has scroll-behavior:smooth because
            // "When this property is specified on the root element, it applies to the viewport instead."
            // and "The scroll-behavior property of the … body element is *not* propagated to the viewport."
            // → https://drafts.csswg.org/cssom-view/#propdef-scroll-behavior
            if (this === document.documentElement && $(this).css('scrollBehavior') === 'smooth') {
               scrollable = [this];
            }

            // If still no scrollable elements, fall back to <body>,
            // if it's in the jQuery collection
            // (doing this because Safari sets scrollTop async,
            // so can't set it to 1 and immediately get the value.)
            if (!scrollable.length && this.nodeName === 'BODY') {
               scrollable = [this];
            }
         });
      }

      // Use the first scrollable element if we're calling firstScrollable()
      if (opts.el === 'first' && scrollable.length > 1) {
         scrollable = [scrollable[0]];
      }

      return scrollable;
   };

   var rRelative = /^([\-\+]=)(\d+)/;

   $.fn.extend({
      scrollable: function (dir) {
         var scrl = getScrollable.call(this, { dir: dir });

         return this.pushStack(scrl);
      },
      firstScrollable: function (dir) {
         var scrl = getScrollable.call(this, { el: 'first', dir: dir });

         return this.pushStack(scrl);
      },

      smoothScroll: function (options, extra) {
         options = options || {};

         if (options === 'options') {
            if (!extra) {
               return this.first().data('ssOpts');
            }

            return this.each(function () {
               var $this = $(this);
               var opts = $.extend($this.data('ssOpts') || {}, extra);

               $(this).data('ssOpts', opts);
            });
         }

         var opts = $.extend({}, $.fn.smoothScroll.defaults, options);

         var clickHandler = function (event) {
            var escapeSelector = function (str) {
               return str.replace(/(:|\.|\/)/g, '\\$1');
            };

            var link = this;
            var $link = $(this);
            var thisOpts = $.extend({}, opts, $link.data('ssOpts') || {});
            var exclude = opts.exclude;
            var excludeWithin = thisOpts.excludeWithin;
            var elCounter = 0;
            var ewlCounter = 0;
            var include = true;
            var clickOpts = {};
            var locationPath = $.smoothScroll.filterPath(location.pathname);
            var linkPath = $.smoothScroll.filterPath(link.pathname);
            var hostMatch = location.hostname === link.hostname || !link.hostname;
            var pathMatch = thisOpts.scrollTarget || (linkPath === locationPath);
            var thisHash = escapeSelector(link.hash);

            if (thisHash && !$(thisHash).length) {
               include = false;
            }

            if (!thisOpts.scrollTarget && (!hostMatch || !pathMatch || !thisHash)) {
               include = false;
            } else {
               while (include && elCounter < exclude.length) {
                  if ($link.is(escapeSelector(exclude[elCounter++]))) {
                     include = false;
                  }
               }

               while (include && ewlCounter < excludeWithin.length) {
                  if ($link.closest(excludeWithin[ewlCounter++]).length) {
                     include = false;
                  }
               }
            }

            if (include) {
               if (thisOpts.preventDefault) {
                  event.preventDefault();
               }

               $.extend(clickOpts, thisOpts, {
                  scrollTarget: thisOpts.scrollTarget || thisHash,
                  link: link
               });

               $.smoothScroll(clickOpts);
            }
         };

         if (options.delegateSelector !== null) {
            this
               .off('click.smoothscroll', options.delegateSelector)
               .on('click.smoothscroll', options.delegateSelector, clickHandler);
         } else {
            this
               .off('click.smoothscroll')
               .on('click.smoothscroll', clickHandler);
         }

         return this;
      }
   });

   var getExplicitOffset = function (val) {
      var explicit = { relative: '' };
      var parts = typeof val === 'string' && rRelative.exec(val);

      if (typeof val === 'number') {
         explicit.px = val;
      } else if (parts) {
         explicit.relative = parts[1];
         explicit.px = parseFloat(parts[2]) || 0;
      }

      return explicit;
   };

   var onAfterScroll = function (opts) {
      var $tgt = $(opts.scrollTarget);

      if (opts.autoFocus && $tgt.length) {
         $tgt[0].focus();

         if (!$tgt.is(document.activeElement)) {
            $tgt.prop({ tabIndex: -1 });
            $tgt[0].focus();
         }
      }

      opts.afterScroll.call(opts.link, opts);
   };

   $.smoothScroll = function (options, px) {
      if (options === 'options' && typeof px === 'object') {
         return $.extend(optionOverrides, px);
      }
      var opts, $scroller, speed, delta;
      var explicitOffset = getExplicitOffset(options);
      var scrollTargetOffset = {};
      var scrollerOffset = 0;
      var offPos = 'offset';
      var scrollDir = 'scrollTop';
      var aniProps = {};
      var aniOpts = {};

      if (explicitOffset.px) {
         opts = $.extend({ link: null }, $.fn.smoothScroll.defaults, optionOverrides);
      } else {
         opts = $.extend({ link: null }, $.fn.smoothScroll.defaults, options || {}, optionOverrides);

         if (opts.scrollElement) {
            offPos = 'position';

            if (opts.scrollElement.css('position') === 'static') {
               opts.scrollElement.css('position', 'relative');
            }
         }

         if (px) {
            explicitOffset = getExplicitOffset(px);
         }
      }

      scrollDir = opts.direction === 'left' ? 'scrollLeft' : scrollDir;

      if (opts.scrollElement) {
         $scroller = opts.scrollElement;

         if (!explicitOffset.px && !(/^(?:HTML|BODY)$/).test($scroller[0].nodeName)) {
            scrollerOffset = $scroller[scrollDir]();
         }
      } else {
         $scroller = $('html, body').firstScrollable(opts.direction);
      }

      // beforeScroll callback function must fire before calculating offset
      opts.beforeScroll.call($scroller, opts);

      scrollTargetOffset = explicitOffset.px ? explicitOffset : {
         relative: '',
         px: ($(opts.scrollTarget)[offPos]() && $(opts.scrollTarget)[offPos]()[opts.direction]) || 0
      };

      aniProps[scrollDir] = scrollTargetOffset.relative + (scrollTargetOffset.px + scrollerOffset + opts.offset);

      speed = opts.speed;

      // automatically calculate the speed of the scroll based on distance / coefficient
      if (speed === 'auto') {

         // $scroller[scrollDir]() is position before scroll, aniProps[scrollDir] is position after
         // When delta is greater, speed will be greater.
         delta = Math.abs(aniProps[scrollDir] - $scroller[scrollDir]());

         // Divide the delta by the coefficient
         speed = delta / opts.autoCoefficient;
      }

      aniOpts = {
         duration: speed,
         easing: opts.easing,
         complete: function () {
            onAfterScroll(opts);
         }
      };

      if (opts.step) {
         aniOpts.step = opts.step;
      }

      if ($scroller.length) {
         $scroller.stop().animate(aniProps, aniOpts);
      } else {
         onAfterScroll(opts);
      }
   };

   $.smoothScroll.version = version;
   $.smoothScroll.filterPath = function (string) {
      string = string || '';

      return string
         .replace(/^\//, '')
         .replace(/(?:index|default).[a-zA-Z]{3,4}$/, '')
         .replace(/\/$/, '');
   };

   // default options
   $.fn.smoothScroll.defaults = defaults;

}));

$('a').smoothScroll({
   speed: 300,
   easing: 'swing',
   // direction: 'bottom',
});





//EVERYTHING FOR RIPPABLE CLOTH

// window.requestAnimFrame =
//    window.requestAnimationFrame ||
//    window.webkitRequestAnimationFrame ||
//    window.mozRequestAnimationFrame ||
//    window.oRequestAnimationFrame ||
//    window.msRequestAnimationFrame ||
//    function (callback) {
//       window.setTimeout(callback, 1e3 / 60)
//    }

// let accuracy = 5
// let gravity = 400
// let clothY = 28
// let clothX = 54
// let spacing = 8
// let tearDist = 60
// let friction = 0.99
// let bounce = 0.5

// let canvas = document.getElementById('canvas')
// let ctx = canvas.getContext('2d')

// canvas.width = window.innerWidth
// canvas.height = window.innerHeight

// ctx.strokeStyle = '#555'

// let mouse = {
//    cut: 8,
//    influence: 26,
//    down: false,
//    button: 1,
//    x: 0,
//    y: 0,
//    px: 0,
//    py: 0
// }

// class Point {
//    constructor(x, y) {
//       this.x = x
//       this.y = y
//       this.px = x
//       this.py = y
//       this.vx = 0
//       this.vy = 0
//       this.pinX = null
//       this.pinY = null

//       this.constraints = []
//    }

//    update(delta) {
//       if (this.pinX && this.pinY) return this

//       if (mouse.down) {
//          let dx = this.x - mouse.x
//          let dy = this.y - mouse.y
//          let dist = Math.sqrt(dx * dx + dy * dy)

//          if (mouse.button === 1 && dist < mouse.influence) {
//             this.px = this.x - (mouse.x - mouse.px)
//             this.py = this.y - (mouse.y - mouse.py)
//          } else if (dist < mouse.cut) {
//             this.constraints = []
//          }
//       }

//       this.addForce(0, gravity)

//       let nx = this.x + (this.x - this.px) * friction + this.vx * delta
//       let ny = this.y + (this.y - this.py) * friction + this.vy * delta

//       this.px = this.x
//       this.py = this.y

//       this.x = nx
//       this.y = ny

//       this.vy = this.vx = 0

//       if (this.x >= canvas.width) {
//          this.px = canvas.width + (canvas.width - this.px) * bounce
//          this.x = canvas.width
//       } else if (this.x <= 0) {
//          this.px *= -1 * bounce
//          this.x = 0
//       }

//       if (this.y >= canvas.height) {
//          this.py = canvas.height + (canvas.height - this.py) * bounce
//          this.y = canvas.height
//       } else if (this.y <= 0) {
//          this.py *= -1 * bounce
//          this.y = 0
//       }

//       return this
//    }

//    draw() {
//       let i = this.constraints.length
//       while (i--) this.constraints[i].draw()
//    }

//    resolve() {
//       if (this.pinX && this.pinY) {
//          this.x = this.pinX
//          this.y = this.pinY
//          return
//       }

//       this.constraints.forEach((constraint) => constraint.resolve())
//    }

//    attach(point) {
//       this.constraints.push(new Constraint(this, point))
//    }

//    free(constraint) {
//       this.constraints.splice(this.constraints.indexOf(constraint), 1)
//    }

//    addForce(x, y) {
//       this.vx += x
//       this.vy += y
//    }

//    pin(pinx, piny) {
//       this.pinX = pinx
//       this.pinY = piny
//    }
// }

// class Constraint {
//    constructor(p1, p2) {
//       this.p1 = p1
//       this.p2 = p2
//       this.length = spacing
//    }

//    resolve() {
//       let dx = this.p1.x - this.p2.x
//       let dy = this.p1.y - this.p2.y
//       let dist = Math.sqrt(dx * dx + dy * dy)

//       if (dist < this.length) return

//       let diff = (this.length - dist) / dist

//       if (dist > tearDist) this.p1.free(this)

//       let mul = diff * 0.5 * (1 - this.length / dist)

//       let px = dx * mul
//       let py = dy * mul

//       !this.p1.pinX && (this.p1.x += px)
//       !this.p1.pinY && (this.p1.y += py)
//       !this.p2.pinX && (this.p2.x -= px)
//       !this.p2.pinY && (this.p2.y -= py)

//       return this
//    }

//    draw() {
//       ctx.moveTo(this.p1.x, this.p1.y)
//       ctx.lineTo(this.p2.x, this.p2.y)
//    }
// }

// class Cloth {
//    constructor() {
//       this.points = []

//       let startX = canvas.width / 2 - clothX * spacing / 2

//       for (let y = 0; y <= clothY; y++) {
//          for (let x = 0; x <= clothX; x++) {
//             let point = new Point(startX + x * spacing, 20 + y * spacing)
//             y === 0 && point.pin(point.x, point.y)
//             x !== 0 && point.attach(this.points[this.points.length - 1])
//             y !== 0 && point.attach(this.points[x + (y - 1) * (clothX + 1)])

//             this.points.push(point)
//          }
//       }
//    }

//    update(delta) {
//       let i = accuracy

//       while (i--) {
//          this.points.forEach((point) => {
//             point.resolve()
//          })
//       }

//       ctx.beginPath()
//       this.points.forEach((point) => {
//          point.update(delta * delta).draw()
//       })
//       ctx.stroke()
//    }
// }

// function setMouse(e) {
//    let rect = canvas.getBoundingClientRect()
//    mouse.px = mouse.x
//    mouse.py = mouse.y
//    mouse.x = e.clientX - rect.left
//    mouse.y = e.clientY - rect.top
// }

// canvas.onmousedown = (e) => {
//    mouse.button = e.which
//    mouse.down = true
//    setMouse(e)
// }

// canvas.onmousemove = setMouse

// canvas.onmouseup = () => (mouse.down = false)

// canvas.oncontextmenu = (e) => e.preventDefault()

// let cloth = new Cloth()

//    ; (function update(time) {
//       ctx.clearRect(0, 0, canvas.width, canvas.height)

//       cloth.update(0.016)

//       window.requestAnimFrame(update)
//    })(0)
