document.addEventListener("DOMContentLoaded", () => {
	document.querySelector("form:has(#forum_search)").addEventListener("submit", (e) => {
		e.preventDefault();
		window.location.href = `/search/${encodeURIComponent(document.querySelector("#forum_search").value)}`;
	});
});