function createAndNavigateToTestPage() {
  var url = "generated.html" + generateQuery();
  window.location.href = url;
}

function generateQuery() {
  var query = "?";
  query += generateQueryParamsForCheckboxes(['service_worker']);
  query += generateQueryParamsForTextFields([
    'name', 'short_name', 'scope', 'display', 'orientation', 'start_url',
    'theme_color', 'background_color'
  ]);
  query += generateIconQueryParams('');

  query += generateQueryParamsForCheckboxes(['update', 'update_service_worker']);
  query += generateQueryParamsForTextFields([
    'update_after_num_page_loads', 'update_name', 'update_short_name',
    'update_scope', 'update_display', 'update_orientation', 'update_start_url',
    'update_theme_color', 'update_background_color'
  ]);
  query += generateIconQueryParams('update_');
  query += "seed=" + randInt(1000);
  return query;
}

function generateIconQueryParams(prefix) {
  var icons = [];
  var iconSizes = [];
  if (isCheckboxChecked(prefix + 'icon_circle_32')) {
    icons.push('icons/circle_32.png');
    iconSizes.push(32);
  }
  if (isCheckboxChecked(prefix + 'icon_triangle_48')) {
    icons.push('icons/triangle_48.png');
    iconSizes.push(48);
  }
  if (isCheckboxChecked(prefix + 'icon_square_64')) {
    icons.push('icons/square_64.png');
    iconSizes.push(64);
  }
  if (isCheckboxChecked(prefix + 'icon_pentagon_128')) {
    icons.push('icons/pentagon_128.png');
    iconSizes.push(128);
  }
  if (isCheckboxChecked(prefix + 'icon_hexagon_256')) {
    icons.push('icons/hexagon_256.png');
    iconSizes.push(256);
  }
  return prefix + 'icons=' + icons.join(',') + '&' + prefix + 'iconSizes=' +
      iconSizes.join(',') + '&';
}

function generateQueryParamsForCheckboxes(keys) {
  var params = '';
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    params += key + '=' + isCheckboxChecked(key) + '&';
  }
  return params;
}

function generateQueryParamsForTextFields(keys) {
  var params = '';
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    params += key + '=' + getTextFieldValue(key) + '&';
  }
  return params;
}

function getTextFieldValue(id) {
  var element = getElement(id);
  return (element != null) ? element.value : null;
}

function isCheckboxChecked(id) {
  var element = getElement(id);
  return (element != null) ? element.checked : false;
}

function getElement(id) {
  return document.getElementById(id);
}

function randInt(max) {
  return Math.floor(Math.random() * max);
}
