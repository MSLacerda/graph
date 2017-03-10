angular.module('GrafoApp', []);

angular.module('GrafoApp')
  .controller('MainCtrl', function ($scope) {
    var cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,

      style: cytoscape.stylesheet()
        .selector('node')
        .css({
          'content': 'data(id)'
        })
        .selector('edge')
        .css({
          'target-arrow-shape': 'triangle',
          'label': 'data(label)',
          'width': 4,
          'line-color': '#d1ad0e',
          'target-arrow-color': '#d1ad0e',
          'curve-style': 'bezier'
        })
        .selector('.highlighted')
        .css({
          'background-color': '#61bffc',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
        })
        .selector('.way')
        .css({
          'background-color': '#61bffc',
          'line-color': '#d1ad0e',
          'target-arrow-color': '#d1ad0e',
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

    self.lista = []; //Array para armazenar nós.
    self.priorityList = []; // Array de prioridades
    self.iteracao = [];
    self.pares = [];
    alfa = 65;

    function min(myArray) {
      var lowest = Number.POSITIVE_INFINITY;
      var tmp;

      for (var i = myArray.length - 1; i >= 0; i--) {
        tmp = myArray[i].no.pesoTo;
        if (tmp < lowest) {
          lowest = tmp;
          objMin = myArray.indexOf(myArray[i]);
        }
      }

      return objMin;

    }

    function enableDisable(a) {
      if (a === 1){
        $("#btnAddGrafo").removeAttr('disabled');
        $("#btnAddExemplo").removeAttr('disabled');
      }
      if(a === 0){
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


    // Add uma aresta
    self.addEdge = function () {
      _source = $("#noX").val();
      _target = $("#noY").val();
      _weight = $("#peso").val();
      cy.add([ // add aresta ao grafico, "biblioteca"
        { group: "edges", data: { id: _source + _target, label: _weight, weight: _weight, source: _source, target: _target } }
      ])
      for (var i = 0; i < self.lista.length; i++) { // Percorre a lista de adjacencia para add o no e o peso
        if (self.lista[i].no.nome === _source) {
          self.lista[i].no.adj.push({ data: { no: _target, peso: _weight } });
        }
      }

    }

    // Remover aresta
    self.deleteEdge = function () {
      _source = $("#noX").val();
      _target = $("#noY").val();
      _weight = $("#peso").val();
      for (var i = 0; i < self.lista.length; i++) { // Faz um for por todo o grafo, removendo os nós
        if (self.lista[i].no.nome === _source) {
          for (var j = 0; j < self.lista[i].no.adj.length; j++) {
            if (self.lista[i].no.adj[j].data.no === _target) {
              cy.remove("#" + _source + _target); // remove do grafico "Biblioteca"
              _remove = self.lista[i].no.adj.indexOf(
                {data: { no: _target, peso: _weight}}
                );
              self.lista[i].no.adj.splice(_remove, 1); // remove no da lista
            }
          }
        }
      }
    }

    self.addExemplo = function () {
      for (var i = 0; i < 5; i ++){
        name = String.fromCharCode(alfa);
        alfa++;
        self.lista.push({no:{ nome: name, pesoTo: null, ant: null, adj: [] } });
         cy.add([
          { group: "nodes", data: { id: name } }
        ])
      }
      cy.add([ // add aresta ao grafico, "biblioteca"
        { group: "edges", data: { id: "AB", label: 1, weight: 1, source: "A", target: "B" } },
        { group: "edges", data: { id: "AE", label: 10, weight: 10, source: "A", target: "E" } },
        { group: "edges", data: { id: "AD", label: 3, weight: 3, source: "A", target: "D" } },
        { group: "edges", data: { id: "BC", label: 5, weight: 5, source: "B", target: "C" } },
        { group: "edges", data: { id: "CE", label: 1, weight: 1, source: "C", target: "E" } },
        { group: "edges", data: { id: "DC", label: 2, weight: 2, source: "D", target: "C" } },
        { group: "edges", data: { id: "DE", label: 6, weight: 6, source: "D", target: "E" } }
      ])
      for(var j = 0; j < self.lista.length; j++){
        if(self.lista[j].no.nome === "A"){
          self.lista[j].no.adj.push({ data: { no: "B", peso:1 } });
          self.lista[j].no.adj.push({ data: { no: "E", peso:10 } });
          self.lista[j].no.adj.push({ data: { no: "D", peso:3 } });
        }
        if(self.lista[j].no.nome === "B") {
          self.lista[j].no.adj.push({ data: { no: "C" , peso: 5 } });
        }
        if(self.lista[j].no.nome === "C") {
          self.lista[j].no.adj.push({ data: { no: "E", peso: 1} });
        }
        if(self.lista[j].no.nome === "D"){
          self.lista[j].no.adj.push({ data: { no: "C", peso: 2} });
          self.lista[j].no.adj.push({ data: { no: "E", peso: 6} });
        }
      }
    }

    self.reset = function () {
      cy.edges().addClass("way");
    }

    function initialize(_init) {
      for (var i = 0; i < self.lista.length; i++) {
        self.lista[i].no.pesoTo = Number.POSITIVE_INFINITY;
        self.lista[i].no.ant = null;

        if (self.lista[i].no.nome === _init) {
          self.lista[i].no.pesoTo = 0;
          self.lista[i].no.ant = null;
        }
      }

      self.priorityList = self.lista.slice(); // Copia os elementos de lista para priorityList

    }

    function drawWay(i, j, k) {
      var timer = setTimeout(function () {
        cy.$("#" + i + j).addClass('way');
        self.iteracao.push({n: i, m: j});
      }, k);
    }

    function drawSearch(i, j, k) {
      var timer = setTimeout(function () {
        cy.$("#" + i + j).addClass('highlighted');
        self.iteracao.push({n: i, m: j});
        $scope.$apply();
      }, k);
    }

    self.search = function () {
      _de = $("#de").val();
      _para = $("#para").val();
      aux = _para;
      i = 0;
      c = 0;
      while (true) {
        for(var i = 0; i<self.pares.length; i++){
          //console.log(_de, _para);
          if(self.pares[i].par.a === _de && self.pares[i].par.p === _para) {
            //console.log(_de, _para);
            //console.log(self.pares[i]);
            break;
          }
          if(self.pares[i].par.p === _para){
            _para = self.pares[i].par.a;
          }
          
        }
        if (c > Math.pow(self.pares.length, 2)) {
          break;
        }
        c++;
      }

    }

    function relax(atual, adja, peso, count) {
      //console.log(atual, adja, peso);
      for (var i = 0; i < self.lista.length; i++) {
        if (self.lista[i].no.nome == adja.no) {
          id = i;
        }
      }

      pesoAdja = self.lista[id].no.pesoTo;
      x = parseInt(atual.pesoTo);
      y = parseInt(peso);

      if (pesoAdja > x + y) {
        self.lista[id].no.pesoTo = x + y;
        self.lista[id].no.ant = atual.nome;
        //drawSearch(atual.nome, adja.no, count);
      }

    }

    function walk() {
      count = 1000;
      for (var i = 0; i < self.lista.length; i++){
        self.pares.push({par:{p:self.lista[i].no.nome,a:self.lista[i].no.ant}});
      }
      for (var j = 0; j < self.pares.length; j++){
        drawSearch(self.pares[j].par.a,self.pares[j].par.p, count);
        count+=1000;
      }
    }
    self.dijkstra = function () {
      _init = $("#noInicial").val();
      initialize(_init);
      count = 2000; //  Contador para timer
      i = 0;
      while (self.priorityList.length != 0) {
        minIndex = min(self.priorityList);
        //self.iteracao.push(self.priorityList[minIndex].no.nome);
        for (var i = 0; i < self.priorityList[minIndex].no.adj.length; i++) {
          _adja = self.priorityList[minIndex].no.adj[i].data;
          _peso = self.priorityList[minIndex].no.adj[i].data.peso;
          _atual = self.priorityList[minIndex].no;
          //drawWay(_atual.nome, _adja.no, count);
          relax(_atual, _adja, _peso, count)
          count += 2000;
        }
        self.priorityList.splice(minIndex, 1);
      }
      walk();
    }

  })
