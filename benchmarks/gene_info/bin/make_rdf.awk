#!/usr/bin/awk -f
BEGIN {
    FS = "\t"
    print "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> ."
    print "@prefix dct: <http://purl.org/dc/terms/> ."
    print "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> ."
    print "@prefix ncbigene: <http://identifiers.org/ncbigene/> ."
    print "@prefix taxid: <http://identifiers.org/taxonomy/> ."
    print "@prefix hgnc: <http://identifiers.org/hgnc/> ."
    print "@prefix mim: <http://identifiers.org/mim/> ."
    print "@prefix mirbase: <http://identifiers.org/mirbase/> ."
    print "@prefix ensembl: <http://identifiers.org/ensembl/> ."
    print "@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> ."
    print "@prefix : <http://purl.org/net/orthordf/hOP/ontology#> ."
}

{
    if (NR == 1) {
        next # Skip header line
    }
    print ""
    print "ncbigene:" $2 " a nuc:Gene ;"
    print "    dct:identifier " $2 " ;"
    print "    rdfs:label \"" $3 "\" ;"
    if ($11 != "-") {
        print "    nuc:standard_name \"" $11 "\" ;"
    }
    if ($5 != "-") {
        split($5, synonyms, "|")
        synonym_str = ""
        for (i = 1; i <= length(synonyms); i++) {
            synonym_str = synonym_str "\"" synonyms[i] "\""
            if (i < length(synonyms)) {
                synonym_str = synonym_str " ,\n        "
            }
        }
        print "    nuc:gene_synonym " synonym_str " ;"
    }
    print "    dct:description \"" $9 "\" ;"
    if ($14 != "-") {
        split($14, others, "|")
        others_str = ""
        for (i = 1; i <= length(others); i++) {
            others_str = others_str "\"" others[i] "\""
            if (i < length(others)) {
                others_str = others_str " ,\n        "
            }
        }
        print "    dct:alternative " others_str " ;"
    }
    if ($6 != "-") {
        split($6, dblinks, "|")
        dblink_str = ""
        for (i = 1; i <= length(dblinks); i++) {
            if (match(dblinks[i], /^MIM:([0-9]+)$/, match_arr)) {
                if (dblink_str != "") {
                    dblink_str = dblink_str " ,\n        "
                }
                dblink_str = dblink_str "mim:" match_arr[1]
            } else if (match(dblinks[i], /^HGNC:HGNC:([0-9]+)$/, match_arr)) {
                if (dblink_str != "") {
                    dblink_str = dblink_str " ,\n        "
                }
                dblink_str = dblink_str "hgnc:" match_arr[1]
            } else if (match(dblinks[i], /^Ensembl:(ENSG[0-9]+)$/, match_arr)) {
                if (dblink_str != "") {
                    dblink_str = dblink_str " ,\n        "
                }
                dblink_str = dblink_str "ensembl:" match_arr[1]
            } else if (match(dblinks[i], /^miRBase:(MI[0-9]+)$/, match_arr)) {
                if (dblink_str != "") {
                    dblink_str = dblink_str " ,\n        "
                }
                dblink_str = dblink_str "mirbase:" match_arr[1]
            }
        }
        print "    nuc:dblink " dblink_str " ;"
    }
    print "    :typeOfGene \"" $10 "\" ;"
    if ($13 == "O") {
        print "    :nomenclatureStatus \"official\" ;"
    } else if ($13 == "I") {
        print "    :nomenclatureStatus \"interim\" ;"
    }
    if ($12 != "-") {
        print "    :fullName \"" $12 "\" ;"
    }
    if ($6 != "-") {
        split($6, db_xrefs, "|")
        db_xref_str = ""
        for (i = 1; i <= length(db_xrefs); i++) {
            if (!(match(db_xrefs[i], /^MIM:([0-9]+)$/) ||
                match(db_xrefs[i], /^HGNC:HGNC:([0-9]+)$/) ||
                match(db_xrefs[i], /^Ensembl:(ENSG[0-9]+)$/) ||
                match(db_xrefs[i], /^miRBase:(MI[0-9]+)$/))) {
                db_xref_str = db_xref_str "\"" db_xrefs[i] "\""
                if (i < length(db_xrefs)) {
                    db_xref_str = db_xref_str " ,\n        "
                }
            }
        }
        if (db_xref_str != "") {
            print "    nuc:db_xref " db_xref_str " ;"
        }
    }
    if ($16 != "-") {
        split($16, feature_types, "|")
        feature_type_str = ""
        for (i = 1; i <= length(feature_types); i++) {
            feature_type_str = feature_type_str "\"" feature_types[i] "\""
            if (i < length(feature_types)) {
                feature_type_str = feature_type_str " ,\n        "
            }
        }
        print "    :featureType " feature_type_str " ;"
    }
    print "    :taxid taxid:" $1 " ;"
    print "    nuc:chromosome \"" $7 "\" ;"
    print "    nuc:map \"" $8 "\" ;"
    if ($15 != "-") {
        date = format_date($15)
        print "    dct:modified \"" date "\"^^xsd:date ."
    }
}

function format_date(date) {
    if (date ~ /^([0-9][0-9][0-9][0-9])([0-9][0-9])([0-9][0-9])$/) {
        return substr(date, 1, 4) "-" substr(date, 5, 2) "-" substr(date, 7, 2)
    }
}
