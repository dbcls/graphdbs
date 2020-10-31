MATCH (n:Resource {uri:'http://identifiers.org/taxonomy/9606'})-[r]->(n2:Resource)
RETURN r, n2
ORDER BY r.uri, n2.uri