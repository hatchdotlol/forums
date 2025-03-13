document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#resolve_button").addEventListener("click", () => {
        fetch("/api/report/resolve", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                "report": document.querySelector("#get-report").content
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
