/*
Copyright (c) 2016 Intel Corporation.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of works must retain the original copyright notice, this list
  of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the original copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.
* Neither the name of Intel Corporation nor the names of its contributors
  may be used to endorse or promote products derived from this work without
  specific prior written permission.

THIS SOFTWARE IS PROVIDED BY INTEL CORPORATION "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL INTEL CORPORATION BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var colorCvs;
var colorCtx;
var volumePreviewCvs;
var volumePreviewCtx;
var msg;
var statusElement;
var sp;
var camerPose;

function init() {
colorCvs = document.getElementById("imgColor");
var width = colorCvs.width;
colorCtx = colorCvs.getContext("2d");
volumePreviewCvs = document.getElementById("volumePreview");
volumePreviewCtx = colorCvs.getContext("2d");
msg = document.getElementById("log");
statusElement = document.getElementById("status");	
}

function startSP(successCallback, errorCallback) {
  var config = {
    useOpenCVCoordinateSystem: true
  };
  sp.init(config)
    .then(function() {
      statusElement.textContent = "init succeeds!"
      return sp.start();
    })
    .then(successCallback)
    .catch(errorCallback);
}

function destroySP(successCallback, errorCallback) {
  sp.destroy()
    .then(successCallback)
    .catch(errorCallback);
}

function getSample() {
  sp.getSample().then(function(sample) {
    var imageData = colorCtx.createImageData(320, 240);
    imageData.data.set(sample.color.data);
    colorCtx.putImageData(imageData, 0, 0);
  })
  .catch(errorCallback);
}

function getVertices() {
  sp.getVertices().then(function(verticals) {
    var imageData = colorCtx.createImageData(verticals.width, verticals.height);
    imageData.data.set(verticals.data);
    colorCtx.putImageData(imageData, 0, 0);
  })
  .catch(errorCallback);
}

function getNormals() {
  sp.getNormals().then(function(normals) {
    var imageData = colorCtx.createImageData(normals.width, normals.height);
    imageData.data.set(normals.data);
    colorCtx.putImageData(imageData, 0, 0);
  })
  .catch(errorCallback);
}

function errorCallback(ex) {
  msg.textContent = ex.message;  
}

var flag = false;
window.onload = function() {
  init();
  sp = realsense.ScenePerception;
  startSP(function() {
    sp.onchecking = function(evt) {
    };

    sp.onsampleprocessed = function(evt) {
      // TEST
      //getNormals();
      statusElement.textContent = "accuracy:" + evt.data.accuracy +
                                  "quality:" + evt.data.quality +
                                  "camera pose: " + evt.data.cameraPose;
      if (flag)return;
      flag = true;
      sp.getVolumePreview(evt.data.cameraPose)
        .then(function(volumePreview) {
          // TODO
          flag = false;
        })
        .catch(errorCallback);	 
    }

    sp.onerror = errorCallback;
  }, function() {
    statusElement.textContent = "init or start a scene perception fail: " + ex.message;
  });
}
