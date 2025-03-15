document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#delete_button").addEventListener("click", () => {
        fetch("/api/delete/post", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                "post": document.querySelector("#get-post").content
            })
        }).then(res => {
            if (res.status === 200) {
				alert("success");
                window.location.reload();
            } else {
                alert(res.status + " " + res.statusText + "!!");
            }
        });
    });
});
