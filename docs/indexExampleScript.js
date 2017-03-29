var set_o = {
    "SDTTreeElements": [{
        "type": "views",
        "dropSwitch": true,
        "foresideType": ["root"],
        "leanRight": false
    }, {
        "type": "group",
        "dropSwitch": true,
        "foresideType": ["root"],
        "leanRight": true
    }, {
        "type": "file",
        "dropSwitch": true,
        "foresideType": ["root", "group"],
        "leanRight": true
    }, {
        "type": "page",
        "dropSwitch": false,
        "foresideType": ["file"],
        "leanRight": true
    }, {
        "type": "mend",
        "dropSwitch": true,
        "foresideType": ["all"],
        "leanRight": true
    }, {
        "type": "code",
        "dropSwitch": false,
        "foresideType": ["group", "file"],
        "leanRight": true
    }],
    "SDTTreeSet": {
        "lineType": "bessel",
        "lineColor": "#547D87",
        "treeCenterX": "360",
        "treeCenterY": "360",
        "treeEleMargin": "16"
    }
};
SDT.SVGDragComponent(set_o);

var intTree = '{"id":"SDTTree","objHeight":0,"childEles":[{"id":"SDTTreeRight","objHeight":8,"childEles":[{"type":"group","dropSwitch":true,"foresideType":["root"],"id":"group1","name":"Group-1","foresideObjId":"SDTTreeRight","objHeight":1,"childEles":[],"objRelativelyHeight":-3.5,"objcolumn":1,"leanRight":true},{"type":"group","dropSwitch":true,"foresideType":["root"],"id":"group2","name":"Group-2","foresideObjId":"SDTTreeRight","objHeight":3,"childEles":[{"type":"code","dropSwitch":true,"foresideType":["group","file"],"id":"code1","name":"Code-1","foresideObjId":"group2","objHeight":1,"childEles":[],"objRelativelyHeight":-2.5,"objcolumn":2,"leanRight":true},{"type":"code","dropSwitch":true,"foresideType":["group","file"],"id":"code2","name":"Code-2","foresideObjId":"group2","objHeight":1,"childEles":[],"objRelativelyHeight":-1.5,"objcolumn":2,"leanRight":true},{"type":"mend","dropSwitch":true,"foresideType":["all"],"id":"mend2","name":"Mend-2","foresideObjId":"group2","objHeight":1,"childEles":[],"objRelativelyHeight":-0.5,"objcolumn":2,"leanRight":true}],"objRelativelyHeight":-1.5,"objcolumn":1,"leanRight":true},{"type":"file","dropSwitch":true,"foresideType":["root","group"],"id":"file1","name":"File-1","foresideObjId":"SDTTreeRight","objHeight":1,"childEles":[],"objRelativelyHeight":0.5,"objcolumn":1,"leanRight":true},{"type":"file","dropSwitch":true,"foresideType":["root","group"],"id":"file2","name":"File-2","foresideObjId":"SDTTreeRight","objHeight":3,"childEles":[{"type":"page","dropSwitch":true,"foresideType":["file"],"id":"page1","name":"Page-1","foresideObjId":"file2","objHeight":1,"childEles":[],"objRelativelyHeight":1.5,"objcolumn":2,"leanRight":true},{"type":"page","dropSwitch":true,"foresideType":["file"],"id":"page2","name":"Page-2","foresideObjId":"file2","objHeight":1,"childEles":[],"objRelativelyHeight":2.5,"objcolumn":2,"leanRight":true},{"type":"mend","dropSwitch":true,"foresideType":["all"],"id":"mend1","name":"Mend-1","foresideObjId":"file2","objHeight":1,"childEles":[],"objRelativelyHeight":3.5,"objcolumn":2,"leanRight":true}],"objRelativelyHeight":2.5,"objcolumn":1,"leanRight":true}],"objRelativelyHeight":0,"objcolumn":0},{"id":"SDTTreeLeft","objHeight":3,"childEles":[{"type":"views","dropSwitch":true,"foresideType":["root"],"id":"views1","name":"Views-1","foresideObjId":"SDTTreeLeft","objHeight":1,"childEles":[],"objRelativelyHeight":-1,"objcolumn":1,"leanRight":false},{"type":"views","dropSwitch":true,"foresideType":["root"],"id":"views2","name":"Views-2","foresideObjId":"SDTTreeLeft","objHeight":1,"childEles":[],"objRelativelyHeight":0,"objcolumn":1,"leanRight":false},{"type":"views","dropSwitch":true,"foresideType":["root"],"id":"views3","name":"Views-3","foresideObjId":"SDTTreeLeft","objHeight":1,"childEles":[],"objRelativelyHeight":1,"objcolumn":1,"leanRight":false}],"objRelativelyHeight":0,"objcolumn":0}],"objRelativelyHeight":0,"objcolumn":0}';

SDT.drawInputTree(JSON.parse(intTree));
document.getElementById("center").addEventListener("click", function() {
    SDT.backCenter();
    console.log(SDT.returnTree(false));
});
document.getElementById("backout").addEventListener("click", function() {
    SDT.removeELe();
});
Object.defineProperty(SDT.dropErrorMsg, 'dataDropError', {
    set: function(msg) {
        alert("Please drop it on: " + msg);
    }
});