MATCH (tax:Resource)-[r:subClassOf*..]->(n2:Resource {uri:'http://identifiers.org/taxonomy/9443'})
RETURN DISTINCT COUNT(tax)

