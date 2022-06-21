function play(difficulty) {
  const host = "http://127.0.0.1:5500/";
  const url = `${host}play.html?d=${difficulty}`;
  window.location.href = url;
}
