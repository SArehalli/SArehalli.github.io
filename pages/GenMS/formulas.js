var jsav4 = new JSAV("formula")
var g4 = new jsav4.ds.graph({layout: "manual", directed: false, width:600, height: 300});

const shift_clause = 140;

V = g4.addNode("V", {"left": 0, 
                    "top": offset_lit_y})
    .addClass("highlighted")
    .addClass("hidden");
notV = g4.addNode("~V", {"left": offset_lit_x, 
                        "top": offset_lit_y})
    .addClass("hidden");
oneV = g4.addNode(1, {"left": offset_fixed_x, 
                     "top": offset_fixed_y})
    .addClass("locked-valid");

g4.addEdge(V, oneV);
g4.addEdge(notV, oneV);

W = g4.addNode("W", {"left": 2*offset_lit_x, 
                     "top": offset_lit_y})
    .addClass("highlighted")
    .addClass("hidden");
notW = g4.addNode("~W", {"left": 3*offset_lit_x, 
                        "top": offset_lit_y})
    .addClass("hidden");
oneW = g4.addNode(1, {"left": 2*offset_lit_x + offset_fixed_x, 
                     "top": offset_fixed_y})
    .addClass("locked-valid");

g4.addEdge(W, oneW);
g4.addEdge(notW, oneW);


X = g4.addNode("X", {"left": 4*offset_lit_x, 
                     "top": offset_lit_y})
    .addClass("highlighted")
    .addClass("hidden");
notX = g4.addNode("~X", {"left": 5*offset_lit_x, 
                        "top": offset_lit_y})
    .addClass("hidden");
oneX = g4.addNode(1, {"left": 4*offset_lit_x + offset_fixed_x, 
                     "top": offset_fixed_y})
    .addClass("locked-valid");

g4.addEdge(X, oneX);
g4.addEdge(notX, oneX);

clause = g4.addNode(3, {"top": offset_clause_y,
                       "left": offset_clause_x - shift_clause})
    .addClass("locked-valid");

clause2 = g4.addNode(3, {"top": offset_clause_y,
                        "left": offset_clause_x + shift_clause})
    .addClass("locked-valid");


extraH1 = g4.addNode("A", {"top": offset_AB_y,
                       "left": offset_A_x - shift_clause})
    .addClass("hidden");
extraH2 = g4.addNode("B", {"top": offset_AB_y,
                       "left": offset_B_x - shift_clause})
    .addClass("hidden");

extraH3 = g4.addNode("C", {"top": offset_AB_y,
                       "left": offset_A_x + shift_clause})
    .addClass("hidden");
extraH4 = g4.addNode("D", {"top": offset_AB_y,
                       "left": offset_B_x + shift_clause})
    .addClass("hidden");

g4.addEdge(V, clause);
g4.addEdge(notW, clause);
g4.addEdge(notX, clause);
g4.addEdge(extraH1, clause);
g4.addEdge(extraH2, clause);

g4.addEdge(notV, clause2);
g4.addEdge(W, clause2);
g4.addEdge(notX, clause2);
g4.addEdge(extraH3, clause2);
g4.addEdge(extraH4, clause2);


function validate() {
    for (var node of g4.nodes()) {
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

g4.on("click", function() {
    if (this.hasClass("locked")) return; 
    this.toggleClass("highlighted");
    validate();
});

g4.on("mouseenter", function() {
        for (var node of this.neighbors()) {
            this.edgeTo(node).css({"stroke-width": 2});
        }
}).on("mouseleave", function() {
        for (var node of this.neighbors()) {
            this.edgeTo(node).css({"stroke-width": 1});
        }
});

validate();
g4.hide();
g4.layout();
jsav.displayInit();

$("#revealFormula").on("click", function() {
    g4.show();
    g4.layout();
});
