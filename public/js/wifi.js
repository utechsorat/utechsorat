var startTime;
var endTime;
var count;
var avgRun = 0;
var dwnlSpeed = [];

function startWifiTest() {
  document.getElementById("button").style.display = "none";
  document.getElementById("loaderText").style.display = "block";
  document.getElementById("loader").style.display = "block";
  initVariables();
}
function initVariables() {
  count = 0;
  startTime = [];
  endTime = [];
  download();
}

function showSpeed(downloadSize) {
  var loop = 0;
  var sizeInBits = downloadSize * 8;
  var speedMBps = [];
  var speedMbps = [];
  var MBps = 0;

  while (loop < endTime.length) {
    var time = (endTime[loop] - startTime[loop]) / 1000;
    speedMbps = ((sizeInBits / time) / (1024 * 1024)).toFixed(2);
    speedMBps[loop] = speedMbps * 0.125;
    loop++;
  }

  loop = 0;
  while (loop < endTime.length) {
    MBps = MBps + speedMBps[loop];
    loop++;
  }

  if (avgRun < 5) {
    dwnlSpeed[avgRun] = (MBps / endTime.length);
    console.log(dwnlSpeed);
    avgRun++;
    initVariables();
  } else {
    dwnlSpeed[avgRun] = (MBps / endTime.length);
    console.log(dwnlSpeed);
    avgRun = 0;
    loop = 0;
    MBps = 0;
    while (loop < dwnlSpeed.length) {
      MBps = MBps + dwnlSpeed[loop];
      loop++;
    }
    document.getElementById("resultH2").innerHTML = (MBps / dwnlSpeed.length).toFixed();
    document.getElementById("wifi").value = (MBps / dwnlSpeed.length).toFixed();
    document.getElementById("loaderText").style.display = "none";
    document.getElementById("loader").style.display = "none";
    document.getElementById("result").style.display = "block";
    dwnlSpeed = [];
  }
}

function download() {
  var XHRequest = new XMLHttpRequest();
  XHRequest.open("GET", "/zip/c++.rar", true);
  XHRequest.setRequestHeader("Cache-Control", "no-cache");
  XHRequest.onreadystatechange = function() {
    if (XHRequest.readyState == 2)
      startTime[count] = (new Date()).getTime();
  };
  XHRequest.onload = function() {
    if (XHRequest.readyState == 4 && XHRequest.status == 200) {
      endTime[count] = (new Date()).getTime();
      if (count == 5) {
        //console.log("Count: " + count + " Start: " + startTime[count] + " End: " + endTime);
        showSpeed(XHRequest.responseText.length);
      } else {
        console.log("Count: " + count + " Start: " + startTime[count] + " End: " + endTime[count]);
        count++;
        download();
      }

    } else {
      console.error("Error loading. Status: " + XHRequest.statusText);
    }
  };
  XHRequest.onerror = function() {
    console.error("Error loading. Status: " + XHRequest.statusText);
  };
  XHRequest.send();
}
