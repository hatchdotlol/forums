async function submit() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    username.disabled = true;
    password.disabled = true;

    if (username.value === "" || password.value === "") {
        username.disabled = false;
        password.disabled = false;
        alert("Username and password is required.");
        return;
    }

    const resp = await fetch("https://api.hatch.lol/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value,
        })
    });

    const json = await resp.json();

    if (json.message) {
        username.disabled = false;
        password.disabled = false;
        alert("Error: " + json.message);
        return;
    }

    username.disabled = false;
    password.disabled = false;

    localStorage.setItem("token", json.token);
    window.location.href = "/"
}

document.getElementById('submit').addEventListener('click', submit);
document.getElementById('username').addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        submit()
    }
});
document.getElementById('password').addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        submit()
    }
});
