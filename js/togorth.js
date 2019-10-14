// namespace
var togorth = {};

// id
togorth.id = 1;

// endpoint
togorth.endpoint = 'https://sparql.orth.dbcls.jp/sparql';

// issue ID
togorth.issueId = function() {
    var id = togorth.id;
    togorth.id++;
    return id;
}

// create tabs
togorth.createTabs = function( tabs ) {
    tabs.forEach( 
        function( element ) {
            title = element.title;
            page = element.page;
            var id = togorth.issueId();
            element.id = id;
            togorth.addTabButton( title, id );
            togorth.addTabContent( page, id );
        }
    );
    var tag = '<div class="tab_rest"></div>';
    $( '#tabs' ).append( tag );

    if( tabs.length > 0 ) {
        togorth.openTab( tabs[ 0 ].id );
    }
}

// add tab button
togorth.addTabButton = function( title, id ) {
    var buttonId = 'tab_button-' + id;
    var tag = '<button id="' + buttonId + '" class="tab_button">' + title + '</button>';
    $( '#tabs' ).append( tag );
    $( '#' + buttonId ).click(
        function() {
            togorth.openTab( id );
        }
    );
}

// add tab content
togorth.addTabContent = function( page, id ) {
    var panelId = 'tab_content-' + id;
    var tag = '<div id="' + panelId + '" class="tab_content"></div>'
    $( '#contents' ).append( tag );
    $( '#' + panelId ).load( page + '.html' );
}

// open tab
togorth.openTab = function( id ) {
    $( '.tab_button' ).css( 'color', 'black' );
    $( '.tab_button' ).css( 'border-bottom', 'none' );
    $( '.tab_button:hover' ).css( 'border-bottom', '2px solid #005cab' );
    $( '.tab_content' ).css( 'display', 'none' );    
    $( '#tab_button-' + id ).css( 'color', '#005cab' );
    $( '#tab_button-' + id ).css( 'border-bottom', '2px solid #005cab' );
    $( '#tab_content-' + id ).css( 'display', 'block' );
}

// submit sparql
togorth.submitSparql = function() {
    var tag = '<h3>Result:</h3><div>Searching...</div>';
    $( '#sparql_result' ).html( tag );

    var sparql = $( '#sparql_text' ).val();

    $.ajax(
        {
            url: togorth.endpoint,
            type: 'GET',
            dataType: 'json',
            data: {
                format: 'application/sparql-results+json',
                query: sparql
            }
        }
    ).then(
        function( result ) {
            var headers = togorth.getHeaders( result );
            var rows = togorth.getResult( result, headers );
            togorth.createSparqlResultTable( headers, rows );
        }
    );
}

// headers
togorth.getHeaders = function( result ) {
    var headers = [];
    result.head.vars.forEach(
        function( element ) {
            headers.push( element );
        }
    );
    return headers;
}

// results
togorth.getResult = function( result, headers ) {
    var array = [];
    result.results.bindings.forEach(
        function( element ) {
            var row = {};
            headers.forEach(
                function( header ) {
                    var value = element[ header ].value;
                    row[ header ] = value;
                }
            );
            array.push( row );
        }
    );
    return array;
}

// sparql result table
togorth.createSparqlResultTable = function( headers, result ) {
    var tag = '<h3>Result:</h3><table id="sparql_result_table"></table>';
    $( '#sparql_result' ).html( tag );

    tag = '<tr>';
    headers.forEach(
        function( header ) {
            tag += '<th>' + header + '</th>'
        }
    );
    tag += '</tr>';
    $( '#sparql_result_table' ).append( tag );

    result.forEach(
        function( row ) {
            tag = '<tr>'
            headers.forEach( 
                function( header ) {
                    tag += '<td>' + row[ header ] + '</td>';
                }
            );
            tag += '</tr>'
            $( '#sparql_result_table' ).append( tag );
        }
    );
}

// create db table
togorth.createDbTable = function( id ) {
    var no = 1;
    $.ajax(
        {
            url: 'https://spreadsheets.google.com/feeds/list/1dku2zss1K3h0dE8yuZ29tgURDK0L4Q5FvlyNK-BImyo/od6/public/values',
            type: 'GET',
            dataType: 'json',
            data: {
                alt: 'json'
            }
        }
    ).then(
        function( result ) {
            var tag = '<tr><th>No.</th><th>Name</th><th>Company/ Organization</th><th>First Release</th><th>Model</th><th>Implementation</th><th>Query Language</th><th>Source code</th><th>Remarks</th></tr>'
            $( '#' + id ).html( tag );
            result.feed.entry.forEach(
                function( entry ) {
                    var obsolete = '';
                    if( 'gsx$obsolete' in entry ) {
                        obsolete = entry[ 'gsx$obsolete' ][ '$t' ];
                    }

                    if( obsolete != '1' ) {
			var object = togorth.getDbObject( entry.content.$t );
			object.no = no;
			var lineTag = togorth.createDbLineTag( object );
			$( '#' + id ).append( lineTag );
			no++;           
		    }             
                }
            );
        }
    );
}

// get DB object
togorth.getDbObject = function ( string ) {
    var object = {};
    var array = string.split( ',' );
    var prevKey = null;
    
    array.forEach(
        function( element ) {
            var index = element.indexOf( ':' );
            if( index >= 0 ) {
                var key = element.substr( 0, index ).trim();
                var value = element.substr( index + 1 ).trim();
                object[ key ] = value;
                prevKey = key;
            }
            else {
                if( prevKey != null ) {
                    object[ prevKey ] = object[ prevKey ] + ', ' + element.trim();
                }
            }
        }
    );

    return object;
}

// create DB line tag
togorth.createDbLineTag = function( object ) {
    var keys = [ 
        'no', 'name', 'company', 'firstrelease', 'datamodel', 'implementation', 'querylanguage', 'sourcecode', 'comment'
    ]
    var tag = togorth.createLineTag( object, keys );
    return tag;
}

// create line tag
togorth.createLineTag = function( object, keys ) {
    var tag = '';
    keys.forEach(
        function( key ) {
            if( key in object ) {
                var value = object[ key ];
                if( key === 'name' ) {
                    var url = object.url;
		    if( url != null ) {
			value = '<a href="' + url + '" target="_blank">' + value + '</a>';
		    }
                }
                if( key === 'sourcecode' ) {
                    value = '<a href="' + value + '" target="_blank">' + value + '</a>';
                }
                tag += '<td>' + value + '</td>'
            }
            else {
                tag += '<td></td>';
            }
        }
    );
    tag = '<tr>' + tag + '</tr>';
    return tag;
}

// create db table
togorth.createLinkTable = function( id ) {
    var tag = '<tr><th>Name</th><th>URL</th></tr>';
    $( '#' + id ).html( tag );
    $.getJSON(
        'json/links.json',
        function( data ) {
            data.forEach(
                function( element ) {
                    var tag = togorth.createLineTag( element, [ 'name', 'url' ] );
                    $( '#' + id ).append( tag );
                }
            );
        }
    );
}

// create reference table
togorth.createReferenceTable = function( id ) {
    var tag = '<tr><th>Authors</th><th>Year</th><th>Title</th><th>Journal</th></tr>';
    $( '#' + id ).html( tag );
    $.getJSON(
        'json/references.json',
        function( data ) {
            data.forEach(
                function( element ) {
                    var keys = [ 'authors', 'year', 'title', 'journal' ];
                    var tag = togorth.createLineTag( element, keys );
                    $( '#' + id ).append( tag );
                }
            );
        }
    );
}

