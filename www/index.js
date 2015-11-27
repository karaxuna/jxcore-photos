(function check() {
    if (typeof jxcore === 'undefined') {
        setTimeout(check, 5);
    } else {
        jxcore.isReady(function () {
            jxcore('alert').register(alert);
            jxcore('app.js').loadMainFile(function(result, err) {
                if (err) {
                    alert(err);
                } else {
                    jxcore('getPhotoUrls').call(function (err, urls) {
                        init(urls);
                    });
                }
            });
        });
    }
})();

var slider;

function init(urls) {
    // initialize slider
    slider = jQuery('#slider').slick({
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true
    });

    // add photos
    urls.forEach(addPhotoToSlider);

    // take photo button
    document.getElementById('takePhoto').addEventListener('click', takeAndSavePhoto);
}

function addPhotoToSlider(url) {
    slider.slick('slickAdd', '<div><img src="' + url + '"/></div>');
}

function takeAndSavePhoto() {
    navigator.device.capture.captureImage(function (imageData) {
        var blob = dataURItoBlob('data:image/jpeg;base64,' + imageData);
        jxcore('savePhoto').call(blob, function (err, url) {
            if (err) {
                alert(err);
            } else {
                addPhotoToSlider(url);
            }
        });
    }, function () {
        alert('Taking photo failed: ' + err);
    });
}

function dataURItoBlob(dataURI, callback) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].s

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    var bb = new BlobBuilder();
    bb.append(ab);
    return bb.getBlob(mimeString);
}

