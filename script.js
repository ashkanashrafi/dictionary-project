function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username.length === 0 || password.length === 0) {
        alert("Username and Password cannot be empty!");
        return;
    } else {
        const users = { username: username, password: password, words: [], score: 0 };
        localStorage.setItem("user", JSON.stringify(users));
        window.location.href = "dashboard.html";
    }
}

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    document.getElementById("welcome").innerText = `Welcome, ${user.username}!`;
    document.getElementById("score").innerText = `Score: ${user.score}`;
} else {
    window.location.href = "login.html";
}

// search word
function searchWord() {
    const word1 = document.getElementById("searchword").value.trim();

    if (!word1) {
        alert("Please enter a word!");
        return;
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word1}`)
        .then(response => response.json())
        .then(data => {

            // جلوگیری از خطا در صورت نبودن داده
            if (!Array.isArray(data) || !data[0]) {
                document.getElementById("result").innerText = "Word not found!";
                return;
            }

            const word = data[0].word;
            const phonetic = data[0].phonetics?.[0]?.text || "not found";
            const audioUrl = data[0].phonetics?.[0]?.audio || "";
            const meaning = data[0].meanings?.[0]?.definitions?.[0]?.definition || "not found";
            const example = data[0].meanings?.[0]?.definitions?.[0]?.example || "not found";

            document.getElementById("word").innerText = `word: ${word}`;
            document.getElementById("phonetic").innerText = `phonetic: ${phonetic}`;

            // اصلاح باگ: src باید فقط لینک باشد
            if (audioUrl) {
                document.getElementById("audio").src = audioUrl;
            }

            document.getElementById("meaning").innerText = `meaning: ${meaning}`;
            document.getElementById("example").innerText = `example: ${example}`;

            addWord(word, meaning, example);
        })
        .catch(error => {
            console.error(error);
            document.getElementById("result").innerText = "Word not found!";
        });
}

function addWord(word, meaning, example) {
    if (!word) {
        alert("Please enter a word!");
        return;
    }

    const newWord = {
        word: word,
        meaning: meaning,
        example: example,
    };

    user.words.push(newWord);
    localStorage.setItem("user", JSON.stringify(user));
    const tableBody = document.getElementById("wordsBody");

    user.words.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${item.word}</td>
        <td>${item.meaning}</td>
        <td>${item.example}</td>
    `;

        tableBody.appendChild(row);
    });
}

