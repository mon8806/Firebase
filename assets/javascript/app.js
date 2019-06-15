var firebaseConfig = {
    apiKey: "AIzaSyA0OKvUylQg3y72yoWoleJOCoOHM0ea_SQ",
    authDomain: "new2-3e3fc.firebaseapp.com",
    databaseURL: "https://new2-3e3fc.firebaseio.com",
    projectId: "new2-3e3fc",
    storageBucket: "new2-3e3fc.appspot.com",
    messagingSenderId: "1002362348725",
    appId: "1:1002362348725:web:baf2f63a7cf18ea3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$("#add-train").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination").val().trim();
    var trainFirstTime =$("#first-train").val().trim();
    var trainFrequency = parseInt($("#frequency").val().trim());

    var results = nextArrivalTime(trainFirstTime, trainFrequency);
    var nextArrival = results.nextArrival
    var minAway = results.minAway;

    var currentTrainSchedule = {
        name: trainName,
        destination: trainDestination,
        firstTrain: trainFirstTime,
        frequency: trainFrequency,
        nextArrival: results.nextArrival
    };

    database.ref().push(currentTrainSchedule);

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");


$("#train-schedule > tbody").append(newRow);
});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstTime = childSnapshot.val().firstTrain;
    var trainFrequency = childSnapshot.val().frequency;
    var results = nextArrivalTime(trainFirstTime, trainFrequency);

    var nextArrival = results.nextArrival
    var minAway = results.minAway;
    //create function that accepts start time, current time, and frequency. Then returns the next train schedule
    //function nextArrival(startTime, currentTime, frequency)
    //Create the daily schedule using startTime and Frequency
    //iterate through schedule if the current time - current schedule time > 0 and < frequency time 
    //Return time difference


    
    // console.log(nextArrivalTime("23:00", 15) + " minutes away for the next train")
    // console.log(nextArrivalTime("23:00", 15000) + " minutes away for the next train")


var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minAway)
    );


    $("#train-schedule > tbody").append(newRow);

});


//provide the startTime in military format 22:00 etc and frequency in interger format
function nextArrivalTime(startTime, frequency) {
    var now = moment(); //time right now
    var scheduledTime = moment(startTime, "HH:mm").add(frequency, "minutes") //Create a moment object with the current time provided
    var difference = parseInt(now.diff(scheduledTime, "minutes")) //subtract the current time from the first scheduled time to get how far away it is
    console.log(`timeNow = ${ now.format("HH:mm") } scheduledTime = ${ scheduledTime.format("HH:mm") } difference = ${ difference } minutes away`)

    //If the the time of the next scheduled time is more than the frequency keep going because that means that the train already passed us
    while (difference >= frequency) {
        scheduledTime = scheduledTime.add(frequency, "minutes") //This adds the frequency in minutes to get the next time scheduled train arrival
        difference = parseInt(now.diff(scheduledTime, "minutes")) //Gets how many minutes it is right now until the next train. The goal of this is to get less tha
        console.log(`timeNow = ${ now.format("HH:mm") } scheduledTime = ${ scheduledTime.format("HH:mm") } difference = ${ difference } minutes away`)
    }

    scheduledTime = scheduledTime.add(frequency, "minutes") //This adds the frequency in minutes to get the next time scheduled train arrival
    difference = parseInt(now.diff(scheduledTime, "minutes")) //Gets how many minutes it is right now until the next train. The goal of this is to get less tha

    var results = {
        nextArrival: scheduledTime.format("HH:mm"),
        minAway:  Math.abs(difference)
    }
    return results; // Need to get the absolute Value incase the value is negative minutes if the next scheduled time is days after the current time
}