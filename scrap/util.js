  /* images dont work well with svg
  var draw = SVG().addTo('#canvas').size(w, h);
  draw.rect(w, h).attr({ fill: '#ffffff'});
  draw.image(window.story.state.combat.scenePic);//.center(w/2,h/2); todo imagenode has width&height but js dont sees them
  var list = window.story.state.combat.enemyParty;
  for(var i=list.length-1;i>=0;i--) {
    var node;
    if('string' == (typeof list[i].pic)) { //is path to image
      node=draw.image(list[i].pic,function (event) {
        // image loaded
        // this is the loading event for the underlying img element
        // you can access the natural width and height of the image with
        event.target.style.x=200;
      });
    } else { //is function returning svg-html
      node = SVG(list[i].pic());
      if(node) {
        var pos = _pos.pop();
        node.addTo(draw).center(pos[0],pos[1]); //this only works if there is width/height set in svg !
      }
    }
    if(_pos.length<=0) break;
  }*/

das ist alles Dreck - kann nicht von lokaler Datei laden
<label for="svg_upload">Upload SVG file:</label>    <input type="file" id="svg_upload" accept=".svg">
<div id="svg_container"></div>
<object data="assets/battlers/wolf3.svg"  type="image/svg+xml"></object>
<script>
//File kann nur durch <input> generiert werden nicht programatisch :(
document.getElementById(`svg_upload`).addEventListener(`change`, window.gm.util.loadLocalSVG.bind(this), false);
//fetch funktioniert NICHT mit local files sondern nur mit webservern!
let img = document.createElement('img');
img.style = 'position:fixed;top:10px;left:10px;width:100px';
document.body.append(img);
fetch('assets/battlers/wolf3.svg').then(response=>{return(response.blob());}).then(blob=>{console.log(blob);img.src = URL.createObjectURL(blob)});
</script>


<script>
document.getElementById(`svg_upload`).addEventListener(`change`, window.gm.util.loadLocalSVG.bind(this), false);
/*var ev={target:{files:['assets/battlers/wolf3.svg']}};
window.gm.util.loadLocalSVG(ev);*/
let img = document.createElement('img');
img.style = 'position:fixed;top:10px;left:10px;width:100px';
document.body.append(img);
fetch('assets/battlers/wolf3.svg').then(response=>{console.log(response);return(response.blob());}).then(blob=>{img.src = URL.createObjectURL(blob)});
</script>

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