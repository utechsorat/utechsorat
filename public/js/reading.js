var startTime;
var stopTime;
var diff;
function startReading() {
  startTime = new Date();
  document.getElementById("btnStart").style.display = "none";
  document.getElementById("readingPassage").style.textShadow = "0 0 0 #000";
  document.getElementById("btnStop").style.display = "block";
  

}
function stopReading() {
  stopTime = new Date();
  diff = parseInt((stopTime.getTime() - startTime.getTime()) / 1000);
  if (diff <= 10) {
    alert(
      "Passage cannot be read this quickly. Please understand what you have read."
    );
    location.reload();
  } else {
    window.location = "/assessment/reading-questions/" + diff * 7490;
  }
}
