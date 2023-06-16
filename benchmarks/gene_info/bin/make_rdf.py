#!/usr/bin/env python3
import argparse
import re

def main():
    parser = argparse.ArgumentParser(description='RDFize NCBI gene info')
    parser.add_argument('gene_info', help='NCBI gene info')
    args = parser.parse_args()
    
    print_prefix()
    
    fp = open(args.gene_info, 'r')
    header = ""
    for line in fp:
        if not header:
            header = line
        else:
            print_entry(line)

def print_prefix():
    print('@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .')
    print('@prefix dct: <http://purl.org/dc/terms/> .')
    print('@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .')
    print('@prefix ncbigene: <http://identifiers.org/ncbigene/> .')
    print('@prefix taxid: <http://identifiers.org/taxonomy/> .')
    print('@prefix hgnc: <http://identifiers.org/hgnc/> .')
    print('@prefix mim: <http://identifiers.org/mim/> .')
    print('@prefix mirbase: <http://identifiers.org/mirbase/> .')
    print('@prefix ensembl: <http://identifiers.org/ensembl/> .')
    print('@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> .')
    print('@prefix : <http://purl.org/net/orthordf/hOP/ontology#> .')

def print_entry(line):
    fields = line.strip().split('\t')
    print()
    print(f'ncbigene:{fields[1]} a nuc:Gene ;')
    print(f'    dct:identifier {fields[1]} ;')
    print(f'    rdfs:label "{fields[2]}" ;')
    if fields[10] != '-':
        print(f'    nuc:standard_name "{fields[10]}" ;')
    if fields[4] != '-':
        print(f'    nuc:gene_synonym {format_str_array(fields[4])} ;')
    print(f'    dct:description "{fields[8]}" ;')
    if fields[13] != '-':
        print(f'    dct:alternative {format_str_array(fields[13])} ;')
    if fields[5] != '-':
        print(f'    nuc:dblink {format_links(fields[5])} ;')
    print(f'    :typeOfGene "{fields[9]}" ;')
    if fields[12] == 'O':
        print(f'    :nomenclatureStatus "official" ;')
    elif fields[12] == 'I':
        print(f'    :nomenclatureStatus "interim" ;')
    if fields[11] != '-':
        print(f'    :fullName "{fields[11]}" ;')
    if fields[15] != '-':
        print(f'    :featureType {format_str_array(fields[15])} ;')
    if fields[5] != '-':
        db_xref = filter_str(fields[5])
        if db_xref:
            print(f'    nuc:db_xref "{db_xref}" ;')
    print(f'    :taxid taxid:{fields[0]} ;')
    print(f'    nuc:chromosome "{fields[6]}" ;')
    print(f'    nuc:map "{fields[7]}" ;')
    print(f'    dct:modified {format_date(fields[14])} .')
    # print(f'    locus {fields[3]} ;')

def format_date(date):
    return f'"{date[0:4]}-{date[4:6]}-{date[6:8]}"^^xsd:date'

def format_str_array(str):
    array = str.split('|')
    str_array = list(map(lambda x: f'"{x}"', array))
    return ' ,\n        '.join(str_array)

def format_links(str):
    array = str.split('|')
    links = []
    for a in array:
        if re.match(r'^MIM:(\d+)$', a):
            m = re.match(r'^MIM:(\d+)$', a)
            [id] = m.groups()
            links.append(f'mim:{id}')
        elif re.match(r'^HGNC:HGNC:(\d+)$', a):
            m = re.match(r'^HGNC:HGNC:(\d+)$', a)
            [id] = m.groups()
            links.append(f'hgnc:{id}')
        elif re.match(r'^Ensembl:ENSG\d+$', a):
            m = re.match(r'^Ensembl:(ENSG\d+)$', a)
            [id] = m.groups()
            links.append(f'ensembl:{id}')
        elif re.match(r'^miRBase:MI\d+$', a):
            m = re.match(r'^miRBase:(MI\d+)$', a)
            [id] = m.groups()
            links.append(f'mirbase:{id}')
    return ' ,\n        '.join(links)

def filter_str(str):
    array = str.split('|')
    links = []
    for a in array:
        if re.match(r'^MIM:(\d+)$', a):
            pass
        elif re.match(r'^HGNC:HGNC:(\d+)$', a):
            pass
        elif re.match(r'^Ensembl:ENSG\d+$', a):
            pass
        elif re.match(r'^miRBase:MI\d+$', a):
            pass
        else:
            links.append(a)
    return '|'.join(links)

if __name__ == '__main__':
    main()
