"use strict";

$('.clockpicker').clockpicker();

// For Registar empréstimo tab
document.getElementById('date').value = moment().format('YYYY-MM-DD');
document.getElementById('time').value = moment().format('HH:mm');

// For Registar devolução tab
document.getElementById('dateOfReception').value = moment().format('YYYY-MM-DD');
document.getElementById('timeOfReception').value = moment().format('HH:mm');

// Prevent numbers to be inserted in the person's name
function preventNumbers(event) {
    let keyCode = (event.keyCode ? event.keyCode : event.which);
    if (keyCode > 47 && keyCode < 58) {
        event.preventDefault();
    }
}


// Register lending of an object in session storage
function registerLending() {
    const object = document.getElementById("object").value;
    const personWhoLends = document.getElementById("personWhoLends").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const personWhoReceives = document.getElementById("personWhoReceives").value;

    // Prevent empty objects to be lended
    if ($.trim(object) === '') {
        alert("Introduza o nome do objeto a emprestar.");
        return false;
    // Prevent empty people to lend or receive objects
    } else if ($.trim(personWhoLends) === '') {
        alert("Introduza o nome da pessoa que empresta.")
        return false;
    } else if ($.trim(personWhoReceives) === '') {
        alert("Introduza o nome da pessoa que recebe.")
        return false;
    }

    const lending = {
        'personWhoLends': String,
        'date': String,
        'time': String,
        'personWhoReceives': String
    };

    lending.personWhoLends = personWhoLends;
    lending.date = date;
    lending.time = time;
    lending.personWhoReceives = personWhoReceives;

    sessionStorage.setItem(object, JSON.stringify(lending));
    alert("Objeto emprestado com sucesso!");
}


// Register reception of an object
function registerReception() {
    const objectToBeReceived = document.getElementById("objectToBeReceived").value;
    // Person who originally lended the object
    const personWhoLended = document.getElementById("personWhoLended").value;

    // Prevent empty objects to be lended
    if ($.trim(objectToBeReceived) === '') {
        alert("Introduza o nome do objeto a devolver.");
        return false;
    // Empty people didn't lend or receive objects
    } else if ($.trim(personWhoLended) === '') {
        alert("Introduza o nome da pessoa que emprestou.")
        return false;
    }

    if (objectToBeReceived in sessionStorage) {
        let objToBeReturned = sessionStorage.getItem(objectToBeReceived);
        objToBeReturned = JSON.parse(objToBeReturned);

        if (personWhoLended === objToBeReturned['personWhoLends']) {
            const date = document.getElementById("dateOfReception").value;
            const time = document.getElementById("timeOfReception").value;

            const dateOfLending = new Date(objToBeReturned['date'] + ' ' + objToBeReturned['time']);
            const dateOfReception = new Date(date + ' ' + time);

            if (dateOfReception >= dateOfLending) {
                const reception = {
                    'personWhoLended': String,
                    'date': String,
                    'time': String,
                };

                reception.personWhoLended = personWhoLended;
                reception.date = date;
                reception.time = time;

                sessionStorage.setItem(objectToBeReceived, JSON.stringify(reception));
                alert("Objeto devolvido com sucesso!");
            } else {
                alert(`Introduza uma data de devolução igual ou superior à data de empréstimo: ${dateOfLending.toLocaleString()}.`);
                return false;
            }
        } else {
            if (objToBeReturned['personWhoLends']) {
                alert(`A pessoa a quem vai devolver o objeto não corresponde à pessoa que o emprestou: ${objToBeReturned['personWhoLends']}!`);
            } else {
                alert("O objeto já foi devolvido!");
            }
            return false;
        }
    } else {
        alert("Objeto a devolver não existe!");
        return false;
    }
}


// Load table of lended objects
function loadTableOfLendedObjects() {
    let output = '', i = 1, lPeopleWhoLends = [];

    for (const obj in sessionStorage) {
        let lendedObj = sessionStorage.getItem(obj);
        lendedObj = JSON.parse(lendedObj);

        if (lendedObj !== null) {
            if (lendedObj['personWhoLends']) {
                output += `<tr><th class='text-right'>${String(i)}</th><td>${obj}</td><td>${lendedObj['personWhoLends']}</td><td class='text-right'>${new Date(lendedObj['date']).toLocaleDateString()}</td><td class='text-right'>${lendedObj['time']}</td><td>${lendedObj['personWhoReceives']}</td></tr>`;
                $("#tableOfLendedObjects").html(output);
                i += 1;
                lPeopleWhoLends.push(lendedObj['personWhoLends']);
            }
        }
    }

    if (lPeopleWhoLends.length === 0) {
        output += `<tr class="text-center"><th>-</th><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>`;
        $("#tableOfLendedObjects").html(output);
    }
}


// Load table of received objects
function loadTableOfReceivedObjects() {
    let output = '', i = 1, lPeopleWhoLended = [];

    for (const obj in sessionStorage) {
        let receivedObj = sessionStorage.getItem(obj);
        receivedObj = JSON.parse(receivedObj);

        if (receivedObj !== null) {
            if (receivedObj['personWhoLended']) {
                output += `<tr><th class='text-right'>${String(i)}</th><td>${obj}</td><td>${receivedObj['personWhoLended']}</td><td class='text-right'>${new Date(receivedObj['date']).toLocaleDateString()}</td><td class='text-right'>${receivedObj['time']}</td></tr>`;
                $("#tableOfReceivedObjects").html(output);
                i += 1;
                lPeopleWhoLended.push(receivedObj['personWhoLended']);
            }
        }
    }

    if (lPeopleWhoLended.length === 0) {
        output += `<tr class="text-center"><th>-</th><td>-</td><td>-</td><td>-</td><td>-</td></tr>`;
        $("#tableOfReceivedObjects").html(output);
    }
}