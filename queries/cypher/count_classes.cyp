MATCH (n:Resource)
RETURN DISTINCT count(labels(n)), labels(n)



// SELECT (COUNT(?instance) AS ?count) ?class
// FROM <http://ddbj.nig.ac.jp/ontologies/taxonomy/>
// WHERE {
//   ?instance a ?class .
// }
// GROUP BY ?class
// ORDER BY DESC(?count)
