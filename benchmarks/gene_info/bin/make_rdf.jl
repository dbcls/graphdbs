function main(args)
    if length(args) == 0
        exit(1)
    end
    input_file = args[1]

    open(input_file) do file
        print_prefix()

        header = readline(file) # Skip header line
        for line in eachline(file)
            field = split(line, "\t")
            println()
            println("ncbigene:$(field[2]) a nuc:Gene ;")
            println("    dct:identifier $(field[2]) ;")
            println("    rdfs:label \"$(field[3])\" ;")
            if field[11] != "-"
                println("    nuc:standard_name \"$(field[11])\" ;")
            end
            if field[5] != "-"
                synonyms = format_str_array(field[5])
                println("    nuc:gene_synonym $synonyms ;")
            end
            println("    dct:description \"$(field[9])\" ;")
            if field[14] != "-"
                others = format_str_array(field[14])
                println("    dct:alternative $others ;")
            end
            link, db_xref = format_link(field[6])
            if field[6] != "-"
                println("    nuc:dblink $link ;")
            end
            println("    :typeOfGene \"$(field[10])\" ;")
            if field[13] == "O"
                println("    :nomenclatureStatus \"official\" ;")
            elseif field[13] == "I"
                println("    :nomenclatureStatus \"interim\" ;")
            end
            if field[12] != "-"
                println("    :fullName \"$(field[12])\" ;")
            end
            if field[6] != "-"
                if db_xref != ""
                    println("    nuc:db_xref $db_xref ;")
                end
            end
            if field[16] != "-"
                feature_type = format_str_array(field[16])
                println("    :featureType $feature_type ;")
            end
            println("    :taxid taxid:$(field[1]) ;")
            println("    nuc:chromosome \"$(field[7])\" ;")
            println("    nuc:map \"$(field[8])\" ;")
            date = format_date(field[15])
            println("    dct:modified \"$date\"^^xsd:date .")
        end
    end
end

function print_prefix()
    println("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .")
    println("@prefix dct: <http://purl.org/dc/terms/> .")
    println("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .")
    println("@prefix ncbigene: <http://identifiers.org/ncbigene/> .")
    println("@prefix taxid: <http://identifiers.org/taxonomy/> .")
    println("@prefix hgnc: <http://identifiers.org/hgnc/> .")
    println("@prefix mim: <http://identifiers.org/mim/> .")
    println("@prefix mirbase: <http://identifiers.org/mirbase/> .")
    println("@prefix ensembl: <http://identifiers.org/ensembl/> .")
    println("@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> .")
    println("@prefix : <http://purl.org/net/orthordf/hOP/ontology#> .")
end

function format_str_array(str)
    arr = split(str, "|")
    str_arr = []
    for a in arr
        push!(str_arr, "\"$a\"")
    end
    return join(str_arr, " ,\n        ")
end

function format_link(str)
    arr = split(str, "|")
    link = []
    xref = []
    for a in arr
        if match(r"^MIM:(\d+)$", a) !== nothing
            id = match(r"^MIM:(\d+)$", a).captures[1]
            push!(link, "mim:$(id)")
        elseif match(r"^HGNC:HGNC:(\d+)$", a) !== nothing
            id = match(r"^HGNC:HGNC:(\d+)$", a).captures[1]
            push!(link, "hgnc:$(id)")
        elseif match(r"^Ensembl:(ENSG\d+)$", a) !== nothing
            id = match(r"^Ensembl:(ENSG\d+)$", a).captures[1]
            push!(link, "ensembl:$(id)")
        elseif match(r"^miRBase:(MI\d+)$", a) !== nothing
            id = match(r"^miRBase:(MI\d+)$", a).captures[1]
            push!(link, "mirbase:$(id)")
        else
            push!(xref, "\"$a\"")
        end
    end
    return join(link, " ,\n        "), join(xref, " ,\n        ")
end

function format_date(date)
    if match(r"^(\d{4})(\d{2})(\d{2})$", date) !== nothing
        y, m, d = match(r"^(\d{4})(\d{2})(\d{2})$", date).captures
        return "$y-$m-$d"
    end
end

# コマンドライン引数から実行
main(ARGS)
