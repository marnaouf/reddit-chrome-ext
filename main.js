
// retrieve the url of the active tab
function getUrl(callback) {
  const qInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(qInfo, tabs => {
    const tab = tabs[0];
    const url = tab.url;
    callback(url);
  });

}

function getSearchPage(url) {
  let searchUrl = 'https://reddit.com/search/?type=link&q=' +
    encodeURIComponent('url:' + url);
  chrome.tabs.create({url: searchUrl});
}

// for now this is the callback function used above
// also the function that does everything
function getPost(url) {

  let searchUrl = 'https://reddit.com/search.json?type=link&q=' +
    encodeURIComponent(url);
  let xhttp = new XMLHttpRequest();
  xhttp.open('GET', searchUrl);

  xhttp.responseType = 'json';
  xhttp.onload = function() {

    let response = xhttp.response;

    if (!response || !response.data || !response.data.children ||
      response.data.children.length === 0) {
      // the link has not been shared. print this on the popup or go
      // straight to the submit page
      // temporarily just take u to reddit home page
      let submitUrl = 'https://reddit.com/submit/?url=' +
        encodeURIComponent(url);
      chrome.tabs.create({url:submitUrl});
      console.log(response);
      return;
    }
    let topResult = response.data.children[0].data;
    let topResultUrl = 'https://www.reddit.com' + topResult.permalink;
    chrome.tabs.create({url : topResultUrl});
    console.log(response.data.children[0]);
  };
  xhttp.send();
}


chrome.browserAction.onClicked.addListener(tab => {
  getUrl(getPost);
});
