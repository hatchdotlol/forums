document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.getElementsByClassName("post")).forEach(element => {
        fetch(`https://api.hatch.lol/users/${element.id}`).then(res => res.json()).then(data => {
            element.querySelector(".post-user-name").innerText = data.displayName;
            element.querySelector(".post-pfp").src = data.profilePicture.startsWith("data:image") ? data.profilePicture : `https://api.hatch.lol/${data.profilePicture}`;
            element.querySelector(".post-user-role").innerText = data.hatchTeam === true ? "Hatch Team" : "Hatchling";
        });
    });
    Array.from(document.getElementsByClassName("post-content")).forEach(element => {
        element.innerHTML = element.innerHTML
            .replace(/(https?:\/\/\S+)/g, "<a href='$1'>$1</a>")
            .replace(/@([a-z,A-Z,0-9,-,_]+)\b/g, "<a href='https://dev.hatch.lol/user/?u=$1'>@$1</a>");
    });
});
