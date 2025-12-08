function goBack() {
    let currentURLNum = window.location.href.split("/").pop().split(".")[0];
    let newURLNum = String(Number(currentURLNum) - 1);
    window.location.href = window.location.href.replace(currentURLNum + ".html", newURLNum + ".html");
}

function goForward() {
    let currentURLNum = window.location.href.split("/").pop().split(".")[0];
    let newURLNum = String(Number(currentURLNum) + 1);
    window.location.href = window.location.href.replace(currentURLNum + ".html", newURLNum + ".html");
}
