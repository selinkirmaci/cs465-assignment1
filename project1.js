

var canvas;
var gl;
var gradientSlider;
var hue = 50;

var t = [];
var prevElement;
var selectedLayer = 0;
var a = 0.1;

var indexArr = [];

var maxNumTriangles = 1000;
var maxNumVertices = 3 * maxNumTriangles;
var index = 0;
var colorIndex = 0;
var indexColor = 0;


var redraw = false;
var colorG = [];

var rC = 0.0;
var gC = 0.0;
var bC = 0.0;

var br;
var bg;
var bb;

var t1, t2, t3, t4;


var colorChosen;
var fromButtons = 1;

var strokeStartIndex;
var strokeEndIndex;


var recValueUndo = [];



var shape = 0;
var filled = 0;

var recValueList = [];
var cirValueList = [];
var triValueList = [];
var j = 0;

var drawingShape = 0;

var LayerALevel = 1;
var LayerBLevel = 2;
var LayerCLevel = 3;

var deleteMode = 0;
var arrIndex = 0;


//New added
var pointArr = [];
var vBuffer;
var colorArr = [];
var cBuffer;
var recArr = [];
var triArr = [];
var circleArr = [];
var shapeArr = [];


var strokeArr = [];
var strokeRedoArr = [];

var undoStrokeTemp = [];
var redoStrokeTemp = [];

var recIndex = 0;


var colors = [
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gradientCanvas = document.getElementById("gl-canvas-gradient");

    redButton = document.getElementById("redButton");
    greenButton = document.getElementById("greenButton");
    blueButton = document.getElementById("blueButton");
    yellowButton = document.getElementById("yellowButton");
    magentaButton = document.getElementById("magentaButton");
    cyanButton = document.getElementById("cyanButton");
    gradientSlider = document.getElementById("gradientColorRange");

    recE = document.getElementById("rectangleEmpty");
    recF = document.getElementById("rectangleFilled");
    cirE = document.getElementById("circleEmpty");
    cirF = document.getElementById("circleFilled");
    triE = document.getElementById("triEmpty");
    triF = document.getElementById("triFilled");
    outShapeMode = document.getElementById("outShapeMode");
    deleteButton = document.getElementById("delete");

    saveButton = document.getElementById("saveButton");
    loadButton = document.getElementById("loadButton");




    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl_gradient = WebGLUtils.setupWebGL(gradientCanvas);
    if (!gl_gradient) { alert("WebGL isn't available"); }


    var verticesGradient = [
        vec2(-1.0, -1.0),
        vec2(-1.0, 1.0),
        vec2(1.0, 1.0),
        vec2(1.0, -1.0)
    ];

    var vertexColorsGradient = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(1.0, 1.0, 1.0, 1.0),  // white
        vec4(0.0, 0.0, 0.0, 1.0),  // black
    ];



    var dragSrcEl = null;


    function handleDragStart(e) {
        this.style.opacity = '0.4';

        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');

        }

        return false;
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';

        items.forEach(function (item) {
            item.classList.remove('over');
        });
    }


    let items = document.querySelectorAll('.container .box');
    items.forEach(function (item) {
        item.addEventListener("click", function (event) {
            if (event != prevElement) {
                if (prevElement != null)
                    prevElement.setAttribute("class", "box");
                event.srcElement.setAttribute("class", "highlight");
                selectedLayer = parseFloat(event.target.title);
                prevElement = event.srcElement;
            }
        });
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });

    //Save button
    saveButton.addEventListener("click", function (event) {
        console.log("save");
    });

    loadButton.addEventListener("click", function (event) {
        console.log("load");
    });



    //Shape Buttons
    recE.addEventListener("click", function (event) {
        shape = 0;
        filled = 0;
        drawingShape = 1;
    });
    recF.addEventListener("click", function (event) {
        shape = 0;
        filled = 1;
        drawingShape = 1;
    });
    cirE.addEventListener("click", function (event) {
        shape = 1;
        filled = 0;
        drawingShape = 1;
    });
    cirF.addEventListener("click", function (event) {
        shape = 1;
        filled = 1;
        drawingShape = 1;
    });
    triE.addEventListener("click", function (event) {
        shape = 2;
        filled = 0;
        drawingShape = 1;
    });
    triF.addEventListener("click", function (event) {
        shape = 2;
        filled = 1;
        drawingShape = 1;
    });
    outShapeMode.addEventListener("click", function (event) {
        drawingShape = 0;
    });

    //Delete
    deleteButton.addEventListener("click", function (event) {
        deleteMode = !deleteMode;
        drawingShape = 0;
    });


    //Fixed Color Buttons
    redButton.addEventListener("click", function (event) {
        console.log("redButton");
        colorIndex = 0;
        fromButtons = 1;
    });
    greenButton.addEventListener("click", function (event) {
        console.log("greenButton");
        colorIndex = 1;
        fromButtons = 1;
    });
    blueButton.addEventListener("click", function (event) {
        console.log("blueButton");
        colorIndex = 2;
        fromButtons = 1;
    });
    yellowButton.addEventListener("click", function (event) {
        console.log("yellowButton");
        colorIndex = 3;
        fromButtons = 1;
    });
    magentaButton.addEventListener("click", function (event) {
        console.log("magentaButton");
        colorIndex = 4;
        fromButtons = 1;
    });
    cyanButton.addEventListener("click", function (event) {
        console.log("cyanButton");
        colorIndex = 5;
        fromButtons = 1;
    });

    //GRadient Slider for Color Change
    gradientSlider.onchange = function () {
        hue = event.srcElement.value;
        gl_gradient.bindBuffer(gl_gradient.ARRAY_BUFFER, cBufferGradient);

        var c = 1.0;
        var x = c * (1.0 - Math.abs(((hue / 60.0) % 2) - 1.0));
        var m = 0.0;
        if (hue <= 60) {
            rC = c;
            gC = x;
            bC = 0;
        } else if (hue <= 120) {
            rC = x;
            gC = c;
            bC = 0;

        } else if (hue <= 180) {
            rC = 0;
            gC = c;
            bC = x;

        } else if (hue <= 240) {
            rC = 0;
            gC = x;
            bC = c;

        } else if (hue <= 300) {
            rC = x;
            gC = 0;
            bC = c;
        } else if (hue <= 360) {
            rC = c;
            gC = 0;
            bC = x;
        }

        var rColor = vec4(rC, gC, bC, 1.0);
        colorG = [vertexColorsGradient[0], vertexColorsGradient[1], rColor, vertexColorsGradient[2]];
        gl_gradient.bufferData(gl_gradient.ARRAY_BUFFER, flatten(colorG), gl_gradient.STATIC_DRAW);
    };

    canvas.addEventListener("mousedown", function (event) {
        strokeStartIndex = index;
        if (!drawingShape) {
            redraw = true;
        } else {
                t1 = vec4(2 * event.clientX / canvas.width - 1,
                    2 * (canvas.height - event.clientY) / canvas.height - 1, 0.0, 1.0);
            
        }
    });

    function calculate(r1, r2, tanValue) {
        var a = Math.sqrt((r1 * r1 * r2 * r2) / (tanValue * tanValue*r1*r1 + r2*r2));
        return a;
    }

    canvas.addEventListener("mouseup", function (event) {

        if (!drawingShape) {
            redraw = false;
        } else {
            if (fromButtons)
                t = vec4(colors[colorIndex]);
            else
                t = vec4(colorChosen);

            //rectangles
            if (shape === 0 && filled === 0) {
                t2 = vec4(2 * event.clientX / canvas.width - 1,
                    2 * (canvas.height - event.clientY) / canvas.height - 1, 0.0, 1.0);
                t3 = vec4(t1[0], t2[1], 0.0, 1.0);
                t4 = vec4(t2[0], t1[1], 0.0, 1.0);

                pointArr.push(t1);
                pointArr.push(t3);
                pointArr.push(t2);
                pointArr.push(t4);


                colorArr.push(t);
                colorArr.push(t);
                colorArr.push(t);
                colorArr.push(t);


                index += 4;

                shapeArr.push(1);
                shapeArr.push(1);
                shapeArr.push(1);
                shapeArr.push(1);
            } else if (shape === 0 && filled === 1) {
                t2 = vec4(2 * event.clientX / canvas.width - 1,
                    2 * (canvas.height - event.clientY) / canvas.height - 1, 0.0, 1.0);
                t3 = vec4(t1[0], t2[1], 0.0, 1.0);
                t4 = vec4(t2[0], t1[1], 0.0, 1.0);

                pointArr.push(t1);
                pointArr.push(t3);
                pointArr.push(t2);
                pointArr.push(t4);


                colorArr.push(t);
                colorArr.push(t);
                colorArr.push(t);
                colorArr.push(t);


                index += 4;

                shapeArr.push(2);
                shapeArr.push(2);
                shapeArr.push(2);
                shapeArr.push(2);
            }
            //ellipses
            else if (shape === 1 && filled === 0) {
               
                t2 = vec4(2 * event.clientX / canvas.width - 1,
                    2 * (canvas.height - event.clientY) / canvas.height - 1, 0.0, 1.0);

                var centerx = (t1[0] + t2[0]) / 2;
                var centery = (t1[1] + t2[1]) / 2;

                console.log(pointArr);

                var center = vec4(centerx, centery, 0.0, 1.0);
                var side1 = vec4(t2[0], centery, 0.0, 1.0);
                var top = vec4(centerx, t1[1], 0.0, 1.0);
                var side2 = vec4(t1[0], centery, 0.0, 1.0);
                var bottom = vec4(centerx, t2[1]);
                var r2 = Math.abs((t2[1] - t1[1]) / 2);
                var r1 = Math.abs((t2[0] - t1[0]) / 2);



                pointArr.push(vec4(t2[0], centery, 0.0, 1.0));

                for (var i = 1; i < 40; i++) {
                    var tanValue = Math.tan(9 * (i) * 0.017453293);

                    if (i < 10) {
                        var a = calculate(r1, r2, tanValue);
                        var b = Math.abs(a * tanValue);
                        var temp = vec4(centerx + a, centery + b, 0.0, 1.0);
                    }
                    else if (i === 10)
                        var temp = vec4(centerx, centery + r2, 0.0, 1.0);
                    else if (i < 20 && i != 10) {
                        var a = calculate(r1, r2, tanValue);
                        var b = Math.abs(a * tanValue);
                        var temp = vec4(centerx - a, centery + b, 0.0, 1.0);
                    }
                    else if (i === 20)
                        var temp = vec4(t1[0], centery, 0.0, 1.0);
                    else if (i < 30 && i != 20) {
                        var a = calculate(r1, r2, tanValue);
                        var b = Math.abs(a * tanValue);
                        var temp = vec4(centerx - a, centery - b, 0.0, 1.0);
                    }
                    else if (i === 30)
                        var temp = vec4(centerx, t2[1], 0.0, 1.0);
                    else if (i < 40 && i != 30) {
                        var a = calculate(r1, r2, tanValue);
                        var b = Math.abs(a * tanValue);
                        var temp = vec4(centerx + a, centery - b, 0.0, 1.0);
                    }
                    pointArr.push(temp);
                }

                index += 40;

                for (var i = 0; i < 40; i++) {
                    colorArr.push(t);
                    shapeArr.push(3);
                }


            } else if (shape === 1 && filled === 1) {
                t2 = vec4(2 * event.clientX / canvas.width - 1,
                    2 * (canvas.height - event.clientY) / canvas.height - 1, 0.0, 1.0);

                var centerx = (t1[0] + t2[0]) / 2;
                var centery = (t1[1] + t2[1]) / 2;

                console.log(pointArr);

                var center = vec4(centerx, centery, 0.0, 1.0);
                var side1 = vec4(t2[0], centery, 0.0, 1.0);
                var top = vec4(centerx, t1[1], 0.0, 1.0);
                var side2 = vec4(t1[0], centery, 0.0, 1.0);
                var bottom = vec4(centerx, t2[1]);
                var r2 = Math.abs((t2[1] - t1[1]) / 2);
                var r1 = Math.abs((t2[0] - t1[0]) / 2);



                pointArr.push(center);
                pointArr.push(vec4(t2[0], centery, 0.0, 1.0));

                for (var i = 1; i < 39; i++) {
                    var tanValue = Math.tan(9 * (i) * 0.017453293);

                    if (i < 10) {
                        var a = calculate(r1, r2, tanValue);
                        var b = Math.abs(a * tanValue);
                        var temp = vec4(centerx + a, centery + b, 0.0, 1.0);
                    }
                    else if (i === 10)
                        var temp = vec4(centerx, centery + r2, 0.0, 1.0);
                    else if (i < 20 && i != 10) {
                        var a = calculate(r1, r2, tanValue);
                        var b = Math.abs(a * tanValue);
                        var temp = vec4(centerx - a, centery + b, 0.0, 1.0);
                    }
                    else if (i === 20)
                        var temp = vec4(t1[0], centery, 0.0, 1.0);
                    else if (i < 30 && i != 20) {
                        var a = calculate(r1, r2, tanValue);
                        var b = Math.abs(a * tanValue);
                        var temp = vec4(centerx - a, centery - b, 0.0, 1.0);
                    }
                    else if (i === 30)
                        var temp = vec4(centerx, t2[1], 0.0, 1.0);
                    else if (i < 40 && i != 30) {
                        var a = calculate(r1, r2, tanValue);
                        var b = Math.abs(a * tanValue);
                        var temp = vec4(centerx + a, centery - b, 0.0, 1.0);
                    }
                    pointArr.push(temp);
                }
                pointArr.push(vec4(t2[0], centery, 0.0, 1.0));

                index += 41;

                for (var i = 0; i < 41; i++) {
                    colorArr.push(t);
                    shapeArr.push(4);
                }
            }
            //triangles
            else if (shape === 2 && filled === 0) {
                t2 = vec4(2 * event.clientX / canvas.width - 1,
                    2 * (canvas.height - event.clientY) / canvas.height - 1, 0.0, 1.0);

                t3 = vec2(2 * t1[0] - t2[0], t2[1]);
                index += 3;
                pointArr.push(t1);
                pointArr.push(t3);
                pointArr.push(t2);

                colorArr.push(t);
                colorArr.push(t);
                colorArr.push(t);

                shapeArr.push(5);
                shapeArr.push(5);
                shapeArr.push(5);
            } else if (shape === 2 && filled === 1) {
                t2 = vec4(2 * event.clientX / canvas.width - 1,
                    2 * (canvas.height - event.clientY) / canvas.height - 1, -selectedLayer / 3, 1.0);

                t3 = vec2(2 * t1[0] - t2[0], t2[1]);
                index += 3;
                pointArr.push(t1);
                pointArr.push(t3);
                pointArr.push(t2);

                colorArr.push(t);
                colorArr.push(t);
                colorArr.push(t);

                shapeArr.push(6);
                shapeArr.push(6);
                shapeArr.push(6);
            }

           

        }
        strokeEndIndex = index;

        strokeArr.push(strokeEndIndex - strokeStartIndex);
        
    });

    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'z') {
            if (strokeArr.length > 0) {
                var redoIndex = strokeArr.pop();
                strokeRedoArr.push(redoIndex);
              
                index -= redoIndex;
               
            } else {
            }
        } else if (event.ctrlKey && event.key === 'y') {
            if (strokeRedoArr.length > 0) {
                var undoIndex = strokeRedoArr.pop();
                strokeArr.push(undoIndex);
               
                index += undoIndex;
            } else {
                
            }
        }
    });

    canvas.addEventListener("mousemove", function (event) {

        if (!drawingShape) {

            if (redraw && !deleteMode) {
                t = vec4(2 * event.clientX / canvas.width - 1,
                    2 * (canvas.height - event.clientY) / canvas.height - 1, 0, 1.0);

                pointArr.push(t);
                shapeArr.push(0);

                if (fromButtons)
                    t = vec4(colors[colorIndex]);
                else
                    t = vec4(colorChosen);

                colorArr.push(t);

                index++;

            } else if (redraw && deleteMode) {
                t = vec4(2 * event.clientX / canvas.width - 1,
                    2 * (canvas.height - event.clientY) / canvas.height - 1, 0, 1.0);


                for (var i = 0; i < index; i++) {
                    if ((t[0] + 0.05 > pointArr[i][0]) && (t[0] - 0.05 < pointArr[i][0]) && (t[1] + 0.05 > pointArr[i][1]) && (t[1] - 0.05 < pointArr[i][1])) {
                        if (shapeArr[i] === 0) {
                            pointArr.splice(i, 1);
                            shapeArr.splice(i, 1);
                            colorArr.splice(i, 1);
                            index--;
                            break;
                        }
                    }
                }   
            }
        } else {

        }
    });

    gradientCanvas.addEventListener("mousedown", function (event) {
        render();
        fromButtons = 0;
        var pixels = new Uint8Array(4);

        gl_gradient.readPixels((event.clientX - 512), (512 - event.clientY), 1, 1, gl_gradient.RGBA, gl_gradient.UNSIGNED_BYTE, pixels);

        br = pixels[0] / 256;
        bg = pixels[1] / 256;
        bb = pixels[2] / 256;

        colorChosen = vec4(br, bg, bb, 1.0);
    });



    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    gl_gradient.viewport(0, 0, gradientCanvas.width, gradientCanvas.height);
    gl_gradient.clearColor(1.0, 1.0, 1.0, 1.0);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    var program_gradient = initShaders(gl_gradient, "vertex-shader-gradient", "fragment-shader-gradient");

    gl.useProgram(program);
    gl_gradient.useProgram(program_gradient);


    //For gl
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //for z coordinate
    var zBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, zBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    var zPosition = gl.getAttribLocation(program, "zCoord");
    gl.vertexAttribPointer(zPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(zPosition);

    //colors
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    //For gl_gradient

    var vBufferGradient = gl_gradient.createBuffer();
    gl_gradient.bindBuffer(gl_gradient.ARRAY_BUFFER, vBufferGradient);
    gl_gradient.bufferData(gl_gradient.ARRAY_BUFFER, flatten(verticesGradient), gl_gradient.STATIC_DRAW);

    var vPositionGradient = gl_gradient.getAttribLocation(program_gradient, "vPosition");
    gl_gradient.vertexAttribPointer(vPositionGradient, 2, gl.FLOAT, false, 0, 0);
    gl_gradient.enableVertexAttribArray(vPositionGradient);

    var cBufferGradient = gl_gradient.createBuffer();
    gl_gradient.bindBuffer(gl_gradient.ARRAY_BUFFER, cBufferGradient);
    gl_gradient.bufferData(gl_gradient.ARRAY_BUFFER, 16 * maxNumVertices, gl_gradient.STATIC_DRAW);

    var vColorGradient = gl_gradient.getAttribLocation(program_gradient, "vColor");
    gl_gradient.vertexAttribPointer(vColorGradient, 4, gl.FLOAT, false, 0, 0);
    gl_gradient.enableVertexAttribArray(vColorGradient);

    gl.enable(gl.DEPTH_TEST);


    render();

}


function render() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl_gradient.clear(gl_gradient.COLOR_BUFFER_BIT);

    gl_gradient.drawArrays(gl_gradient.TRIANGLE_FAN, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    for (var i = 0; i < index;) {

        if (shapeArr[i] === 0) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(pointArr[i]));
            i++
        } else if (shapeArr[i] === 1) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(pointArr[i]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 1), flatten(pointArr[i + 1]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 2), flatten(pointArr[i + 2]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 3), flatten(pointArr[i + 3]));
            i += 4;
        } 
        else if (shapeArr[i] === 2) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(pointArr[i]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 1), flatten(pointArr[i + 1]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 2), flatten(pointArr[i + 2]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 3), flatten(pointArr[i + 3]));
            i += 4;
        } else if (shapeArr[i] === 3) {
            for (var j = 0; j < 40; j++) {
                gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i+j), flatten(pointArr[i+j]));
            }
            i += 40;
        } else if (shapeArr[i] === 4) {
            for (var j = 0; j < 41; j++) {
                gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + j), flatten(pointArr[i + j]));
            }
            i += 41;

        } else if (shapeArr[i] === 5) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(pointArr[i]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 1), flatten(pointArr[i + 1]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 2), flatten(pointArr[i + 2]));
            i += 3;
        }
        else if (shapeArr[i] === 6) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(pointArr[i]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 1), flatten(pointArr[i + 1]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 2), flatten(pointArr[i + 2]));
            i += 3;
        }
    }


    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

    for (var i = 0; i < index;) {

        if (shapeArr[i] === 0) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(colorArr[i]));
            i++;
        } else if (shapeArr[i] === 1) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(colorArr[i]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 1), flatten(colorArr[i + 1]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 2), flatten(colorArr[i + 2]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 3), flatten(colorArr[i + 3]));
            i += 4;
        }
        else if (shapeArr[i] === 2) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(colorArr[i]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 1), flatten(colorArr[i + 1]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 2), flatten(colorArr[i + 2]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 3), flatten(colorArr[i + 3]));
            i += 4;
        } else if (shapeArr[i] === 3) {
            for (var j = 0; j < 40; j++) {
                gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + j), flatten(colorArr[i+j]));
            }
            i += 40;
        }
        else if (shapeArr[i] === 4) {
            for (var j = 0; j < 41; j++) {
                gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + j), flatten(colorArr[i + j]));
            }
            i += 41;
        }
        else if (shapeArr[i] === 5) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(colorArr[i]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 1), flatten(colorArr[i + 1]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 2), flatten(colorArr[i + 2]));
            i += 3;
        } else if (shapeArr[i] === 6) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(colorArr[i]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 1), flatten(colorArr[i + 1]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 2), flatten(colorArr[i + 2]));
            i += 3;
        }
    }


  

    for (var i = 0; i < index; ) {
        if (shapeArr[i] === 0) {
            gl.drawArrays(gl.POINTS, i, 1);
            i++;
        } else if (shapeArr[i] === 1) {
            gl.drawArrays(gl.LINE_LOOP, i, 4);
            i += 4;
        }
        else if (shapeArr[i] === 2) {
            gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
            i += 4;
        } else if (shapeArr[i] === 5) {
            gl.drawArrays(gl.LINE_LOOP, i, 3);
            i += 3;
        } else if (shapeArr[i] === 6) {
            gl.drawArrays(gl.TRIANGLE_FAN, i, 3);
            i += 3;
        } else if (shapeArr[i] === 4) {
            gl.drawArrays(gl.TRIANGLE_FAN, i, 41);
            i += 41;

        } else if (shapeArr[i] === 3) {
            gl.drawArrays(gl.LINE_LOOP, i, 40);
            i += 40;
        }
    }

    window.requestAnimFrame(render);
}
