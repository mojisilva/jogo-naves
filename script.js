function start(){

    $("#inicio").hide();
    $("#fundo-game").append("<div class='anima1' id='jogador'></div>")
    $("#fundo-game").append("<div class='anima2' id='inimigo1'></div>")
    $("#fundo-game").append("<div id='inimigo2'></div>")
    $("#fundo-game").append("<div class='anima3' id='amigo'></div>")

    var jogo = {};
    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    jogo.pressionou = [];
    var podeAtirar =  true;

    $(document).keydown(function(e){
        jogo.pressionou[e.which] =  true;

    });
    $(document).keyup(function(e){
        jogo.pressionou[e.which] =  false;

    });




    jogo.timer = setInterval(loop, 30)
    
    function loop(){
        moveFundo();
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo()
    }

    function moveFundo(){
        let esquerda = 0;
        esquerda = parseInt($("#fundo-game").css("background-position"));
	    $("#fundo-game").css("background-position",esquerda-1);
    }

    function moveJogador(){
        if(jogo.pressionou[TECLA.W]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo-10);   
            if(topo <=0){
                $("#jogador").css("top", topo+10);       
            }
        }
        if(jogo.pressionou[TECLA.S]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo+10);
            if(topo>=434){
                $("#jogador").css("top", topo-10);       
            }   
        }
        if(jogo.pressionou[TECLA.D]){
            disparo();              
        }
    }

    function moveInimigo1(){
        posicaoX = parseInt($('#inimigo1').css("left"));
        $("#inimigo1").css("left", posicaoX-velocidade);
        $("#inimigo1").css("top", posicaoY);

        if(posicaoX<=0){
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
    }

    function moveInimigo2(){
        posicaoX = parseInt($('#inimigo2').css("left"));
        $("#inimigo2").css("left", posicaoX-3);
       
        if(posicaoX<=0){
            $("#inimigo2").css("left", 775);
        }
    }

    function moveAmigo(){
        posicaoX = parseInt($('#amigo').css("left"));
        $("#amigo").css("left", posicaoX+1);
       
        if(posicaoX >=906){
            $("#amigo").css("left", 0);
        }
    }

    function disparo(){
        if(podeAtirar === true){
            podeAtirar = false;
            topo = parseInt($("#jogador"). css("top"));
            posicaoX = parseInt($("#jogador").css("left"));
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundo-game").append("<div id='disparo'></div>");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executarDisparo, 30);
        }

        function executarDisparo(){
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX+15);
            if(posicaoX >900){
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    }
}
