// globals
var _player = document.createElement("audio"),
    _playerWrap = document.createElement("span"),
  _playlist = document.getElementById("playlist");
  //_stop = document.getElementById("stop");

_player.id = "player";
_player.setAttribute("controls","");

_playerWrap.appendChild(_player);
_playerWrap.className = "playerWrap";

// functions
function nextElemSibling( el ) {
    do { el = el.nextSibling } 
  while ( el && el.nodeType !== 1 );
    return el;
}

function playlistItemClick(clickedElement) {
  var selected = _playlist.querySelector(".selected");
  if (selected) {
    selected.classList.remove("selected");
  }
  clickedElement.classList.add("selected");
  clickedElement.appendChild(_playerWrap);

  _player.src = clickedElement.getAttribute("data-mp3");
  _player.play();
}

function playNext() {
  var selected = _playlist.querySelector("li.selected");
  if (selected && nextElemSibling(selected)) {
    playlistItemClick(nextElemSibling(selected));
  } else {
    selected.classList.remove("selected");
    selected.removeChild(_playerWrap);
  }

}

// event listeners
//_stop.addEventListener("click", function() {
//  _player.pause();
//});

_player.addEventListener("ended", playNext);

_playlist.addEventListener("click", function(e) {
  if (e.target && e.target.nodeName === "LI") {
    playlistItemClick(e.target);
  }
});
