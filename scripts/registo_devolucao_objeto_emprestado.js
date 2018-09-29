"use strict";

//Não existem nomes de pessoas com números...
function textonly(e) {
    var code;
    if (!e) var e = window.event;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    var character = String.fromCharCode(code);
    var AllowRegex  = /^[\ba-zA-Z\u00E0-\u00FC\s]$/;
    if (AllowRegex.test(character)) return true;
    return false;
}

function registo_dev() {
    var obj = document.getElementById("objeto").value;
    //Remetente original inserido
    var remo = document.getElementById("remo").value;
    var icon_alert = "<i class='fas fa-exclamation-circle'></i>"
    
    //Para impedir que se devolvam objetos vazios
    if ($.trim(obj) === '') {
        alert("Introduza o nome do objeto a devolver.");
        return false;
    //Para impedir que se devolvam objetos a pessoas vazias
    } else if ($.trim(remo) === '') {
        alert("Introduza o nome do remetente original.")
        return false;
    }
                
    if (obj in sessionStorage) {
        var dados_do_empr = sessionStorage.getItem(obj);
        dados_do_empr = dados_do_empr.split(',');
        //Remetente original
        if (remo === dados_do_empr[0]) {
            var lobj = [];
            var data = document.getElementById("datadev").value;
            var tempo = document.getElementById("myTime").value;
            lobj.push(remo);
            lobj.push(data);
            lobj.push(tempo);
            
            var dataEmprestimo = new Date(dados_do_empr[1] + ' ' + dados_do_empr[2])
            var dataEmprestimoSemSegMil = dataEmprestimo.setSeconds(0,0);
            var dataDevolucao = new Date(data + ' ' + tempo).setSeconds(0,0);

            if (dataDevolucao >= dataEmprestimoSemSegMil) {
                sessionStorage.setItem(obj, lobj);
                alert("Objeto devolvido com sucesso!");
            } else {
                alert("Introduza uma data de devolução igual ou superior à data de empréstimo: " + dataEmprestimo);
                return false;
            }
        } else {
            alert("A pessoa a quem vai devolver o objeto não corresponde ao remetente original " + dados_do_empr[0] + ".");
            return false;
        } 
    } else {
        alert("Objeto a devolver não existe.");
        return false;
    }
}