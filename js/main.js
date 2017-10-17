/**
* Author: Por Heng
* Email: heng.porr(at)gmail.com
* Oct 2017
* v1.0
**/
//var blockes[3][3];
//var items[3][3];
var emptyCellRow;
var emptyCellCol;
var cellDisplacement = "100px";
var found = false;
var goal = [[0,1,2],[3,4,5],[6,7,8]];
var list, listAI;
var possibleMove = 0;
var boardList;

$(document).ready(function(){

    $("#restart").click(restart);
    $("#help").click(solve);
    list = [[1,4,2],[3,7,5],[6,0,8]];
    listAI = $.extend(true, [], list);

    //boardList = list;
    $('#status').hide();
    createBoardGame(list);
    if(isGoal()) {
        showSuccess("You win!!!");
        return 1;
    }

});

function restart() {
    //random game
    //change value of current
    list = [[0,1,2],[3,4,5],[6,7,8]];
    var move = Math.floor(Math.random()*50+10); //50 to 10
    console.log(move);
    var m = 0;
    // 0 = up
    // 1 = down;
    // 2 = left;
    // 3 = right;

    var col = 0, row = 0;
    var k,l;
    do {
        var rnd = Math.floor(Math.random()*3);
        if(rnd == 0 ) { //move up
            k = row + 1; l = col;
        }
        else if(rnd == 1) { //move down
            k = row - 1; l = col;
        }
        else if(rnd == 2) { //move left
            k = row; l = col + 1;
        }
        else { //move right
            k = row; l = col - 1;
        }
        if(k>=0&&k<=2&&l>=0&&l<=2){
            m++;
            //swap
            var temp = list[row][col];
            list[row][col] = list[k][l];
            list[k][l] = temp;
            //update index 0 location
            row = k;
            col = l;
        }
    }while(m<=move);
    $("#board").empty();
    $("#goal").empty();
    $("#tip").empty().hide();

    createBoardGame(list);
    found = false;
}

function showSuccess(txtMsg) {
    $("#status").addClass("alert-success");
    $("#alertText").text(txtMsg);
    $("#status").show().fadeOut(2000);
}

function createBoardGame(list) {
    for(i=0;i<3;i++) {
        var row = $("<div class='row1'></div>");
        var goalRow = $("<div class='rowGoal'></div>");
        for(j=0;j<3;j++) {
            var pos = i+","+j;
            var cell = $("<div class='cell' data-pos='"+pos+"'></div>").text(list[i][j]);
            var goalCell = $("<div class='cellGoal'></div>").text(goal[i][j]);
            if(list[i][j]==0)  {
                cell.text("");
                cell.attr("id","empty");
                emptyCellRow = i;
                emptyCellCol = j;
            }
            if(goal[i][j] == 0) goalCell.text("");
            cell.click(move);
            row.append(cell);
            goalRow.append(goalCell);
        }
        $("#board").append(row);
        $("#goal").append(goalRow);
    }

}

function move() {
    var pos = $(this).attr('data-pos');
    var posRow = parseInt(pos.split(',')[0]);
    var posCol = parseInt(pos.split(',')[1]);

    if(reachGoal(list)) {
        showSuccess("You already win!!!. Please restart to start a new Game.");
        return 1;
    }

    if (posRow + 1 == emptyCellRow && posCol == emptyCellCol)
    {
        $(this).animate({
            'top' : "+=" + cellDisplacement //moves up
        });

        $('#empty').animate({
            'top' : "-=" + cellDisplacement //moves down
        });

        emptyCellRow-=1;
            $(this).attr('data-pos',(posRow+1) + "," + posCol);
        }

        // Move Down
    else if (posRow - 1 == emptyCellRow && posCol == emptyCellCol)
    {
        $(this).animate({
            'top' : "-=" + cellDisplacement //moves down
        });

        $('#empty').animate({
            'top' : "+=" + cellDisplacement //moves up
        });

        emptyCellRow+=1;
        $(this).attr('data-pos',(posRow-1) + "," + posCol);
    }

    // Move Left
    else if (posRow == emptyCellRow && posCol + 1 == emptyCellCol)
    {
        $(this).animate({
            'right' : "-=" + cellDisplacement //moves right
        });

        $('#empty').animate({
            'right' : "+=" + cellDisplacement //moves left
        });

        emptyCellCol -= 1;
        $(this).attr('data-pos',posRow + "," + (posCol+1));
    }

    // Move Right
    else if (posRow == emptyCellRow && posCol - 1 == emptyCellCol)
    {
        $(this).animate({
            'right' : "+=" + cellDisplacement //moves left
        });

        $('#empty').animate({
            'right' : "-=" + cellDisplacement //moves right
        });

        emptyCellCol += 1;
        $(this).attr('data-pos',posRow + "," + (posCol-1));
    }
    else {
        console.log('error move');
        $("#status").show().fadeOut(2000);
        $("#status").removeClass("alert-success");
        $("#alertText").text("You can't move this tile");

    }
    // Update empty position
    $('#empty').attr('data-pos',emptyCellRow + "," + emptyCellCol);
    if(isGoal()){
        console.log('win after move');
        showSuccess("You win!!!");
    }
}

function getValueFromBoard() {
    var current =[[0,1,2],[3,4,5],[6,7,8]];;
    $( ".cell" ).each(function( index ) {
        var pos = $(this).attr('data-pos');
        var posRow = parseInt(pos.split(',')[0]);
        var posCol = parseInt(pos.split(',')[1]);
        var val = 0;
        if($(this).text() != "") val = $(this).text();
        current[posRow][posCol] = val;
    });
    return current;
}
function isGoal() {
    var current = getValueFromBoard();
    //printArr(current);
    for(i=0;i<3;i++) {
        for(j=0;j<3;j++) {
            if(current[i][j] != goal[i][j]) { return false;}
        }
    }

    found = true;
    return true;
}

function reachGoal(grid) {
    for(var i=0;i<3;i++) {
        for(var j=0;j<3;j++) {
            if(grid[i][j]!=goal[i][j]) return false;
        }
    }
    return true;
}

function printArr(arr) {
    for(i=0;i<3;i++) {
        console.log(arr[i][0] + " - " + arr[i][1] + " - " + arr[i][2]);
    }
}

function heuristic(grid) {
    return ManhattanDist(grid);
}

function ManhattanDist(grid) {
    var dist = 0;
    for(i=0;i<3;i++) {
        for(j=0;j<3;j++) {
            if(grid[i][j]!=0) {
                for(k=0;k<3;k++) {
                    for(l=0;l<3;l++) {
                        if(grid[i][j] == goal[k][l]) {
                            dist+= Math.abs(i-k)+Math.abs(j-l);
                        }
                    }
                }
            }
        }
    }
    return dist;
}

function expand(grid) {
    var original = grid;
    //printArr(original);
    var col = -1, i, j, row = -1;
    //find the 0 location
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (grid[i][j] == 0) {
                row = i;
                col = j;
                break;
            }
        }
    }

    console.log(row + "-"+ col);
    var fourPair = [[row-1,col],[row,col-1],[row+1,col],[row,col+1]];
                    //up -        left            down     right

    var minCost = 1000;
    var index = -1;
    for(i=0;i<4;i++){
        if(fourPair[i][0]>=0&&fourPair[i][0]<=2&&fourPair[i][1]>=0&&fourPair[i][1]<=2)         {
            var temp = tempSquare[i][row][col];
            tempSquare[i][row][col]= tempSquare[i][fourPair[i][0]][fourPair[i][1]];
            tempSquare[i][fourPair[i][0]][fourPair[i][1]] = temp;
            printArr(tempSquare[i]);
            console.log("===================");

            var cost = heuristic(grid);
            if(minCost>cost) {
                index = i;
                minCost = cost;
            }
        }
    }
    return 1;
}

function AI(grid = 0) {
    if (grid == 0) {
        listAI = getValueFromBoard();
    }
    var col = -1, i, j, row = -1;
    //find the 0 location
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (listAI[i][j] == 0) {
                row = i;
                col = j;
                break;
            }
        }
    }

    var moves = new Array();
    for(var k=0;k<4;k++) {
        moves[k] = $.extend(true, [], listAI);
    }
    var fourPair = [[row-1,col],[row,col-1],[row+1,col],[row,col+1]];
    //down - right - up - left
    var listMove = ['down','right','up','left'];
    var index = 0;
    var minCost = 1000;
    for(i=0;i<4;i++){
        if(fourPair[i][0] >= 0 && fourPair[i][0] <= 2 &&
            fourPair[i][1]>=0 && fourPair[i][1]<=2) {
            //swap value between zero and other
            var temp = moves[i][row][col];
            moves[i][row][col] = moves[i][fourPair[i][0]][fourPair[i][1]];
            moves[i][fourPair[i][0]][fourPair[i][1]] = temp;
            var cost = heuristic(moves[i]);
            if(minCost > cost) {
                index = i;
                minCost = cost;
            }
        }
    }
    //update listAI
    listAI = $.extend(true, [], moves[index]);
    return listMove[index];
}


function solve() {
    $("#tip").empty();
    var m = 1;
    listAI = getValueFromBoard();
    var found = reachGoal(listAI);
    if (found) {
        $("#tip").text("you won already!!!").slideDown(500);
        return;
    }
    do {
        var move = AI(-1);
        var str = "moves " + m + ":" + move;
        $("#tip").append('<div>'+str+'</div>');
        m++;
        found = reachGoal(listAI);
    } while (found == false && m < 1255);
    $("#tip").slideDown(1000);
    return 0;
}
