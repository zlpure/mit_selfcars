
//<![CDATA[
//ref : http://selfdrivingcars.mit.edu/deeptesla/
//First, we need to load the image into the browser:
var dimg = new Image();
dimg.onload = function() {
    var data_canvas = document.createElement('canvas');
    data_canvas.width = base_input_x * base_input_y;
    data_canvas.height = batch_size;
    var data_ctx = data_canvas.getContext("2d");
    data_ctx.drawImage(dimg, 0, 0);
    img_data = data_ctx.getImageData(0, 0, data_canvas.width, data_canvas.height);
    train_worker.postMessage([imgData, batch_info]);
}
dimg.src = "our_example_batch.jpg";

//Now that we have our image data, we need to transform it into a ConvNetJS volume – 
//the basic unit of data representation in ConvNetJS.
var decode_images = function (img_data) {
    var decoded_images = [];
 
    for (var z = 0; z < batch_size; z++) {
        var image_vol = new convnetjs.Vol(base_input_x, base_input_y, 3, 0.0);
        var row_size = base_input_x * base_input_y;
 
        for (var t = (row_size * z); t < (row_size * (z + 1)); t++) {
            var translation_index = (t - row_size * z);
            image_vol.w[(translation_index * 3)] = (img_data.data[(t * 4)]) / 255;
            image_vol.w[(translation_index * 3) + 1] = (img_data.data[(t * 4) + 1]) / 255;
            image_vol.w[(translation_index * 3) + 2] = (img_data.data[(t * 4) + 2]) / 255;
        }
        decoded_images.push(image_vol);
    }
 
    return decoded_images;
};

// load a hidden video element:
<video style="display:none;" controls="true" height="820" width="1280" id="normal_video" src="example_video.mkv"></video>

//create a Javascript function that runs another function on each repaint of the browser
function draw() {
    if (window.requestAnimationFrame) {
        window.requestAnimationFrame(draw);
    } else if (window.msRequestAnimationFrame) {
        window.msRequestAnimationFrame(draw);
    } else if (window.mozRequestAnimationFrame) {
        window.mozRequestAnimationFrame(draw);
    } else if (window.webkitRequestAnimationFrame) {
        window.webkitRequestAnimationFrame(draw);
    } else {
        setTimeout(draw, 16.7);
    }
 
        video_to_canvas();
}

//out network structure
{
	"network" : [
		{ "type" : "input", "out_sx" : 200, "out_sy" : 66, "out_depth" : 3 },
		{ "type" : "conv", "sx" : 3, "filters" : 16, "stride" : 5, "pad" : 2, "activation" : "relu" },
		{ "type" : "conv", "sx" : 3, "filters" : 16, "stride" : 5, "pad" : 2, "activation" : "relu" },
		{ "type" : "pool", "sx" : 2, "stride" : 2},
		{ "type" : "conv", "sx" : 3, "filters" : 8, "stride" : 3, "pad" : 2, "activation" : "relu" },
		{ "type" : "conv", "sx" : 3, "filters" : 8, "stride" : 3, "pad" : 2, "activation" : "relu" },
		{ "type" : "pool", "sx" : 2, "stride" : 2},
		{ "type" : "conv", "sx" : 3, "filters" : 8, "stride" : 1, "pad" : 2, "activation" : "relu" },
		{ "type" : "conv", "sx" : 3, "filters" : 8, "stride" : 1, "pad" : 2, "activation" : "relu" },
		{ "type" : "pool", "sx" : 2, "stride" : 2 },
		{ "type" : "regression", "num_neurons" : 1 }
	],
	"trainer" : { "method" : "adadelta", "batch_size" : 4, "l2_decay" : 0.0001 }
}

//start train
var imgData = ctx.getImageData(0, 0, 1280, 720); // if constructing a 1280x720 volume
var vol = image_data_to_volume(imgData);
network.forward(vol);

//]]>
