package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	writer := bufio.NewWriter(os.Stdout)
	fmt.Fprintln(writer, "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .")
	fmt.Fprintln(writer, "@prefix dct: <http://purl.org/dc/terms/> .")
	fmt.Fprintln(writer, "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .")
	fmt.Fprintln(writer, "@prefix ncbigene: <http://identifiers.org/ncbigene/> .")
	fmt.Fprintln(writer, "@prefix taxid: <http://identifiers.org/taxonomy/> .")
	fmt.Fprintln(writer, "@prefix hgnc: <http://identifiers.org/hgnc/> .")
	fmt.Fprintln(writer, "@prefix mim: <http://identifiers.org/mim/> .")
	fmt.Fprintln(writer, "@prefix mirbase: <http://identifiers.org/mirbase/> .")
	fmt.Fprintln(writer, "@prefix ensembl: <http://identifiers.org/ensembl/> .")
	fmt.Fprintln(writer, "@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> .")
	fmt.Fprintln(writer, "@prefix : <http://purl.org/net/orthordf/hOP/ontology#> .")

	var scanner *bufio.Scanner
	if len(os.Args) > 1 {
		file, err := os.Open(os.Args[1])
		if err != nil {
			fmt.Fprintln(os.Stderr, "Failed to open the file:", err)
			os.Exit(1)
		}
		defer file.Close()
		scanner = bufio.NewScanner(file)
	} else {
		scanner = bufio.NewScanner(os.Stdin)
	}

	if scanner.Scan() {
		_, err := scanner.Text(), scanner.Err()
		if err != nil {
			os.Exit(1)
		}
	}
	for scanner.Scan() {
		line := scanner.Text()
		line = strings.TrimSuffix(line, "\n")
		fields := strings.Split(line, "\t")
		fmt.Fprintln(writer)
		fmt.Fprintf(writer, "ncbigene:%s a nuc:Gene ;\n", fields[1])
		fmt.Fprintf(writer, "    dct:identifier %s ;\n", fields[1])
		fmt.Fprintf(writer, "    rdfs:label \"%s\" ;\n", fields[2])
		if fields[10] != "-" {
			fmt.Fprintf(writer, "    nuc:standard_name \"%s\" ;\n", fields[10])
		}
		if fields[4] != "-" {
			synonyms := formatStrArray(fields[4])
			fmt.Fprintf(writer, "    nuc:gene_synonym %s ;\n", synonyms)
		}
		fmt.Fprintf(writer, "    dct:description \"%s\" ;\n", fields[8])
		if fields[13] != "-" {
			others := formatStrArray(fields[13])
			fmt.Fprintf(writer, "    dct:alternative %s ;\n", others)
		}
		link, dbXref := formatLink(fields[5])
		if fields[5] != "-" {
			fmt.Fprintf(writer, "    nuc:dblink %s ;\n", link)
		}
		fmt.Fprintf(writer, "    :typeOfGene \"%s\" ;\n", fields[9])
		if fields[12] == "O" {
			fmt.Fprintf(writer, "    :nomenclatureStatus \"official\" ;\n")
		} else if fields[12] == "I" {
			fmt.Fprintf(writer, "    :nomenclatureStatus \"interim\" ;\n")
		}
		if fields[11] != "-" {
			fmt.Fprintf(writer, "    :fullName \"%s\" ;\n", fields[11])
		}
		if dbXref != "" {
			fmt.Fprintf(writer, "    nuc:db_xref %s ;\n", dbXref)
		}
		if fields[15] != "-" {
			featureType := formatStrArray(fields[15])
			fmt.Fprintf(writer, "    :featureType %s ;\n", featureType)
		}
		fmt.Fprintf(writer, "    :taxid taxid:%s ;\n", fields[0])
		fmt.Fprintf(writer, "    nuc:chromosome \"%s\" ;\n", fields[6])
		fmt.Fprintf(writer, "    nuc:map \"%s\" ;\n", fields[7])
		date := formatDate(fields[14])
		fmt.Fprintf(writer, "    dct:modified \"%s\"^^xsd:date .\n", date)
	}
	if scanner.Err() != nil {
		fmt.Fprintln(os.Stderr, "Error reading input:", scanner.Err())
		os.Exit(1)
	}
	writer.Flush()
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
