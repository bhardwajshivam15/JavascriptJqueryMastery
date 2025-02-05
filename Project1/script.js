let totalSeconds=0;
let id=-1;
    $(document).ready(function(){
        function renderTime(){
        let hr = Math.floor(totalSeconds/3600);
        let min = Math.floor(totalSeconds/60-hr*60);
        let sec = totalSeconds-hr*3600-min*60;
        hr = hr>9?hr+"":"0"+hr;
        min = min>9?min+"":"0"+min;
        sec = sec>9?sec+"":"0"+sec;
        $('p').html(`${hr} : ${min} : ${sec}`);
    }
        $(".start").click(function(){
        if(id === -1){
            id = setInterval(()=>{
            totalSeconds++;
            renderTime();
            },1000);
        }
        });
        $(".pause").click(function(){
            renderTime();
            clearInterval(id);
            id = -1;
        });
        $(".stop").click(function(){
            totalSeconds=0;
            renderTime();
            clearInterval(id);
            id = -1;
        });
    });