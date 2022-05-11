# Benchmark

The following is an example test case for benchmarking Virtuoso.

**Data preparation**
```
$ git clone https://github.com/dbcls/graphdbs.git
$ cd graphdbs/benchmark
$ bunzip2 --keep data/taxonomy_2019-05-01.ttl.bz2
```
**Build docker image**
```
$ cat virtuoso.dockerfile | docker build -t benchmark:virtuoso7.2.5.1 -
```
* Build context `.` is large. Use `-` instead.

**Run benchmark**
```
$ docker run -it --rm -v $(pwd):/work benchmark:virtuoso7.2.5.1
```
