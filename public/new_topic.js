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
        if (document.querySelector("#new_post_title").value.length > 100) {
            alert("error: 100-character title limit surpassed");
            return;
        }
        if (document.querySelector("#new_post_title").value.trim().length < 1) {
            alert("error: no title provided");
            return;
        }
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
                window.location.href = `/category/${document.querySelector("#get-category").content}`;
            } else {
                alert(res.status + " " + res.statusText + "!!");
            }
        });
    });
});
