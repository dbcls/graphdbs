#!/usr/bin/env runc
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_LINE_LENGTH 8192

void print_prefix() {
    printf("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n");
    printf("@prefix dct: <http://purl.org/dc/terms/> .\n");
    printf("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n");
    printf("@prefix ncbigene: <http://identifiers.org/ncbigene/> .\n");
    printf("@prefix taxid: <http://identifiers.org/taxonomy/> .\n");
    printf("@prefix hgnc: <http://identifiers.org/hgnc/> .\n");
    printf("@prefix mim: <http://identifiers.org/mim/> .\n");
    printf("@prefix mirbase: <http://identifiers.org/mirbase/> .\n");
    printf("@prefix ensembl: <http://identifiers.org/ensembl/> .\n");
    printf("@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> .\n");
    printf("@prefix : <http://purl.org/net/orthordf/hOP/ontology#> .\n");
}

void format_str_array(char* str, char* formatted_str) {
    char* token = strtok(str, "|");
    while (token != NULL) {
        strcat(formatted_str, "\"");
        strcat(formatted_str, token);
        strcat(formatted_str, "\" ,\n        ");
        token = strtok(NULL, "|");
    }
    formatted_str[strlen(formatted_str) - 11] = '\0';  // Remove trailing comma and space
}

void format_link(char* str, char* formatted_link, char* filtered_db_xref) {
    char* token = strtok(str, "|");
    while (token != NULL) {
        if (strncmp(token, "MIM:", 4) == 0) {
            strcat(formatted_link, "mim:");
            strcat(formatted_link, token + 4);
            strcat(formatted_link, " ,\n        ");
        } else if (strncmp(token, "HGNC:HGNC:", 10) == 0) {
            strcat(formatted_link, "hgnc:");
            strcat(formatted_link, token + 10);
            strcat(formatted_link, " ,\n        ");
        } else if (strncmp(token, "Ensembl:", 8) == 0) {
            strcat(formatted_link, "ensembl:");
            strcat(formatted_link, token + 8);
            strcat(formatted_link, " ,\n        ");
        } else if (strncmp(token, "miRBase:", 8) == 0) {
            strcat(formatted_link, "mirbase:");
            strcat(formatted_link, token + 8);
            strcat(formatted_link, " ,\n        ");
        } else {
            strcat(filtered_db_xref, "\"");
            strcat(filtered_db_xref, token);
            strcat(filtered_db_xref, "\", ");
        }
        token = strtok(NULL, "|");
    }
    formatted_link[strlen(formatted_link) - 11] = '\0';  // Remove trailing comma and space
    filtered_db_xref[strlen(filtered_db_xref) - 2] = '\0';  // Remove trailing comma and space
}

void print_entry(char* line) {
    char* token = strtok(line, "\t");
    char* field[16];
    int i = 0;
    while (token != NULL) {
        field[i] = token;
        token = strtok(NULL, "\t");
        i++;
    }

    printf("\n");
    printf("ncbigene:%s a nuc:Gene ;\n", field[1]);
    printf("    dct:identifier %s ;\n", field[1]);
    printf("    rdfs:label \"%s\" ;\n", field[2]);

    if (strcmp(field[10], "-") != 0) {
        printf("    nuc:standard_name \"%s\" ;\n", field[10]);
    }

    if (strcmp(field[4], "-") != 0) {
        char formatted_synonyms[MAX_LINE_LENGTH] = "";
        format_str_array(field[4], formatted_synonyms);
        printf("    nuc:gene_synonym %s ;\n", formatted_synonyms);
    }

    printf("    dct:description \"%s\" ;\n", field[8]);

    if (strcmp(field[13], "-") != 0) {
        char formatted_others[MAX_LINE_LENGTH] = "";
        format_str_array(field[13], formatted_others);
        printf("    dct:alternative %s ;\n", formatted_others);
    }

    char formatted_link[MAX_LINE_LENGTH] = "";
    char filtered_db_xref[MAX_LINE_LENGTH] = "";
    if (strcmp(field[5], "-") != 0) {
        format_link(field[5], formatted_link, filtered_db_xref);
        printf("    nuc:dblink %s ;\n", formatted_link);
    }

    printf("    :typeOfGene \"%s\" ;\n", field[9]);

    if (strcmp(field[12], "O") == 0) {
        printf("    :nomenclatureStatus \"official\" ;\n");
    } else if (strcmp(field[12], "I") == 0) {
        printf("    :nomenclatureStatus \"interim\" ;\n");
    }

    if (strcmp(field[11], "-") != 0) {
        printf("    :fullName \"%s\" ;\n", field[11]);
    }

    if (strlen(filtered_db_xref) > 0) {
        printf("    nuc:db_xref %s ;\n", filtered_db_xref);
    }

    if (strcmp(field[15], "-") != 0) {
        char formatted_feature_type[MAX_LINE_LENGTH] = "";
        format_str_array(field[15], formatted_feature_type);
        printf("    :featureType %s ;\n", formatted_feature_type);
    }

    printf("    :taxid taxid:%s ;\n", field[0]);
    printf("    nuc:chromosome \"%s\" ;\n", field[6]);
    printf("    nuc:map \"%s\" ;\n", field[7]);

    char* date = field[14];
    if (strlen(date) == 8) {
        char formatted_date[MAX_LINE_LENGTH] = "";
        strncpy(formatted_date, date, 4);
        strcat(formatted_date, "-");
        strncat(formatted_date, date + 4, 2);
        strcat(formatted_date, "-");
        strncat(formatted_date, date + 6, 2);
        printf("    dct:modified \"%s\"^^xsd:date .\n", formatted_date);
    }
}

void chomp(char* line) {
    size_t len = strlen(line);
    if (len > 0 && line[len - 1] == '\n') {
        line[len - 1] = '\0';
    }
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        printf("Usage: %s gene_info\n", argv[0]);
        return 1;
    }

    FILE* fp = fopen(argv[1], "r");
    if (fp == NULL) {
        printf("Error opening file: %s\n", argv[1]);
        return 1;
    }

    print_prefix();

    char line[MAX_LINE_LENGTH];
    fgets(line, sizeof(line), fp); // Read and ignore the header line
    while (fgets(line, sizeof(line), fp) != NULL) {
        chomp(line);
        print_entry(line);
    }

    fclose(fp);

    return 0;
}
