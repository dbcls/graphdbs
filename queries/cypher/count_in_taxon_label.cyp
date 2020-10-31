MATCH (taxid:Resource)-[rdfs:subClassOf*..]->(:Resource {label:'Primates'})
RETURN COUNT(DISTINCT(taxid))

/*
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT (COUNT(DISTINCT ?taxid) AS ?count) ?taxon
FROM <http://ddbj.nig.ac.jp/ontologies/taxonomy/>
WHERE {
  ?taxid rdfs:subClassOf* ?taxon .
  ?taxon rdfs:label "Primates" .
} GROUP BY ?taxon
*/
