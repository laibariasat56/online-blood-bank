/* ================= REGISTER ================= */
document.getElementById("registerForm")?.addEventListener("submit", async function(e){
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("password").value,
    role: document.getElementById("role").value,
    blood_group: document.getElementById("blood_group").value,
    address: document.getElementById("address").value
  };

  const res = await fetch("/api/users/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(data)
  });

  alert(await res.text());
});
/* ================= LOGIN ================= */
document.getElementById("loginForm")?.addEventListener("submit", async function(e){
  e.preventDefault();

  const data = {
    email: email.value,
    password: password.value,
    role: role.value
  };

  const res = await fetch("/api/users/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(data)
  });

  const result = await res.json();

  if(result.success){
    localStorage.setItem("user",JSON.stringify(result.user));
    window.location = `${data.role}.html`;
  } else {
    alert("Invalid Credentials");
  }
});