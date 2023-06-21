#!/usr/bin/perl -w
use strict;
use File::Basename;
use Getopt::Std;
my $PROGRAM = basename $0;
my $USAGE=
"Usage: $PROGRAM
";

my %OPT;
getopts('', \%OPT);

!@ARGV && -t and die $USAGE;

print_prefix();

my $HEADER = <>;
while (<>) {
    chomp;
    my @field = split("\t");
    print "\n";
    print "ncbigene:$field[1] a nuc:Gene ;\n";
    print "    dct:identifier $field[1] ;\n";
    print "    rdfs:label \"$field[2]\" ;\n";
    if ($field[10] ne "-") {
        print "    nuc:standard_name \"$field[10]\" ;\n";
    }
    if ($field[4] ne "-") {
        my $synonyms = format_str_array($field[4]);
        print "    nuc:gene_synonym $synonyms ;\n";
    }
    print "    dct:description \"$field[8]\" ;\n";
    if ($field[13] ne "-") {
        my $others = format_str_array($field[13]);
        print "    dct:alternative $others ;\n";
    }
    if ($field[5] ne "-") {
        my $link = format_link($field[5]);
        print "    nuc:dblink $link ;\n";
    }
    print "    :typeOfGene \"$field[9]\" ;\n";
    if ($field[12] eq "O") {
        print "    :nomenclatureStatus \"official\" ;\n";
    } elsif ($field[12] eq "I") {
        print "    :nomenclatureStatus \"interim\" ;\n";
    }
    if ($field[11] ne "-") {
        print "    :fullName \"$field[11]\" ;\n";
    }
    if ($field[5] ne "-") {
        my $db_xref = filter_str($field[5]);
        if ($db_xref) {
            print "    nuc:db_xref $db_xref ;\n";
        }
    }
    if ($field[15] ne "-") {
        my $feature_type = format_str_array($field[15]);
        print "    :featureType $feature_type ;\n";
    }
    print "    :taxid taxid:$field[0] ;\n";
    print "    nuc:chromosome \"$field[6]\" ;\n";
    print "    nuc:map \"$field[7]\" ;\n";
    my $date = format_date($field[14]);
    print "    dct:modified \"$date\"^^xsd:date .\n";
}

sub print_prefix {
    print '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .', "\n";
    print '@prefix dct: <http://purl.org/dc/terms/> .', "\n";
    print '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .', "\n";
    print '@prefix ncbigene: <http://identifiers.org/ncbigene/> .', "\n";
    print '@prefix taxid: <http://identifiers.org/taxonomy/> .', "\n";
    print '@prefix hgnc: <http://identifiers.org/hgnc/> .', "\n";
    print '@prefix mim: <http://identifiers.org/mim/> .', "\n";
    print '@prefix mirbase: <http://identifiers.org/mirbase/> .', "\n";
    print '@prefix ensembl: <http://identifiers.org/ensembl/> .', "\n";
    print '@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> .', "\n";
    print '@prefix : <http://purl.org/net/orthordf/hOP/ontology#> .', "\n";
}

sub format_date {
    my ($date) = @_;
    if ($date =~ /^(\d\d\d\d)(\d\d)(\d\d)$/) {
        my ($y, $m, $d) = ($1, $2, $3);
        return "$y-$m-$d";
    }
}

sub format_str_array {
    my ($str) = @_;
    my @arr = split(/\|/, $str);
    my @str_arr = ();
    for my $a (@arr) {
        push(@str_arr, "\"$a\"");
    }
    return join(" ,\n        ", @str_arr);
}

sub format_link {
    my ($str) = @_;
    my @arr = split(/\|/, $str);
    my @link = ();
    for my $a (@arr) {
        if ($a =~ /^MIM:(\d+)$/) {
            push(@link, "mim:$1");
        } elsif ($a =~ /^HGNC:HGNC:(\d+)$/) {
            push(@link, "hgnc:$1");
        } elsif ($a =~ /^Ensembl:(ENSG\d+)$/) {
            push(@link, "ensembl:$1");
        } elsif ($a =~ /^miRBase:(MI\d+)$/) {
            push(@link, "mirbase:$1");
        }
    }
    return join(" ,\n        ", @link);
}

sub filter_str {
    my ($str) = @_;
    my @arr = split(/\|/, $str);
    my @link = ();
    for my $a (@arr) {
        if ($a =~ /^MIM:(\d+)$/) {
        } elsif ($a =~ /^HGNC:HGNC:(\d+)$/) {
        } elsif ($a =~ /^Ensembl:(ENSG\d+)$/) {
        } elsif ($a =~ /^miRBase:(MI\d+)$/) {
        } else {
            push(@link, "\"$a\"");
        }
    }
    return join(" ,\n        ", @link);
}
