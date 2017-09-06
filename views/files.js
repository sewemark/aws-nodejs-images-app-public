
function doButtonClickHandler(event) {
        sendFilesOperation();
        function getFileOperations() {
            var files = [];
            var checkboxes = document.getElementsByClassName("cutomCheckbox");
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    var next = checkboxes[i].nextSibling;
                    var operation;
                    var radios = document.getElementsByName(i + "operationRadioButtons")
                    for (var j = 0; j < radios.length; j++) {
                        if (radios[j].checked == true)
                            operation = radios[j].value;
                    }
                    files.push({file: checkboxes[i].id, operation: operation, params: getParams()});
                }
            }
            return files;
        }
        function getParams() {
            var params = {};
            if (operation == "rotateRadio") {
                params.angels = document.getElementById('rotateImageAngels').value;
            } else {
                params.width = document.getElementById('resizeImageWidth').value;
                params.height = document.getElementById('resizeImageHeight').value;
            }
            return params;
        }
        function sendFilesOperation() {
            var sendSQS = '/sendSQS';
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var responseDoc = xhr.responseXML;
                }
            };
            xhr.open('POST', sendSQS, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(getFileOperations()));
        }
}

function downloadButtonClickHandler (button) {
    var id = button.id.slice(0, button.id.length - 6);
    window.location = "http://localhost:55555/download?fileName=" + id;
}

function operationClickHandle(item) {
    showHideItems(item.value);
}

function showHideItems(value) {
    if (value == 'resizeRadio') {
        var element = document.getElementById('resizeDiv');
        element.style.display = 'block'
        var element = document.getElementById('roateDiv');
        element.style.display = 'none'
    } else if (value == 'rotateRadio') {
        var element = document.getElementById('resizeDiv');
        element.style.display = 'none'
        var element = document.getElementById('roateDiv');
        element.style.display = 'block'
    } else {
        var element = document.getElementById('resizeDiv');
        element.style.display = 'none'
        var element = document.getElementById('roateDiv');
        element.style.display = 'none'
    }
}
