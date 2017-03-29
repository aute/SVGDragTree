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