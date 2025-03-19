import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#new_post_content")) {
        document.querySelector("#new_post_content").addEventListener("keyup", () => {
            document.querySelector("#new_post_content_preview").innerHTML = glitter(marked.parse(document.querySelector("#new_post_content").value
                .replace(/&/g, "&amp;")
                .replace(/>/g, "&gt;")
                .replace(/</g, "&lt;")));
        });
    }

    Array.from(document.getElementsByClassName("post")).forEach(element => {
        fetch(`https://api.hatch.lol/users/${element.dataset.author}`).then(res => res.json()).then(data => {
            element.querySelector(".post-user-name").innerText = data.displayName;
            element.querySelector(".post-pfp").src = `https://api.hatch.lol${data.profilePicture}?size=120`;
            element.querySelector(".post-user-role").innerText = data.hatchTeam === true ? "Hatch Team" : "Hatchling";
        });
    });

    Array.from(document.getElementsByClassName("post-content")).forEach(element => {
        element.innerHTML = glitter(marked.parse(element.innerText
            .replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")));
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

    Array.from(document.getElementsByClassName("post-reply-button")).forEach(element => {
        element.addEventListener("click", () => {
            document.querySelector("#new_post_content").value = `${document.querySelector("#new_post_content").value}[quote=${element.parentElement.parentElement.dataset.author}]\n${element.dataset.postcontent}\n[/quote]`;
            document.querySelector("#new_post_content").focus();
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
                    if (document.querySelector("#pin-topic-button")) {
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
                }
            });
        } else {
            mod_actions_bar.remove();
            Array.from(post_deletion_buttons).forEach(button => button.remove());
        }
    });
});
