var testingParagraph = document.getElementById("testingParagraph");
var testingParagraph2 = document.getElementById("hiddenParagraph");
var userInput = document.getElementById("userInput");
var wpm = document.getElementById("wpm");

//document.getElementById("startBtn");
function startTimer() {
  document.getElementById("startBtn").style.visibility = "hidden";

  document.getElementById("userInput").style.visibility = "visible";
  document.getElementById("userInput").focus();

  document.getElementById("nextBtn").style.visibility = "visible";
  var presentTime = document.getElementById("timer").innerHTML;
  var timeArray = presentTime.split(/[:]+/);
  var timeLoop;
  var m = timeArray[0];
  var s = checkSecond(timeArray[1] - 1);
  if (s == 59) {
    m = m - 1;
  }
  if (m < 0) {
    //disable inputs field
    userInput.disabled = true;
    //change timer color
    presentTime.style.color = "#FF0000";
    //clear timer variable
    clearTimeout(timeLoop);
    document.getElementById("userInput").disabled = false;
  } else {
    document.getElementById("timer").innerHTML = m + ":" + s;
    timeLoop = setTimeout(startTimer, 1000);
  }
}
function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {
    sec = "0" + sec;
  } // add zero in front of numbers < 10
  if (sec < 0) {
    sec = "59";
  }
  return sec;
}
function textComparison(event) {
  //base on the browser, if it uses or support event.which then keypressed equates to it otherwise keypressed equates to keyCode
  var keypressed = event.which || event.keyCode;
  var keyCharCode = String.fromCharCode(keypressed);

  console.log(keyCharCode);
  console.log(testingParagraph2.value.charAt(0));

  if (keyCharCode == testingParagraph2.value.charAt(0)) {
    testingParagraph.style.color = "#00cc00";
    testingParagraph2.value = testingParagraph2.value.substr(1);
    userInput.style.color = "#000000";
    wpm.value = wpm.value + keyCharCode;
    console.log(correctWord);
    console.log(testingParagraph2.value);
  } else {
    testingParagraph.style.color = "#FF0000";
    userInput.style.color = "#FF0000";
  }
}
