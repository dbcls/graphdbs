// namespace
ortholog = {};

ortholog.maxId = 0;

// create groups query
ortholog.createGroupsQuery = function( term ) {
    var query = 'PREFIX orth: <http://purl.jp/bio/11/orth#> '
              + 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '
              + 'PREFIX dct: <http://purl.org/dc/terms/> '
              + 'select distinct ?id ?label from <http://purl.org/net/orthordf/hOP> where { '
              + '    ?group a orth:OrthologGroup ; '
              + '       rdfs:label ?label ; '
              + '       dct:identifier ?id . ';

    if( term !== undefined && term !== null && term !== '' ) {
        query = query + "filter( contains( ?label, '" + term + "' ) || contains( str( ?id ), '" + term  + "' ) ). ";
    }
    query = query + '} order by ?id';
    return query;
}

// create groups query
ortholog.createGeneGroupsQuery = function( symbol ) {
    var query = 'PREFIX orth: <http://purl.jp/bio/11/orth#> '
              + 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '
              + 'PREFIX dct: <http://purl.org/dc/terms/> '
              + 'select distinct ?id from <http://purl.org/net/orthordf/hOP> where { '
              + "    values ?gene_label { '" + symbol + "' } . "
              + '    ?group a orth:OrthologGroup ; '
              + '       rdfs:label ?label ; '
              + '       dct:identifier ?id ; '
              + '       orth:member ?gene . '
              + '    ?gene rdfs:label ?gene_label . '
              + "} order by ?id";
    return query;
}

// create genes property
ortholog.createGenesQuery = function( term ) {
    var query = 'PREFIX orth: <http://purl.jp/bio/11/orth#> '
              + 'PREFIX hop: <http://purl.org/net/orthordf/hOP/ontology#> '
              + ' SELECT ?description ?symbol '
              + 'WHERE { '
              + '    ?gene a orth:Gene ; '
              + '    hop:symbol ?symbol ; '
              + '    hop:description ?description . ';
    if( term !== undefined && term !== null && term !== '' ) {
        var keyword = term.toLowerCase();
        query = query + "filter( contains( lcase( ?symbol ), '" + keyword + "' ) || contains( lcase( ?description ), '" + keyword  + "' ) ). ";
    }
    query = query + '} order by ?symbol';
    return query;
}    

// create detail query
ortholog.createDetailQuery = function( groupId ) {
    var query = 'PREFIX orth: <http://purl.jp/bio/11/orth#> '
              + 'PREFIX dct: <http://purl.org/dc/terms/> '
              + 'PREFIX hop: <http://purl.org/net/orthordf/hOP/ontology#> '
              + 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '
              + 'PREFIX group: <http://purl.org/net/orthordf/hOP/group/> '
              + 'select distinct ?common_id ?scientific_name ?common_name ?comment ?time where { '
              + '   values ( ?group )  { ( group:' + groupId + ' ) } '
              + '   ?group orth:organism ?organism . '
              + '   ?organism rdfs:label ?scientific_name ; '
              + '             dct:identifier ?common_id ; '
              + '             dct:description ?common_name ; '
              + '             rdfs:comment ?comment ; '
              + '             hop:branchTimeMya ?time . '
              + '} order by ?common_id';
    return query;
}

// create max id query
ortholog.createMaxQuery = function() {
    var query = 'PREFIX orth: <http://purl.jp/bio/11/orth#> '
              + 'PREFIX dct: <http://purl.org/dc/terms/> '
              + 'PREFIX hop: <http://purl.org/net/orthordf/hOP/ontology#> '
              + 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '
              + 'select max( ?common_id ) as ?max_id where { '
              + '    ?orthogroup a orth:OrthologGroup ; '
              + '        orth:organism ?organism . '
              + '    ?organism rdfs:label ?scientific_name ; '
              + '        dct:identifier ?common_id . '
              + '}';
    return query;
}

// create hit query
ortholog.createHitQuery = function( groupId ) {
    var query = 'PREFIX dct: <http://purl.org/dc/terms/> '
              + 'PREFIX hop: <http://purl.org/net/orthordf/hOP/ontology#> '
              + 'PREFIX group: <http://purl.org/net/orthordf/hOP/group/> '
              + 'SELECT ?group ?group_id ?score '
              + 'WHERE { '
              + '    VALUES (?query_group) { (group:' + groupId + ') } '
              + '    ?pair hop:group ?query_group ; '
              + '        hop:group ?group ; '
              + '        hop:score ?score . '
              + '    ?group dct:identifier ?group_id . '
              + 'FILTER (?query_group != ?group) '
              + '} ORDER BY DESC(?score) DESC(?group_id)';
    return query;              
}

// show group
ortholog.showSearchResult = function( groupId ) {
    $( '#search_result' ).html( '' );
    $( '#search_result' ).append( '<tr id="origin_tr" style="padding: 3px;"></tr> ');
    $( '#origin_tr' ).append( '<td style="white-space: nowrap;">Group ' + groupId + '</td>' );
    $( '#origin_tr' ).append( '<td style="white-space: nowrap; align: center"></td>' );
    $( '#origin_tr' ).append( '<td id="origin_chart"></td>' );
    ortholog.draw( groupId, 'origin_chart' );

    $.ajax(
       {
           url: 'https://sparql.orth.dbcls.jp/sparql',
           type: 'GET',
           dataType: 'json',
           data: {
               format: 'application/sparql-results+json',
               query: ortholog.createHitQuery( groupId )
           }
       }
    ).then(
        function( result ) {
            result.results.bindings.forEach(
                function( element ) {
                    var group = element.group_id.value;
                    var score = element.score.value;
                    var id = 'tr_' + group;
                    var tag = '<tr id="' + id + '" style="padding: 3px;" ><td style="white-space: nowrap">Group ' + group + '</td><td style="white-space: nowrap;">[Score=' + score + ']</td><td id="' + id + '_chart"></td></tr>';
                    $( '#search_result' ).append( tag );
                    ortholog.draw( group, id + '_chart' );
                }
            );
        }
    );    
}

// draw
ortholog.draw = function( groupId, area ) {
    var height = 20;
    var borderWidth = 3;
    var width = borderWidth * ortholog.maxId;
    $.ajax(
       {
           url: 'https://sparql.orth.dbcls.jp/sparql',
           type: 'GET',
           dataType: 'json',
           data: {
               format: 'application/sparql-results+json',
               query: ortholog.createDetailQuery( groupId )
           }
       }
    ).then(
        function( result ) {
            var id = area + '_svg';
            var tag = '<svg id="' + id + '" width="' + width + '" height="' + height + '" '
                    + 'style="border: 1px solid black;" id="' + id + '" viewBox="0 0 ' + width + ' ' + height + '"></svg>';
            $( '#' + area ).append( tag );
            result.results.bindings.forEach(
                function( element ) {
                    var comment = element.comment.value;
                    var commonId = parseInt( element.common_id.value );
                    var commonName = element.common_name.value;
                    var scientificName = element.scientific_name.value;
                    var time = parseFloat( element.time.value );
                    var color = ortholog.getColor( comment );
                    var title = "ID: " + commonId + "\n"
                              + "Scientific Name: " + scientificName + "\n"
                              + "Common Name: " + commonName + "\n"
                              + "Comment: " + comment + "\n"
                              + "Time: " + time;
                    var tag = '<rect x="' + ( ( commonId - 1 ) * borderWidth ) + '" '
                            + 'y="0" width="' + borderWidth + '" '
                            + 'height="' + height + '" '
                            + 'fill="' + color + '" stroke="none" title="' + title + '"></rect>';
                    $( '#' + id ).append( tag );
                }
            );
            $( '#' + id ).html( $( '#' + id ).html() );
        }
    );
}

// create select
ortholog.createGenesSelect = function( term ) {
    $( '#gene-selection' ).select2(
        {
            ajax: {
                type: 'POST',
                url: 'https://sparql.orth.dbcls.jp/sparql',
                data: function( params ) {
                    var term = params.term;
                    var query = ortholog.createGenesQuery( term );
                    var data = {
                        format: 'application/sparql-results+json',
                        query: query
                    };
                    return data;
                },
                processResults: function( result ) {
                    array = [];
                    result.results.bindings.forEach(
                        function( element ) {
                            var symbol = element.symbol.value;
                            var description = element.description.value;
                            array.push( { id: symbol, text: symbol + ' : ' + description } );
                        }
                    );
                    return { results: array };
                }
            },
            tags: true
        }
    );
}

// create group page
ortholog.createGroupPage = function() {
    ortholog.createGenesSelect();
    $( '#gene-selection' ).change( 
        function() {
            ortholog.onChangeGene();
        }
    );

    $.ajax(
       {
           url: 'https://sparql.orth.dbcls.jp/sparql',
           type: 'GET',
           dataType: 'json',
           data: {
               format: 'application/sparql-results+json',
               query: ortholog.createMaxQuery()
           }
       }
    ).then(
        function( result ) {
            ortholog.maxId = parseInt( result.results.bindings[ 0 ].max_id.value );
        }
    );
}

// on change gene
ortholog.onChangeGene = function() {
    $( '#search_area' ).css( 'display', 'none' );
    var symbol = $( '#gene-selection' ).val();
    $.ajax(
       {
           url: 'https://sparql.orth.dbcls.jp/sparql',
           type: 'GET',
           dataType: 'json',
           data: {
               format: 'application/sparql-results+json',
               query: ortholog.createGeneGroupsQuery( symbol )
           }
       }
    ).then(
        function( result ) {
            $( '#result' ).html( '' );
            result.results.bindings.forEach(
                function( element ) {
                    var id = parseInt( element.id.value );
                    var trId = 'result_tr_' + id;
                    var tag = '<tr id="' + trId + '"></tr>';
                    $( '#result' ).append( tag );
                    $( '#' + trId ).append( '<td style="whitespace: nowrap;">Group ' + id + '</td>' );
                    $( '#' + trId ).append( '<td id="' + trId + '_chart"></td>' );
                    $( '#' + trId ).append( '<td><button id="' + trId + '_button">Search</button></td>' );
                    ortholog.draw( id, trId + '_chart' );
                    $( '#' + trId + '_button' ).click( 
                        function() {
                            ortholog.onSearchButton( id );
                        }
                    );
                }
            );
        }
    );    
}

// on search button
ortholog.onSearchButton = function( id ) {
    $( '#search_area' ).css( 'display', 'block' );
    ortholog.showSearchResult( id );
}

// on change group
ortholog.onChangeGroup = function() {
    var groupId = $( '#group-selection' ).val();
    ortholog.showGroup( groupId );
}

// get color
ortholog.getColor = function( comment ) {
    var color = 'navy';
    if( comment == 'Mammals' ) {
        color = '#31292b';
    }
    else if( comment == 'Other vertebrates' ) {
        color = '#515153';
    }
    else if( comment == 'Lancelets/tunicates' ) {
        color = '#6a6c6e';
    }
    else if( comment == 'Echinoderms/hemichordata' ) {
        color = '#929396';
    }
    else if( comment == 'Arthropods' ) {
        color = '#00b6ae';
    }
    else if( comment == 'Nematodes' ) {
        color = '#008dcb';
    }
    else if( comment == 'Cnidaria' ) {
        color = '#84460a';
    }
    else if( comment == 'Sponge/Placozoa' ) {
        color = '#995c2e';
    }
    else if( comment == 'Choanoflagellates' ) {
        color = '#c98c5c';
    }
    else if( comment == 'Fungi' ) {
        color = '#ffb83d';
    }
    else if( comment == 'Amoebozoa' ) {
        color = '#e2e100';
    }
    else if( comment == 'Plantae' ) {
        color = '#82cd44';
    }
    else if( comment == 'Other protists' ) {
        color = '#f11831';
    }

    return color;
}
