async function loadLogs(){

const res = await fetch("/logs");
const logs = await res.json();

const table = document.getElementById("logTable");

logs.forEach(log=>{

table.innerHTML += `
<tr>
<td>${log.ip}</td>
<td>${log.username}</td>
<td>${log.status}</td>
<td>${log.attempts}</td>
<td>${new Date(log.time).toLocaleString()}</td>
</tr>
`;

});

}

loadLogs();