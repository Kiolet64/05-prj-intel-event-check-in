// Get all needed DOM elements
const form = document.getElementById("checkInForm")
const nameInput = document.getElementById("attendeeName")
const teamSelect = document.getElementById("teamSelect")

// Track attendance
let count = 0;
const maxCount = 50; 

//Handle form subission
form.addEventListener("sumbit", function (event) {j
  event.preventDefault(); 

  // Get form values
const name = nameInput.value;
const team = teamSelect.value; 
const teamName = teamSelect.selectdOptions[0].text;

console.log(name, team, teamName); 

// Increment count
count++ 
console.log("Total check-ins: ", count)

// Update progress bar
const percentage = Math.round((count / maxCount) * 100) + "%";
console.log(`Progress: ${percentage}`)

// Update team counter 
const teamCounter = document.getElementById(team+ "Count"); 
const current = parseInt(teamCounter.textContent);
teamCounter.textContent = parseInt(teamCounter.textContent) + 1; 

//Show welcome message 
const message = `Welcome, ${name} from ${teamName}`;
console.log(message); 

form.reset(); 
}); 

