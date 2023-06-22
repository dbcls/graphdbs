import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class GeneInfo {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.exit(1);
        }
        String inputFileName = args[0];

        try (BufferedReader reader = new BufferedReader(new FileReader(inputFileName))) {
            printPrefix();

            String header = reader.readLine(); // Skip header line
            String line;
            while ((line = reader.readLine()) != null) {
                String[] field = line.split("\t");
                System.out.println();
                System.out.printf("ncbigene:%s a nuc:Gene ;%n", field[1]);
                System.out.printf("    dct:identifier %s ;%n", field[1]);
                System.out.printf("    rdfs:label \"%s\" ;%n", field[2]);
                if (!field[10].equals("-")) {
                    System.out.printf("    nuc:standard_name \"%s\" ;%n", field[10]);
                }
                if (!field[4].equals("-")) {
                    String synonyms = formatStrArray(field[4]);
                    System.out.printf("    nuc:gene_synonym %s ;%n", synonyms);
                }
                System.out.printf("    dct:description \"%s\" ;%n", field[8]);
                if (!field[13].equals("-")) {
                    String others = formatStrArray(field[13]);
                    System.out.printf("    dct:alternative %s ;%n", others);
                }
                String[] linkAndXref = formatLink(field[5]);
                if (!field[5].equals("-")) {
                    System.out.printf("    nuc:dblink %s ;%n", linkAndXref[0]);
                }
                System.out.printf("    :typeOfGene \"%s\" ;%n", field[9]);
                if (field[12].equals("O")) {
                    System.out.println("    :nomenclatureStatus \"official\" ;");
                } else if (field[12].equals("I")) {
                    System.out.println("    :nomenclatureStatus \"interim\" ;");
                }
                if (!field[11].equals("-")) {
                    System.out.printf("    :fullName \"%s\" ;%n", field[11]);
                }
                if (!field[5].equals("-")) {
                    if (linkAndXref[1] != null) {
                        System.out.printf("    nuc:db_xref %s ;%n", linkAndXref[1]);
                    }
                }
                if (!field[15].equals("-")) {
                    String featureType = formatStrArray(field[15]);
                    System.out.printf("    :featureType %s ;%n", featureType);
                }
                System.out.printf("    :taxid taxid:%s ;%n", field[0]);
                System.out.printf("    nuc:chromosome \"%s\" ;%n", field[6]);
                System.out.printf("    nuc:map \"%s\" ;%n", field[7]);
                String date = formatDate(field[14]);
                System.out.printf("    dct:modified \"%s\"^^xsd:date .%n", date);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void printPrefix() {
        System.out.println("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .");
        System.out.println("@prefix dct: <http://purl.org/dc/terms/> .");
        System.out.println("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .");
        System.out.println("@prefix ncbigene: <http://identifiers.org/ncbigene/> .");
        System.out.println("@prefix taxid: <http://identifiers.org/taxonomy/> .");
        System.out.println("@prefix hgnc: <http://identifiers.org/hgnc/> .");
        System.out.println("@prefix mim: <http://identifiers.org/mim/> .");
        System.out.println("@prefix mirbase: <http://identifiers.org/mirbase/> .");
        System.out.println("@prefix ensembl: <http://identifiers.org/ensembl/> .");
        System.out.println("@prefix nuc: <http://ddbj.nig.ac.jp/ontologies/nucleotide/> .");
        System.out.println("@prefix : <http://purl.org/net/orthordf/hOP/ontology#> .");
    }

    private static String formatStrArray(String str) {
        String[] arr = str.split("\\|");
        StringBuilder sb = new StringBuilder();
        for (String a : arr) {
            sb.append("\"").append(a).append("\" ,\n        ");
        }
        return sb.substring(0, sb.length() - 11);
    }

    private static String[] formatLink(String str) {
        String[] arr = str.split("\\|");
        StringBuilder linkBuilder = new StringBuilder();
        StringBuilder xrefBuilder = new StringBuilder();
        for (String a : arr) {
            if (a.matches("^MIM:(\\d+)$")) {
                linkBuilder.append("mim:").append(a.substring(4)).append(" ,\n        ");
            } else if (a.matches("^HGNC:HGNC:(\\d+)$")) {
                linkBuilder.append("hgnc:").append(a.substring(10)).append(" ,\n        ");
            } else if (a.matches("^Ensembl:(ENSG\\d+)$")) {
                linkBuilder.append("ensembl:").append(a.substring(8)).append(" ,\n        ");
            } else if (a.matches("^miRBase:(MI\\d+)$")) {
                linkBuilder.append("mirbase:").append(a.substring(8)).append(" ,\n        ");
            } else {
                xrefBuilder.append("\"").append(a).append("\" ,\n        ");
            }
        }

        String[] result = new String[2];
        if (linkBuilder.length() > 0) {
            result[0] = linkBuilder.substring(0, linkBuilder.length() - 11);
        }
        if (xrefBuilder.length() > 0) {
            result[1] = xrefBuilder.substring(0, xrefBuilder.length() - 11);
        }
        return result;
    }

    private static String formatDate(String date) {
        if (date.matches("^\\d{8}$")) {
            String year = date.substring(0, 4);
            String month = date.substring(4, 6);
            String day = date.substring(6, 8);
            return year + "-" + month + "-" + day;
        }
        return null;
    }
}
