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
        fetch("/api/report", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                "reason": document.querySelector("#new_post_content").value,
                "post": document.querySelector("#get-post").content
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
