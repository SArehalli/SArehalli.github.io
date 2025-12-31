var jsav2 = new JSAV("literal")
var g2 = new jsav2.ds.graph({layout: "automatic", directed: false, width:200, height: 200});

V = g2.addNode("V").addClass("highlighted").addClass("hidden");
notV = g2.addNode("~V").addClass("hidden");
One = g2.addNode(1).addClass("locked-valid");

g2.addEdge(V, One);
g2.addEdge(notV, One);

function validate() {
    for (var node of g2.nodes()) {
        if (node.hasClass("locked-valid") || node.hasClass("locked-invalid")) {
            var count = 0;
            for (var otherNode of node.neighbors()) {
                if (otherNode.hasClass("highlighted")) count++;
            }
            if (count == node.value()) {
                node.addClass("locked-valid");
                node.removeClass("locked-invalid");
            } else {
                node.addClass("locked-invalid");
                node.removeClass("locked-valid");
            }
        }
    }
}

g2.on("click", function() {
    if (this.hasClass("locked")) return; 
    this.toggleClass("highlighted");
    validate();
});

g2.layout()
g2.hide();
jsav.displayInit();

$("#revealLiteral").on("click", function() {
    g2.show();
    g2.layout();
});
