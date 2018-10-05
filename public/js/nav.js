var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };
  
  TxtRotate.prototype.tick = function() {
    //Don't use modulo, it causes the loop. If there is no full text, you are out of the loop and you don't want to do anything.
    var fullTxt = this.toRotate[this.loopNum];
    if(fullTxt) {
      if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }
  
      this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  
      var that = this;
      var delta = 300 - Math.random() * 100;
  
      if (this.isDeleting) { delta /= 2; }
  
      if (!this.isDeleting && this.txt === fullTxt) {
        // If you are on the last item of the toRotate array, break the loop before deletion.
        if(this.loopNum >= this.toRotate.length-1) {
          return;
        }
        delta = this.period;
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
      }
  
      setTimeout(function() {
        that.tick();
      }, delta);
    }
  };
  window.onload = function() {
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-rotate');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate &gt; .wrap { border-right: 0.1em solid #666 }";
  document.body.appendChild(css);
  };