const p=DB.get('patients').find(x=>x.id===qs.get('id'));
if(!p){$('missing').classList.remove('d-none');$('content').classList.add('d-none')}
else{
  $('pname').textContent=p.name;$('psub').textContent=[age(p.dob)+' years',p.gender].filter(Boolean).join(' · ');
  $('editBtn').href='patients.html?edit='+p.id;$('bookBtn').href='appointments.html?new='+p.id;
  const rows=[['Date of birth',fmtDate(p.dob)],['Phone',p.phone],['Email',p.email],['Address',p.address],['Emergency contact',p.emergency],['Referred by',p.referral],['Presenting concern',p.concern],['General notes',p.notes]];
  $('info').innerHTML=rows.map(r=>`<dt class="small text-muted fw-normal">${r[0]}</dt><dd class="mb-3">${esc(r[1])||'<span class="text-muted">Not provided</span>'}</dd>`).join('');
  const as=DB.get('appts').filter(a=>a.pid===p.id).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
  $('rows').innerHTML=as.map(a=>`<tr><td>${fmtDate(a.date)}<div class="small text-muted">${esc(a.time)} · ${esc(a.duration)} min</div></td><td>${esc(a.type)}<div class="small text-muted">${esc(a.mode)}</div></td>
   <td><span class="badge text-bg-${badge[a.status]}">${esc(a.status)}</span></td>
   <td>${a.status==='Cancelled'?'<span class="text-muted small">n/a</span>':`<span class="badge text-bg-${a.payment==='Paid'?'success':'warning'}">${a.payment==='Paid'?'Paid':'Unpaid'}</span> <span class="small text-muted">${money(a.fee)}</span>`}</td>
   <td>${a.notes?'<span class="text-success small"><i class="bi bi-journal-check"></i> Written</span>':'<span class="text-muted small">None yet</span>'}</td>
   <td class="text-end"><a class="btn btn-sm btn-primary" href="appointment.html?id=${a.id}">Open notes</a></td></tr>`).join('')
   ||'<tr><td colspan="6" class="text-center text-muted py-4">No appointments yet. Book the first one.</td></tr>';
}
