document.getElementById("urlForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const longUrl = document.getElementById("longUrl").value.trim();
    if (!longUrl) {
        alert("Please enter a valid URL.");
        return;
    }

    try {
        // Send the long URL to the backend API
        const response = await fetch('http://localhost:3000/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ longUrl }),
});
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to shorten URL');
        }

        // Display the shortened URL
        displayShortenedUrl(data.shortUrl);
        saveHistory(data.longUrl, data.shortUrl);
        updateHistory();
    } catch (error) {
        alert(error.message);
    }
});

function displayShortenedUrl(shortUrl) {
    const shortenedUrlContainer = document.getElementById("shortenedUrlContainer");
    const shortenedUrl = document.getElementById("shortenedUrl");

    shortenedUrl.href = shortUrl;
    shortenedUrl.textContent = shortUrl;

    shortenedUrlContainer.style.display = "block";

    // Add copy functionality
    document.getElementById("copyButton").onclick = function () {
        navigator.clipboard.writeText(shortUrl).then(() => {
            alert("Shortened URL copied to clipboard!");
        });
    };
}

function saveHistory(longUrl, shortUrl) {
    const history = JSON.parse(localStorage.getItem("urlHistory")) || [];
    history.unshift({ longUrl, shortUrl });
    localStorage.setItem("urlHistory", JSON.stringify(history));
}

function updateHistory() {
    const historyList = document.getElementById("historyList");
    const history = JSON.parse(localStorage.getItem("urlHistory")) || [];
    historyList.innerHTML = "";

    history.forEach((entry) => {
        const listItem = document.createElement("li");

        const link = document.createElement("a");
        link.href = entry.shortUrl;
        link.target = "_blank";
        link.textContent = entry.shortUrl;

        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy";
        copyButton.onclick = function () {
            navigator.clipboard.writeText(entry.shortUrl).then(() => {
                alert("Shortened URL copied to clipboard!");
            });
        };

        listItem.appendChild(link);
        listItem.appendChild(copyButton);
        historyList.appendChild(listItem);
    });
}

// Load history on page load
updateHistory();