// Firebase Auth object
const auth = firebase.auth();

// Google Auth Provider object
const provider = new firebase.auth.GoogleAuthProvider();



// ✅ Firebase Email/Password Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Logged in as: " + user.email);
      document.getElementById("login-section").style.display = "none";
      document.getElementById("input-section").style.display = "block";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
      console.error(error);
    });
}

// ✅ Google Login (with redirect fallback for mobile)
document.getElementById("googleLoginBtn").addEventListener("click", () => {
  const btn = document.getElementById("googleLoginBtn");
  btn.disabled = true;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    auth.signInWithRedirect(provider);
  } else {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        alert("Welcome, " + user.displayName);
        document.getElementById("login-section").style.display = "none";
        document.getElementById("input-section").style.display = "block";
        btn.disabled = false;
      })
      .catch((error) => {
        console.error(error);
        alert("Google login failed: " + error.message);
        btn.disabled = false;
      });
  }
});

// ✅ Handle redirect result
auth.getRedirectResult()
  .then((result) => {
    if (result.user) {
      const user = result.user;
      alert("Welcome back, " + user.displayName);
      document.getElementById("login-section").style.display = "none";
      document.getElementById("input-section").style.display = "block";
    }
  })
  .catch((error) => {
    console.error(error);
  });

// ✅ Handle User Input and Recommend Plan
function submitDetails() {
  const age = parseInt(document.getElementById("age").value);
  const weight = parseFloat(document.getElementById("weight").value);

  if (!age || !weight || age < 5 || age > 100 || weight < 10 || weight > 300) {
    alert("Please enter valid age and weight");
    return;
  }

  document.getElementById("input-section").style.display = "none";
  document.getElementById("result-section").style.display = "block";

  let msg = "";
  if (weight < 50) {
    msg = "You are underweight. Let's work on building healthy mass.";
    showPlans("gain");
  } else if (weight > 80) {
    msg = "You are overweight. Let's start burning those extra calories!";
    showPlans("lose");
  } else {
    msg = "You are fit! Maintain your healthy lifestyle.";
    showPlans("maintain");
  }
  document.getElementById("result-msg").innerText = msg;
}

function showPlans(goal) {
  const exerciseList = document.getElementById("exercise-list");
  const dietList = document.getElementById("diet-list");
  exerciseList.innerHTML = "";
  dietList.innerHTML = "";

  let exercises = [];
  let diet = [];

  if (goal === "gain") {
    exercises = ["Weight training", "Push-ups", "Leg press", "Squats"];
    diet = ["Bananas", "Milk & Dates", "Rice with chicken", "Peanut butter"];
  } else if (goal === "lose") {
    exercises = ["Running", "Jump rope", "Cycling", "Burpees"];
    diet = ["Oats", "Boiled eggs", "Green veggies", "Detox drinks"];
  } else {
    exercises = ["Jogging", "Yoga", "Stretching", "Light cardio"];
    diet = ["Balanced meal", "Fruits", "Grilled chicken", "Nuts"];
  }

  exercises.forEach((ex) => {
    const li = document.createElement("li");
    li.textContent = ex;
    exerciseList.appendChild(li);
  });

  diet.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    dietList.appendChild(li);
  });

  document.getElementById("exercise-section").style.display = "block";
  document.getElementById("diet-section").style.display = "block";
}
