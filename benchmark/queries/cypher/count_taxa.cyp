MATCH (n:Taxon)
RETURN COUNT(n)


// PREFIX taxon: <http://ddbj.nig.ac.jp/ontologies/taxonomy/>

// SELECT (COUNT(?taxid) AS ?count)
// FROM <http://ddbj.nig.ac.jp/ontologies/taxonomy/>
// WHERE {
//   ?taxid a taxon:Taxon .
// }

