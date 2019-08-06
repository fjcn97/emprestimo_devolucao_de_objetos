"use strict";

$('.clockpicker').clockpicker();

// For Registar empréstimo tab
$('#date').val(moment().format('YYYY-MM-DD'));
$('#time').val(moment().format('HH:mm'));

// For Registar devolução tab
$('#dateOfReception').val(moment().format('YYYY-MM-DD'));
$('#timeOfReception').val(moment().format('HH:mm'));

// Prevent numbers to be inserted in the person's name
function preventNumbers(event) {
    const keyCode = (event.keyCode ? event.keyCode : event.which);
    if (keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 105) {
        event.preventDefault();
    }
}

// For Registar empréstimo tab
// If all fields are filled, then enable the lend object button.
// If no one is filled or not all are filled, then disable the lend object button.
function enableDisableLendObjectButton(field) {
    $(field).on("keyup", function() {
        if ($.trim($('#object').val()) !== '' &&
        $.trim($('#personWhoLends').val()) !== '' &&
        $.trim($('#personWhoReceives').val()) !== '') {
            $('#lendObjectButton').prop('disabled', false);
        } else {
            $('#lendObjectButton').prop('disabled', true);
        }
    });
}

enableDisableLendObjectButton("#object");
enableDisableLendObjectButton("#personWhoLends");
enableDisableLendObjectButton("#personWhoReceives");

// Register lending of an object in session storage
function registerLending() {
    const lending = {
        'personWhoLends': String,
        'date': String,
        'time': String,
        'personWhoReceives': String
    };

    lending.personWhoLends = $("#personWhoLends").val();
    lending.date = $("#date").val();
    lending.time = $("#time").val();
    lending.personWhoReceives = $("#personWhoReceives").val();

    sessionStorage.setItem($("#object").val(), JSON.stringify(lending));
    alert("Objeto emprestado com sucesso!");
}


// For Registar devolução tab
// If all fields are filled, then enable the return object button.
// If no one is filled or not all are filled, then disable the return object button.
function enableDisableReturnObjectButton(field) {
    $(field).on("keyup", function() {
        if ($.trim($('#objectToBeReceived').val()) !== ''
        && $.trim($('#personWhoLended').val()) !== '') {
            $('#returnObjectButton').prop('disabled', false);
        } else {
            $('#returnObjectButton').prop('disabled', true);
        }
    });
}

enableDisableReturnObjectButton("#objectToBeReceived");
enableDisableReturnObjectButton("#personWhoLended");

// Register reception of an object
function registerReception() {
    const objectToBeReceived = $("#objectToBeReceived").val();
    // Person who originally lended the object
    const personWhoLended = $("#personWhoLended").val();

    if (objectToBeReceived in sessionStorage) {
        let objToBeReturned = sessionStorage.getItem(objectToBeReceived);
        objToBeReturned = JSON.parse(objToBeReturned);

        if (personWhoLended === objToBeReturned['personWhoLends']) {
            const date = $("#dateOfReception").val();
            const time = $("#timeOfReception").val();

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