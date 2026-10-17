$('yr').textContent=new Date().getFullYear();
if(Auth.current())$('authLinks').innerHTML='<a class="btn btn-sm btn-light ms-md-2" href="dashboard.html">Go to dashboard</a>';
