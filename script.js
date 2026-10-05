// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const checkInButton = document.getElementById("checkInBtn");
const greeting = document.getElementById("greeting");
const progressBar = document.getElementById("progressBar");

const maxCount = 50;

//Handle form subission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (Number(attendeeCountDisplay.textContent) >= maxCount) {
    checkInButton.disabled = true;
    checkInButton.textContent = "Check-in closed";
    greeting.textContent = "Attendance is full. Check-in is closed.";
    return;
  }

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, team, teamName);

  // Update team counter
  const teamCounter = document.getElementById(`${team}Count`);
  teamCounter.textContent = Number(teamCounter.textContent) + 1;

  // Update total attendance from all team counters
  const waterCount = Number(document.getElementById("waterCount").textContent);
  const zeroCount = Number(document.getElementById("zeroCount").textContent);
  const powerCount = Number(document.getElementById("powerCount").textContent);
  const count = waterCount + zeroCount + powerCount;
  attendeeCountDisplay.textContent = count;
  console.log("Total check-ins: ", count);

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);
  progressBar.style.width = percentage;

  if (count >= maxCount) {
    checkInButton.disabled = true;
    checkInButton.textContent = "Check-in closed";
    greeting.textContent = "Attendance is full. Check-in is closed.";
  }

  //Show welcome message
  const message = `Welcome, ${name} from ${teamName}`;
  console.log(message);

  form.reset();
});
