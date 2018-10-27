var myPlayer,
  // +++ Set up data for CMS API request +++
  // Build options needed for CMS API request
    options = {},
    baseURL = "https://cms.api.brightcove.com/v1/accounts/",
    accountId = "1752604059001";

options.proxyURL = "https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php";
options.requestType = "GET",
  // return the 10 newest videos created
  endPoint = "?sort=-created_at&limit=10";
options.url = baseURL + accountId + "/videos" + endPoint;

videojs("myPlayerID").ready(function() {
  (myPlayer = this),
    (requestData = {}),
    (newestVideos = []),
    (videoData = []),
    (videoObjects = []);

  // +++ Make the CMS API request to get matching video IDs +++
  makeRequest(options, function (newestVideos) {
    // Convert response string into JSON
		JSONnewestVideos = JSON.parse(newestVideos);
    // extract the needed video data into an array
    videoData = extractVideoData(JSONnewestVideos);
    getVideoData(videoData, function(videoObjects) {
      // add the newest videos list to the player as a playlist
      myPlayer.playlist(videoObjects);
    });
  });
});

// +++ Makes actual call for data +++
/**
	* send API request to the proxy
	* @param  {Object} options for the request
	* @param  {String} options.url the full API request URL
	* @param  {String="GET","POST","PATCH","PUT","DELETE"} requestData [options.requestType="GET"] HTTP type for the request
	* @param  {String} options.proxyURL proxyURL to send the request to
	* @param  {String} options.client_id client id for the account (default is in the proxy)
	* @param  {String} options.client_secret client secret for the account (default is in the proxy)
	* @param  {JSON} [options.requestBody] Data to be sent in the request body in the form of a JSON string
	* @param  {Function} [callback] callback function that will process the response
	*/
function makeRequest(options, callback) {
  var httpRequest = new XMLHttpRequest(),
      response,
      requestParams,
      dataString,
      proxyURL = options.proxyURL,
      // response handler
      getResponse = function() {
        try {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status >= 200 && httpRequest.status < 300) {
              response = httpRequest.responseText;
              // some API requests return '{null}' for empty responses - breaks JSON.parse
              if (response === "{null}") {
                response = null;
              }
              // return the response
              callback(response);
            } else {
              alert(
                "There was a problem with the request. Request returned " +
                httpRequest.status
              );
            }
          }
        } catch (e) {
          alert("Caught Exception: " + e);
        }
      };
   /**
     * set up request data
	   * the proxy used here takes the following request body:
	   * JSON.strinify(options)
	   */
  // set response handler
  httpRequest.onreadystatechange = getResponse;
  // open the request
  httpRequest.open("POST", proxyURL);
  // set headers if there is a set header line, remove it
  // open and send request
  httpRequest.send(JSON.stringify(options));
}

// +++ Standard code to extract videos from returned data +++
	/**
	* extract video data from CMS API response
	* @param {array} cmsData the data from the CMS API
	* @return {array} videoData array of video info
	*/
function extractVideoData(cmsData) {
  var i,
      iMax = cmsData.length,
      videoItem,
      videoDataForReturn = [];
  for (i = 0; i < iMax; i++) {
    if (cmsData[i].id !== null) {
      videoItem = {};
      videoItem.id = cmsData[i].id;
      videoDataForReturn.push(videoItem);
    }
  }
  return videoDataForReturn;
}

// +++ Get video objects from IDs +++
/**
	* get video objects
	* @param {array} videoIds array of video ids
	* @return {array} videoData array of video objects
	*/
function getVideoData(videoIds, callback) {
  var i = 0,
      iMax = videoIds.length,
      videoObjectsForReturn = [];
/**
  * Makes catalog calls for all video ids in the array
	*/
  getVideo();

  function getVideo() {
    if (i < iMax) {
      myPlayer.catalog.getVideo(videoIds[i].id, pushData);
    } else {
      callback(videoObjectsForReturn);
    }
  }

  // +++ Place video objects in array +++
  /**
	 * callback for the catalog calls
	 * pushes the returned data object into an array
	 * @param {string} error error returned if the call fails
	 * @parap {object} video the video object
	 */
  function pushData(error, video) {
    videoObjectsForReturn.push(video);
    i++;
    getVideo();
  }
}
