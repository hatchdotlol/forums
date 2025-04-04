document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#new_post_submit").addEventListener("click", () => {
        if (document.querySelector("#new_post_content").value.length > 8000) {
            alert("error: 8000-character content limit surpassed");
            return;
        }
        if (document.querySelector("#new_post_content").value.trim().length < 1) {
            alert("error: no content provided");
            return;
        }
        fetch("/api/new/post", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                "content": document.querySelector("#new_post_content").value,
                "topic": document.querySelector("#get-topic").content
            })
        }).then(res => {
            if (res.status === 200) {
                window.location.reload();
            } else {
                alert(res.status + " " + res.statusText + "!!");
            }
        });
    });
});
