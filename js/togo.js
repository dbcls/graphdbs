// namespace
var togo = {};

// id
togo.id = 1;

// issue ID
togo.issueId = function () {
  var id = togo.id;
  togo.id++;
  return id;
}

// create tabs
togo.createTabs = (tabs) => {
  tabs.forEach((element) => {
    title = element.title;
    page = element.page;
    const id = togo.issueId();
    element.id = id;
    togo.addTabButton(title, id);
    togo.addTabContent(page, id);
  });
  const tag = '<div class="tab_rest"></div>';
  $('#tabs').append(tag);

  if (tabs.length > 0) {
    togo.openTab(tabs[0].id);
  }
}

// add tab button
togo.addTabButton = function (title, id) {
  var buttonId = 'tab_button-' + id;
  var tag = '<button id="' + buttonId + '" class="tab_button">' + title + '</button>';
  $('#tabs').append(tag);
  $('#' + buttonId).click(
    function () {
      togo.openTab(id);
    }
  );
}

// add tab content
togo.addTabContent = function (page, id) {
  var panelId = 'tab_content-' + id;
  var tag = '<div id="' + panelId + '" class="tab_content"></div>'
  $('#contents').append(tag);
  $('#' + panelId).load(page + '.html');
}

// open tab
togo.openTab = function (id) {
  $('.tab_button').css('color', 'black');
  $('.tab_button').css('border-bottom', 'none');
  $('.tab_button:hover').css('border-bottom', '2px solid #005cab');
  $('.tab_content').css('display', 'none');
  $('#tab_button-' + id).css('color', '#005cab');
  $('#tab_button-' + id).css('border-bottom', '2px solid #005cab');
  $('#tab_content-' + id).css('display', 'block');
}

// headers
togo.getHeaders = function (result) {
  var headers = [];
  result.head.vars.forEach(
    function (element) {
      headers.push(element);
    }
  );
  return headers;
}

// results
togo.getResult = function (result, headers) {
  var array = [];
  result.results.bindings.forEach(
    function (element) {
      var row = {};
      headers.forEach(
        function (header) {
          var value = element[header].value;
          row[header] = value;
        }
      );
      array.push(row);
    }
  );
  return array;
}

// create db table
togo.createDbTable = function (id) {
  var no = 1;
  $.ajax(
    {
      url: 'https://sheets.googleapis.com/v4/spreadsheets/1dku2zss1K3h0dE8yuZ29tgURDK0L4Q5FvlyNK-BImyo/values/A1:ZZ256?key=AIzaSyDjDVUwbN8fcUrNrCFH1JgoIg-oot7UYNA',
      type: 'GET',
      dataType: 'json',
      data: {
        alt: 'json'
      }
    }
  ).then(
    function (result) {
      var tag = '<tr><th>No.</th><th>Name</th><th>Company/ Organization</th><th>First Release</th><th>Model</th><th>Implementation</th><th>Query Language</th><th>Source code</th><th>History</th></tr>'
      $('#' + id).html(tag);
      console.log(result);
      result.feed.entry.forEach(
        function (entry) {
          var hide = '';
          if ('gsx$hide' in entry) {
            hide = entry['gsx$hide']['$t'];
          }

          if (hide != '1') {
            var object = togo.getDbObject(entry.content.$t);
            object.no = no;
            var lineTag = togo.createDbLineTag(object);
            $('#' + id).append(lineTag);
            no++;
          }
        }
      );
    }
  );
}

// get DB object
togo.getDbObject = function (string) {
  var object = {};
  var array = string.split(',');
  var prevKey = null;

  array.forEach(
    function (element) {
      var index = element.indexOf(':');
      if (index >= 0) {
        var key = element.substr(0, index).trim();
        var value = element.substr(index + 1).trim();
        object[key] = value;
        prevKey = key;
      } else {
        if (prevKey != null) {
          object[prevKey] = object[prevKey] + ', ' + element.trim();
        }
      }
    }
  );

  return object;
}

// create DB line tag
togo.createDbLineTag = function (object) {
  var keys = [
    'no', 'name', 'company', 'firstrelease', 'datamodel', 'implementation', 'querylanguage', 'sourcecode', 'comment'
  ]
  var tag = togo.createLineTag(object, keys);
  return tag;
}

// create line tag
togo.createLineTag = function (object, keys) {
  var tag = '';
  keys.forEach(
    function (key) {
      if (key in object) {
        var value = object[key];
        if (key === 'name') {
          var url = object.url;
          if (url != null) {
            value = '<a href="' + url + '" target="_blank">' + value + '</a>';
            // value = '<img src="img/jena.png" height="50" />';
          }
        }
        if (key === 'sourcecode') {
          value = '<a href="' + value + '" target="_blank">' + 'GitHub' + '</a>';
        }
        tag += '<td>' + value + '</td>'
      } else {
        tag += '<td></td>';
      }
    }
  );
  tag = '<tr>' + tag + '</tr>';
  return tag;
}

// create db table
togo.createLinkTable = function (id) {
  var tag = '<tr><th>Name</th><th>URL</th></tr>';
  $('#' + id).html(tag);
  $.getJSON(
    'json/links.json',
    function (data) {
      data.forEach(
        function (element) {
          var tag = togo.createLineTag(element, ['name', 'url']);
          $('#' + id).append(tag);
        }
      );
    }
  );
}

// create paper table
togo.createPaperTable = function (id) {
  var no = 1;
  $.ajax(
    {
      url: 'https://sheets.googleapis.com/v4/spreadsheets/1QNBD67P-CUbmz_NNOkikNYsuV2bL9zzauToFDZeLib4/values/A1:ZZ256?key=AIzaSyDjDVUwbN8fcUrNrCFH1JgoIg-oot7UYNA',
      type: 'GET',
      dataType: 'json',
      data: {
        alt: 'json'
      }
    }
  ).then(
    function (result) {
      var tag = '<tr><th>Tag</th><th>Year</th><th>Paper</th></tr>'
      $('#' + id).html(tag);
      result.feed.entry.forEach(
        function (entry) {
          console.log(entry);
          var tag = entry['gsx$tag']['$t'];
          var paper = entry['gsx$paper']['$t'];
          var year = entry['gsx$year']['$t'];
          var url = entry['gsx$url']['$t'];
          var lineTag = togo.createPaperLineTag(tag, paper, year, url);
          $('#' + id).append(lineTag);
        }
      );
    }
  );
}

// create paper line tag
togo.createPaperLineTag = function (tag, paper, year, url) {
  var line = '<tr><td>' + tag + '</td><td>' + year + '</td>';
  var paperTag = paper;
  if (url !== '') {
    paperTag = '<a href="' + url + '" target="_blank">' + paperTag + '</a>';
  }
  paperTag = '<td>' + paperTag + '</td>';
  line = line + paperTag + '</tr>';
  return line;
}

// create reference table
togo.createReferenceTable = function (id) {
  var tag = '<tr><th>Authors</th><th>Year</th><th>Title</th><th>Journal</th></tr>';
  $('#' + id).html(tag);
  $.getJSON(
    'json/references.json',
    function (data) {
      data.forEach(
        function (element) {
          var keys = ['authors', 'year', 'title', 'journal'];
          var tag = togo.createLineTag(element, keys);
          $('#' + id).append(tag);
        }
      );
    }
  );
}

