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
            .replace(/@([a-z,A-Z,0-9,-,_]+)\b/g, "<a href='https://dev.hatch.lol/user/?u=$1'>@$1</a>")
            .replace(/:glungus:/g, "<img class='emoji' src='https://dev.hatch.lol/images/emojis/glungus.png' alt='glungus'>")
            .replace(/:(tada|hooray):/g, "🎉")
            .replace(/:(\+1|thumbsup):/g, "👍")
            .replace(/:(\-1|thumbsdown):/g, "👎")
            .replace(/:skull:/g, "💀")
            .replace(/:(hatch(dotlol)?|kyle):/g, "🐣")
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

    const mod_actions_bar = document.querySelector("#mod-actions");
    const post_deletion_buttons = document.querySelectorAll(".post-deletion-button");

    if (!localStorage.getItem("token")) {
        mod_actions_bar.remove();
        Array.from(post_deletion_buttons).forEach(button => button.remove());
    }
    
    fetch("https://api.hatch.lol/auth/me", {
        headers: {
            "Token": localStorage.getItem("token")
        }
    }).then(fres => {
        if (fres.status === 200) {
            fres.json().then(data => {
                if (!data.hatchTeam) {
                    mod_actions_bar.remove();
                    Array.from(post_deletion_buttons).forEach(button => button.remove());
                } else {
                    document.querySelector("#pin-topic-button").addEventListener("click", () => {
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
                }
            });
        } else {
            mod_actions_bar.remove();
            Array.from(post_deletion_buttons).forEach(button => button.remove());
        }
    });
});
