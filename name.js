var myPlayer;

videojs("myPlayerID").one("loadedmetadata", function() {
  myPlayer = this;
  myPlayer.play();
});

// +++ Retrieve and load playlist +++
function loadPlaylist(playlistID) {
  myPlayer.catalog.getPlaylist(playlistID, function(error, playlist) {
    myPlayer.catalog.load(playlist);
    myPlayer.playlist.first();
  });
}
