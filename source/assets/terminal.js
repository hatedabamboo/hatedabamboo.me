const lines = [
  "> init",
  "initializing sequence..........OK",
  "> syscheck",
  "system check...................OK",
  "> connect hatedabamboo.me/arg2025",
  "connecting.....................OK",
  "access granted",
  "> man arg2025",
  "loading instructions...........OK",
  "The game begins when the timer reaches zero.",
  "Solve the puzzles. Follow the clues. Reach the final code.",
  'Anyone can complete the sequence, but only one will claim <a href="https://notes.hatedabamboo.me/arg2025/#rewards" target="_blank">the reward</a>.',
  "> countdown --start-time=now",
];

const clueLines = [
  "> clue --id=01",
  "00000000  57 61 6b 65 20 75 70 2c  20 4e 65 6f 2e 2e 2e 20",
  "00000010  54 68 65 20 4d 61 74 72  69 78 20 68 61 73 20 79",
  "00000020  6f 75 2e 2e 2e 20 46 6f  6c 6c 6f 77 20 74 68 65",
  "00000030  20 72 6f 62 6f 74 73 2e",
  "> solve",
  "Enter the passphrase to finish the game:"
];

const terminal = document.getElementById("terminal");
const target = new Date("2025-11-11T11:11:11Z");
const urlParams = new URLSearchParams(window.location.search);
const typingSpeed = parseInt(urlParams.get('typingSpeed')) || 45;
let lineIndex = 0;

function typeLine(text, callback) {
  const lineEl = document.createElement("div");
  lineEl.className = "line";
  terminal.appendChild(lineEl);

  const tempEl = document.createElement("div");
  tempEl.innerHTML = text;
  const visibleText = tempEl.textContent || tempEl.innerText;

  let i = 0;
  const typing = setInterval(() => {
    const tempPartial = document.createElement("div");
    tempPartial.innerHTML = text;

    const walker = document.createTreeWalker(tempPartial, NodeFilter.SHOW_TEXT);
    let charCount = 0;
    let currentNode;

    while (currentNode = walker.nextNode()) {
      const nodeLength = currentNode.textContent.length;
      if (charCount + nodeLength <= i) {
        charCount += nodeLength;
      } else {
        currentNode.textContent = currentNode.textContent.slice(0, i - charCount);
        let nextNode = walker.nextNode();
        while (nextNode) {
          nextNode.parentNode.removeChild(nextNode);
          nextNode = walker.nextNode();
        }
        break;
      }
    }

    lineEl.innerHTML = tempPartial.innerHTML;
    i++;

    if (i > visibleText.length) {
      clearInterval(typing);
      if (callback) setTimeout(callback, 300);
    }
  }, typingSpeed);
}

function startTyping() {
  if (lineIndex < lines.length) {
    typeLine(lines[lineIndex], () => {
      lineIndex++;
      startTyping();
    });
  } else {
    startCountdown();
  }
}

function startCountdown() {
  const countdownLine = document.createElement("div");
  countdownLine.className = "line";
  terminal.appendChild(countdownLine);

  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    countdownLine.textContent = "00:00:00:00";
    showClue();
    return;
  }

  function updateCountdown() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      clearInterval(intervalId);
      countdownLine.textContent = "00:00:00:00";
      showClue();
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownLine.textContent = `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} `;
  }

  updateCountdown();
  const intervalId = setInterval(updateCountdown, 1000);
}

function showClue() {
  let index = 0;
  function typeNextLine() {
    if (index < clueLines.length) {
      typeLine(clueLines[index], () => {
        index++;
        typeNextLine();
      });
    } else {
      createInput();
    }
  }
  typeNextLine();
}

function createInput() {
  const promptLine = document.createElement("div");
  promptLine.className = "line";

  const input = document.createElement("input");
  input.type = "text";
  input.style.cssText = "background:transparent;border:none;outline:none;color:#00ff66;font-family:'Courier New',monospace;font-size:16px;caret-color:#00ff66;width:800px";
  input.autofocus = true;

  promptLine.appendChild(input);
  terminal.appendChild(promptLine);

  const messageLine = document.createElement("div");
  messageLine.className = "line";
  terminal.appendChild(messageLine);

  input.focus();

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const passphrase = input.value.trim();

      if (!passphrase) {
        messageLine.textContent = "Please enter a passphrase.";
        return;
      }

      input.disabled = true;
      messageLine.textContent = "Checking passphrase...";

      try {
        const response = await fetch(`https://api.hatedabamboo.me/arg?key=${encodeURIComponent(passphrase)}`, {
          method: 'GET',
          mode: 'cors'
        });

        if (response.status === 200) {
          const data = await response.json();
          messageLine.textContent = data.message;
        } else if (response.status === 406) {
          const data = await response.json();
          messageLine.textContent = data.message || "Access denied. Try again.";
          input.disabled = false;
          input.value = "";
          input.focus();
        } else {
          messageLine.textContent = `Unexpected response: ${response.status}`;
          input.disabled = false;
          input.value = "";
          input.focus();
        }
      } catch (error) {
        messageLine.textContent = `Error: ${error.message}`;
        input.disabled = false;
        input.value = "";
        input.focus();
      }
    }
  });
}

startTyping();
