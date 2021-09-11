"use strict";
  /* Retrieves SVG files from server, based on filename selected in dropdown */
/*UNUSED async load_server_file(event) {
    const select_el = event.target;
    const filename = select_el.value; 
    if (filename !== `none`) {
      let path = `./assets/`;

      // uses modern asynchronous promise-based `fetch` rather than `XMLHttpRequest`
      await fetch(`${path}${filename}`)
        .then( response =>  response.text() )
        .then(svg_str => {
            this.insert_svg (svg_str);
          })
          .catch(err => {
            throw new Error(err);
          });
    }
}*/
  /* Serializes and saves SVG file to local file system */
/*UNUSED  save_file () {
    const svg_el = document.querySelector("#svg_container > svg");
    if (svg_el) {
      let content = new XMLSerializer().serializeToString( svg_el );
      let filetype = `image/svg+xml`;

      let name = "modified_svg";
      let filename = `${name}.svg`;

      let DOMURL = self.URL || self.webkitURL || self;
      let blob = new Blob([content], {type : 'image/svg+xml;charset=utf-8'});
      let url = DOMURL.createObjectURL(blob);

      let file_save_section = document.querySelector(`#controls`);
      let download_link_el = document.createElement(`a`);
      download_link_el.style = `display: none`;
      file_save_section.appendChild(download_link_el);
      download_link_el.download = filename;

      if ( `image/svg+xml` == filetype ) {
        download_link_el.href = url;
      }

      download_link_el.click();
      DOMURL.revokeObjectURL(url);
      download_link_el.remove();
    }
  }*/
  /* Makes embedded SVG element go fullscreen, apart from host parent HTML file */
  /*UNUSED display_svg_fullscreen () {
    const svg_el = document.querySelector("#svg_container > svg");
    if (svg_el.requestFullscreen) {
      svg_el.requestFullscreen();
    }
  }*/

/**
 * extends Function with the possibility to execute it multiple times with delay
 * var foo = function test(startTime, count) { alert(startTime + count);};
 * new foo.Timer(2000,3,null);
 * see https://wiki.selfhtml.org/wiki/JavaScript/Tutorials/komfortable_Timer-Funktion
 * @param {int} interval: in ms 
 * @param {*} calls : how many times or use Infinity
 * @param {*} onend : optional CB fired after #calls or if function returns false
 */
//todo unused because no simple way to stop running timer  ?! 
/*Function.prototype.Timer = function (interval, calls, onend) {
  var count = 0;
  var payloadFunction = this;
  //payloadFunction.abortTimer = false;
  var startTime = new Date();
  var callbackFunction = function () {
    return payloadFunction(startTime, count);
  };
  var endFunction = function () {
    if (onend) {
      onend(startTime, count, calls);
    }
  };
  var timerFunction = function () {
    count++;
    if(payloadFunction.abortTimer) return;
    if (count < calls && callbackFunction() != false) {
      window.setTimeout(timerFunction, interval);
    } else {
      endFunction();
    }
  };
  timerFunction();
};*/
/*
core functionality
*/