document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#new_post_submit").addEventListener("click", () => {
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
