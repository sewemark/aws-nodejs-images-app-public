
function submitButtonClickHandler(event) {
        var fileInput = document.getElementById('file_input');
        var file = fileInput.files[0];
		console.log(file);
        if (file !== undefined && file !== null) {
            var filename = file.name;
            getCredentialForFile(filename, function (result) {
                console.log(result.params["x-amz-algorithm"]);
				console.log(document.getElementById("key"));
                document.getElementById("key").value = result.params.key;
                document.getElementById("acl").value = result.params.acl;
                document.getElementById("success_action_status").value = result.params.success_action_status;
                document.getElementById("policy").value = result.params.policy;
                document.getElementById("x-amz-algorithm").value = result.params["x-amz-algorithm"];
                document.getElementById("x-amz-credential").value = result.params["x-amz-credential"];
                document.getElementById("x-amz-date").value = result.params["x-amz-date"];
                document.getElementById("x-amz-signature").value = result.params["x-amz-signature"];
                uploadToS3(result);
            });
        } else {
            console.log("first upload file");
        }
}

function uploadToS3(result) {
    var form = document.getElementById("uploadForm");
	console.log(document.getElementById("key").value);
    var formData = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        console.log("CALLBACK");
        if (xhr.readyState == 4 && ((xhr.status == 200) || (xhr.status == 2001))) {
            var responseDoc = xhr.responseXML;

            location.reload();
        }
    };
	console.log(result.upload_url)
    xhr.open('POST', result.upload_url, true);
	
    xhr.send(formData);
}

function getCredentialForFile (filename, callback) {
    var getCredentialForFileUrl = '/getCredentialForFile';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            callback(response);
        }
    };
    xhr.open("GET", getCredentialForFileUrl + "?filename=" + filename, true);
    xhr.send();
}
