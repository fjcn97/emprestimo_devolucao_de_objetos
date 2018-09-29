"use strict";

function mostrarlista() {
    $("#tab_objetos_emprestados").toggle();
    var output = '', key, i = 1;

    for (key in sessionStorage) {
        var dados_do_empr = sessionStorage.getItem(key);
        var splitado = dados_do_empr.split(',');
        
        if (splitado.length === 4) {
            output +=  "<tr>" + "<th class='text-right'>" + String(i) + "</th>" + "<td>" + key + "</td>" + "</tr>";
            $("#tab_corpo").html(output);
            i += 1;
        }
    }
}