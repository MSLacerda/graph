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

    var self = this; // AngularJS...

    self.lista = []; //Array para armazenar nós.
    alfa = 65;

    //Cria o grafo  
    self.addGrafo = function () {
      console.log(self);
      var j = $("#qtdNo").val();
      console.log(j);
      for (var i = 0; i < j; i++) {
        name = String.fromCharCode(alfa); // Transforma o código ascii em letras 
        alfa++; //Acrescenta +1 no código ascii para prox letra
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
      cy.add([ // add aresta ao grafico, "biblioteca"
        { group: "edges", data: { id: _source+_target, label: _weight, weight: _weight, source: _source, target: _target } }
      ])

      for (var i = 0; i < self.lista.length; i++) { // Percorre a lista de adjacencia para add o no e o peso
        if (self.lista[i].no.nome === _source) {
          self.lista[i].no.adj.push({data:{no:_target, peso:_weight}});
          console.log(self.lista[i]);
        }
      }

    }

    // Remover aresta
    self.deleteEdge = function() {
      _source = $("#noX").val();
      _target = $("#noY").val();
      _weight = $("#peso").val();
      for (var i = 0; i < self.lista.length; i++) { // Faz um for por todo o grafo, removendo os nós
        if (self.lista[i].no.nome === _source) {
          for (var j = 0; j < self.lista[i].no.adj.length; j++){
            if (self.lista[i].no.adj[j].data.no === _target) {
              console.log(self.lista[i].no.adj[j].data.no);
              cy.remove("#" + _source+_target); // remove no do grafico "Biblioteca"
              _remove = self.lista[i].no.adj.indexOf({data: {no:_target, peso: _weight}}); 
              self.lista[i].no.adj.splice(_remove, 1); // remove no da lista
            }
          }
        }
      }

    }

  })
