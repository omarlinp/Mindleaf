const list=DB.get('appts'),a=list.find(x=>x.id===qs.get('id')),N=['mood','risk','summary','interventions','progress','plan'];
if(!a){$('missing').classList.remove('d-none');$('content').classList.add('d-none')}
else{
  $('back').href='patient.html?id='+a.pid;
  $('who').textContent=pname(a.pid);
  $('meta').textContent=`${fmtDate(a.date)}, ${a.time} · ${a.duration} min · ${a.type} · ${a.mode}`;
  const paint=()=>{$('stat').className='badge fs-6 text-bg-'+badge[a.status];$('stat').textContent=a.status;
    $('saved').textContent=a.notes&&a.notes.savedAt?'Last saved '+new Date(a.notes.savedAt).toLocaleString():'Not saved yet'};
  N.forEach(k=>{if(a.notes&&a.notes[k])$(k).value=a.notes[k]});paint();
  const save=done=>{
    a.notes={savedAt:Date.now()};N.forEach(k=>a.notes[k]=$(k).value.trim());
    if(done)a.status='Completed';
    DB.set('appts',list.map(x=>x.id===a.id?a:x));paint();
  };
  $('form').addEventListener('submit',e=>{e.preventDefault();save(false)});
  $('done').addEventListener('click',()=>save(true));
}
