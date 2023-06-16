#!/usr/bin/env nimr
import os,times,strutils,sequtils
import nre

let argc = paramCount()
let argv = commandLineParams()

proc format_date(date: string): string =
  return '"' & date[0..3] & '-' & date[4..5] & '-' & date[6..7] & '"' & "^^xsd:date"

proc format_str_array(str: string): string =
  let array = str.split('|')
  let str_array = array.map do (x:string) -> string : '"' & x & '"'
  return str_array.join(" ,\n        ")

proc format_link(str: string): string =
  let arr = str.split('|')
  var str_array: seq[string]
  for a in items(arr):
    if a.contains(re"^MIM:(\d+)$"):
      let id = a.match(re"^MIM:(\d+)$").get.captures[0]
      str_array.add("mim:" & id)
    elif a.contains(re"^HGNC:HGNC:(\d+)$"):
      let id = a.match(re"^HGNC:HGNC:(\d+)$").get.captures[0]
      str_array.add("hgnc:" & id)
    elif a.contains(re"^Ensembl:(ENSG\d+)$"):
      let id = a.match(re"^Ensembl:(ENSG\d+)$").get.captures[0]
      str_array.add("ensembl:" & id)
    elif a.contains(re"^miRBase:(MI\d+)$"):
      let id = a.match(re"^miRBase:(MI\d+)$").get.captures[0]
      str_array.add("mirbase:" & id)
  return str_array.join(" ,\n        ")

proc filter_str(str: string): string =
  let arr = str.split('|')
  var str_array: seq[string]
  for a in items(arr):
    if a.contains(re"^MIM:(\d+)$"):
      discard
    elif a.contains(re"^HGNC:HGNC:(\d+)$"):
      discard
    elif a.contains(re"^Ensembl:(ENSG\d+)$"):
      discard
    elif a.contains(re"^miRBase:(MI\d+)$"):
      discard
    else:
      return a

block:
  var header = ""
  var f : File = open(argv[0], FileMode.fmRead)
  defer :
    close(f)
  while f.endOfFile == false :
    let line = f.readline()
    if header == "":
      header = line
      echo("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .")
      echo("@prefix dct: <http://purl.org/dc/terms/> .")
      echo("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .")
      echo("@prefix ncbigene: <http://identifiers.org/ncbigene/> .")
      echo("@prefix taxid: <http://identifiers.org/taxonomy/> .")
      echo("@prefix hgnc: <http://identifiers.org/hgnc/> .")
      echo("@prefix mim: <http://identifiers.org/mim/> .")
      echo("@prefix mirbase: <http://identifiers.org/mirbase/> .")
      echo("@prefix ensembl: <http://identifiers.org/ensembl/> .")
      echo("@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> .")
      echo("@prefix : <http://purl.org/net/orthordf/hOP/ontology#> .")
    else:
      let fields = line.split('\t')
      echo()
      echo "ncbigene:", fields[1], " a nuc:Gene ;"
      echo "    dct:identifier ", fields[1], " ;"
      echo "    rdfs:label \"", fields[2], "\" ;"
      if fields[10] != "-":
        echo "    nuc:standard_name \"", fields[10], "\" ;"
      if fields[4] != "-":
        echo "    nuc:gene_synonym ", format_str_array(fields[4]), " ;"
      echo "    dct:description \"", fields[8], "\" ;"
      if fields[13] != "-":
        echo "    dct:alternative ", format_str_array(fields[13]), " ;"
      if fields[5] != "-":
        echo "    nuc:dblink ", format_link(fields[5]), " ;"
      echo "    :typeOfGene \"", fields[9], "\" ;"
      if fields[12] == "O":
        echo "    :nomenclatureStatus \"official\" ;"
      elif fields[12] == "I":
        echo "    :nomenclatureStatus \"interim\" ;"
      if fields[11] != "-":
        echo "    :fullName \"", fields[11], "\" ;"
      if fields[15] != "-":
        echo "    :featureType ", format_str_array(fields[15]), " ;"
      if fields[5] != "-":
        let db_xref = filter_str(fields[5])
        if db_xref != "":
          echo "    nuc:db_xref \"", db_xref, "\" ;"
      echo "    :taxid taxid:", fields[0], " ;"
      echo "    nuc:chromosome \"", fields[6], "\" ;"
      echo "    nuc:map \"", fields[7], "\" ;"
      echo "    dct:modified ", format_date(fields[14]), " ."
