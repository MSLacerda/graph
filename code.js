angular.module('GrafoApp', []);

angular.module('GrafoApp')
  .controller('MainCtrl', function ($scope) {
    var cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,

      pan: { x: 300, y: 300 },

      style: cytoscape.stylesheet()
        .selector('node')
        .css({
          'color': 'white',
          'content': 'data(id)',
          'background-color': 'white',
          'font-weight': 'bold'
        })
        .selector('edge')
        .css({
          'target-arrow-shape': 'triangle',
          'label': 'data(label)',
          'color': 'white',
          'width': 4,
          'line-color': '#9999ff',
          'target-arrow-color': '#9999ff',
          'curve-style': 'bezier'
        })
        .selector('.highlighted')
        .css({
          'background-color': 'red',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
        })
        .selector('.way')
        .css({
          'background-color': 'green',
          'line-color': 'green',
          'target-arrow-color': 'green',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
        }),
      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: '#A',
        padding: 10
      }
    });

    // ---- TRABALHO COMEÇA AQUI ------

    // Código para explicar.

    var self = this; // AngularJS...

    self.ok = false;
    self.msg = "";
    self.classCtrl = "";

    function exibir(msg, classe, bolean) {
      self.msg = msg;
      self.classCtrl = classe;
      self.ok = true;
      setTimeout(function () { self.ok = false; console.log("OK") }, 6000);
    }

    self.centralizar = function () {
      cy.animate({
        center: { eles: "#A" }
      })
        .delay(0500)
        .animate({
          zoom: 1
        })
    }

    self.lista = []; //Array para armazenar nós.
    self.priorityList = []; // Array de prioridades
    self.iteracao = []; // Array para exibir iteração na view
    self.pares = [];  //  Array que contem os pares resultante no algoritmo
    var list = [];
    var listAux = 0;
    var alfa = 65;

    //  Função para retornar item de menor peso da lista
    function min() {
      var lowest = Number.POSITIVE_INFINITY;
      var objMin = -1;
      var tmp;
      for (var i = 0; i < self.priorityList.length; i++) {
        tmp = self.priorityList[i].no.pesoTo;
        if (tmp < lowest) {
          lowest = tmp;
          objMin = self.priorityList.indexOf(self.priorityList[i]);
        }
      }
      return objMin;

    }

    function clear() {
      $("#noX").val("");
      $("#noY").val("");
      $("#peso").val("");
    }

    // Função para ativar e desativar "Buttons"
    function enableDisable(a) {
      if (a === 1) {
        $("#btnAddGrafo").removeAttr('disabled');
        $("#btnAddExemplo").removeAttr('disabled');
      }
      if (a === 0) {
        $("#btnAddGrafo").attr('disabled', 'disabled');
        $('#btnAddExemplo').attr('disabled', 'disabled');
      }
    }

    //Cria o grafo  
    self.addGrafo = function () {
      var j = $("#qtdNo").val();
      enableDisable(0);
      for (var i = 0; i < j; i++) {
        name = String.fromCharCode(alfa); // Transforma o código ascii em letras 
        alfa++; //Acrescenta +1 no código ascii para prox letra
        cy.add([
          { group: "nodes", data: { id: name } }
        ])
        self.lista.push({ no: { nome: name, pesoTo: null, ant: null, adj: [] } });
      }
      cy.animate({
        center: { eles: '#A' }
      })
    }

    //Remove o grafo
    self.deleteGrafo = function () {
      enableDisable(1);
      for (var i = 0; i < self.lista.length; i++) { // Faz um for por todo o grafo, removendo os nós
        cy.remove("#" + self.lista[i].no.nome);
      }
      alfa = 65;  // Reseta o codigo ASCI para A novamente
      self.lista = [];            // 
      self.iteracao = [];         //  Limpa todas as listas
      self.priorityList = [];     //
      self.pares = [];            //
    }

    // Add um nó
    self.addNo = function () {
      name = String.fromCharCode(alfa);
      alfa++;
      cy.add([
        { group: "nodes", data: { id: name } }
      ])
      self.lista.push({ no: { nome: name, pesoTo: null, ant: null, adj: [] } });
    }

    self.deleteNo = function () {
      _no = $("#noToDelete").val();
      for (i = 0; i < self.lista.length; i++) {
        if (self.lista[i].no.nome === _no) {
          self.lista.splice(i, 1);
        }
        for (j = 0; j < self.lista[i].no.adj.length; j++) {
          if (self.lista[i].no.adj[j].data.no === _no)
            self.lista[i].no.adj.splice(j, 1);
        }
      }
      cy.remove('#' + _no);
    }


    // Add uma aresta
    self.addEdge = function () {
      _source = $("#noX").val();
      _target = $("#noY").val();
      _weight = $("#peso").val();
      _noSaida = -1;
      _noChegada = -1;
      for (var i = 0; i < self.lista.length; i++) { // Percorre a lista de adjacencia para add o no e o peso
        if (self.lista[i].no.nome === _source) {
          _noSaida = i;
        }
        if (self.lista[i].no.nome === _target) {
          _noChegada = i;
        }
      }
      if (_noSaida !== -1) {
        if (_noChegada !== -1) {
          self.lista[_noSaida].no.adj.push({ data: { no: _target, peso: _weight } });
          cy.add([ // add aresta ao grafico, "biblioteca"
            { group: "edges", data: { id: _source + _target, label: _weight, weight: _weight, source: _source, target: _target } }
          ])
          exibir("Aresta Adicionada", "well ok");
        } else {
          exibir("Nó de chegada não encontrado!", "well danger");
        }
      } else {
        exibir("Nó de Saida não encontrado!", "well danger");
      }
      $("#noX").focus();
      clear();
    }

    // Remover aresta
    self.deleteEdge = function () {
      _source = $("#noX").val();
      _target = $("#noY").val();
      _weight = $("#peso").val();
      for (var i = 0; i < self.lista.length; i++) {
        if (self.lista[i].no.nome === _source) {
          for (var j = 0; j < self.lista[i].no.adj.length; j++) {
            if (self.lista[i].no.adj[j].data.no === _target) {
              cy.remove("#" + _source + _target); // remove do grafico "Biblioteca"
              _remove = self.lista[i].no.adj.indexOf(
                { data: { no: _target, peso: _weight } }
              );
              self.lista[i].no.adj.splice(_remove, 1); // remove aresta da lista
            }
          }
        }
      }
      $("#noX").focus();
      clear();
    }

    self.addExemplo = function () {
      enableDisable(0);
      for (var i = 0; i < 5; i++) {
        name = String.fromCharCode(alfa);
        alfa++;
        self.lista.push({ no: { nome: name, pesoTo: null, ant: null, adj: [] } });
        cy.add([
          { group: "nodes", data: { id: name } }
        ])
      }
      cy.add([ // add arestas ao grafico, "biblioteca"
        { group: "edges", data: { id: "AB", label: 1, weight: 1, source: "A", target: "B" } },
        { group: "edges", data: { id: "AE", label: 10, weight: 10, source: "A", target: "E" } },
        { group: "edges", data: { id: "AD", label: 3, weight: 3, source: "A", target: "D" } },
        { group: "edges", data: { id: "BC", label: 5, weight: 5, source: "B", target: "C" } },
        { group: "edges", data: { id: "CE", label: 1, weight: 1, source: "C", target: "E" } },
        { group: "edges", data: { id: "DC", label: 2, weight: 2, source: "D", target: "C" } },
        { group: "edges", data: { id: "DE", label: 6, weight: 6, source: "D", target: "E" } }
      ])
      for (var j = 0; j < self.lista.length; j++) {
        if (self.lista[j].no.nome === "A") {
          self.lista[j].no.adj.push({ data: { no: "B", peso: 1 } });
          self.lista[j].no.adj.push({ data: { no: "E", peso: 10 } });
          self.lista[j].no.adj.push({ data: { no: "D", peso: 3 } });
        }
        if (self.lista[j].no.nome === "B") {
          self.lista[j].no.adj.push({ data: { no: "C", peso: 5 } });
        }
        if (self.lista[j].no.nome === "C") {
          self.lista[j].no.adj.push({ data: { no: "E", peso: 1 } });
        }
        if (self.lista[j].no.nome === "D") {
          self.lista[j].no.adj.push({ data: { no: "C", peso: 2 } });
          self.lista[j].no.adj.push({ data: { no: "E", peso: 6 } });
        }
      }
    }

    function reset() {
      cy.edges().classes();
      cy.nodes().css('background-color', 'white');

      self.pares = [];
      self.iteracao = [];

      self.list = list.splice();
    }

    function initialize(_inicial) {

      for (var i = 0; i < self.lista.length; i++) {         //
        self.lista[i].no.pesoTo = Number.POSITIVE_INFINITY; //  Inicializa todos os nós com peso infinito
        self.lista[i].no.ant = null;                        //  e anterior igual a null

        if (self.lista[i].no.nome === _inicial) {
          self.lista[i].no.pesoTo = 0;                      // O nó inicial tem como peso 0
          self.lista[i].no.ant = null;
        }
      }

      self.priorityList = self.lista.slice(); // Copia os elementos de lista para priorityList

    }
    function drawSearch(i, j) {
      self.iteracao.push({ n: i, m: j });
      $scope.$apply();
      cy.$("#" + i + j).addClass('way');
    }

    function relax(atual, adja, peso, count) {
      for (var i = 0; i < self.lista.length; i++) {
        if (self.lista[i].no.nome == adja.no) {     //
          id = i;                                   //  Procura na lista principal o Adj
        }                                           //
      }

      pesoAdja = self.lista[id].no.pesoTo;          //  Captura o peso atual do no adjacente
      x = parseInt(atual.pesoTo); // Converte o peso do no atual                    
      y = parseInt(peso);         // e o peso da aresta para inteiro
      if (pesoAdja > x + y) {             //  Faz o relaxamento
        self.lista[id].no.pesoTo = x + y;
        self.lista[id].no.ant = atual.nome;
      }

    }

    function teste(no) {
      for(var i = 0; i < self.lista.length; i++){
        if (self.lista[i].no.ant == no){
          drawSearch(no,self.lista[i].no.nome);
          setTimeout(teste, 1000, self.lista[i].no.nome);
        }
      }
      

    }

    function walk(inicial) {
      count = 1000;   // Contador para timer
      for (var i = 0; i < self.lista.length; i++) {
        if (!self.lista[i].no.ant && self.lista[i].no.nome != inicial) {
          continue;
        }
        self.pares.push({ par: { p: self.lista[i].no.nome, a: self.lista[i].no.ant } });

        x = parseInt(self.lista[i].no.pesoTo);
        if (x == 0)
          cy.$("#" + self.lista[i].no.nome).css('background-color', '#ff0202');
        if (x >= 1)
          cy.$("#" + self.lista[i].no.nome).css('background-color', '#fc2d2d');
        if (x >= 2)
          cy.$("#" + self.lista[i].no.nome).css('background-color', '#fc5858');
        if (x >= 3)
          cy.$("#" + self.lista[i].no.nome).css('background-color', '#f27474');
        if (x >= 5)
          cy.$("#" + self.lista[i].no.nome).css('background-color', '#ffa0a0');
        if (x >= 7)
          cy.$("#" + self.lista[i].no.nome).css('background-color', '#fcb8b8');
        if (x >= 9)
          cy.$("#" + self.lista[i].no.nome).css('background-color', '#ffd3d3');
      }
      teste(inicial);
    }

    function dijkstra(inicial) {
      if (listAux === 0)
        list = self.lista.slice();
      else
        reset();
      listAux++;
      initialize(inicial);              //  Inicializa o grafo
      while (self.priorityList.length !== 0) {
        var a = min();
        if (a == -1) {
          break;
        }
        noV = self.priorityList.splice(a, 1); // Pega o indice do elemento de menor peso da lista de prioridades
        for (var i = 0; i < noV[0].no.adj.length; i++) {
          cy.$('#' + noV[0].no.nome + noV[0].no.adj[i].data.no).addClass('highlighted')
          _adja = noV[0].no.adj[i].data;         //
          _peso = noV[0].no.adj[i].data.peso;    // Caminha sobre as adjancencias do nó e faz o relaxamento
          _atual = noV[0].no;                    //
          relax(_atual, _adja, _peso)
        }
      }
      walk(inicial);                 // Ao terminar o algoritmo inicia para desenhar
    }

    cy.on('tap', 'node', function (evt) {
      dijkstra(evt.cyTarget.id());
    });



  })
