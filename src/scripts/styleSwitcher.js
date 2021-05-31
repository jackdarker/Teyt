;(function () {
"use strict";

// Style Switcher from https://www.stichpunkt.de/css/styleswitch.html
// todo cookies dont work with files that are not served by server!?
class StyleSwitcher {
    constructor(){
        this.style = "default";
        this.cookie = "Layout";
        this.days = 30;
    }
switchStyle(s) {
  if (!document.getElementsByTagName) return;
  var el = document.getElementsByTagName("link");
  for (var i = 0; i < el.length; i++ ) {
    if (el[i].getAttribute("rel").indexOf("style") != -1 && el[i].getAttribute("title")) {
      el[i].disabled = true;
      if (el[i].getAttribute("title") == s) el[i].disabled = false;
    }
  }
}
loadStyle() {
  var c = this.getStyleCookie();
  if (c && c != this.style) {
    this.switchStyle(c);
    this.style = c;
  }
}
setStyle(s) {
  if (s != this.style) {
    this.switchStyle(s);
    this.style = s;
    this.setStyleCookie();
  }
}
// Cookie-Funktionen
setCookie(name, value, expdays) {   // g�ltig expdays Days
  var now = new Date();
  var exp = new Date(now.getTime() + (1000*60*60*24*expdays));
  var val =name + "=" + escape(value) + "," + "expires=" + exp.toGMTString() + "," +  "path=/";
  document.cookie = val;
}
delCookie(name) {   // expires ist abgelaufen
  var now = new Date();
  var exp = new Date(now.getTime() - 1);
  document.cookie = name + "=;" +
                    "expires=" + exp.toGMTString() + ";" + 
                    "path=/";
}
getCookie(name) {
  var cname = name + "=";
  var dc = document.cookie;
  if (dc.length > 0) {
    var start = dc.indexOf(cname);
    if (start != -1) {
      start += cname.length;
      var stop = dc.indexOf(";", start);
      if (stop == -1) stop = dc.length;
      return unescape(dc.substring(start,stop));
    }
  }
  return null;
}
setStyleCookie() {  this.setCookie(this.cookie, this.style, this.days);}
getStyleCookie() {  return this.getCookie(this.cookie);}
delStyleCookie() {  this.delCookie(this.cookie);}
}
window.styleSwitcher = new StyleSwitcher(); 
window.styleSwitcher.loadStyle();
//window.onload = window.styleSwitcher.loadStyle;
})(window, document);