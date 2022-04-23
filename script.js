function start(){

    $("#inicio").hide();
    $("#fundo-game").append("<div class='anima1' id='jogador'></div>")
    $("#fundo-game").append("<div class='anima2' id='inimigo1'></div>")
    $("#fundo-game").append("<div id='inimigo2'></div>")
    $("#fundo-game").append("<div class='anima3' id='amigo'></div>")
    $("#fundo-game").append("<div id='placar'></div>")
    $("#fundo-game").append("<div id='energia'></div>")

    var jogo = {};
    var TECLA = {
        Cima: 38,
        Baixo: 40,
        Tiro: 32
    }
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    jogo.pressionou = [];
    var podeAtirar =  true;
    var fimJogo = false;
    var pontos=0;
    var salvos=0;
    var perdidos=0;
    var energiaAtual = 3;
    var somDisparo = document.getElementById('somDisparo')
    var somExplosao = document.getElementById('somExplosao')
    var musica = document.getElementById('musica')
    var somGameOver = document.getElementById('somGameOver')
    var somPerdido = document.getElementById('somPerdido')
    var somResgate = document.getElementById('somResgate')


    musica.addEventListener("ended", function(){
        musica.currentTime =0;
        musica.play();
    }, false);
    musica.play();


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
        moveAmigo();
        colisao();
        placar();
        energia();
        
    }

    function moveFundo(){
        let esquerda = 0;
        esquerda = parseInt($("#fundo-game").css("background-position"));
	    $("#fundo-game").css("background-position",esquerda-1);
    }

    function moveJogador(){
        if(jogo.pressionou[TECLA.Cima]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo-10);   
            if(topo <=0){
                $("#jogador").css("top", topo+10);       
            }
        }
        if(jogo.pressionou[TECLA.Baixo]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo+10);
            if(topo>=434){
                $("#jogador").css("top", topo-10);       
            }   
        }
        if(jogo.pressionou[TECLA.Tiro]){
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
        somDisparo.play();
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

    function colisao(){
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));


        if(colisao1.length > 0){
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
            energiaAtual--;
            
        }

        if(colisao2.length > 0){
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);
            $("#inimigo2").remove();
            reposicionarInimigo2();
            energiaAtual--;
        }

        if(colisao3.length > 0){
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left",950);
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
            pontos = pontos + 100;
            velocidade = velocidade +0.3;
            
        }

        if(colisao4.length > 0){
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left",950);
            reposicionarInimigo2();
            pontos = pontos + 50;
        }

        if(colisao5.length > 0){
            somResgate.play();
            reposicionarAmigo();
            $("#amigo").remove();
            salvos++;
        }

        if(colisao6.length > 0){
            somPerdido.play();
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();
            reposicionarAmigo();
            perdidos++;
        }     
    }

    function explosao1(inimigoX, inimigoY){
        somExplosao.play();
        $("#fundo-game").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url(images/explosao.png)");
        var div=$("#explosao1");
        div.css("top", inimigoY)
        div.css("left", inimigoX);
        div.animate({width:200, opacity:0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

            function removeExplosao(){
                div.remove();
                window.clearInterval(tempoExplosao);
                tempoExplosao = null;
            }
    }

    function explosao2(inimigoX, inimigoY){
        somExplosao.play();
        $("#fundo-game").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image", "url(images/explosao.png)");
        var div=$("#explosao2");
        div.css("top", inimigoY)
        div.css("left", inimigoX);
        div.animate({width:200, opacity:0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

            function removeExplosao(){
                div.remove();
                window.clearInterval(tempoExplosao);
                tempoExplosao = null;
            }
    }

    function explosao3(amigoX, amigoY){
        $("#fundo-game").append("<div class='anima4' id='explosao3'></div>");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
      

        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

            function resetaExplosao3(){
                $("#explosao3").remove();
                window.clearInterval(tempoExplosao3);
                tempoExplosao3 = null;
            }
    }


    function reposicionarInimigo2(){
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);
        function reposiciona4(){
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;
            if(fimJogo === false){
                $("#fundo-game").append("<div id='inimigo2'></div>")
            }
        }
    }

    function reposicionarAmigo(){
        var tempoAmigo = window.setInterval(reposicionar6, 6000);
        function reposicionar6(){
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
        }
        if(fimJogo === false){
            $("#fundo-game").append("<div class='anima3' id='amigo'></div>")
        }
    }

    function placar(){
        $("#placar").html("<h2>Pontos:  " + pontos + "Salvos:  "+ salvos + "Perdidos:  " + perdidos + "</h2>");
    }

    function energia(){
        if(energiaAtual === 3){
            $("#energia").css("background-image", "url(images/energia3.png)")
        }

        if(energiaAtual === 2){
            $("#energia").css("background-image", "url(images/energia2.png)")
        }
        if(energiaAtual === 1){
            $("#energia").css("background-image", "url(images/energia1.png)")
        }
        if(energiaAtual === 0){
            $("#energia").css("background-image", "url(images/energia0.png)")
            gameOver();
        }
    }
    function gameOver(){
        fimJogo = true;
        musica.pause();
        somGameOver.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundo-game").append("<div id='fim'></div>");

        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciarJogo()><h3>Jogar Novamente</h3></div>");
    }

}
function reiniciarJogo(){
    somGameOver.pause();
    $("#fim").remove();
    start();
    
}




    