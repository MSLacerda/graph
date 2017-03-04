angular.module('GrafoApp', []);

angular.module('GrafoApp')
  .controller('MainCtrl', function () {
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
        }),
      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: '#a',
        padding: 10
      }
    });

    var bfs = cy.elements().bfs('#a', function () { }, true);
    var i = 0;
    var highlightNextEle = function () {
      if (i < bfs.path.length) {
        bfs.path[i].addClass('highlighted');

        i++;
        setTimeout(highlightNextEle, 1000);
      }
    };

    // kick off first highlight
    highlightNextEle();

    // ---- TRABALHO COMEÇA AQUI ------

    // Código para explicar.

    var self = this;

    self.lista = []; //Array para armazenar nós.
    alfa = 65;

    //Cria o grafo  
    self.addGrafo = function () {
      console.log(self);
      var j = $("#qtdNo").val();
      console.log(j);
      for (var i = 0; i < j; i++) {
        name = String.fromCharCode(alfa); // Transforma o código ascii em letras 
        alfa++;
        cy.add([
          { group: "nodes", data: { id: name } }
        ])
        self.lista.push({ no: { nome: name, adj: [] } });
      }
    }


    //Remove o grafo
    self.deleteGrafo = function () {
      console.log(self.lista);

      for (var i = 0; i < self.lista.length; i++) { // Faz um for por todo o grafo, removendo os nós
        cy.remove("#" + self.lista[i].no.nome);
      }
      alfa = 65;  // Reseta o codigo ASCI para A novamente
      self.lista = []; // Limpa a lista
    }


    // Add um nó
    self.addNo = function () {
      name = String.fromCharCode(alfa);
      alfa++;
      cy.add([
        { group: "nodes", data: { id: name } }
      ])

      self.lista.push({ no: { nome: name, adj: [] } });
    }


    // Add uma aresta
    self.addEdge = function() {
      _source = $("#noX").val();
      _target = $("#noY").val();
      _weight = $("#peso").val();
      cy.add([
        { group: "edges", data: { id: _source + _target, label: _weight, weight: _weight, source: _source, target: _target } }
      ])

      for (var i = 0; i < self.lista.length; i++) {
        if (self.lista[i].no.nome === _source) {
          self.lista[i].no.adj.push(_target);
          console.log(self.lista[i]);
        }
      }

    }

  })
