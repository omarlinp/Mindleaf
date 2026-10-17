const $=id=>document.getElementById(id);
const PLANS={Starter:19,Professional:39,Clinic:89};
const Auth={
  users(){try{return JSON.parse(localStorage.getItem('pms_users'))||[]}catch(e){return[]}},
  save(u){try{localStorage.setItem('pms_users',JSON.stringify(u))}catch(e){throw new Error('Could not save: browser storage is unavailable.')}},
  uid(){return localStorage.getItem('pms_session')},
  current(){return this.users().find(u=>u.id===this.uid())||null},
  async hash(pw,salt){
    if(!(window.crypto&&crypto.subtle))throw new Error('This browser cannot protect passwords here. Open the app from localhost or https.');
    const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+':'+pw));
    return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
  },
  async signup({name,email,password,plan}){
    email=email.trim().toLowerCase();const users=this.users();
    if(users.some(u=>u.email===email))throw new Error('An account with this email already exists. Try logging in.');
    if(password.length<8)throw new Error('Password must be at least 8 characters.');
    const id='u'+Date.now().toString(36),salt=Math.random().toString(36).slice(2)+Date.now();
    const u={id,name:name.trim(),email,salt,hash:await this.hash(password,salt),plan:PLANS[plan]?plan:'Professional',created:Date.now()};
    // First account adopts any data saved by the single-user version
    if(!users.length)['patients','appts'].forEach(k=>{const old=localStorage.getItem('pms_'+k);if(old)localStorage.setItem(`pms_${id}_${k}`,old)});
    this.save([...users,u]);localStorage.setItem('pms_session',id);
  },
  async login(email,password){
    const u=this.users().find(x=>x.email===email.trim().toLowerCase()&&!x.demo);
    if(!u||u.hash!==await this.hash(password,u.salt))throw new Error('Incorrect email or password.');
    localStorage.setItem('pms_session',u.id);
  },
  demo(){
    const users=this.users();
    if(!users.some(u=>u.id==='demo'))this.save([...users,{id:'demo',demo:true,name:'Demo Psychologist',email:'demo@mindleaf.local',plan:'Professional',created:Date.now()}]);
    localStorage.setItem('pms_session','demo');
  },
  logout(){localStorage.removeItem('pms_session');location.href='login.html'}
};
