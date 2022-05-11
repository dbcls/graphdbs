MATCH (tax9606:Resource {uri:'http://identifiers.org/taxonomy/9606'}),
      (tax9606)-[:subClassOf*1..]->(ancestor:Resource)
MATCH
      (tax511145:Resource {uri:'http://identifiers.org/taxonomy/511145'}),
      (ancestor)<-[:subClassOf*1..]-(tax511145)
MATCH      
      (ancestor:Resource)-[p]->(o)
RETURN ancestor, p, o



// PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
// PREFIX taxid: <http://identifiers.org/taxonomy/>

// SELECT ?ancestor ?p ?o
// FROM <http://ddbj.nig.ac.jp/ontologies/taxonomy/>
// WHERE {
//   ?ancestor ?p ?o .
//   ?tax1 rdfs:subClassOf ?ancestor .
//   ?tax2 rdfs:subClassOf ?ancestor .
//   taxid:9606 rdfs:subClassOf* ?tax1 .
//   taxid:511145 rdfs:subClassOf* ?tax2 .
//   FILTER(?tax1 != ?tax2)
// }

