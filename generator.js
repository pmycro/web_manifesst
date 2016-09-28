window.onload =
    function() {
  var params = queryToDictionary();
  var serviceWorker = (params["service_worker"] === "true");
  var name = params["name"];
  var shortName = params["shortName"];
  var scope = params["scope"];
  var display = params["display"];
  var orientation = params["orientation"];
  var startUrl = params["start_url"];
  var themeColor = params["theme_color"];
  var backgroundColor = params["background_color"];
  var icons = stringToArray(params["icons"]);
  var iconSizes = stringToArray(params["iconSizes"]);

  var update = (params["update"] === "true");
  var updateAfterNumPageLoads = parseInt(params["update_after_num_page_loads"]);
  var seed = params["seed"];

  if (update) {
    pageLoadNum = getCookie(seed);
    console.log(pageLoadNum);
    var pageLoadsLeft = updateAfterNumPageLoads - pageLoadNum;
    if (pageLoadsLeft > 0) {
      writeCookie(pageLoadNum + 1, seed);
      update = false;

      var updatesLeftDivTag = document.createElement('div');
      updatesLeftDivTag.innerHTML =
          "Update in " + pageLoadsLeft + " page loads.";
      document.body.append(updatesLeftDivTag);
    } else {
      var updateMessageDivTag = document.createElement('div');
      updateMessageDivTag.innerHTML = "Updated!";
      document.body.append(updateMessageDivTag);
    }
  }

  if (update) {
    serviceWorker = (params['update_service_worker'] === 'true');
    name = params["update_name"];
    shortName = params["update_short_name"];
    scope = params["update_scope"];
    display = params["update_display"];
    orientation = params["update_orientation"];
    startUrl = params["update_start_url"];
    themeColor = params["update_theme_color"];
    backgroundColor = params["update_background_color"];
    icons = params["update_icons"];
    iconSizes = params["update_icon_sizes"];
  }

  if (serviceWorker) {
    registerServiceWorker();
  }

  var manifestJson = generateManifestJson(
      name, shortName, scope, display, orientation, startUrl, themeColor,
      backgroundColor, icons, iconSizes);
  var preTag = document.createElement('pre');
  preTag.innerHTML = manifestJson;
  document.body.append(preTag);
  appendManifestTag(manifestJson);
}

function
queryToDictionary() {
  var query = window.location.search;
  var params = {};
  if (query.length < 1) {
    return params;
  }
  var paramArray = query.substr(1).split("&");
  for (var i = 0; i < paramArray.length; ++i) {
    var keyValue = paramArray[i];
    var colonIndex = keyValue.indexOf("=");
    if (colonIndex <= 0 || colonIndex >= keyValue.lenght - 1) {
      continue;
    }
    var key = keyValue.substr(0, colonIndex);
    var value = keyValue.substr(colonIndex + 1);
    params[key] = value;
  }
  return params;
}

function stringToArray(value) {
  return (value != null && value.length > 0) ? value.split(",") : [];
}

function appendManifestTag(manifest) {
  var linkTag = document.createElement("link");
  linkTag.rel = "manifest";
  linkTag.href = "data:text/plain;" + escape(manifest);
  document.head.append(linkTag);
}

function generateManifestJson(
    name, shortName, scope, display, orientation, startUrl, themeColor,
    backgroundColor, icons, iconSizes) {
  if (!isArray(icons) || !isArray(iconSizes)) {
    return "";
  }

  var manifestStart =
      '{ \n' +
      '  "name": "{{name}}",\n' +
      '  "short_name": "{{short_name}}",\n' +
      '  "scope": "{{scope}}",\n' +
      '  "display": "{{display}}",\n' +
      '  "orientation": "{{orientation}}",\n' +
      '  "start_url": "{{start_url}}",\n' +
      '  "theme_color": "{{theme_color}}",\n' +
      '  "background_color": "{{background_color}}",\n' +
      '  "icons": [\n';
  var iconPart =
      '    {\n' +
      '      "src": "{{src}}",\n' +
      '      "sizes": "{{sizes}}"\n' +
      '    }{{separator}}\n';
  var manifestEnd =
      '  ]\n' +
      '}\n';

  var manifest = manifestStart;
  manifest = replaceValue(manifest, "name", name);
  manifest = replaceValue(manifest, "short_name", shortName);
  manifest = replaceValue(manifest, "scope", scope);
  manifest = replaceValue(manifest, "display", display);
  manifest = replaceValue(manifest, "orientation", orientation);
  manifest = replaceValue(manifest, "start_url", startUrl);
  manifest = replaceValue(manifest, "theme_color", themeColor);
  manifest = replaceValue(manifest, "background_color", backgroundColor);
  var numIcons = Math.min(icons.length, iconSizes.length);
  for (var i = 0; i < numIcons; ++i) {
    manifest += iconPart;
    manifest = replaceValue(manifest, "separator", (i < numIcons - 1) ? "," : "");
    manifest = replaceValue(manifest, "src", icons[i]);
    var size = iconSizes[i];
    manifest = replaceValue(manifest, "sizes", size + "x" + size);
  }
  manifest += manifestEnd;
  return manifest;
}

function replaceValue(template, key, value) {
  var index = template.indexOf("{{"  + key + "}}");
  if (index < 0)
    return template;
  return template.substr(0, index) + value +
      template.substr(index + 4 + key.length);
}

function isArray(test) {
  return test != null && test.constructor == Array;
}

function
registerServiceWorker() {
  navigator.serviceWorker.register('service-worker.js')
}

function getCookie(expectedSeed) {
  console.log(document.cookie);
  var cookieArray = document.cookie.split(';');
  if (cookieArray.length == 0)
    return 0;
  var pair = cookieArray[0].split(',');
  if (pair.length != 2 || pair[1] != expectedSeed)
    return 0;
  if (isNaN(pair[0]))
    return 0;
  return parseInt(pair[0]);
}

function writeCookie(pageLoadNum, seed) {
  var d = new Date();
  d.setTime(d.getTime() + (10 * 24 * 60 * 60 * 1000));
  var cookie = pageLoadNum + ',' + seed + ';expires=' + d.toUTCString();
  document.cookie = cookie;
  console.log(cookie);
  console.log(document.cookie);
}
