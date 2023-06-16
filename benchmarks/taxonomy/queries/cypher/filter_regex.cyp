MATCH (taxid:Resource)
WHERE taxid.label =~ '.*Homo .*'
RETURN taxid


// PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

// SELECT *
// FROM <http://ddbj.nig.ac.jp/ontologies/taxonomy/>
// WHERE {
//   ?taxid rdfs:label ?label .
//   FILTER regex(?label, "Homo ")
// }

