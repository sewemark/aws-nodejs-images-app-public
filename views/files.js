
function doButtonClickHandler(event) {
        sendFilesOperation();
        function getFileOperations() {
            var files = [];
            var checkboxes = document.getElementsByClassName("cutomCheckbox");
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    var operation;
                    var radios = document.getElementsByName(i.toString() + "_operationRadioButtons")
                    for (var j = 0; j < radios.length; j++) {
                        if (radios[j].checked == true)
                            operation = radios[j].value;
                    }
					var fileName =  checkboxes[i].id.slice(0,checkboxes[i].id.lastIndexOf('_'));
                    files.push({file:fileName, operation: operation, params: getParams(operation,i)});
                }
            }
            return files;
        }

        function getParams(operation,index) {
            var params = {};
            if (operation == "rotateRadio") {
                params.angels = document.getElementById(index+'rotateImageAngels').value;
            } else {
                params.width = document.getElementById(index+'resizeImageWidth').value;
                params.height = document.getElementById(index+'resizeImageHeight').value;
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

function deleteButtonClickHandler(button) {
    var fileName = button.id.slice(0, button.id.length - 6);
    var getDeleteForFileUrl = '/delete';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            location.reload();
        }
    };
    xhr.open("GET", getDeleteForFileUrl + "?fileName=" + fileName, true);
    xhr.send();
}

function downloadButtonClickHandler (button) {
    var id = button.id.slice(0, button.id.length - 6);
    var url = document.URL.slice(0,document.URL.toString().lastIndexOf('/'));
    window.location = url+ "/download?fileName=" + id;
}

function operationClickHandle(item) {
    console.log(item.name)
    var index= item.name.slice(0,item.name.indexOf('_'));
    console.log(index);
    showHideItems(item.value ,index);
}

function showHideItems(value,index) {
    if (value == 'resizeRadio') {
        var element = document.getElementById('resizeDiv' +index);
        element.style.display = 'block'
        var element = document.getElementById('roateDiv'+index);
        element.style.display = 'none'
    } else if (value == 'rotateRadio') {
        var element = document.getElementById('resizeDiv'+index);
        element.style.display = 'none'
        var element = document.getElementById('roateDiv'+index);
        element.style.display = 'block'
    } else {
        var element = document.getElementById('resizeDiv' + index);
        element.style.display = 'none'
        var element = document.getElementById('roateDiv'+index);
        element.style.display = 'none'
    }
}
