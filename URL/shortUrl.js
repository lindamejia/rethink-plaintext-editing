// //3. Given any URL, shorten it and return a globally unique URL back to the user. Make sure to call out any assumptions and / or limitations in your solution.

//Assumptions: jsonstore.io is being used as my databse, I am generating a unique hash, and then storing a new record into this databse with that url, and that hash. 

var endpoint =
  'https://www.jsonstore.io/8ba4fd855086288421f770482e372ccb5a05d906269a34da5884f39eed0418a1';

function getrandom() {
  var random_string =
    Math.random()
      .toString(32)
      .substring(2, 5) +
    Math.random()
      .toString(32)
      .substring(2, 5);
  return random_string();
}

//Should Use Rgegx Instead
function geturl() {
  var url = document.getElementById('urlinput').value;
  var protocol_ok =
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('ftp://');
  if (!protocol_ok) {
    newurl = 'http://' + url;
    return newurl;
  } else {
    return url;
  }
}

function genhash() {
  if (window.location.hash == '') {
    window.location.hash = getrandom();
  }
}

function shorturl() {
  var longurl = geturl();
  genhash();
  send_request(longurl);
}

//we call the send_request() with an argument longurl. In this function a JSON request is being sent to jsonstore to store the long URL with a link to short URL.

function send_request(url) {
  this.url = url;
  $.ajax({
    url: endpoint + '/' + window.location.hash.substr(1),
    type: 'POST',
    data: JSON.stringify(this.url),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8'
  });
}

var hashh = window.location.hash.substr(1);
if (window.location.hash != '') {
  $.getJSON(endpoint + '/' + hashh, function(data) {
    data = data['result'];
    if (data != null) {
      window.location.href = data;
    }
  });
}

console.log(shorturl());