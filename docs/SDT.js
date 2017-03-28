var SDT = (function() {
    //初始化SVG画布
    if (document.querySelector(".sdt-canvas #sdtDropCanvas")) {
        document.querySelector(".sdt-canvas #sdtDropCanvas").innerHTML = document.querySelector(".sdt-canvas #sdtDropCanvas").innerHTML + '<g id="sdtDropCanvasAll"><g id="sdtDropCanvasRight"></g><g id="sdtDropCanvasLeft"></g></g>';
        document.querySelector(".sdt-canvas #sdtDropCanvas #sdtDropCanvasAll").setAttribute("style", "-moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; user-select: none;");
    }
    //配置单
    var SDTTreeCollocated = {
        "SDTTreeElements": [],
        "SDTTreeSet": {
            "SDTTreeLineType": "bessel", //元素连线方式 bessel,straight
            "SDTTreeEleHeight": 0, // 元素的 height
            "SDTTreeEleWidth": 0, // 元素的 width
            "SDTTreeEleMargin": 16, //元素的边距
            "SDTTreeLineColor": "#000", // 连线的颜色
            "SDTTreeCenterX": 0, // 树的中心点坐标 X
            "SDTTreeCenterY": 0, // 树的中心点坐标 Y
            "SDTViewBoxMinX": 0, //sdtDropCanvas 的 viewBox
            "SDTViewBoxMinY": 0, //sdtDropCanvas 的 viewBox
            "SDTViewBoxWidth": 0, //sdtDropCanvas 的 viewBox
            "SDTViewBoxHeight": 0 //sdtDropCanvas 的 viewBox
        }
    };
    //临时元素对象，用作事件间的信息传递
    var provisionalSDTTreeEle;
    //元素放置顺序表
    var eleSeqList = [];
    //右边树
    var SDTTreeRight = {
            "id": "SDTTreeRight",
            "objHeight": 0,
            "childEles": [],
            "objRelativelyHeight": 0,
            "objcolumn": 0
        }
        //左边树
    var SDTTreeLeft = {
            "id": "SDTTreeLeft",
            "objHeight": 0,
            "childEles": [],
            "objRelativelyHeight": 0,
            "objcolumn": 0
        }
        //树
    var SDTTree = {
            "id": "SDTTree",
            "objHeight": 0,
            "childEles": [SDTTreeRight, SDTTreeLeft],
            "objRelativelyHeight": 0,
            "objcolumn": 0
        }
        // 元素类型计数表
    var typeEleCountList = [];

    var dropError = {};
    dropError.dataDropError;



    // 颜色值测试正则表达式子
    var pattern = new RegExp(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/);
    // 是否第一次放置的标记
    var firstDrop = true;
    //元素构造函数
    function SDTTreeEle() {
        this.type = ""; //元素类型
        this.dropSwitch = true; //元素是否可放置状态的开关
        this.foresideType = []; //元素可以放在哪些元素后
        this.id = ""; //元素ID，不可变，唯一
        this.name = ""; //元素名，可变
        this.foresideObjId = ""; //当前元素的上层元素的ID
        this.objHeight = 1; //元素占高
        this.childEles = []; //子元素
        this.objRelativelyHeight = 0; //元素相对高度
        this.objcolumn = 0; //元素列数
        this.leanRight = true; //元素是否默认放置与右边
    }
    //元素类型对象构造函数
    function TypeEleCount(countType) {
        this.countType = countType;
        this.countNumber = 0;
    }

    // 获取可拖动元素
    if (document.querySelectorAll(".sdt-drag-element")) {
        // 可拖动元素配置
        var sdtList = document.querySelectorAll(".sdt-drag-element");
        for (var i = 0; i < sdtList.length; i++) {
            if (sdtList[i].dataset.sdtType) {
                sdtList[i].setAttribute("draggable", "true");
                var SDTTreeEleObj = {
                    "dropSwitch": true, // 元素默认可放置
                    "foresideType": ["all"], // 元素默认可放置于所有元素后
                    "objHeight": 1, // 元素占高
                    "leanRight": true
                }
                SDTTreeEleObj.type = sdtList[i].dataset.sdtType;
                // 从HTML读取配置并设置
                if (sdtList[i].dataset.sdtElesetDropswitch) {
                    if (sdtList[i].dataset.sdtElesetDropswitch === "ture") {
                        SDTTreeEleObj.dropSwitch = true;
                    } else {
                        SDTTreeEleObj.dropSwitch = false;
                    }
                }
                if (sdtList[i].dataset.sdtElesetForesidetype) {
                    SDTTreeEleObj.foresideType = [];
                    var ForesidetypeStr = "";
                    var sdtElesetForesidetypeSrt = sdtList[i].dataset.sdtElesetForesidetype;
                    for (j = 0; j < sdtElesetForesidetypeSrt.length; j++) {
                        if (sdtElesetForesidetypeSrt.charAt(j) !== ",") {
                            ForesidetypeStr = ForesidetypeStr + sdtElesetForesidetypeSrt.charAt(j);
                        } else {
                            SDTTreeEleObj.foresideType.push(ForesidetypeStr);
                            ForesidetypeStr = "";
                        };
                        if (j === sdtElesetForesidetypeSrt.length - 1) {
                            SDTTreeEleObj.foresideType.push(ForesidetypeStr);
                            ForesidetypeStr = "";
                        }
                    }
                }
                if (sdtList[i].dataset.sdtElesetLeanright) {
                    if (sdtList[i].dataset.sdtElesetLeanright === "ture") {
                        SDTTreeEleObj.leanRight = true;
                    } else {
                        SDTTreeEleObj.leanRight = false;
                    }
                }
                if (sdtList[i].getElementsByTagName("text")[0]) {
                    SDTTreeEleObj.name = sdtList[i].getElementsByTagName("text")[0].childNodes[0].nodeValue;
                }
                SDTTreeCollocated.SDTTreeElements.push(SDTTreeEleObj);
                // 元素类型计数表添加新类型
                var eleCount = new TypeEleCount(SDTTreeEleObj.type);
                typeEleCountList.push(eleCount);
            }
        }
        // 元素的 width 和 height设置
        SDTTreeCollocated.SDTTreeSet.SDTTreeEleWidth = document.querySelector(".sdt-drag-element svg").width.baseVal.value;
        SDTTreeCollocated.SDTTreeSet.SDTTreeEleHeight = document.querySelector(".sdt-drag-element svg").height.baseVal.value;
        // 画布配置
        var sCanvas = document.querySelector(".sdt-canvas");
        if (sCanvas.dataset.sdtElesetLinetype) {
            SDTTreeCollocated.SDTTreeSet.SDTTreeLineType = sCanvas.dataset.sdtElesetLinetype;
        }
        if (sCanvas.dataset.sdtElesetLinecolor) {
            if (pattern.test(sCanvas.dataset.sdtElesetLinecolor)) {
                SDTTreeCollocated.SDTTreeSet.SDTTreeLineColor = sCanvas.dataset.sdtElesetLinecolor;
            } else {
                console.log("颜色值非法");
            }
        }
        if (sCanvas.dataset.sdtElesetTreecenterx) {
            SDTTreeCollocated.SDTTreeSet.SDTTreeCenterX = Number(sCanvas.dataset.sdtElesetTreecenterx);
        }
        if (sCanvas.dataset.sdtElesetTreecentery) {
            SDTTreeCollocated.SDTTreeSet.SDTTreeCenterY = Number(sCanvas.dataset.sdtElesetTreecentery);
        };
        if (sCanvas.dataset.sdtElesetMargin) {
            SDTTreeCollocated.SDTTreeSet.SDTTreeEleMargin = Number(sCanvas.dataset.sdtElesetMargin);
            SDTTreeCollocated.SDTTreeSet.SDTTreeEleHeight = SDTTreeCollocated.SDTTreeSet.SDTTreeEleHeight + SDTTreeCollocated.SDTTreeSet.SDTTreeEleMargin;
        }
    }

    document.querySelector(".sdt-drag-element-lis").ondragstart = function(event) { //监听 .sdt-drag-element-lis 上的拖拽开始事件 dragstart
        var type;
        if (event.target.dataset.sdtType) {
            type = event.target.dataset.sdtType;
            provisionalSDTTreeEle = creatSDTTreeEle(type); //创建当前 type 类型的对象，并由 provisionalSDTTreeEle 保存
        }
        event.dataTransfer.setData("Text", provisionalSDTTreeEle); //事件传递信息设为 provisionalSDTTreeEle
    }
    document.getElementById("sdtDropCanvas").ondragover = function(event) { //设置画布"sdtDropCanvas"允许放置，阻止对元素的默认处理方式
        event.preventDefault();
    }
    document.getElementById("sdtDropCanvas").ondrop = function(event) { //监听画布 "sdtDropCanvas" 的 ondrop 放置事件，阻止对元素的默认处理方式（打开链接）
        event.preventDefault();
        if (provisionalSDTTreeEle) {
            if (provisionalSDTTreeEle.dropSwitch === true) { //如果临时对象的dropSwitch属性为
                typeEleCountList.forEach(function(element) {
                    if (element.countType === provisionalSDTTreeEle.type) {
                        provisionalSDTTreeEle.id = provisionalSDTTreeEle.type + (element.countNumber + 1);
                        if (provisionalSDTTreeEle.name === "") {
                            provisionalSDTTreeEle.name = provisionalSDTTreeEle.id;
                        } else {
                            provisionalSDTTreeEle.name = provisionalSDTTreeEle.name + "-" + (element.countNumber + 1);
                        }
                        element.countNumber++;
                    }
                });
                if (event.target.id === "sdtDropCanvas") {
                    if (provisionalSDTTreeEle.leanRight) {
                        provisionalSDTTreeEle.foresideObjId = "SDTTreeRight"; //设置元素与上层元素ID
                    } else {
                        provisionalSDTTreeEle.foresideObjId = "SDTTreeLeft";
                    }
                } else {
                    provisionalSDTTreeEle.foresideObjId = event.target.parentNode.id;
                }
                // 设置列
                if (event.target.parentNode.getAttribute("objcolumn")) {
                    provisionalSDTTreeEle.objcolumn = Number(event.target.parentNode.getAttribute("objcolumn")) + 1;
                } else {
                    provisionalSDTTreeEle.objcolumn = 1;
                }
                pushObject(SDTTree, provisionalSDTTreeEle);
                eleSeqList.push(provisionalSDTTreeEle.id);
                canvasRepain();
                // 初次放置后的画布行为初始化
                if (firstDrop) {
                    canvasBlow();
                    dragable();
                    firstDrop = false;
                }
            } else {
                dropError.dataDropError = provisionalSDTTreeEle.foresideType;
            }
        }
        provisionalSDTTreeEle = null;
    }


    function creatSDTTreeEle(type) { //创建特定type类型的对象
        var typeObj;
        SDTTreeCollocated.SDTTreeElements.forEach(function(element) {
            if (element.type === type) {
                typeObj = new SDTTreeEle();
                typeObj.type = element.type;
                typeObj.name = element.name;
                typeObj.dropSwitch = element.dropSwitch;
                typeObj.foresideType = element.foresideType;
                typeObj.leanRight = element.leanRight;
            }
        });
        return typeObj;
    }

    function canvasRepain() {
        setObjHeight(SDTTree);
        //清空画布
        document.querySelectorAll("#sdtDropCanvasRight svg,#sdtDropCanvasLeft svg,.objLine").forEach(function(element) {
            element.remove();
        });
        draw(SDTTree, SDTTreeCollocated.SDTTreeSet);
        if (SDTTreeCollocated.SDTTreeSet.SDTTreeLineType === "straight") {
            linkObjStraight(SDTTree, SDTTreeCollocated.SDTTreeSet);
        } else {
            linkObjBessel(SDTTree, SDTTreeCollocated.SDTTreeSet);
        }

        setDropObject(); //对画布上的所有元素绑定事件
    }

    function pushObject(rootObj, obj) {
        for (var i = 0; i < rootObj.childEles.length; i++) {
            if (rootObj.childEles[i].id === obj.id) {
                obj.foresideObjId = null;
            } else {
                pushObject(rootObj.childEles[i], obj);
                if (rootObj.childEles[i].id === obj.foresideObjId) {
                    rootObj.childEles[i].childEles.push(obj);
                }
            }
        }
    }

    function removeObject(rootObj, obj) {
        for (var i = 0; i < rootObj.childEles.length; i++) {
            removeObject(rootObj.childEles[i], obj);
            if (rootObj.childEles[i].id === obj) {
                rootObj.childEles.splice(i, 1);
            }
        }
    }

    function setObjHeight(obj) {
        insetobjHeight(obj.childEles[0]);
        insetobjHeight(obj.childEles[1]);

        function insetobjHeight(setHiObj) {
            if (setHiObj.childEles.length > 0) {
                setHiObj.objHeight = 0;
            };
            for (var i = 0; i < setHiObj.childEles.length; i++) {

                insetobjHeight(setHiObj.childEles[i]);
                setHiObj.objHeight = setHiObj.objHeight + setHiObj.childEles[i].objHeight;
                setHiObj.childEles[i].objRelativelyHeight = setHiObj.childEles[i].objHeight;
            }
        }
    }

    function draw(obj, ts) {
        var eleHi = ts.SDTTreeEleHeight;
        var eleWi = ts.SDTTreeEleWidth;
        var eleMar = ts.SDTTreeEleMargin;
        var cenX = ts.SDTTreeCenterX;
        var cenY = ts.SDTTreeCenterY;
        drawEle(obj.childEles[0], true);
        drawEle(obj.childEles[1], false);

        function drawEle(drawObj, rightOn) {
            for (var i = 0; i < drawObj.childEles.length; i++) {
                drawObj.childEles[i].objRelativelyHeight = ((drawObj.childEles.length > 1) ? ((i > 0) ? drawObj.childEles[i].objRelativelyHeight * 0.5 + drawObj.childEles[i - 1].objRelativelyHeight + drawObj.childEles[i - 1].objHeight * 0.5 : drawObj.objRelativelyHeight + drawObj.childEles[i].objRelativelyHeight * 0.5 - drawObj.objHeight * 0.5) : drawObj.objRelativelyHeight);
                var dropDeviceObject = document.querySelector("[data-sdt-type=" + drawObj.childEles[i].type + "] svg").cloneNode(true);
                dropDeviceObject.setAttribute("id", drawObj.childEles[i].id);
                dropDeviceObject.setAttribute("class", drawObj.childEles[i].type);
                dropDeviceObject.setAttribute("objcolumn", drawObj.childEles[i].objcolumn);
                if (rightOn) {
                    dropDeviceObject.setAttribute("x", (((eleHi * 3) + eleWi) * drawObj.childEles[i].objcolumn) - eleWi + cenX);
                } else {
                    dropDeviceObject.setAttribute("x", -((eleHi * 3) + eleWi) * drawObj.childEles[i].objcolumn + cenX);
                }
                dropDeviceObject.setAttribute("y", eleHi * (drawObj.childEles[i].objRelativelyHeight) + eleMar / 2 + cenY);
                if (rightOn) {
                    document.querySelector("#sdtDropCanvasRight").appendChild(dropDeviceObject);
                } else {
                    document.querySelector("#sdtDropCanvasLeft").appendChild(dropDeviceObject);
                }
                document.querySelector("#" + drawObj.childEles[i].id + " text").childNodes[0].nodeValue = drawObj.childEles[i].name;
                drawEle(drawObj.childEles[i], rightOn);
            }
        }
    }

    function linkObjStraight(obj, ls) {
        var eleHi = ls.SDTTreeEleHeight;
        var eleWi = ls.SDTTreeEleWidth;
        var lineColor = ls.SDTTreeLineColor;
        var cenX = ls.SDTTreeCenterX;
        var cenY = ls.SDTTreeCenterY;
        sLinkObj(obj.childEles[0], true);
        sLinkObj(obj.childEles[1], false);

        function sLinkObj(lObj, rightOn) {
            for (var i = 0; i < lObj.childEles.length; i++) {
                sLinkObj(lObj.childEles[i], rightOn);
                if (rightOn) {
                    var x1 = ((eleHi * 3) + eleWi) * lObj.childEles[i].objcolumn - (eleHi * 3) - eleWi + cenX;
                    var srtH = " h ";
                } else {
                    var x1 = -((eleHi * 3) + eleWi) * lObj.childEles[i].objcolumn + ((eleHi * 3) + eleWi) + cenX;
                    var srtH = " h -";
                }
                var y1 = eleHi * (lObj.childEles[i].objRelativelyHeight) - ((lObj.childEles[i].objHeight > 1) ? (lObj.childEles[i].objHeight - 1) * (eleHi / 2) : 0);
                y1 = y1 + cenY;
                var y2 = eleHi + ((lObj.childEles[i].objHeight > 1) ? (lObj.childEles[i].objHeight - 1) * eleHi : 0);
                var y3 = -(eleHi / 2) - ((lObj.childEles[i].objHeight > 1) ? (lObj.childEles[i].objHeight - 1) * (eleHi / 2) : 0);

                if (lObj.childEles.length > 1) {
                    if (i === 0) {
                        document.getElementById("sdtDropCanvasAll").innerHTML = document.getElementById("sdtDropCanvasAll").innerHTML + "<path class='objLine' d =' M " + x1 + " " + (y1 + y2 + y3) + srtH + (eleHi * 3) + "' stroke = '" + lineColor + "' fill='transparent'/><path class='objLine' d =' M " + x1 + " " + (y1 + y2 + y3 - (eleHi / 4)) + " v " + (-y3 + (eleHi / 4)) + "' stroke = '" + lineColor + "' stroke-width='4px' fill='transparent'/>";
                    } else if (i === (lObj.childEles.length - 1)) {
                        document.getElementById("sdtDropCanvasAll").innerHTML = document.getElementById("sdtDropCanvasAll").innerHTML + "<path class='objLine' d =' M " + x1 + " " + (y1 + y2 + y3) + srtH + (eleHi * 3) + "' stroke = '" + lineColor + "' fill='transparent'/><path class='objLine' d =' M " + x1 + " " + y1 + " v " + (y2 + y3 + (eleHi / 2 / 2)) + "' stroke = '" + lineColor + "' stroke-width='4px' fill='transparent'/>";
                    } else {
                        document.getElementById("sdtDropCanvasAll").innerHTML = document.getElementById("sdtDropCanvasAll").innerHTML + "<path class='objLine' d =' M " + x1 + " " + (y1 + y2 + y3) + srtH + (eleHi * 3) + "' stroke = '" + lineColor + "' fill='transparent'/><path class='objLine' d =' M " + x1 + " " + y1 + " v " + y2 + "' stroke = '" + lineColor + "' stroke-width='4px' fill='transparent'/>";
                    };
                } else {
                    y1 = y1 + (eleHi / 4);
                    y2 = y2 - (eleHi / 2);
                    y3 = y3 + (eleHi / 4);
                    document.getElementById("sdtDropCanvasAll").innerHTML = document.getElementById("sdtDropCanvasAll").innerHTML + "<path class='objLine' d =' M " + x1 + " " + (y1 + y2 + y3) + srtH + (eleHi * 3) + "' stroke = '" + lineColor + "' fill='transparent'/><path class='objLine' d =' M " + x1 + " " + y1 + " v " + y2 + "' stroke = '" + lineColor + "' stroke-width='4px' fill='transparent'/>";
                }
            }
        }
    }

    function linkObjBessel(obj, ls) {
        var eleHi = ls.SDTTreeEleHeight;
        var eleWi = ls.SDTTreeEleWidth;
        var lineColor = ls.SDTTreeLineColor;
        var cenX = ls.SDTTreeCenterX;
        var cenY = ls.SDTTreeCenterY;
        bLinkObj(obj.childEles[0], true);
        bLinkObj(obj.childEles[1], false);

        function bLinkObj(lObj, rightOn) {
            for (var i = 0; i < lObj.childEles.length; i++) {
                bLinkObj(lObj.childEles[i], rightOn);
                if (rightOn) {
                    var x1 = ((eleHi * 3) + eleWi) * lObj.childEles[i].objcolumn - eleWi + cenX;
                    var x2 = ((eleHi * 3) + eleWi) * lObj.objcolumn + eleWi - eleWi + eleHi + cenX;
                    var cx1 = x1 - eleHi;
                    var cx2 = x2 - eleHi;
                } else {
                    var x1 = -((eleHi * 3) + eleWi) * lObj.childEles[i].objcolumn + eleWi + cenX;
                    var x2 = x1 + (eleHi * 3) - eleHi;
                    var cx1 = x1 + eleHi;
                    var cx2 = x2 + eleHi;
                }
                var y1 = eleHi * (lObj.childEles[i].objRelativelyHeight) + (eleHi / 2) + cenY;
                var y2 = eleHi * (lObj.objRelativelyHeight) + (eleHi / 2) + cenY;
                document.getElementById("sdtDropCanvasAll").innerHTML = document.getElementById("sdtDropCanvasAll").innerHTML + "<path class='objLine' d =' M " + x1 + " " + y1 + " C " + cx1 + " " + y1 + "," + x2 + " " + y2 + "," + cx2 + " " + y2 + "' stroke = '" + lineColor + "' fill='transparent'/>";
            }
        }
    }


    function setDropObject() { //将所有画布上的元素绑定事件
        document.querySelectorAll("#sdtDropCanvas svg").forEach(function(element) {
            element.ondragover = function(event) {
                event.preventDefault();
                if (provisionalSDTTreeEle) {
                    var parentClass = this.getAttribute("class");
                    var fTypes = provisionalSDTTreeEle.foresideType
                    if (fTypes.indexOf(parentClass) !== -1 || fTypes.indexOf("all") !== -1) {
                        event.target.parentNode.setAttribute('opacity', 0.38);
                        provisionalSDTTreeEle.dropSwitch = true;
                    } else {
                        provisionalSDTTreeEle.dropSwitch = false;
                    }

                }
            };
            element.ondragleave = function(event) {
                event.preventDefault();
                this.setAttribute('opacity', 1);
                provisionalSDTTreeEle.dropSwitch = false;
                var fTypes = provisionalSDTTreeEle.foresideType
                if (fTypes.indexOf("root") !== -1 || fTypes.indexOf("all") !== -1) {
                    provisionalSDTTreeEle.dropSwitch = true;
                }
            }
        });
    }


    function dragable() {
        var dragCanvasSVG = document.querySelector("#sdtDropCanvas");

        function dragableMousemove(event) {
            SDTTreeCollocated.SDTTreeSet.SDTViewBoxMinX = (-(event.clientX - x));
            SDTTreeCollocated.SDTTreeSet.SDTViewBoxMinY = (-(event.clientY - y));
            dragCanvasSVG.setAttribute("viewBox", SDTTreeCollocated.SDTTreeSet.SDTViewBoxMinX + "," + SDTTreeCollocated.SDTTreeSet.SDTViewBoxMinY + "," + SDTTreeCollocated.SDTTreeSet.SDTViewBoxWidth + "," + SDTTreeCollocated.SDTTreeSet.SDTViewBoxHeight);
        }

        function dragableCount(event) {
            x = (event.clientX + SDTTreeCollocated.SDTTreeSet.SDTViewBoxMinX);
            y = (event.clientY + SDTTreeCollocated.SDTTreeSet.SDTViewBoxMinY);

            document.addEventListener("mousemove", dragableMousemove);
        }
        document.getElementById('sdtDropCanvas').addEventListener("mousedown", dragableCount, false);
        document.addEventListener("mouseup", function(event) {
            document.removeEventListener("mousemove", dragableMousemove);
        });
        document.addEventListener("dragend", function(event) {
            document.removeEventListener("mousemove", dragableMousemove);
        });
    }



    function canvasBlow() {
        SDTTreeCollocated.SDTTreeSet.SDTViewBoxWidth = document.querySelector("#sdtDropCanvas").width.animVal.value;
        SDTTreeCollocated.SDTTreeSet.SDTViewBoxHeight = document.querySelector("#sdtDropCanvas").height.animVal.value;
        var SDTViewBoxHeight = SDTTreeCollocated.SDTTreeSet.SDTViewBoxHeight;
        var sdtDropCanvasScale = 1;
        document.querySelector("#sdtDropCanvas").addEventListener("mousewheel", function(event) {
            event.preventDefault();
            if (event.wheelDelta > 0) {
                if (sdtDropCanvasScale < 1.5) {
                    sdtDropCanvasScale += 0.1;
                }
            } else {
                if (sdtDropCanvasScale > 0.75) {
                    sdtDropCanvasScale -= 0.1;
                }
            }
            document.getElementById("sdtDropCanvasAll").setAttribute("transform", "translate(" + (SDTViewBoxHeight / 2) + " " + (SDTViewBoxHeight / 2) + ") scale(" + sdtDropCanvasScale + ") translate(" + -(SDTViewBoxHeight / 2) + " " + -(SDTViewBoxHeight / 2) + ")");
        });

        document.querySelector("#sdtDropCanvas").addEventListener("DOMMouseScroll", function(event) {
            event.preventDefault();
            if (event.detail < 0) {
                if (sdtDropCanvasScale < 1.5) {
                    sdtDropCanvasScale += 0.1;
                };
            } else {
                if (sdtDropCanvasScale > 0.75) {
                    sdtDropCanvasScale -= 0.1;
                };
            };
            document.getElementById("sdtDropCanvasAll").setAttribute("transform", "translate(" + (SDTViewBoxHeight / 2) + " " + (SDTViewBoxHeight / 2) + ") scale(" + sdtDropCanvasScale + ") translate(" + -(SDTViewBoxHeight / 2) + " " + -(SDTViewBoxHeight / 2) + ")");
        });
    }

    return {
        SVGDragComponent: function(_component) {
            if (_component.SDTTreeSet.lineType) {
                SDTTreeCollocated.SDTTreeSet.SDTTreeLineType = _component.SDTTreeSet.lineType;
            }
            if (_component.SDTTreeSet.lineColor) {
                if (pattern.test(_component.SDTTreeSet.lineColor)) {
                    SDTTreeCollocated.SDTTreeSet.SDTTreeLineColor = _component.SDTTreeSet.lineColor;
                } else {
                    console.log("颜色值非法");
                }
            }
            if (_component.SDTTreeSet.treeCenterX !== undefined) {
                SDTTreeCollocated.SDTTreeSet.SDTTreeCenterX = Number(_component.SDTTreeSet.treeCenterX);
            }
            if (_component.SDTTreeSet.treeCenterY !== undefined) {
                SDTTreeCollocated.SDTTreeSet.SDTTreeCenterY = Number(_component.SDTTreeSet.treeCenterY);
            }
            if (_component.SDTTreeSet.treeEleMargin !== undefined) {
                SDTTreeCollocated.SDTTreeSet.SDTTreeEleMargin = Number(_component.SDTTreeSet.treeEleMargin);
                SDTTreeCollocated.SDTTreeSet.SDTTreeEleHeight = document.querySelector(".sdt-drag-element svg").height.baseVal.value;
                SDTTreeCollocated.SDTTreeSet.SDTTreeEleHeight = SDTTreeCollocated.SDTTreeSet.SDTTreeEleHeight + SDTTreeCollocated.SDTTreeSet.SDTTreeEleMargin;

            }
            _component.SDTTreeElements.forEach(function(element) {
                var _comEle = element;
                SDTTreeCollocated.SDTTreeElements.forEach(function(element) {
                    if (_comEle.type === element.type) {
                        if ("dropSwitch" in _comEle) {
                            if (typeof _comEle.dropSwitch === "string") {
                                if (_comEle.dropSwitch === "ture") {
                                    element.dropSwitch = true;
                                } else {
                                    element.dropSwitch = false;
                                }
                            } else if (typeof _comEle.dropSwitch === "boolean") {
                                element.dropSwitch = _comEle.dropSwitch;
                            };
                        };
                        if ("foresideType" in _comEle) {
                            element.foresideType = _comEle.foresideType;
                        };
                        if ("leanRight" in _comEle) {
                            element.leanRight = _comEle.leanRight;
                        };
                        if ("name" in _comEle) {
                            element.name = _comEle.name;
                        }
                    }
                });
            });
        },
        returnTree: function(simplify) {
            if (simplify) {
                var simplifySDTTree = simplifyTree(SDTTree);

                function simplifyTree(rawTree, sTree) {　　　　
                    var sTree = sTree || {};　　　　
                    for (var i in rawTree) {
                        if (i === "id" || i === "name" || i === "foresideObjId" || i === "childEles" || !isNaN(i)) {
                            if (typeof rawTree[i] === 'object') {　　　　　　　　
                                sTree[i] = (Object.prototype.toString.call(rawTree[i]) === '[object Array]') ? [] : {};　　　　　　　　
                                simplifyTree(rawTree[i], sTree[i]);　　　　　　
                            } else {　　　　　　　　　
                                sTree[i] = rawTree[i];　　　　　　
                            }　　　
                        }　
                    }　　　　
                    return sTree;　　
                }
                return simplifySDTTree;
            }
            return SDTTree;
        },
        backCenter: function() {
            var dragSVG = document.getElementById("sdtDropCanvas");
            var cs = SDTTreeCollocated.SDTTreeSet
            var minX = cs.SDTViewBoxMinX;
            var minY = cs.SDTViewBoxMinY;
            var vbWi = cs.SDTViewBoxWidth;
            var vbHi = cs.SDTViewBoxHeight;
            setTimeout(function() {
                if (minX != 0 || minY != 0) {
                    minX = minX - minX / 4;
                    minY = minY - minY / 4;
                    if (((minX < 1) && (minX > 0)) || ((minX > -1) && (minX < 0))) {
                        minX = 0;
                    };
                    if (((minY < 1) && (minY > 0)) || ((minY > -1) && (minY < 0))) {
                        minY = 0;
                    };
                    dragSVG.setAttribute("viewBox", minX + "," + minY + "," + vbHi + "," + vbWi);
                    cs.SDTViewBoxMinX = minX;
                    cs.SDTViewBoxMinY = minY;
                    cs.SDTViewBoxWidth = vbWi;
                    cs.SDTViewBoxHeight = vbHi;
                    setTimeout(arguments.callee, 20);
                };
            }, 20);
        },
        removeELe: function(eleList) {
            if (Object.prototype.toString.call(eleList) === '[object Array]') {
                eleList.forEach(function(element) {
                    removeObject(SDTTree, element);
                });
            } else if (eleList === undefined) {
                removeObject(SDTTree, eleSeqList.pop());
            }
            canvasRepain();
        },
        drawInputTree: function(tree) {
            SDTTree = tree;
            canvasRepain();
        },
        dropErrorMsg: dropError,
    };
}());