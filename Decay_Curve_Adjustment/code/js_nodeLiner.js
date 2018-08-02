autowatch = 1;

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;
var w = this.box.rect[2] - this.box.rect[0];
var h = this.box.rect[3] - this.box.rect[1];
var baseImage;

var lineWidth = 2.5;
var nodeSize = 0.5;
var spSize = 0;
var curve = 1;
var sw = 0;

setup_base();

//draw function
function paint(){
	mgraphics.image_surface_draw(baseImage);
	
	mgraphics.set_line_width(lineWidth);
	mgraphics.move_to(0, lineWidth/2);
	mgraphics.line_to(w*spSize, lineWidth/2);
    var segment = 25;
    for(var i=1; i<=segment; i++){
        var x = i*(nodeSize - spSize)/segment;
        var y = Math.min(Math.pow(i/segment, curve), 1);
        if((spSize+x)*w-lineWidth/2<lineWidth/2){
            x = lineWidth/w - spSize;
        }
        if(y*h-lineWidth/2<lineWidth/2){
            y = lineWidth/h;
        }
        mgraphics.line_to((spSize+x)*w, y*h-lineWidth/2);
    }
	mgraphics.line_to(w-lineWidth/4, h-lineWidth/2);
	
    mgraphics.stroke();
    outlet(0, nodeSize, curve, spSize);
}

function setup_base(){
    var baseMG = new MGraphics(w, h);
    
	//set background 
    baseMG.set_source_rgba(0.3, 0.3, 0.3, 0.5);
    baseMG.rectangle(0, 0, w, h);
    baseMG.fill();

	//set grid line 
	baseMG.set_source_rgba(0, 0, 0, 1);
	var gridNum = 10;
	baseMG.set_line_width(0.1);
	for(var i=1; i<gridNum; i++){
		baseMG.move_to(i * w/gridNum, 0);
		baseMG.line_to(i * w/gridNum, h);
		baseMG.move_to(0, i * h/gridNum);
		baseMG.line_to(w, i * h/gridNum);
	}
	baseMG.stroke();
	
	//set frame
	baseMG.set_source_rgba(0.4, 0.4, 0.4, 1);
	var frameWidth = 1.5;
	baseMG.set_line_width(frameWidth);
	baseMG.rectangle(frameWidth/2, frameWidth/2, w - frameWidth, h - frameWidth);
	baseMG.stroke();
    
    baseImage = new Image(baseMG);
    mgraphics.redraw();
}

function onclick(x, y, non, cmd){
    drag_click(x, y, cmd);
    mgraphics.redraw();
}

function ondrag(x, y, non, cmd){
    drag_click(x, y, cmd);
    mgraphics.redraw();
}

function drag_click(x, y, cmd){
    if(cmd==0){
        nodeSize = Math.min(Math.max(x/w, spSize+0.1), 1);
        if(y<h/2){
            curve = Math.min((h/2 - y)/(h/2), 1)*4 + 1;
        }
        else{
            curve = 1 - Math.min((y - h/2)/(h/2)*0.8, 0.8);
        }
    }
    else{
        spSize = Math.min(Math.max(x/w, 0), nodeSize - 0.1);
    }
}

function set_nodeSize(val){
	nodeSize = val;
	mgraphics.redraw();
}

function set_spSize(val){
	spSize = val;
	mgraphics.redraw();
}

function set_curve(val){
	curve = val;
	mgraphics.redraw();
}

//for log function
function log(message){
    for(var i=0, len=arguments.length; i<len; i++) {
        var message = arguments[i];
        if(message && message.toString) {
            var s = message.toString();
            if(s.indexOf("[object ") >= 0) {
                s = JSON.stringify(message);
            }
            post(s);
        }
        else if(message===null) {
            post("<null>");
        }
        
        else {
            post(message);
        }
    }
    post("\n");
}

	
