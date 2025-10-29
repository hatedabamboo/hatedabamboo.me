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
    return;
  }

  function updateCountdown() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      clearInterval(intervalId);
      countdownLine.textContent = "00:00:00:00";
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

startTyping();
