document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#delete_button").addEventListener("click", () => {
        fetch("/api/delete/topic", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                "topic": document.querySelector("#get-topic").content
            })
        }).then(res => {
            if (res.status === 200) {
				alert("success");
                document.querySelector("#back_button").click();
            } else {
                alert(res.status + " " + res.statusText + "!!");
            }
        });
    });
});
