MATCH  (species:Resource)-[:subClassOf*1..]->(:Resource {uri:'http://identifiers.org/taxonomy/40674'}),
      (species:Resource)-[:rank]->(taxon:Resource {uri:'http://ddbj.nig.ac.jp/ontologies/taxonomy/Species'})
MATCH
      (species)-[:subClassOf*1..]->(family:Resource)-[:rank]->
        (:Resource {uri:'http://ddbj.nig.ac.jp/ontologies/taxonomy/Family'})
MATCH
      (species)-[:subClassOf*1..]->(order:Resource)-[:rank]->(:Resource {uri:'http://ddbj.nig.ac.jp/ontologies/taxonomy/Order'})
RETURN
order.uri, order.label, family.uri, family.label, species.uri, species.label


// PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
// PREFIX taxid: <http://identifiers.org/taxonomy/>
// PREFIX taxon: <http://ddbj.nig.ac.jp/ontologies/taxonomy/>

// SELECT ?order ?order_name ?family ?family_name ?species ?name
// FROM <http://ddbj.nig.ac.jp/ontologies/taxonomy/>
// WHERE {
//   ?species taxon:rank taxon:Species ;
//       rdfs:label ?name ;
//       rdfs:subClassOf+ taxid:40674 ;
//       rdfs:subClassOf+ ?family ;
//       rdfs:subClassOf+ ?order .
//   ?family taxon:rank taxon:Family ;
//       rdfs:label ?family_name .
//   ?order taxon:rank taxon:Order ;
//       rdfs:label ?order_name .
// }
// ORDER BY ?order_name ?family_name ?name

