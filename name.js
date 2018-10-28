var myPlayer,
  playlistIds = ["4450721964001", "2805100167001", "2764931905001","1754200320001"],
  playlistIdsLength = playlistIds.length,
  tabs = document.getElementsByClassName("button"),
  currentTab,
  currentTabName,
  playlistNames = [];

videojs("video_1").ready(function() {
  myPlayer = this;
  // console.log("ready");
  processTab(0);
});

function processTab(index) {
  // console.log("processTab");
  resetTabs();
  document.getElementById("tab" + index).setAttribute("style", "background:#08c;color: #00FFFF; border-bottom: 1px solid #00FFFF;");
  loadPlaylist(playlistIds[index]);
};

function loadPlaylist(currentId) {
  myPlayer.catalog.getPlaylist(currentId, function(error, playlist) {
    myPlayer.catalog.load(playlist);
    myPlayer.playlist.currentItem (0);
  });
};

function resetTabs() {
  var i,
    iMax = tabs.length;
  for (i = 0; i < iMax; i++) {
    tabs[i].setAttribute("style", "background: #0000cc;color: #fff;")
  }
}
