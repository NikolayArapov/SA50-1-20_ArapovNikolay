function Animation(){
  let elem = document.getElementById("block");
  let pos = 0;
  let top = 0;
  let time = setInterval (frame, 2);
  let speed_top = 0;
  let speed_left = 1;
  function frame(){
      if(pos==0 && top==0){
      speed_left = 1;
      speed_top = 0;
      }else if(pos==700 && top==0){
      speed_left = 0;
      speed_top = 1;
      }else if(pos==700 && top==700){
      speed_left = -1;
      speed_top = 0;
      }else if(pos==0 && top==700){
      speed_left = 0;
      speed_top = -1;
      }
      top+= speed_top;
      elem.style.top = top + "px";
      pos+=speed_left;
      elem.style.left = pos + "px";
      }
  }