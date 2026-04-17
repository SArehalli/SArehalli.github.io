var jsav3 = new JSAV("clause")
var g3 = new jsav3.ds.graph({layout: "manual", directed: false, width:600, height: 300});

const offset_fixed_y = 0;
const offset_fixed_x = 50;
const offset_lit_y = 50;
const offset_lit_x = 100;
const offset_clause_x = 2*offset_lit_x + offset_fixed_x;
const offset_clause_y = 3*offset_lit_y;
const offset_AB_y = 4*offset_lit_y;
const offset_A_x = offset_clause_x - offset_lit_x;
const offset_B_x = offset_clause_x + offset_lit_x;


V = g3.addNode("V", {"left": 0, 
                    "top": offset_lit_y})
    .addClass("highlighted")
    .addClass("hidden");
notV = g3.addNode("~V", {"left": offset_lit_x, 
                        "top": offset_lit_y})
    .addClass("hidden");
oneV = g3.addNode(1, {"left": offset_fixed_x, 
                     "top": offset_fixed_y})
    .addClass("locked-valid");

g3.addEdge(V, oneV);
g3.addEdge(notV, oneV);

W = g3.addNode("W", {"left": 2*offset_lit_x, 
                     "top": offset_lit_y})
    .addClass("highlighted")
    .addClass("hidden");
notW = g3.addNode("~W", {"left": 3*offset_lit_x, 
                        "top": offset_lit_y})
    .addClass("hidden");
oneW = g3.addNode(1, {"left": 2*offset_lit_x + offset_fixed_x, 
                     "top": offset_fixed_y})
    .addClass("locked-valid");

g3.addEdge(W, oneW);
g3.addEdge(notW, oneW);


X = g3.addNode("X", {"left": 4*offset_lit_x, 
                     "top": offset_lit_y})
    .addClass("highlighted")
    .addClass("hidden");
notX = g3.addNode("~X", {"left": 5*offset_lit_x, 
                        "top": offset_lit_y})
    .addClass("hidden");
oneX = g3.addNode(1, {"left": 4*offset_lit_x + offset_fixed_x, 
                     "top": offset_fixed_y})
    .addClass("locked-valid");

g3.addEdge(X, oneX);
g3.addEdge(notX, oneX);

clause = g3.addNode(3, {"top": offset_clause_y,
                       "left": offset_clause_x})
    .addClass("locked-valid");
extraH1 = g3.addNode("A", {"top": offset_AB_y,
                       "left": offset_A_x})
    .addClass("hidden");
extraH2 = g3.addNode("B", {"top": offset_AB_y,
                       "left": offset_B_x})
    .addClass("hidden");

g3.addEdge(V, clause);
g3.addEdge(notW, clause);
g3.addEdge(notX, clause);
g3.addEdge(extraH1, clause);
g3.addEdge(extraH2, clause);

function validate_clause() {
    for (var node of g3.nodes()) {
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

g3.on("click", function() {
    if (this.hasClass("locked")) return; 
    this.toggleClass("highlighted");
    validate_clause();
});

validate();
g3.hide();
g3.layout();
jsav.displayInit();

$("#revealClauses").on("click", function() {
    g3.show();
    g3.layout();
});
