# RDFizing gene_info

## Original data

NCBI Homo_sapiens.gene_info
* ftp.ncbi.nlm.nih.gov/gene/DATA/GENE_INFO/Mammalia/Homo_sapiens.gene_info.gz (2021-02-10)
* See the directory [original_data](https://github.com/dbcls/graphdbs/tree/master/benchmarks/gene_info/original_data) for details.

## Created RDF
```
$ ./bin/make_rdf.pl original_data/Homo_sapiens.gene_info > created_rdf/Homo_sapiens.gene_info.ttl
```

## Benchmark

### Perl etc.
```
$ time ./bin/make_rdf.pl original_data/Homo_sapiens.gene_info > /dev/null
```

### Java
```
$ time java -cp bin/java GeneInfo original_data/Homo_sapiens.gene_info > /dev/null
```
