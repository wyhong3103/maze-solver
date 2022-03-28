const maze_container = document.querySelector(".maze");
const generate_btn = document.querySelector(".generate");
const solve_btn = document.querySelector(".solve");
const resize_btn = document.querySelector(".resize");
const size_slider = document.querySelector("#size-slider");
const size_n = document.querySelector(".size-n");
let vis = [];
let grid = [];
let wall = [];
let size = 5;

function cell_generator(size){    
    for(let i = 0; i < size; i++){
        let row_vis = [];
        let row_grid = [];
        let row_wall = [];
        for (let j = 0; j < size; j++){
            let cell = document.createElement("div");
            cell.style.width = `${649/size}px`;
            cell.style.height = cell.style.width;
            cell.classList.add("maze-cell");
            maze_container.appendChild(cell);
            row_vis.push(0);
            row_grid.push(cell);
            row_wall.push([1,1,1,1]);
        }
        vis.push(row_vis);
        grid.push(row_grid);
        wall.push(row_wall);
    }
}

function valid(i, j, carved){
    if (i-1 < 0 && carved === 0){
        return false;
    }
    else if (j-1 < 0 && carved=== 3){
        return false;
    }
    else if (i+1 >= size && carved === 2){
        return false;
    }
    else if (j+1 >= size && carved === 1){
        return false;
    }
    switch(carved){
        case 0:
            if (vis[i-1][j]) return false;
            break;
        case 1:
            if (vis[i][j+1]) return false;
            break;
        case 2:
            if (vis[i+1][j]) return false;
            break;
        case 3:
            if (vis[i][j-1]) return false;
            break;
    }
    return true;
}

function available(i, j){
    if (i > 0 && !vis[i-1][j]) return true;
    if (i < size-1 && !vis[i+1][j]) return true;
    if (j > 0 && !vis[i][j-1]) return true;
    if (j < size-1 && !vis[i][j+1]) return true;
    return false;
}

function dfs(i, j){
    if (i < 0 || j < 0 || i >= size|| j >= size|| vis[i][j]) return;
    vis[i][j] = true;


    while (available(i,j)){
        let possible_path = [0,1,2,3];
        let carved_wall = possible_path[Math.floor(Math.random() * 4)];
        while (!valid(i,j, carved_wall) && (possible_path.length > 0)){
            possible_path = possible_path.filter((i) => i != carved_wall);
            carved_wall = possible_path[Math.floor(Math.random() * possible_path.length)];
        }
        if (possible_path.length === 0) break;
        wall[i][j][carved_wall] = 0;
        switch(carved_wall){
            case 0:
                wall[i-1][j][2] = 0;
                grid[i-1][j].style.borderBottom = "none";
                grid[i][j].style.borderTop = "none";
                dfs(i-1, j);
                break;
            case 1:
                wall[i][j+1][3] = 0;
                grid[i][j+1].style.borderLeft = "none";
                grid[i][j].style.borderRight = "none";
                dfs(i, j+1);
                break;
            case 2:
                wall[i+1][j][0] = 0;
                grid[i+1][j].style.borderTop = "none";
                grid[i][j].style.borderBottom = "none";
                dfs(i+1, j);
                break;
            case 3:
                wall[i][j-1][1] = 0;
                grid[i][j-1].style.borderRight = "none";
                grid[i][j].style.borderLeft = "none";
                dfs(i, j-1);
                break;
        }
    }
}

function fill_path(path){
    grid[size-1][size-1].classList.add("path");
    let pair = path[size-1][size-1];
    let i = pair[0]; let j = pair[1];
    while(!(i === 0 && j === 0)){
        i = pair[0];
        j = pair[1];
        pair = path[i][j];
        grid[i][j].classList.add("path");
    }
}

function solve(){
    let queue = [];
    queue.push([0,0]);
    let path = [];
    let vis_solve = [];
    for(let i = 0; i < size; i++){
        row = [];
        row_vis = []
        for(let j = 0; j < size; j++){
            row.push([-1,-1]);
            row_vis.push(-1);
        }
        path.push(row);
        vis_solve.push(row_vis);
    }
    vis_solve[0][0] = true;

    while (queue.length > 0){
        let c = queue.shift();
        let i = c[0]; let j = c[1];
        if (i === size-1 && j === size-1) break;

        if (!wall[i][j][0]){
            if (vis_solve[i-1][j] === -1){
                path[i-1][j] = [i,j];
                vis_solve[i-1][j] = true;
                queue.push([i-1, j]);
            }
        }
        if (!wall[i][j][1]){
            if (vis_solve[i][j+1] === -1){
                path[i][j+1] = [i,j];
                vis_solve[i][j+1] = true;
                queue.push([i, j+1]);
            }
        }
        if (!wall[i][j][2]){
            if (vis_solve[i+1][j] === -1){
                path[i+1][j] = [i,j];
                vis_solve[i+1][j] = true;
                queue.push([i+1, j]);
            }
        }
        if (!wall[i][j][3]){
            if (vis_solve[i][j-1] === -1){
                path[i][j-1] = [i,j];
                vis_solve[i][j-1] = true;
                queue.push([i, j-1]);
            }
        }

    }
    fill_path(path);
}

function generate_onclick(){
    vis = [];
    grid = [];
    wall = [];
    maze_container.innerHTML = "";
    cell_generator(size);
    dfs(0,0);
}

function solve_onclick(){
    solve();
}

function update_size_n(){
    size_n.textContent = size_slider.value;
}

function resize_onclick(){
    vis = [];
    grid = [];
    wall = [];
    size = size_slider.value;
    maze_container.innerHTML = "";
    cell_generator(size);
    dfs(0,0);
}


generate_btn.addEventListener("click", generate_onclick);
solve_btn.addEventListener("click", solve_onclick);
size_slider.addEventListener("change", update_size_n)
resize_btn.addEventListener("click",resize_onclick)


generate_onclick();
update_size_n();