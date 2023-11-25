function skillsMember() {
    var x = document.getElementById("skillsMember");
    if (x.style.display === "none") {
        x.style.display = "block";
        document.getElementById("skillsMember").style.display = "block";
    } else {
        x.style.display = "none";
        document.getElementById("skillsMember").style.display = "none";
    }
}