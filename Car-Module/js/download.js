function saveFile4D() {
    var BB = window.Blob;
    var data = document.getElementById('data4D');
    saveAs(
        new BB(
            [data.value.replace(/\n/g, '\r\n')], {
                type: 'text/plain;charset=' + document.characterSet
            }
        ), 'train4D.txt'
    );
}

function saveFile6D() {
    var BB = window.Blob;
    var data = document.getElementById('data6D');
    saveAs(
        new BB(
            [data.value.replace(/\n/g, '\r\n')], {
                type: 'text/plain;charset=' + document.characterSet
            }
        ), 'train6D.txt'
    );
}
