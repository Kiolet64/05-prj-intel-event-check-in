// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const checkInButton = document.getElementById("checkInBtn");
const greeting = document.getElementById("greeting");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");
const teamCounters = {
  water: document.getElementById("waterCount"),
  zero: document.getElementById("zeroCount"),
  power: document.getElementById("powerCount"),
};
const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

const maxCount = 50;
const attendanceStorageKey = "eventAttendance";

function loadAttendance() {
  const savedAttendance = localStorage.getItem(attendanceStorageKey);

  if (savedAttendance === null) {
    return { water: 0, zero: 0, power: 0, total: 0, attendees: [] };
  }

  const attendance = JSON.parse(savedAttendance);
  if (attendance === null || typeof attendance !== "object") {
    throw new Error("Saved attendance data is invalid.");
  }

  const validTeamCounts =
    Number.isSafeInteger(attendance.water) &&
    Number.isSafeInteger(attendance.zero) &&
    Number.isSafeInteger(attendance.power) &&
    attendance.water >= 0 &&
    attendance.zero >= 0 &&
    attendance.power >= 0;

  if (!validTeamCounts) {
    throw new Error("Saved attendance data is invalid.");
  }

  const teamTotal = attendance.water + attendance.zero + attendance.power;

  if (
    !Number.isSafeInteger(attendance.total) ||
    attendance.total !== teamTotal ||
    teamTotal > maxCount
  ) {
    throw new Error("Saved attendance data is invalid.");
  }

  const attendees =
    attendance.attendees === undefined ? [] : attendance.attendees;

  if (!Array.isArray(attendees) || attendees.length > attendance.total) {
    throw new Error("Saved attendee list is invalid.");
  }

  for (let index = 0; index < attendees.length; index++) {
    const attendee = attendees[index];

    if (
      attendee === null ||
      typeof attendee !== "object" ||
      typeof attendee.name !== "string" ||
      attendee.name.trim() === "" ||
      !teamNames[attendee.team]
    ) {
      throw new Error("Saved attendee list is invalid.");
    }
  }

  return {
    water: attendance.water,
    zero: attendance.zero,
    power: attendance.power,
    total: attendance.total,
    attendees: attendees,
  };
}

function renderAttendance() {
  teamCounters.water.textContent = attendance.water;
  teamCounters.zero.textContent = attendance.zero;
  teamCounters.power.textContent = attendance.power;
  attendeeCountDisplay.textContent = attendance.total;
  progressBar.style.width = `${Math.round(
    (attendance.total / maxCount) * 100
  )}%`;
  attendeeList.replaceChildren();

  if (attendance.attendees.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "attendee-empty";
    emptyMessage.textContent = "No attendees checked in yet.";
    attendeeList.appendChild(emptyMessage);
  } else {
    for (let index = 0; index < attendance.attendees.length; index++) {
      const attendee = attendance.attendees[index];
      const attendeeItem = document.createElement("li");
      const attendeeName = document.createElement("span");
      const attendeeTeam = document.createElement("span");

      attendeeName.className = "attendee-name";
      attendeeName.textContent = attendee.name;
      attendeeTeam.className = "attendee-team";
      attendeeTeam.textContent = teamNames[attendee.team];
      attendeeItem.appendChild(attendeeName);
      attendeeItem.appendChild(attendeeTeam);
      attendeeList.appendChild(attendeeItem);
    }
  }

  if (attendance.total >= maxCount) {
    checkInButton.disabled = true;
    checkInButton.textContent = "Check-in closed";
  }
}

function showGoalGreeting() {
  const teams = [
    { name: teamNames.water, count: attendance.water },
    { name: teamNames.zero, count: attendance.zero },
    { name: teamNames.power, count: attendance.power },
  ];
  let highestTeamCount = -1;
  let winningTeams = [];

  for (let index = 0; index < teams.length; index++) {
    if (teams[index].count > highestTeamCount) {
      highestTeamCount = teams[index].count;
      winningTeams = [teams[index].name];
    } else if (teams[index].count === highestTeamCount) {
      winningTeams.push(teams[index].name);
    }
  }

  greeting.textContent = `Attendance goal is reached! Congratulations to the winning team, ${winningTeams.join(
    " and "
  )}`;
  greeting.classList.remove("success-message");
  greeting.classList.add("celebration-message");
  greeting.style.display = "block";
}

let attendance = loadAttendance();
renderAttendance();
if (attendance.total >= maxCount) {
  showGoalGreeting();
}

// Handle form submission.
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (attendance.total >= maxCount) {
    checkInButton.disabled = true;
    checkInButton.textContent = "Check-in closed";
    greeting.textContent = "Attendance is full. Check-in is closed.";
    greeting.classList.remove("success-message");
    greeting.classList.remove("celebration-message");
    greeting.style.display = "block";
    return;
  }

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, team, teamName);

  const updatedAttendance = {
    water: attendance.water,
    zero: attendance.zero,
    power: attendance.power,
    total: attendance.total,
    attendees: attendance.attendees.concat({ name: name, team: team }),
  };
  updatedAttendance[team] += 1;
  updatedAttendance.total += 1;

  try {
    localStorage.setItem(
      attendanceStorageKey,
      JSON.stringify(updatedAttendance)
    );
  } catch (error) {
    console.error("Unable to save attendance:", error);
    greeting.textContent = "Check-in could not be saved. Please try again.";
    greeting.classList.remove("success-message");
    greeting.classList.remove("celebration-message");
    greeting.style.display = "block";
    return;
  }

  attendance = updatedAttendance;
  renderAttendance();

  if (attendance.total >= maxCount) {
    showGoalGreeting();
  } else {
    greeting.textContent = `Welcome, ${name} from ${teamName}!`;
    greeting.classList.remove("celebration-message");
    greeting.classList.add("success-message");
    greeting.style.display = "block";
  }

  form.reset();
});
