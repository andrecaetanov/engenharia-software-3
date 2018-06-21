import { Alternativa } from './../../models/alternativa';
import { PerguntaProvider } from './../../providers/pergunta/pergunta';
import { MenuPrincipalPage } from './../menu-principal/menu-principal';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Pergunta } from '../../models/pergunta';
import shuffle from 'shuffle-array';

const TOTAL_PERGUNTAS = 4;

@IonicPage()
@Component({
  selector: 'page-pergunta',
  templateUrl: 'pergunta.html',
  providers: [PerguntaProvider]
})
export class PerguntaPage {
  private perguntas: Pergunta[] = this.perguntaProvider.getPerguntas();
  private indicePergunta: number = 0;
  public perguntaAtual: Pergunta = this.perguntas[this.indicePergunta];
  public pontuacao: number = 500;
  public alternativas: Alternativa[] = new Array();
  public usouDica = false;
  public usouSopro = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private perguntaProvider: PerguntaProvider) {
    this.sortearAlternativas();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerguntaPage');
  }

  retornarParaMenu() {
    this.navCtrl.push(MenuPrincipalPage);
  }

  verificarResposta(alternativa: Alternativa) {
    if (this.indicePergunta < TOTAL_PERGUNTAS) {
      if (alternativa.titulo == this.perguntaAtual.alternativaCorreta.titulo) {
        this.indicePergunta++;
        this.perguntaAtual = this.perguntas[this.indicePergunta];
        this.sortearAlternativas();
        this.calcularPontuacao(this.indicePergunta);
      }
      else {
        this.retornarParaMenu();
      }
    }
  }

  sortearAlternativas() {
    this.alternativas = new Array();
    this.alternativas = this.perguntaAtual.alternativasIncorretas.slice(0);
    this.alternativas.push(this.perguntaAtual.alternativaCorreta);

    shuffle(this.alternativas);
  }

  usarDica() {
    if (!this.usouDica) {
      this.usouDica = true;
      let contador = 0;

      shuffle( this.perguntaAtual.alternativasIncorretas);

      this.perguntaAtual.alternativasIncorretas.some(alternativa => {
        if (alternativa == this.alternativas[0]) {
          this.alternativas[0].desabilitada = true;
        }
        else if (alternativa == this.alternativas[1]) {
          this.alternativas[1].desabilitada = true;
        }
        else if (alternativa == this.alternativas[2]) {
          this.alternativas[2].desabilitada = true;
        }
        else if (alternativa == this.alternativas[3]) {
          this.alternativas[3].desabilitada = true;
        }

        contador++;

        if (contador == 2) {
          return true;
        }
      });
    }
  }

  usarSopro() {
    if (!this.usouSopro) {
      /*this.usouSopro = true;
      let porcentagem = 100;

      this.alternativas.forEach(alternativa => {
        if (alternativa.titulo == this.perguntaAtual.alternativaCorreta.titulo) {
          alternativa.porcentagemSopro = Math.floor(Math.random() * (porcentagem - porcentagem*0.4)) + 20;
        }
        else {
          alternativa.porcentagemSopro = Math.floor(Math.random() * (porcentagem - porcentagem*0.75)) + 5;
        }

        porcentagem = porcentagem - alternativa.porcentagemSopro;
      });*/
    }
  }

  calcularPontuacao(x: number) {
    this.pontuacao = -0.0000772376 * Math.pow(x, 16) 
      + 0.00950231 * Math.pow(x, 15) 
      - 0.536279 * Math.pow(x, 14) 
      + 18.4071 * Math.pow(x, 13) 
      - 429.497 * Math.pow(x, 12) 
      + 7213.2 * Math.pow(x, 11) 
      - 90050.9 * Math.pow(x, 10) 
      + 850927 * Math.pow(x, 9) 
      - 6.13852 * Math.pow(10, 6) * Math.pow(x, 8)
      + 3.38434 * Math.pow(10, 7) * Math.pow(x, 7)
      - 1.41766 * Math.pow(10, 8) * Math.pow(x, 6)
      + 4.4512;
  }
}
