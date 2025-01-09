document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#new_post_submit").addEventListener("click", () => {
        fetch("/api/new/topic", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                "title": document.querySelector("#new_post_title").value,
                "content": document.querySelector("#new_post_content").value,
                "category": document.querySelector("#get-category").content
            })
        }).then(res => {
            if (res.status === 200) {
                window.location.href = "..";
            } else {
                alert(res.status + " " + res.statusText + "!!");
            }
        });
    })
})
