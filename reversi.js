const SIZE=8;
let turn=0;
let Board=
[["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["","","","black","white","","",""],
["","","","white","black","","",""],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
];
const turn_text=document.querySelector("#turn")
const Board_view=get_board()
set_button();
change_view()

function set_button(){
    let buttons=document.querySelectorAll(".cell");
    for(let i in buttons){
        try{
            buttons[i].addEventListener("click",put_stone);
            buttons[i].value=i
        }catch{}
    }
}
//htmlから取得
function get_board(){
    let cell_obj=document.querySelectorAll(".cell")
    let array=[]
    let board=[]
    for(let i in cell_obj){
        try{
            array.push(cell_obj[i].querySelector("div"))
            if(i%SIZE==SIZE-1){
                board.push(array)
                array=[]
            }
        }catch{}
    }
    return board
}

//htmlを変える
function change_view(){
    for(let y=0;y<SIZE;y++){
        for(let x=0;x<SIZE;x++){
            Board_view[y][x].className="stone "+Board[y][x]
        }
    }
}


function put_stone(){
    const y=Math.floor(this.value/SIZE)
    const x=this.value%SIZE
    reverse(y,x)
}

//石をひっくり返す puttableの役目も果たす
function reverse(y,x){
    let flag=false;
    const my_color=turn ? "white":"black";
    const opp_color=!turn ? "white":"black";
    for(dy=-1;dy<2;dy++){
        for(dx=-1;dx<2;dx++){
            if(check(y,x,dy,dx)){
                flag=true;
                for(let i=1;i<SIZE;i++){
                    if(Board[y+dy*i][x+dx*i]==opp_color){
                        Board[y+dy*i][x+dx*i]=my_color;
                    }else{
                        break;
                    }
                }
            }
        }   
    }
    if(flag){
        Board[y][x]=my_color
        change_turn()
    }
    return flag;
}

//石が置けるかどうか
function is_puttable(y,x){
    const my_color=turn ? "white":"black";
    const opp_color=!turn ? "white":"black";
    if(Board[y][x]!=""){return false;}
    for(dy=-1;dy<2;dy++){
        for(dx=-1;dx<2;dx++){
            if(check(y,x,dy,dx)){
                return true;
            }
        }
    }
    return false;
}
//特定の方向におけるかどうか確かめる
function check(y,x,dy,dx){
    const my_color=turn ? "white":"black";
    const opp_color=!turn ? "white":"black";
    if(Board[y][x]!=""){return false;}
    if(dx==0&&dy==0){
        return false;
    }
    for(let i=1;i<SIZE;i++){
        //枠外
        if(y+dy*i<0||y+dy*i>SIZE-1||x+dx*i<0||x+dx*i>SIZE-1){
            break;
        }
        //自分の色を発見
        if(Board[y+dy*i][x+dx*i]==my_color){
            if(i>1){
                return true;
            //真横は除外
            }else{
                break;
            }
        }
        if(Board[y+dy*i][x+dx*i]==""){
            break;
        }
    }
    return false;

}

function change_turn(){
    console.log("ここ",turn)
    change_view();
    if(is_finished()){
        finish()
    }else{
        turn=1-turn;
        console.log(turn)
        turn_text.textContent=(turn? "白":"黒")+"の番です"
        if(is_pass()){
            turn=1-turn;
            if(is_pass()){
                finish()
            }else{
                window.alert("置ける場所がないのでパスします")
                turn_text.textContent=(turn? "白":"黒")+"の番です"
            }
        }
    }

}

//終了でtrue
function is_finished(){
    for(let y=0;y<SIZE;y++){
        for(let x=0;x<SIZE;x++){
            if(Board[y][x]==""){
                return false;
            }
        }
    }
    return true;
}
//パスするかどうか
function is_pass(){
    for(let y=0;y<SIZE;y++){
        for(let x=0;x<SIZE;x++){
            if(is_puttable(y,x)){
                return false;
            }
        }
    }
    return true;
}

function finish(){
    let black_count=0;
    let white_count=0;
    for(let y=0;y<SIZE;y++){
        for(let x=0;x<SIZE;x++){
            if(Board[y][x]=="black"){
                black_count++;
            }else if(Board[y][x]=="white"){
                white_count++;
            }
        }
    }
    const winner= black_count>white_count? "黒":"白"
    turn_text.textContent=winner+"の勝ち! "+`黒${black_count} : 白${white_count}`
    console.log("finish!!")
}

function restart(){
    if(confirm("本当に終了しますか?")){
        window.location.href="./"
    }
}