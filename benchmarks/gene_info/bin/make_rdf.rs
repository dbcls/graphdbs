use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};

fn main() {
    println!("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .");
    println!("@prefix dct: <http://purl.org/dc/terms/> .");
    println!("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .");
    println!("@prefix ncbigene: <http://identifiers.org/ncbigene/> .");
    println!("@prefix taxid: <http://identifiers.org/taxonomy/> .");
    println!("@prefix hgnc: <http://identifiers.org/hgnc/> .");
    println!("@prefix mim: <http://identifiers.org/mim/> .");
    println!("@prefix mirbase: <http://identifiers.org/mirbase/> .");
    println!("@prefix ensembl: <http://identifiers.org/ensembl/> .");
    println!("@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> .");
    println!("@prefix : <http://purl.org/net/orthordf/hOP/ontology#> .");
    println!();

    let args: Vec<String> = env::args().collect();
    let filename = &args[1];
    let file = File::open(filename).expect("Failed to open the file");

    let mut lines = BufReader::new(file).lines();
    let _header = lines.next().unwrap().unwrap();

    for line in lines {
        let line = line.unwrap();
        let fields: Vec<&str> = line.split('\t').collect();

        println!();
        println!("ncbigene:{} a nuc:Gene ;", fields[1]);
        println!("    dct:identifier {} ;", fields[1]);
        println!("    rdfs:label \"{}\" ;", fields[2]);
        if fields[10] != "-" {
            println!("    nuc:standard_name \"{}\" ;", fields[10]);
        }
        if fields[4] != "-" {
            let synonyms = format_str_array(fields[4]);
            println!("    nuc:gene_synonym {} ;", synonyms);
        }
        println!("    dct:description \"{}\" ;", fields[8]);
        if fields[13] != "-" {
            let others = format_str_array(fields[13]);
            println!("    dct:alternative {} ;", others);
        }
        if fields[5] != "-" {
            let link = format_link(fields[5]);
            println!("    nuc:dblink {} ;", link);
        }
        println!("    :typeOfGene \"{}\" ;", fields[9]);
        if fields[12] == "O" {
            println!("    :nomenclatureStatus \"official\" ;");
        } else if fields[12] == "I" {
            println!("    :nomenclatureStatus \"interim\" ;");
        }
        if fields[11] != "-" {
            println!("    :fullName \"{}\" ;", fields[11]);
        }
        if fields[5] != "-" {
            let db_xref = filter_str(fields[5]);
            if !db_xref.is_empty() {
                println!("    nuc:db_xref {} ;", db_xref);
            }
        }
        if fields[15] != "-" {
            let feature_type = format_str_array(fields[15]);
            println!("    :featureType {} ;", feature_type);
        }
        println!("    :taxid taxid:{} ;", fields[0]);
        println!("    nuc:chromosome \"{}\" ;", fields[6]);
        println!("    nuc:map \"{}\" ;", fields[7]);
        let date = format_date(fields[14]);
        println!("    dct:modified \"{}\"^^xsd:date .", date);
    }
}

fn format_str_array(str: &str) -> String {
    let arr: Vec<&str> = str.split('|').collect();
    let str_arr: Vec<String> = arr.iter().map(|a| format!("\"{}\"", a)).collect();
    str_arr.join(" ,\n        ")
}

fn format_link(str: &str) -> String {
    let arr: Vec<&str> = str.split('|').collect();
    let mut link: Vec<String> = Vec::new();
    for a in arr {
        if let Some(matched) = a.splitn(2, ':').collect::<Vec<&str>>().get(1) {
            match *matched {
                "MIM" => link.push(format!("mim:{}", matched)),
                "HGNC" => link.push(format!("hgnc:{}", matched)),
                "Ensembl" => link.push(format!("ensembl:{}", matched)),
                "miRBase" => link.push(format!("mirbase:{}", matched)),
                _ => (),
            }
        }
    }
    link.join(" ,\n        ")
}

fn filter_str(str: &str) -> String {
    let arr: Vec<&str> = str.split('|').collect();
    let mut link: Vec<String> = Vec::new();
    for a in arr {
        if let Some(matched) = a.splitn(2, ':').collect::<Vec<&str>>().get(1) {
            match *matched {
                "MIM" => (),
                "HGNC" => (),
                "Ensembl" => (),
                "miRBase" => (),
                _ => link.push(format!("\"{}\"", a)),
            }
        }
    }
    link.join(" ,\n        ")
}

fn format_date(date: &str) -> String {
    if date.len() == 8 {
        format!("{}-{}-{}", &date[..4], &date[4..6], &date[6..8])
    } else {
        String::new()
    }
}
