#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const readline = require('readline');

program
  .arguments('<original_data_file>')
  .parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
const opts = program.opts();

const rs = fs.createReadStream(program.args[0], 'utf8');
const rl = readline.createInterface({ input: rs });

let header = [];
rl.on('line', (line) => {
  const fields = line.split('\t');
  if (header.length === 0) {
    header = line;
    printPrefix();
  } else {
    printTriples(fields);
  }
});

function printPrefix() {
  console.log('@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .');
  console.log('@prefix dct: <http://purl.org/dc/terms/> .');
  console.log('@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .');
  console.log('@prefix ncbigene: <http://identifiers.org/ncbigene/> .');
  console.log('@prefix taxid: <http://identifiers.org/taxonomy/> .');
  console.log('@prefix hgnc: <http://identifiers.org/hgnc/> .');
  console.log('@prefix mim: <http://identifiers.org/mim/> .');
  console.log('@prefix mirbase: <http://identifiers.org/mirbase/> .');
  console.log('@prefix ensembl: <http://identifiers.org/ensembl/> .');
  console.log('@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> .');
  console.log('@prefix : <http://purl.org/net/orthordf/hOP/ontology#> .');
}

function printTriples(fields) {
  console.log('');
  console.log(`ncbigene:${fields[1]} a nuc:Gene ;`);
  console.log(`    dct:identifier ${fields[1]} ;`);
  console.log(`    rdfs:label "${fields[2]}" ;`);
  if (fields[10] !== '-') {
    console.log(`    nuc:standard_name "${fields[10]}" ;`);
  }
  if (fields[4] !== '-') {
    const synonyms = fields[4].split('|')
          .map((d) => `"${d}"`)
          .join(' ,\n' + ' '.repeat(8));
    console.log(`    nuc:gene_synonym ${synonyms} ;`);
  }
  console.log(`    dct:description "${fields[8]}" ;`);
  if (fields[13] !== '-') {
    const other_designations = fields[13].split('|')
          .map((d) => `"${d}"`)
          .join(' ,\n' + ' '.repeat(8));
    console.log(`    dct:alternative ${other_designations} ;`);
  }
  if (fields[5] !== '-') {
    const seeAlso = fields[5].split('|')
          .map((d) => makeURI(d)).filter(x => x)
          .join(' ,\n' + ' '.repeat(8));
    console.log(`    nuc:dblink ${seeAlso} ;`);
  }
  const type_of_gene = fields[9];
  console.log(`    :typeOfGene "${fields[9]}" ;`);
  if (fields[12] === 'O') {
    console.log(`    :nomenclatureStatus "official" ;`);
  } else if (fields[12] === 'I') {
    console.log(`    :nomenclatureStatus "interim" ;`);
  }
  if (fields[11] !== '-') {
    console.log(`    :fullName "${fields[11]}" ;`);
  }
  if (fields[5] !== '-') {
    let dbXrefs = fields[5].split('|')
        .map((d) => filterStr(d)).filter(x => x);
    if (dbXrefs.length !== 0) {
      dbXrefs = dbXrefs.join(' ,\n' + ' '.repeat(8));
      console.log(`    nuc:db_xref ${dbXrefs} ;`);
    }
  }
  if (fields[15] !== '-') {
    const feature_type = fields[15].split('|')
          .map((d) => `"${d}"`)
          .join(' ,\n' + ' '.repeat(8));
    console.log(`    :featureType ${feature_type} ;`);
  }
  console.log(`    :taxid taxid:${fields[0]} ;`);
  console.log(`    nuc:chromosome "${fields[6]}" ;`);
  console.log(`    nuc:map "${fields[7]}" ;`);
  console.log(`    dct:modified "${formatDate(fields[14])}"^^xsd:date .`);
}

function makeURI(str) {
  let r;
  if (r = /^MIM:(\d+)$/.exec(str)) {
    return `mim:${r[1]}`;
  } else if (r = /^HGNC:HGNC:(\d+)$/.exec(str)) {
    return `hgnc:${r[1]}`;
  } else if (r = /^Ensembl:(ENSG\d+)$/.exec(str)) {
    return `ensembl:${r[1]}`;
  } else if (r = /^miRBase:(MI\d+)$/.exec(str)) {
    return `mirbase:${r[1]}`;
  }
}

function filterStr(str) {
  if (/^MIM:\d+$/.test(str)) {
  } else if (/^HGNC:HGNC:\d+$/.test(str)) {
  } else if (/^Ensembl:ENSG\d+$/.test(str)) {
  } else if (/^miRBase:MI\d+$/.test(str)) {
  } else {
    return `"${str}"`;
  }
}

function formatDate(date) {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(date);
  if (m) {
    return `${m[1]}-${m[2]}-${m[3]}`;
  } else {
    console.error(date);
    process.exit(1);
  }
}
