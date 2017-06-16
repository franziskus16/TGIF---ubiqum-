$(function () {
    
       var data = null;

    switch(window.location.pathname){

        case "/congress-party-loyalty.html":

            $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/house", function(json){

                data = json;

                tableGlance2();
                loyaltyfill();
                loyaltyfill2();

            });
            break;
            
        case "/senate%20-%20party-loyalty.html":
            
        $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/senate", function(json){
            
            data = json;

               tableGlance2();
            loyaltyfill();
            loyaltyfill2();

            });
    };


//TAULA SENATE GLANCE//

function tableGlance() {
    var numberRep = [];
    var numberInd = [];
    var numberDem = []; 
    var numbertotal = [];    
    var votesRep = 0;
    var votesInd = 0; 
    var votesDem = 0;
    var totalvotes = 0;  
    var sumaDem = 0;
    var sumaInd = 0;
    var sumaRep = 0;


    var currentMembers = data.results[0].members;//agafa el data de la json.

    for (var i=0; i< currentMembers.length; i++){

        if (currentMembers[i].party == "R"){
            numberRep.push(currentMembers[i])
            votesRep += parseFloat(currentMembers[i].votes_with_party_pct);
        }

        if (currentMembers[i].party == "D"){
            numberDem.push(currentMembers[i])
            votesDem += parseFloat(currentMembers[i].votes_with_party_pct);
        }
        if (currentMembers[i].party == "I"){
            numberInd.push(currentMembers[i])
            votesInd += parseFloat(currentMembers[i].votes_with_party_pct);
        }

    }
    statistics.stats[0].noOfRep = numberRep.length;
    statistics.stats[1].noOfRep = numberDem.length;
    statistics.stats[2].noOfRep = numberInd.length;
    statistics.stats[0].porcent = (votesRep/numberRep.length).toFixed(2);
    statistics.stats[1].porcent = (votesDem/numberDem.length).toFixed(2);
    statistics.stats[2].porcent = (votesInd/numberInd.length).toFixed(2);
    statistics.stats[3].reps = (numberDem.length + numberRep.length + numberInd.length);
    statistics.stats[3].votes = ((votesRep/numberRep.length) + (votesDem/numberDem.length) + (votesInd/numberInd.length));
    //console.log((votesDem/numberDem.length).toFixed(2))

};
function tableGlance2(){

    var members = tableGlance();

    var cellRep = document.getElementById("primero");
    var cellDem = document.getElementById("segundo");    
    var cellInd = document.getElementById("tercero");
    var cellporcen1 = document.getElementById("porce1");    
    var cellporcen2 = document.getElementById("porce2");
    var cellporcen3 = document.getElementById("porce3");
    var celltotal = document.getElementById("totalmejor")
    var celltotalporcent = document.getElementById("totalporce")

    var repu = statistics.stats[0].noOfRep;
    var dem = statistics.stats[1].noOfRep;
    var indep = statistics.stats[2].noOfRep; 
    var porcenrepu = statistics.stats [0].porcent + "%";
    var porcendem = statistics.stats [1].porcent + "%";
    var porcenindep = statistics.stats [2].porcent + "%";
    var total = statistics.stats[3].reps;
    var totalporcent = statistics.stats[3].votes /3;    


    cellRep.innerHTML = repu;
    cellDem.innerHTML = dem;
    cellInd.innerHTML = indep; 
    cellporcen1.innerHTML = porcenrepu;
    cellporcen2.innerHTML = porcendem;
    cellporcen3.innerHTML = porcenindep;    
    celltotal.innerHTML = total;
    celltotalporcent.innerHTML = totalporcent.toFixed(2);    
};

//TAULA SENATE LOYALTY LEAST//

function tableloyalty(){

    var members = data.results[0].members;

    for (var i= 100; i <= members.length; i = i - 0.01){

        var filteredArray = members.filter(function(x){

            return x.votes_with_party_pct >= i;
        });

        if (filteredArray.length >= members.length*0.1){
            //console.log(filteredArray.length);
            return filteredArray;
            break;
        }

    }

}
function loyaltyfill(){
    var members = tableloyalty();
    members.sort(function(a,b){return b.votes_with_party_pct - a.votes_with_party_pct});
    for (var i = 0; i < members.length; i++){

        var tbl = document.getElementById("loyaltyleast");
        var row = document.createElement("tr"); //crea una tr sin marcarlos en el html
        if (members[i]["middle_name"] == null || members[i]["middle.name"] == ""){
            var fullName = members[i]["first_name"] + " " + members[i]["last_name"];  
        }
        else{
            var fullName = members[i]["first_name"] + " " + members[i]["middle_name"] + " " + members[i]["last_name"];   
        }
        var votePartyper = members[i]["votes_with_party_pct"] + "%";
        var totalvotes = members[i]["total_votes"];
        var a = document.createElement("a");
        a.href=members[i].url;
        a.innerHTML=fullName;
        tbl.appendChild(row); //afegeix files a la taula//
        row.insertCell().appendChild(a); //añade el contenido a la celda/
        row.insertCell().innerHTML = totalvotes;
        row.insertCell().innerHTML = votePartyper;                            
    }
}


//TAULA SENATE LOYALTY MOST//

function tableloyaltymost(){

    var members = data.results[0].members;

    for (var i= 0; i <= members.length; i = i + 0.01){

        var filteredArray = members.filter(function(x){

            return x.votes_with_party_pct <= i;
        });

        if (filteredArray.length >= members.length*0.1){
            //console.log(filteredArray.length);
            return filteredArray;
            break;
        }

    }

}
function loyaltyfill2(){
    var members = tableloyaltymost();
    members.sort(function(a,b){return a.votes_with_party_pct - b.votes_with_party_pct});
    for (var i = 0; i < members.length; i++){

        var tbl = document.getElementById("loyaltymost");
        var row = document.createElement("tr"); //crea una tr sin marcarlos en el html
        if (members[i]["middle_name"] == null || members[i]["middle.name"] == ""){
            var fullName = members[i]["first_name"] + " " + members[i]["last_name"];  
        }
        else{
            var fullName = members[i]["first_name"] + " " + members[i]["middle_name"] + " " + members[i]["last_name"];   
        }
        var votePartyper = members[i]["votes_with_party_pct"] + "%";
        var totalvotes = members[i]["total_votes"];
        var a = document.createElement("a");
        a.href=members[i].url;
        a.innerHTML=fullName;
        tbl.appendChild(row); //afegeix files a la taula//
        row.insertCell().appendChild(a); //añade el contenido a la celda/
        row.insertCell().innerHTML = totalvotes;
        row.insertCell().innerHTML = votePartyper;                            
    }
}

});


