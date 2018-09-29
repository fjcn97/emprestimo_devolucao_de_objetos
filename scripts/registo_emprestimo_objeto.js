"use strict";

//Não existem nomes de pessoas com números...
function textonly(e){
    var code;
    if (!e) var e = window.event;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    var character = String.fromCharCode(code);
    var AllowRegex  = /^[\ba-zA-Z\u00E0-\u00FC\s]$/;
    if (AllowRegex.test(character)) return true;
    return false; 
}

function registo_emp() {
    var lobj = [];
    var obj = document.getElementById("objeto").value;
    var rem = document.getElementById("rem").value;
    var data = document.getElementById("dataemp").value;
    var tempo = document.getElementById("myTime").value;
    var dest = document.getElementById("destinatario").value;
    
    //Para impedir que se emprestem objetos vazios
    if ($.trim(obj) === '') {
        alert("Introduza o nome do objeto a emprestar.");
        return false;
    //Para impedir que pessoas vazias emprestem objetos
    } else if ($.trim(rem) === '') {
        alert("Introduza o nome do remetente.")
        return false;
    } else if ($.trim(dest) === '') {
        alert("Introduza o nome do destinatário.")
        return false;
    }
    
    lobj.push(rem);
    lobj.push(data);
    lobj.push(tempo);
    lobj.push(dest);
    sessionStorage.setItem(obj, lobj);
    alert("Objeto emprestado com sucesso!");
}