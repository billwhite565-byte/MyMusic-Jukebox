const tracks = window.TRACKS || [];

const audio = document.querySelector("#audio");
const list = document.querySelector("#track-list");
const nowTitle = document.querySelector("#now-title");
const nowMeta = document.querySelector("#now-meta");
const playButton = document.querySelector("#play-pause");
const search = document.querySelector("#search");

let current = -1;

function render() {
  const query = search.value.toLowerCase();

  list.innerHTML = tracks
    .map((track, index) => ({ track, index }))
    .filter(({ track }) => track.title.toLowerCase().includes(query))
    .map(({ track, index }) => `
      <li class="track ${index === current ? "current" : ""}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <button data-index="${index}">
          ${track.title}
          <span class="meta">${track.artist || "Bill White"}</span>
        </button>
        <button class="play" data-index="${index}">Play</button>
      </li>
    `)
    .join("");
}

function load(index) {
  current = index;
  const track = tracks[index];

  audio.src = track.streamUrl;
  nowTitle.textContent = track.title;
  nowMeta.textContent =
    [track.artist, track.year].filter(Boolean).join(" / ") ||
    track.sourceFolder;

  audio.play().catch(() => {});
  render();
}

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-index]");
  if (button) load(Number(button.dataset.index));
});

playButton.addEventListener("click", () => {
  if (current < 0) {
    load(0);
  } else if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

document.querySelector("#previous").addEventListener("click", () => {
  load(current > 0 ? current - 1 : tracks.length - 1);
});

document.querySelector("#next").addEventListener("click", () => {
  load(current < tracks.length - 1 ? current + 1 : 0);
});

document.querySelector("#shuffle").addEventListener("click", () => {
  load(Math.floor(Math.random() * tracks.length));
});

search.addEventListener("input", render);

audio.addEventListener("play", () => {
  playButton.textContent = "Pause";
});

audio.addEventListener("pause", () => {
  playButton.textContent = "Play";
});

audio.addEventListener("ended", () => {
  load((current + 1) % tracks.length);
});

render();
