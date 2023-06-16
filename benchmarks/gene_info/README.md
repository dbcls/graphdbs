# RDFizing gene_info

## Original data

NCBI Homo_sapiens.gene_info
* Downloaded from ftp.ncbi.nlm.nih.gov/gene/DATA/GENE_INFO/Mammalia/Homo_sapiens.gene_info.gz (2021-02-10)
* See the directory [original_data](https://github.com/dbcls/graphdbs/tree/master/benchmarks/gene_info/original_data) for details.

## Created RDF
```
./bin/make_rdf.pl original_data/Homo_sapiens.gene_info > created_rdf/Homo_sapiens.gene_info.ttl
```

## Results
Required time (sec)
| Perl | Python | Ruby3 | Node.js |
| :--- | :--- | :--- | :--- |
| 0.631 | 1.357 | 2.224 | 3.056 |
| 0.629 | 1.369 | 2.197 | 3.093 |
| 0.636 | 1.338 | 2.171 | 3.005 |
| 0.630 | 1.334 | 2.157 | 3.053 |
| 0.636 | 1.343 | 2.156 | 3.272 |
