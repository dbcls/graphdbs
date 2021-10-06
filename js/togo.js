// namespace
let togo = {};

// id
togo.id = 1;

// create tabs
togo.createTabs = (tabs) => {
  tabs.forEach((element) => {
    title = element.title;
    page = element.page;
    const id = togo.id++;
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
  let buttonId = 'tab_button-' + id;
  let tag = `<button id="${buttonId}" class="tab_button">${title}</button>`;
  $('#tabs').append(tag);
  $('#' + buttonId).click(
    () => togo.openTab(id)
  );
}

// add tab content
togo.addTabContent = function (page, id) {
  let panelId = 'tab_content-' + id;
  let tag = `<div id="${panelId}" class="tab_content"></div>`;
  $('#contents').append(tag);
  $('#' + panelId).load(page + '.html');
}

// open tab
togo.openTab = function (id) {
  $('.tab_button').css('color', 'black');
  $('.tab_button').css('border-bottom', 'none');
  $('.tab_button:hover').css('border-bottom', '2px solid #005cab');
  $('.tab_content').css('display', 'none');
  $('#tab_button-' + id).css('color', '#005cab').css('border-bottom', '2px solid #005cab');
  $('#tab_content-' + id).css('display', 'block');
}

// create db table
togo.createDbTable = function (id) {
  $.ajax(
    {
      url: 'json/engines.json',
      type: 'GET',
      dataType: 'json',
      data: {
        alt: 'json'
      }
    }
  ).then(
    function (result) {
      let content = '<thead><tr><th>No.</th><th>Name</th><th>Company/ Organization</th><th>First Release</th>' +
        '<th>Model</th><th>Implementation</th><th>Query Language</th><th>Source code</th><th>History</th></tr></thead>';
      
      result.forEach(
        (row, i) => {
          if(row.Hide !== '1') {
            row.number = i + 1;
            let lineTag = togo.createDbLineTag(row);
            content += lineTag;
          }
        }
      );
      $( '#' + id ).html(content).tablesorter({
        headers: {
          7: {
            sorter: false
          }
        }
      });
    }
  );
}

// create DB line tag
togo.createDbLineTag = function (object) {
  let keys = [
    'number', 'Name', 'Company', 'First release', 'Data model', 'Implementation', 'Query language', 'Source code', 'Comment'
  ]
  let tag = togo.createLineTag(object, keys);
  return tag;
}

// create line tag
togo.createLineTag = function (object, keys) {
  let tag = '';
  keys.forEach(
    (key) => {
      if (key in object) {
        let value = object[key];
        if (key === 'Name') {
          let url = object.URL;
          if (url != null) {
            value = `<a href="${url}" target="_blank">${value}</a>`;
            // value = '<img src="img/jena.png" height="50" />';
          }
        }
        if (key === 'Source code') {
          value = `<a href="${value}" target="_blank">GitHub</a>`;
        }
        tag += `<td>${value}</td>`;
      } else {
        tag += '<td></td>';
      }
    }
  );
  tag = `<tr>${tag}</tr>`;
  return tag;
}

// create db table
togo.createLinkTable = function (id) {
  let tag = '<tr><th>Name</th><th>URL</th></tr>';
  $('#' + id).html(tag);
  $.getJSON(
    'json/links.json',
    (data) => {
      data.forEach(
        (element) => {
          let tag = togo.createLineTag(element, ['name', 'url']);
          $('#' + id).append(tag);
        }
      );
    }
  );
}

// create paper table
togo.createPaperTable = function (id) {
  $.ajax(
    {
      url: 'json/references.json',
      type: 'GET',
      dataType: 'json',
      data: {
        alt: 'json'
      }
    }
  ).then(
    function (result) {
      let content = '<thead><tr><th>Tag</th><th>Year</th><th>Paper</th></tr></thead>';
      result.forEach(
        (row) => {
          content += togo.createPaperLineTag(row.Tag, row.Paper, row.Year, row.URL);
        }
      );
      $( '#' + id ).html(content).tablesorter();
    }
  );
}

// create paper line tag
togo.createPaperLineTag = function (tag, paper, year, url) {
  let paperTag = paper;
  if (url !== '') {
    paperTag = `<a href="${url}" target="_blank">${paperTag}</a>`;
  }
  paperTag = `<td>${paperTag}</td>`;
  return `<tr><td>${tag}</td><td>${year}</td>${paperTag}</tr>`;
}

// create reference table
togo.createReferenceTable = function (id) {
  let tag = '<tr><th>Authors</th><th>Year</th><th>Title</th><th>Journal</th></tr>';
  $('#' + id).html(tag);
  $.getJSON(
    'json/references.json',
    (data) => {
      data.forEach(
        function (element) {
          let keys = ['authors', 'year', 'title', 'journal'];
          let tag = togo.createLineTag(element, keys);
          $('#' + id).append(tag);
        }
      );
    }
  );
}

