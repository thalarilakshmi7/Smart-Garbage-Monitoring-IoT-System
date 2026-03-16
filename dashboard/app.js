function loadGoogleMaps() {

const script = document.createElement("script");

script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&callback=initMap`;

script.async = true;

document.head.appendChild(script);

}
let map;
let markers=[];
let routeLine;

/* Dummy bin data */

const bins=[

{binId:"BIN1",level:90,status:"FULL",lat:12.9716,lng:77.5946},
{binId:"BIN2",level:60,status:"HALF",lat:12.9725,lng:77.5952},
{binId:"BIN3",level:20,status:"EMPTY",lat:12.9735,lng:77.5962},
{binId:"BIN4",level:85,status:"FULL",lat:12.9740,lng:77.5970},
{binId:"BIN5",level:40,status:"HALF",lat:12.9750,lng:77.5980},
{binId:"BIN6",level:95,status:"FULL",lat:12.9760,lng:77.5990},
{binId:"BIN7",level:10,status:"EMPTY",lat:12.9770,lng:77.6000},
{binId:"BIN8",level:75,status:"HALF",lat:12.9780,lng:77.6010},
{binId:"BIN9",level:88,status:"FULL",lat:12.9790,lng:77.6020},
{binId:"BIN10",level:30,status:"EMPTY",lat:12.9800,lng:77.6030}

];

let complaints=[];

/* initialize map */

function initMap(){

map=new google.maps.Map(document.getElementById("map"),{

zoom:13,
center:{lat:12.9716,lng:77.5946}

});

/* garbage depot marker */

new google.maps.Marker({

position:{lat:12.9716,lng:77.5946},
map:map,
title:"Garbage Truck Depot"

});

}

window.onload = loadGoogleMaps;

/* clear markers */

function clearMarkers(){

markers.forEach(m=>m.setMap(null));
markers=[];

}


/* load bins */

function loadBins(){

clearMarkers();

const filter=document.getElementById("filter").value;

const container=document.getElementById("bins");
container.innerHTML="";

bins.forEach(bin=>{

if(filter!=="ALL" && bin.status!==filter) return;

const card=document.createElement("div");

card.className="card "+bin.status.toLowerCase();

card.innerHTML=`
<b>${bin.binId}</b><br>
Status: ${bin.status}<br>
Level: ${bin.level}%
`;

card.onclick=()=>showDetails(bin);

container.appendChild(card);

const marker=new google.maps.Marker({

position:{lat:bin.lat,lng:bin.lng},
map:map

});

markers.push(marker);

});

}


/* full bin alerts */

function loadAlerts(){

const container=document.getElementById("alerts");
container.innerHTML="";

bins.filter(b=>b.status==="FULL").forEach(bin=>{

const card=document.createElement("div");

card.className="card full";

card.innerHTML=`⚠ ${bin.binId} FULL`;

card.onclick=()=>showDetails(bin);

container.appendChild(card);

});

}


/* route optimization */

function loadRoute(){

const fullBins=bins.filter(b=>b.status==="FULL");

let start={lat:12.9716,lng:77.5946};

let remaining=[...fullBins];

let route=[];

let current=start;

while(remaining.length){

remaining.sort((a,b)=>distance(current,a)-distance(current,b));

let next=remaining.shift();

route.push(next);

current=next;

}

const container=document.getElementById("route");
container.innerHTML="";

let path=[start];

route.forEach((bin,i)=>{

const card=document.createElement("div");

card.className="card full";

card.innerHTML=`
Stop ${i+1}: ${bin.binId}
`;

card.onclick=()=>showDetails(bin);

container.appendChild(card);

path.push({lat:bin.lat,lng:bin.lng});

});

if(routeLine) routeLine.setMap(null);

routeLine=new google.maps.Polyline({

path:path,
strokeColor:"#00ffff",
strokeWeight:4

});

routeLine.setMap(map);

}


/* distance function */

function distance(a,b){

return Math.sqrt(

Math.pow(a.lat-b.lat,2)+
Math.pow(a.lng-b.lng,2)

);

}


/* complaints */

function loadComplaints(){

const container=document.getElementById("complaints");
container.innerHTML="";

complaints.forEach(c=>{

const card=document.createElement("div");

card.className="card empty";

card.innerHTML=`${c.name} - ${c.location}`;

card.onclick=()=>showComplaint(c);

container.appendChild(card);

});

}


/* complaint form */

document.getElementById("complaintForm").addEventListener("submit",function(e){

e.preventDefault();

const name=document.getElementById("name").value;
const location=document.getElementById("location").value;
const message=document.getElementById("message").value;

const newComplaint={name,location,message};

complaints.push(newComplaint);

alert("Complaint submitted");

loadComplaints();

});


/* popup */

function showDetails(bin){

document.getElementById("popup").style.display="block";

document.getElementById("popupData").innerHTML=`

<h3>${bin.binId}</h3>

Status: ${bin.status}<br>
Level: ${bin.level}%<br>
Latitude: ${bin.lat}<br>
Longitude: ${bin.lng}

`;

}

function showComplaint(c){

document.getElementById("popup").style.display="block";

document.getElementById("popupData").innerHTML=`

<h3>${c.name}</h3>

Location: ${c.location}<br>
Complaint: ${c.message}

`;

}

function closePopup(){

document.getElementById("popup").style.display="none";

}