const API_BASE = "http://localhost:5000/api";

// Register a new user
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    country: document.getElementById("country").value,
    address: document.getElementById("address").value,
    avatarUrl: document.getElementById("avatarUrl").value || "https://placehold.co/100x100",
    bio: document.getElementById("bio").value,
  };

  try {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    document.getElementById("registerResponse").textContent = `✅ User created: ${data.username}`;
    document.getElementById("registerForm").reset();
  } catch (err) {
    document.getElementById("registerResponse").textContent = "❌ Error registering user.";
    console.error(err);
  }
});

// Load all users
document.getElementById("loadUsers").addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_BASE}/users`);
    const users = await res.json();

    const list = document.getElementById("userList");
    list.innerHTML = "";

    users.forEach(u => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${u.username}</strong> (${u.country})`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error fetching users:", err);
  }
});
