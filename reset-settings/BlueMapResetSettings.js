const currentVersion = 1;
// ---
const version = parseInt(localStorage.getItem("version") || "0")
localStorage.setItem("version", currentVersion);
if (version < currentVersion) bluemap.resetSettings();
