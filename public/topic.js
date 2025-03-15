document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.getElementsByClassName("post")).forEach(element => {
        fetch(`https://api.hatch.lol/users/${element.dataset.author}`).then(res => res.json()).then(data => {
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

    Array.from(document.getElementsByClassName("post-reaction-button")).forEach(element => {
        element.addEventListener("click", () => {
            fetch("/api/new/reaction", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Token": localStorage.getItem("token")
                },
                body: JSON.stringify({
                    "reaction": element.dataset.reaction,
                    "post": element.dataset.post
                })
            });
        });
    });

    const pin_topic_button = document.querySelector("#pin-topic-button");

    if (localStorage.getItem("token")) {
        pin_topic_button.remove();
    }
    
    fetch("https://api.hatch.lol/auth/me", {
        headers: {
            "Token": localStorage.getItem("token")
        }
    }).then(fres => {
        if (fres.status === 200) {
            fres.json().then(data => {
                if (!data.hatchTeam) {
                    pin_topic_button.remove();
                }
                pin_topic_button.addEventListener("click", () => {
                    fetch("/api/pin/topic", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            "Token": localStorage.getItem("token")
                        },
                        body: JSON.stringify({
                            "id": document.querySelector("#get-topic").content
                        })
                    });
                });
            });
        } else {
            pin_topic_button.remove();
        }
    });
});
