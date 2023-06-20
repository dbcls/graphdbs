package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	fmt.Println("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .")
	fmt.Println("@prefix dct: <http://purl.org/dc/terms/> .")
	fmt.Println("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .")
	fmt.Println("@prefix ncbigene: <http://identifiers.org/ncbigene/> .")
	fmt.Println("@prefix taxid: <http://identifiers.org/taxonomy/> .")
	fmt.Println("@prefix hgnc: <http://identifiers.org/hgnc/> .")
	fmt.Println("@prefix mim: <http://identifiers.org/mim/> .")
	fmt.Println("@prefix mirbase: <http://identifiers.org/mirbase/> .")
	fmt.Println("@prefix ensembl: <http://identifiers.org/ensembl/> .")
	fmt.Println("@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> .")
	fmt.Println("@prefix : <http://purl.org/net/orthordf/hOP/ontology#> .")

	reader := bufio.NewReader(os.Stdin)
	_, err := reader.ReadString('\n')
	if err != nil {
		os.Exit(1)
	}

	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			break
		}
		line = strings.TrimSuffix(line, "\n")
		fields := strings.Split(line, "\t")
		fmt.Println()
		fmt.Printf("ncbigene:%s a nuc:Gene ;\n", fields[1])
		fmt.Printf("    dct:identifier %s ;\n", fields[1])
		fmt.Printf("    rdfs:label \"%s\" ;\n", fields[2])
		if fields[10] != "-" {
			fmt.Printf("    nuc:standard_name \"%s\" ;\n", fields[10])
		}
		if fields[4] != "-" {
			synonyms := formatStrArray(fields[4])
			fmt.Printf("    nuc:gene_synonym %s ;\n", synonyms)
		}
		fmt.Printf("    dct:description \"%s\" ;\n", fields[8])
		if fields[13] != "-" {
			others := formatStrArray(fields[13])
			fmt.Printf("    dct:alternative %s ;\n", others)
		}
		link, dbXref := formatLink(fields[5])
		if fields[5] != "-" {
			fmt.Printf("    nuc:dblink %s ;\n", link)
		}
		fmt.Printf("    :typeOfGene \"%s\" ;\n", fields[9])
		if fields[12] == "O" {
			fmt.Printf("    :nomenclatureStatus \"official\" ;\n")
		} else if fields[12] == "I" {
			fmt.Printf("    :nomenclatureStatus \"interim\" ;\n")
		}
		if fields[11] != "-" {
			fmt.Printf("    :fullName \"%s\" ;\n", fields[11])
		}
		if dbXref != "" {
			fmt.Printf("    nuc:db_xref %s ;\n", dbXref)
		}
		if fields[15] != "-" {
			featureType := formatStrArray(fields[15])
			fmt.Printf("    :featureType %s ;\n", featureType)
		}
		fmt.Printf("    :taxid taxid:%s ;\n", fields[0])
		fmt.Printf("    nuc:chromosome \"%s\" ;\n", fields[6])
		fmt.Printf("    nuc:map \"%s\" ;\n", fields[7])
		date := formatDate(fields[14])
		fmt.Printf("    dct:modified \"%s\"^^xsd:date .\n", date)
	}
}

func formatStrArray(str string) string {
	arr := strings.Split(str, "|")
	var strArr []string
	for _, a := range arr {
		strArr = append(strArr, "\""+a+"\"")
	}
	return strings.Join(strArr, " ,\n        ")
}

func formatLink(str string) (string, string) {
	arr := strings.Split(str, "|")
	var link []string
	var xref []string
	for _, a := range arr {
		if match := strings.Split(a, ":"); len(match) >= 2 {
			switch match[0] {
			case "MIM":
				link = append(link, "mim:"+match[1])
			case "HGNC":
				link = append(link, "hgnc:"+match[2])
			case "Ensembl":
				link = append(link, "ensembl:"+match[1])
			case "miRBase":
				link = append(link, "mirbase:"+match[1])
			default:
				xref = append(xref, "\""+a+"\"")
			}
		}
	}
	return strings.Join(link, " ,\n        "), strings.Join(xref, " ,\n        ")
}

func formatDate(date string) string {
	if len(date) == 8 {
		return fmt.Sprintf("%s-%s-%s", date[0:4], date[4:6], date[6:8])
	}
	return ""
}
