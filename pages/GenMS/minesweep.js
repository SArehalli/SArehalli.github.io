var jsav = new JSAV("av");
var g;
var done = false;
function getRandomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

lowV = 3;
highV = 10;
edgeP = 0.4;
mineUTF = "&#128163;";
flagUTF = "&#128274;";

// Enforce mines < vertices in UI
var verticesInput = $("#vertices");
var minesInput = $("#mines");
function limitMines() {
    minesInput.val(Math.min(verticesInput.val(), minesInput.val()));
};
verticesInput.on("change", limitMines);
minesInput.on("change", limitMines);

// Add reveal/flag functionality
function reveal(node) {
    node.revealed = true;
    node.removeClass("unchecked");
    if (node.mine) {
        node.value(mineUTF);
    } else { 
        node.value(node.count);
    };
}

function lose() {
    if (done) return;
    for (var node of g.nodes()) {
        reveal(node);
    }
    jsav.umsg("You lost :(");
    done = true;
}

function checkWin() {
    if (done) return;
    for (var node of g.nodes()) {
        if (!node.mine && !node.revealed) return false;
    }
    for (var node of g.nodes()) {
        reveal(node);
    }
    jsav.umsg("You win :)");
    done = true;
}


//Generate Graph on button click 
function genGraph(numNodes, edgeP, numMines) {
    var g = jsav.ds.graph({layout: "automatic", directed: false, width: 400, height: 400});
    for (var i = 0; i < numNodes; i++) {
        g.addNode("").addClass("unchecked");
    }

    for (var i = 0; i < g.nodes().length; i++) {
        for (var j = 0; j < g.nodes().length; j++) {
            if (i == j) continue;
            if (Math.random() < edgeP) {
                g.addEdge(g.nodes().at(i), g.nodes().at(j));
            }
        }
    }

    for (var node of JSAV.utils.rand.sample(g.nodes(), numMines)) {
        node.mine = true;
    }
    for (var node of g.nodes()) {
        node.count = 0;
        node.marked = false;
        node.revealed = false;
        if (!node.mine) {
            for (var othernode of node.neighbors()) {
                if (othernode.mine) node.count++;
            }
        }
    }

    jsav.umsg(`${numMines} mines total`);
    // Add highlight functionality
    g.mouseenter(function() {
        for (var node of this.neighbors()) {
            node.addClass("highlighted");
            this.edgeTo(node).css({"stroke-width": 2});
        }
    }).mouseleave(function() { 
        for (var node of this.neighbors()) {
            node.removeClass("highlighted");
            this.edgeTo(node).css({"stroke-width": 1});
        }
    });

    g.on("click", function(e) {
        if (this.marked) return;
        reveal(this);
        if (this.mine) {
            lose();
        }
        checkWin();
    }).on("contextmenu", function() {
        this.toggleClass("marked")
        this.marked = !this.marked;
        if (this.marked) {
            this.value(flagUTF);
        } else {
            this.value("");
        }
    });
    g.layout();
    jsav.displayInit();
    return(g);
};

$("#genGraph").on("click", function() {
    if (g != undefined) g.clear();
    done = false;
    g = genGraph(verticesInput.val(), edgeP, minesInput.val());
});

