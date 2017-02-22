//DIRECTIONAL BUTTONS
var n = document.getElementById('n');
var s = document.getElementById('s');
var e = document.getElementById('e');
var w = document.getElementById('w');
var table = document.getElementById('table');
// var gridCell = localStorage.getItem('grid size', 4);
var gridCell = localStorage.getItem('grid size') || 4;
var maze, thisCell, exitCell, cells;
var monsters = [];
var monsterTypes = ['dragon', 'goblin', 'orge', 'troll', 'harpey'];

var hero = {
    name: 'Tim',
    hp: 10
};

function Monsters(name, hp){
    this.name = name,
    this.hp =  hp
};



n.addEventListener('click', function(evt){
    moveNorth(evt);
});
e.addEventListener('click', function(evt){
    moveEast(evt);
});
s.addEventListener('click', function(evt){
    moveSouth(evt);
});
w.addEventListener('click', function(evt){
    moveWest(evt);
});

function enableNorth(wall){
    wall ? n.disabled = false : n.disabled=true
    // console.log(wall);
};
function enableEast(wall){
    wall ? e.disabled = false : e.disabled=true
    // console.log(wall);
};
function enableSouth(wall){
    wall ? s.disabled = false : s.disabled=true
    // console.log(wall);
};
function enableWest(wall){
    wall ? w.disabled = false : w.disabled=true
    // console.log(wall);
};

function moveNorth(x){
    console.log('go north');
    statusCell(thisCell, 'inactive');
    // maze.firstChild.childNodes[thisCell[0]].childNodes[thisCell[1]].classList.remove('active');
    thisCell = [thisCell[0]-1, thisCell[1]];
    statusCell(thisCell, 'active');
    encounter();
    checkWalls(cells);
};
function moveEast(x){
    console.log('go east');
    statusCell(thisCell, 'inactive');
    // maze.firstChild.childNodes[thisCell[0]].childNodes[thisCell[1]].classList.remove('active');
    thisCell = [thisCell[0], thisCell[1]+1];
    statusCell(thisCell, 'active');
    encounter();
    checkWalls(cells);
};
function moveSouth(x){
    console.log('go south');
    statusCell(thisCell, 'inactive');
    // maze.firstChild.childNodes[thisCell[0]].childNodes[thisCell[1]].classList.remove('active');
    thisCell = [thisCell[0]+1, thisCell[1]];
    statusCell(thisCell, 'active');
    encounter();
    checkWalls(cells);
};
function moveWest(x){
    console.log('go west');
    statusCell(thisCell, 'inactive')
    // maze.firstChild.childNodes[thisCell[0]].childNodes[thisCell[1]].classList.remove('active');
    thisCell = [thisCell[0], thisCell[1]-1];
    statusCell(thisCell, 'active');
    encounter();
    checkWalls(cells);
};

addEventListener('keypress', function(evt){
    evt.preventDefault();
    // console.log(evt);
    if(evt.keyCode === 38 && !n.disabled){
        moveNorth();
    }else if(evt.keyCode === 39 && !e.disabled){
        moveEast();
    }else if(evt.keyCode === 40 && !s.disabled){
        moveSouth();
    }else if(evt.keyCode === 37 && !w.disabled){
        moveWest();
    }
});

//MAZE GENERATOR
var grid = function(x, y){
    var totalCells = x*y;
    cells = [];
    var unvisited = [];

    for (var i=0; i<y; i++){
        cells[i] = [];
        unvisited[i] = [];

        for (var j=0; j<x; j++){
            cells[i][j] = [0,0,0,0];
            unvisited[i][j] = true;
        }
    }

    var currentCell = [Math.floor(Math.random()*y), Math.floor(Math.random()*x)];
    console.log('currentCell '+currentCell);
    var path = [currentCell];

    unvisited[currentCell[0]][currentCell[1]] = false;

    var visited = 1;

    while (visited<totalCells){
        // console.log(visited +', ' +totalCells);
        var possible =
        [[currentCell[0]-1,currentCell[1], 0, 2],
        [currentCell[0], currentCell[1]+1, 1, 3],
        [currentCell[0]+1, currentCell[1], 2, 0],
        [currentCell[0], currentCell[1]-1, 3, 1]];

    var neighbors = [];

        for (var l = 0; l < 4; l++){
            if (possible[l][0]>-1 &&
                possible[l][0]<y &&
                possible[l][1]>-1 &&
                possible[l][1]<x &&
                unvisited[possible[l][0]][possible[l][1]] ){
                neighbors.push(possible[l])
            }
        }

        if (neighbors.length){
            var next = neighbors[Math.floor(Math.random()*neighbors.length)];

            cells[currentCell[0]][currentCell[1]][next[2]]=1;
            cells[ next[0] ][ next[1] ][ next[3] ] = 1;
            unvisited[ next[0] ][ next[1] ] = false;

            visited++;
            currentCell = [ next[0], next[1] ];
            path.push(currentCell);
        }else {
            currentCell = path.pop();
        }
    }
    // return cells;

    gridStart(cells, path);


}(gridCell,gridCell);

function gridStart(cells, path){
    gridBuilder(cells);

    thisCell = statusCell(path[0], 'active');
    exitCell = statusCell(path[path.length-1], 'finish');
    checkWalls(cells);
};

function gridBuilder(cells){
    maze = document.createElement('table');
    table.appendChild(maze);
    // console.log(table);
    for (var i = 0; i<cells.length; i++){
        maze.insertRow(i);
        for (var j = 0; j<cells[i].length; j++){
            maze.firstChild.childNodes[i].insertCell(j);
            thisCell = maze.firstChild.childNodes[i].childNodes[j]

            for (var k = 0; k<4;k++){
                switch(k){
                    case 0:
                        cells[i][j][k] ? thisCell.classList.remove('bt') :
                                                thisCell.classList.add('bt');
                    break;
                    case 1:
                        cells[i][j][k] ? thisCell.classList.remove('br') :
                                                thisCell.classList.add('br');
                        break;
                    case 2:
                        cells[i][j][k] ? thisCell.classList.remove('bb'):
                                                thisCell.classList.add('bb');
                        break;
                    case 3:
                        cells[i][j][k] ? thisCell.classList.remove('bl'):
                                                thisCell.classList.add('bl');
                        break;
                }
            };
        };
    };
};

function theCell(cell){
    maze.firstChild.childNodes[cell[0]].childNodes[cell[1]].classList.add('active');

    return cell;
};

function leaveCell(cell){
    maze.firstChild.childNodes[cell[0]].childNodes[cell[1]].classList.add('exit');
    return cell;
};

function checkWalls(cells){
    var walls = cells[ thisCell[0] ][ thisCell[1] ];
    // console.log(walls);

    for (var i = 0; i < 4; i++){
        switch (i) {
            case 0:
                enableNorth(walls[i]);
                break;
            case 1:
                enableEast(walls[i]);
                break;
            case 2:
                enableSouth(walls[i]);
                break;
            case 3:
                enableWest(walls[i]);
                break;
        }
    };
};

function statusCell (cell, status){
    switch (status) {
        case 'active':
            maze.firstChild.childNodes[cell[0]].childNodes[cell[1]].classList.add('active');
            break;
        case 'inactive':
            maze.firstChild.childNodes[cell[0]].childNodes[cell[1]].classList.remove('active');
            break;
        case 'finish':
            maze.firstChild.childNodes[cell[0]].childNodes[cell[1]].classList.add('exit');
            break;


    }
    return cell;
}

//
// var hero = {
//     name: 'Steve',
//     power: 100,
// };
//
// var Enemy = function(name, power){
//     this.name = name,
//     this.power = power,
//     this.test = function(){
//         return 'a custom method';
//     }
// };
//
// function randCell(){
//     var x = Math.floor(Math.random * cells.length);
//     var y = Math.floor(Math.random * cells[0].length);
// }
//
// function powerLvl (lvl){
//     if (lvl == 'easy'){
//         power = 30;
//     }else if (lvl == 'medium'){
//         power = Math.ceil(Math.random()*20)+30
//     }else if (lvl ==  'hard'){
//         power = Math.ceil(Math.random()*20)+50;
//     }
//     return power;
// }
//
// var enemy1 = new Enemy('Matt', powerLvl('easy'), randCell());
// var enemy2 = new Enemy('Gregg', powerLvl('medium'), randCell());
// var enemy3 = new Enemy('Clyde', powerLvl('hard'), randCell());
//
// // console.log(hero);
// // console.log(enemy1);
// // console.log(enemy2);
// // console.log(enemy3);
//
// if( !localStorage.getItem('hero')) {
//     setCharStorage();
// }
//
// function setCharStorage(){
//     localStorage.setItem('hero', JSON.stringify(hero));
//     sessionStorage.setItem('enemy1',JSON.stringify(enemy1));
//     sessionStorage.setItem('enemy2',JSON.stringify(enemy2));
//     sessionStorage.setItem('enemy3',JSON.stringify(enemy3));
// }
//
// // console.log(JSON.parse(localStorage.getItem('hero')));
//
// // if(!localStorage.getItem('username') && !localStorage.getItem('lastname')){
// //     var name = prompt('Enter your name');
// //     var lName = prompt('Enter your last name');
// //     var password = prompt('Enter your password');
// //
// //     setLoginStorage();
// //
// // }else{
// //     alert('Welcome back '+localStorage.getItem('username')+'!')
// // }
// //
// // function setLoginStorage(){
// //     localStorage.setItem('username', name);
// //     localStorage.setItem('lastname', lName);
// //     sessionStorage.setItem('password', password);
// // }

function gererateMonsters(){
    var totalMonsters = Math.round(Math.random()*(gridCell));
    console.log(totalMonsters);

    for(var i = 0;i < totalMonsters; i++){
        monsters[i] = new Monsters();
        monsters[i].name = monsterTypes[Math.floor(Math.random()*monsterTypes.length)];
        monsters[i].hp = Math.ceil(Math.random()*10);
    }
};

gererateMonsters();

function encounter(){
    console.log(monsters.length);
    var percEnc = Math.round(monsters.length / (cells.length * cells[0].length) *100);
    console.log(percEnc);
    var chanceEnc = Math.ceil(Math.random()*100);
    var monsterEnc = Math.floor(Math.random()* monsters.length);
    if(chanceEnc <= percEnc){
        battle( monsters.splice(monsterEnc, 1) );
        console.log("ahh!! a monster!");
    }
    if (
        maze.firstChild.childNodes[thisCell[0]].childNodes[thisCell[1]].classList.contains('exit')
    ){
        alert('You win!!!');
        gridCell++;
        localStorage.setItem('grid size', gridCell);
        location.reload();
    }
};

function battle(monster){
    // console.log(monster[0].name);
    // console.log(monster[0].hp);
    alert('Prepare for battle!! You happened across a '+monster[0].name+' !!')
    while (monster[0].hp > 0 && hero.hp > 0){
        var damage = Math.ceil(monster[0].hp / 3);
        hero.hp -= damage;
        if(hero.hp <= 0){
            alert("You're dead.. sorry :(");
            location.reload();
        }
        alert("You've taken "+ damage+" against your HP!");
        playerAction(monster);
        if(monster[0] <= 0 ){
            alert("You're monster is dead!!")
        }
    }
};

function playerAction(monster){
    var damage = Math.ceil(hero.hp / 2);
    monster[0].hp -= damage;
    alert("You've dealt a deadly blow of "+damage+" HP!")
};
