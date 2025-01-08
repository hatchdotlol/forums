document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.getElementsByClassName("post")).forEach(element => {
        fetch(`https://api.hatch.lol/users/${element.id}`).then(res => res.json()).then(data => {
            element.querySelector(".post-user-name").innerText = data.displayName;
            element.querySelector(".post-pfp").src = data.profilePicture.startsWith("data:image") ? data.profilePicture : `https://api.hatch.lol/${data.profilePicture}`;
        });
    });
});
