#!/usr/bin/env python3
import sys
import re

def main():
    if len(sys.argv) != 2:
        print(f'Usage: {sys.argv[0]} <input_file>')
        sys.exit(1)
    input_file = sys.argv[1]

    print_prefix()

    with open(input_file, 'r') as fp:
        header = fp.readline()
        for line in fp:
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
    field = line.strip().split('\t')
    print()
    print(f'ncbigene:{field[1]} a nuc:Gene ;')
    print(f'    dct:identifier {field[1]} ;')
    print(f'    rdfs:label "{field[2]}" ;')
    if field[10] != '-':
        print(f'    nuc:standard_name "{field[10]}" ;')
    if field[4] != '-':
        synonyms = format_str_array(field[4])
        print(f'    nuc:gene_synonym {synonyms} ;')
    print(f'    dct:description "{field[8]}" ;')
    if field[13] != '-':
        others = format_str_array(field[13])
        print(f'    dct:alternative {others} ;')
    if field[5] != '-':
        link = format_link(field[5])
        print(f'    nuc:dblink {link} ;')
    print(f'    :typeOfGene "{field[9]}" ;')
    if field[12] == 'O':
        print('    :nomenclatureStatus "official" ;')
    elif field[12] == 'I':
        print('    :nomenclatureStatus "interim" ;')
    if field[11] != '-':
        print(f'    :fullName "{field[11]}" ;')
    if field[5] != '-':
        db_xref = filter_str(field[5])
        if db_xref:
            print(f'    nuc:db_xref {db_xref} ;')
    if field[15] != '-':
        feature_type = format_str_array(field[15])
        print(f'    :featureType {feature_type} ;')
    print(f'    :taxid taxid:{field[0]} ;')
    print(f'    nuc:chromosome "{field[6]}" ;')
    print(f'    nuc:map "{field[7]}" ;')
    date = format_date(field[14])
    print(f'    dct:modified "{date}"^^xsd:date .')

def format_date(date):
    match = re.match(r'(\d{4})(\d{2})(\d{2})', date)
    if match:
        return f'{match.group(1)}-{match.group(2)}-{match.group(3)}'

def format_str_array(string):
    arr = string.split('|')
    str_arr = [f'"{a}"' for a in arr]
    return ' ,\n        '.join(str_arr)

def format_link(string):
    arr = string.split('|')
    link = []
    for a in arr:
        match = re.match(r'MIM:(\d+)$', a)
        if match:
            link.append(f'mim:{match.group(1)}')
        else:
            match = re.match(r'HGNC:HGNC:(\d+)$', a)
            if match:
                link.append(f'hgnc:{match.group(1)}')
            else:
                match = re.match(r'Ensembl:(ENSG\d+)$', a)
                if match:
                    link.append(f'ensembl:{match.group(1)}')
                else:
                    match = re.match(r'miRBase:(MI\d+)$', a)
                    if match:
                        link.append(f'mirbase:{match.group(1)}')
    return ' ,\n        '.join(link)

def filter_str(string):
    arr = string.split('|')
    link = [f'"{a}"' for a in arr if not re.match(r'(MIM|HGNC|Ensembl|miRBase):.*', a)]
    return ' ,\n        '.join(link)

if __name__ == '__main__':
    main()
