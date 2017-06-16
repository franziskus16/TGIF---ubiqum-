
$(function () {

    var data = null;
    var data2 = null;

    addListeners();// LLAMADA A LOS LISTENERS//


    switch(window.location.pathname){//EXECUTA DIVERSOS BLOCS AL MOMENT//

        case "/congress%20113.html":

            $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/house", function(dataNYT){
                console.log("primerJSON");
                data = dataNYT.results[0].members;

                $.getJSON("js/congressSunlight.json", function (dataSUN){
                    data2 = dataSUN.results;
                    createTable();
                    console.log("hola");

                });

            });
            break;
        case "/senate.html":

            $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/senate", function(dataNYT){
                data = dataNYT.results[0].members;

                $.getJSON("js/sunlightSenate.json", function (dataSUN){
                    data2 = dataSUN.results;
                    createTable(fillObject());

                });

            });
            break;
            
  }
    //FUNCION PARA RELLENAR CADA ROW//
    function fillObject(){

        var allDataArray3 = [];

        var data3 = data.concat(data2);//junta las dos datas en data3 para que recorra las dos.//

        for (var i=0 ;  i< data3.length ; i++){

            var objApi = {};
            //RECORRE ESTOS 3 VALORES QUE SON COMUNES EN LAS DOS ARRAYS.//
            objApi.fullName = data3[i].first_name + " " + data3[i].last_name;
            objApi.partyAll = data3[i].party;
            objApi.stateAll = data3[i].state;
            
                //RECORRE ESTAS VARIABLES PARA LA API DE NYT//
            if (data3[i].birthday == undefined){//en la api de NYT no hay BIRTHDAY//
                objApi.officeYear = data3[i].seniority;//recorre seniority//
                objApi.votePercenP = data3[i].votes_with_party_pct;//que recorra votes with party//
                objApi.birthD = "--";// que saque los dos guiones en este valor ya que no existe.//
                objApi.api = "nyt"; //que te saque la API//
            }
            else{//RECORRE LAS VARIABLES PARA LA API DE SUN//
                objApi.seniority = "--";//te lo deje con los dos guiones
                objApi.votePercenP = "--";
                objApi.birthD = data3[i].birthday;
                objApi.api = "sun";

            }
            allDataArray3.push(objApi);//añade cada valor a la array//
        }

        return allDataArray3;// RETORNA cada punto del fillobject recorrido en la array.
    }
    //CREAR TABLA//
    function createTable(){

        var allDataArray3 = fillObject();//

        $('#infoTable').empty();//VACIA LA TABLA//

        $.each(allDataArray3, function (key,value){//TE VA SACANDO CADA VALOR DE LA TABLA//

            if (filter(value)){

                var row = document.createElement("tr");//TE CREA UNA LINEA POR CADA VALOR EN EL TR.//

                for (key in value){
                    row.insertCell().innerHTML = value[key];// TE las mete en el HTML//
                }
                //console.log("hola")
                $("#infoTable").append(row); //añade cada row a la id de la tabla del hmtl.
            }
        });

       $('td:nth-child(7)').hide();//esconde toda la columa (7) - en este caso de las apis.
    }

    //HACE LOS FILTROS POR CADA PARTE//
    function filter(value){
                //filtro 1 - el filtro de los checkedboxes//
        var filter1 = checkedBoxes().indexOf(value.partyAll) != -1; //si esta en el array//
            //filtro 3 - el filtro de los checkboxes de cada API//
        var filter3 = checkApis().indexOf(value.api) != -1;
           //CREACION del filtro 2 - crea un boolean para sacar uno cada vez que se clicka//
        var drop = document.getElementById("dropstate");
        
        if (drop.value == value.stateAll || drop.value == "all"){
            var filter2 = true;
        } 
        else{
            var filter2 = false;
        } 
        return filter1 && filter2 && filter3;//Que retorni els tres filtres a l'hora.//
    }

    function inserdata(){

        var tbl = document.getElementById("infoTable");
        var senateResults = data.results;
        var listaSenate = senateResults[0].members;
        var listaParty = checkedBoxes();

        while(tbl.rows.length > 0) {
            tbl.deleteRow(0);
        }

        for (var i = 0; i < listaSenate.length; i++) {
            var row = document.createElement("tr"); //crea una tr sin marcarlos en el html
            if (listaSenate[i]["middle_name"] == null || listaSenate[i]["middle.name"] == ""){
                var fullName = listaSenate[i]["first_name"] + " " + listaSenate[i]["last_name"];  
            }
            else{
                var fullName = listaSenate[i]["first_name"] + " " + listaSenate[i]["middle_name"] + " " + listaSenate[i]["last_name"];   
            }
            var party = listaSenate[i]["party"];
            var state = listaSenate[i].state;
            var drop = document.getElementById("dropstate");
            if ( (listaParty.indexOf(party) != -1) && (state == drop.value || drop.value == "all")){

                var seniority = listaSenate[i].seniority;
                var votePercentage = listaSenate[i].votes_with_party_pct;
                var a = document.createElement("a");

                a.href=listaSenate[i].url;
                a.innerHTML=fullName;
                tbl.appendChild(row); //afegeix files a la taula//
                row.insertCell().appendChild(a); //añade el contenido a la celda/
                row.insertCell().innerHTML = party;
                row.insertCell().innerHTML = state;
                row.insertCell().innerHTML = seniority;
                row.insertCell().innerHTML = votePercentage;

            }
        }
    }

    //opcions que estan marcades! para cada checkbox de partidos.
    function checkedBoxes(){


        var checkboxD = document.getElementById("dem");//VARIABLE ASIGNADA A DEMOCRATAS
        var checkboxR = document.getElementById("rep");//VARIABLE ASIGNADA A REPUBLICANOS
        var checkboxI = document.getElementById("ind");//VARIABLE ASIGNADA A INDEPENDIENTES
        var arrayChecked = [];


        if(checkboxD.checked){
            arrayChecked.push("D");
        }
        if(checkboxR.checked){
            arrayChecked.push("R");
        }
        if(checkboxI.checked){
            arrayChecked.push("I");
        }
        if(checkboxD.checked == 0 && checkboxR.checked == 0 && checkboxI.checked == 0){
            arrayChecked.push("D","R","I");
        }

        return arrayChecked;
    }

    //llamada a botones de filtro por partidos.
    function addListeners() {

        var stateSelector = document.getElementById("dropstate");//selecciona l'id que vols que agafi com a selector//
        stateSelector.addEventListener ("change",function(){//et fa el selector i la relaciona amb la taula//
            createTable()
        });
        //agafa el botó D del checkbox i fas un addlistener per quan clickas sobre ell per confirmar que es aquest//
        var checkboxD = document.getElementById("dem");

        checkboxD.addEventListener("click", function(){
            createTable()   
        });

        var checkboxR = document.getElementById("rep");

        checkboxR.addEventListener("click", function(){
            createTable()
        });

        var checkboxI = document.getElementById("ind");

        checkboxI.addEventListener("click", function(){
            createTable()
        });
        //aquests dos ultims addlisteners son per les dues apis i els seus propis checkbox.//
        var checkboxNyt = document.getElementById("nyt");
         
         checkboxNyt.addEventListener("click", function(){
            createTable()
         });
        var checkboxSl = document.getElementById("sl");
        checkboxSl.addEventListener("click", function (){
            createTable()
        });
        

    };

    //opcions que estan marcades! para cada checkbox de APIS.
    function checkApis(){


        var checkboxNyt = document.getElementById("nyt");//agafa cada checkbox amb l'id que vols que seleccioni.//
        var checkboxSl = document.getElementById("sl");
        var checkedArrays = [];


        if(checkboxNyt.checked){//Si esta marcat que et tregui el NYT API//
            checkedArrays.push("nyt");
        }
        if (checkboxSl.checked){//si esta marcat que et tregui el SUN API//
            checkedArrays.push("sun");
        }

        if(!checkboxNyt.checked && !checkboxSl.checked){//si no esta marcat cap dels dos que et tregui els dos.//
            checkedArrays.push("nyt");
            checkedArrays.push("sun");
        }

        return checkedArrays;
    }

    //FUNCION DE LA NAVBAR//
    $(function() {
        $(".expand").on( "click", function() {
            // $(this).next().slideToggle(200);
            $expand = $(this).find(">:first-child");

            if($expand.text() == "+") {
                $expand.text("-");
            } else {
                $expand.text("+");
            }
        });
    });


});

    //MUSTACHE//
    /*$(function(){

   $.getJSON('congress.js', function(data){

       var template = $('datatptl').html();
       var html = Mustache.to_html(template, data);

   }); 

});*/