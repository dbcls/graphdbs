use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader, BufWriter, Write, stdout};

fn main() {
    let stdout = stdout();
    let mut writer = BufWriter::new(stdout.lock());

    writeln!(writer, "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .").unwrap();
    writeln!(writer, "@prefix dct: <http://purl.org/dc/terms/> .").unwrap();
    writeln!(writer, "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .").unwrap();
    writeln!(writer, "@prefix ncbigene: <http://identifiers.org/ncbigene/> .").unwrap();
    writeln!(writer, "@prefix taxid: <http://identifiers.org/taxonomy/> .").unwrap();
    writeln!(writer, "@prefix hgnc: <http://identifiers.org/hgnc/> .").unwrap();
    writeln!(writer, "@prefix mim: <http://identifiers.org/mim/> .").unwrap();
    writeln!(writer, "@prefix mirbase: <http://identifiers.org/mirbase/> .").unwrap();
    writeln!(writer, "@prefix ensembl: <http://identifiers.org/ensembl/> .").unwrap();
    writeln!(writer, "@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> .").unwrap();
    writeln!(writer, "@prefix : <http://purl.org/net/orthordf/hOP/ontology#> .").unwrap();

    let args: Vec<String> = env::args().collect();
    let filename = &args[1];
    let file = File::open(filename).expect("Failed to open the file");

    let mut lines = BufReader::new(file).lines();
    let _header = lines.next().unwrap().unwrap();

    for line in lines {
        let line = line.unwrap();
        let fields: Vec<&str> = line.split('\t').collect();

        writeln!(writer, "").unwrap();
        writeln!(writer, "ncbigene:{} a nuc:Gene ;", fields[1]).unwrap();
        writeln!(writer, "    dct:identifier {} ;", fields[1]).unwrap();
        writeln!(writer, "    rdfs:label \"{}\" ;", fields[2]).unwrap();
        if fields[10] != "-" {
            writeln!(writer, "    nuc:standard_name \"{}\" ;", fields[10]).unwrap();
        }
        if fields[4] != "-" {
            writeln!(writer, "    nuc:gene_synonym {} ;", format_str_array(fields[4])).unwrap();
        }
        writeln!(writer, "    dct:description \"{}\" ;", fields[8]).unwrap();
        if fields[13] != "-" {
            writeln!(writer, "    dct:alternative {} ;", format_str_array(fields[13])).unwrap();
        }
        let (link, db_xref) = format_link(fields[5]);
        if fields[5] != "-" {
            writeln!(writer, "    nuc:dblink {} ;", link).unwrap();
        }
        writeln!(writer, "    :typeOfGene \"{}\" ;", fields[9]).unwrap();
        if fields[12] == "O" {
            writeln!(writer, "    :nomenclatureStatus \"official\" ;").unwrap();
        } else if fields[12] == "I" {
            writeln!(writer, "    :nomenclatureStatus \"interim\" ;").unwrap();
        }
        if fields[11] != "-" {
            writeln!(writer, "    :fullName \"{}\" ;", fields[11]).unwrap();
        }
        if fields[5] != "-" {
            if !db_xref.is_empty() {
                writeln!(writer, "    nuc:db_xref {} ;", db_xref).unwrap();
            }
        }
        if fields[15] != "-" {
            writeln!(writer, "    :featureType {} ;", format_str_array(fields[15])).unwrap();
        }
        writeln!(writer, "    :taxid taxid:{} ;", fields[0]).unwrap();
        writeln!(writer, "    nuc:chromosome \"{}\" ;", fields[6]).unwrap();
        writeln!(writer, "    nuc:map \"{}\" ;", fields[7]).unwrap();
        writeln!(writer, "    dct:modified \"{}\"^^xsd:date .", format_date(fields[14])).unwrap();
    }
}

fn format_str_array(str: &str) -> String {
    let arr: Vec<&str> = str.split('|').collect();
    let str_arr: Vec<String> = arr.iter().map(|a| format!("\"{}\"", a)).collect();
    str_arr.join(" ,\n        ")
}

fn format_link(str: &str) -> (String, String) {
    let arr: Vec<&str> = str.split('|').collect();
    let mut link: Vec<String> = Vec::new();
    let mut db_xref: Vec<String> = Vec::new();

    for a in arr {
        if a.starts_with("MIM:") {
            link.push(format!("mim:{}", &a[4..]));
        } else if a.starts_with("HGNC:HGNC:") {
            link.push(format!("hgnc:{}", &a[10..]));
        } else if a.starts_with("Ensembl:") {
            link.push(format!("ensembl:{}", &a[8..]));
        } else if a.starts_with("miRBase:") {
            link.push(format!("mirbase:{}", &a[8..]));
        } else {
            db_xref.push(format!("\"{}\"", a));
        }
    }

    (link.join(" ,\n        "), db_xref.join(" ,\n        "))
}

fn format_date(date: &str) -> String {
    if date.len() == 8 {
        format!("{}-{}-{}", &date[..4], &date[4..6], &date[6..8])
    } else {
        String::new()
    }
}
