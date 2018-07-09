  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAiPy1K_hpcp_Rz3WNIqK1HriI81vWD2cE",
    authDomain: "train-scheduler-5810d.firebaseapp.com",
    databaseURL: "https://train-scheduler-5810d.firebaseio.com",
    projectId: "train-scheduler-5810d",
    storageBucket: "train-scheduler-5810d.appspot.com",
    messagingSenderId: "205854758848"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //Display clock
  function clock() {
    setInterval(function () {
      $("#time").html(moment().format("hh:mm A"))
    }, 60000);
  }
  clock();

  //Add train button
  $("#addButton").on("click", function (event) {
    event.preventDefault();


    var trainName = $("#trainName").val().trim()
    var destination = $("#destination").val().trim()
    var firstTrain = $("#firstTrain").val().trim()
    var frequency = $("#frequency").val().trim()

    var newTrain = {
      name: trainName,
      destin: destination,
      first: firstTrain,
      freq: frequency,
    }

    database.ref().push(newTrain);

    $("#trainName").val("")
    $("#destination").val("")
    $("#firstTrain").val("")
    $("#frequency").val("")
  });


  database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    //Set variables for form input field values equal to the stored values in firebase.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destin;
    var firstTrain = childSnapshot.val().first;
    var frequency = childSnapshot.val().freq;

    var currentTime = moment();
    console.log(currentTime)

    var timeConvert = moment(firstTrain, "hh:mm");

    var diffTime = moment().diff(moment(timeConvert), "minutes");

    var remainder = diffTime % frequency;

    var timeTillNextTrain = frequency - remainder;
    console.log("timeTillNextTrain = " + timeTillNextTrain)

    var nextTrain = moment().add(timeTillNextTrain, "minutes").format("hh:mm A");


    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(nextTrain),
      $("<td>").text(timeTillNextTrain)
    );

    $("#schedules").append(newRow)

  });