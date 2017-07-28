if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.splice = function(start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}

var resizeImage = function (settings) {
  var file = settings.file;
  var maxSize = settings.maxSize;
  var reader = new FileReader();
  var image = new Image();
  var canvas = document.createElement('canvas');
  var dataURItoBlob = function (dataURI) {
      var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
          atob(dataURI.split(',')[1]) :
          unescape(dataURI.split(',')[1]);
      var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var max = bytes.length;
      var ia = new Uint8Array(max);
      for (var i = 0; i < max; i++)
          ia[i] = bytes.charCodeAt(i);
      return new Blob([ia], { type: mime });
  };
  var resize = function () {
        var width = image.width;
        var height = image.height;
        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg');
        return dataUrl;
    };
    return new Promise(function (ok, no) {
        if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
        }
        reader.onload = function (readerEvent) {
            image.onload = function () { return ok(resize()); };
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    });
};

function sendFile(file, callbacks, baseUrl) {
  console.log(file)

  // The image's largest dimension should be at most 960 pixels, and so we resize it here
  resizeImage({
      file: file,
      maxSize: 960
  }).then(function (resizedImage) {
      var data = {'file': resizedImage};
      console.log(data);

      callbacks.onImageUploadBegin();

      // This is the call that requires jQuery. If you want to replace it with another
      // framework that encapsulates XmlHttpRequest queries, feel free.
      $.post({
        url: baseUrl ? baseUrl + '/process' : '/process',
        data: data,
        dataType: 'json',
        complete: function() {

        },
        success: function(data) {
          console.log("success: ", data);

          if (data.code) {
            // The code is sent back from the service without dashes,
            // and so we add them back in here.
            console.log("Code: " + data.code);
            var currentCode = data.code;
            if(data.code.length > 3) {
              currentCode = currentCode.splice(3, 0, '-')
            }
            if (data.code.length > 6) {
              currentCode = currentCode.splice(7, 0, '-');
            }
            if (data.code.length > 9) {
              currentCode = currentCode.splice(11, 0, '-');
            }

            callbacks.onCodeReceived(data.id, currentCode);
          } else {
            callbacks.onError({ message: "No valid code returned", error: data.error, id:data.id });
          }
        },
        error: function() {
          // Log the error, show an alert, whatever works for you
          callbacks.onError({ message: "Upload failed", error: "Upload failed" });
        }
      });
      console.log("upload resized image")
  }).catch(function (err) {
      callbacks.onError({ message: "Resize failed", error: err });
  });
}
