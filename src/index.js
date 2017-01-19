import * as TOOLS from './components/tools.class.js'
import THREE_Controller from './components/three_controller.class.js'

var framecounter = new TOOLS.FrameRateUI()
framecounter.hide()


var audio_analyser = new TOOLS.AudioAnalyzer({
    debug: true,
    playerUI: true,
    autoplay: false,
    audioElement: document.querySelector('audio'),
    samplingFrequency: 256
})

audio_analyser.hide()

audio_analyser.addControlPoint({
      bufferPosition : 23
})

audio_analyser.addControlPoint({
      bufferPosition : 36
})

STORAGE.audio = audio_analyser

var controller = new THREE_Controller({
  container: document.querySelector('#container')
})

window.addEventListener('keyup', function(evt){
    var key = evt.keyCode
    if (key == 192) {
        framecounter.toggleShow()
        audio_analyser.toggleShow()
    }
})



// start animating
animate();

function animate() {
    requestAnimationFrame(animate);

    // Updating components
    controller.update()
    audio_analyser.update()
    framecounter.update()

}
