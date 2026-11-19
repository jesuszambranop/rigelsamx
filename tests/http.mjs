// Prueba real HTTP -> PHP -> SMTP local. No conecta a un servidor de correo externo.
import net from 'node:net';
import {spawn} from 'node:child_process';
import {cp,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const work=resolve(root,'work'); await mkdir(work,{recursive:true});
const temp=await mkdtemp(resolve(work,'http-test-'));
const inbox=[];let server;let php;
try {
  await cp(resolve(root,'public/api'),resolve(temp,'api'),{recursive:true,filter:p=>!p.endsWith('config.local.php')});
  server=net.createServer(socket=>{
    socket.setEncoding('utf8');socket.write('220 localhost SMTP test\r\n');
    let buffer='',data=false,message=[];
    socket.on('data',chunk=>{
      buffer+=chunk;
      while(buffer.includes('\n')) {
        const i=buffer.indexOf('\n');const line=buffer.slice(0,i).replace(/\r$/,'');buffer=buffer.slice(i+1);
        if(data) {if(line==='.') {inbox.push(message.join('\r\n'));message=[];data=false;socket.write('250 Accepted locally\r\n');}else message.push(line);continue;}
        if(/^EHLO|^HELO/.test(line))socket.write('250-localhost\r\n250 SIZE 10000000\r\n');
        else if(/^MAIL FROM:|^RCPT TO:|^RSET/.test(line))socket.write('250 OK\r\n');
        else if(line==='DATA'){data=true;socket.write('354 End with dot\r\n');}
        else if(line==='QUIT'){socket.end('221 Bye\r\n');}
        else socket.write('250 OK\r\n');
      }
    });
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const smtpPort=server.address().port;
  const reserve=net.createServer();await new Promise(r=>reserve.listen(0,'127.0.0.1',r));const port=reserve.address().port;await new Promise(r=>reserve.close(r));
  php=spawn(process.env.PHP_EXECUTABLE || 'php',['-d','upload_max_filesize=5M','-d','post_max_size=7M','-S',`127.0.0.1:${port}`,'-t',temp],{cwd:root,windowsHide:true,stdio:'ignore',env:{...process.env,RIGEL_MAIL_TRANSPORT:'smtp',RIGEL_SMTP_HOST:'127.0.0.1',RIGEL_SMTP_PORT:String(smtpPort),RIGEL_SMTP_SECURE:'none',RIGEL_SMTP_USER:'',RIGEL_SMTP_PASSWORD:''}});
  let spawnError;php.on('error',e=>spawnError=e);
  const base=`http://127.0.0.1:${port}`;
  let response;
  for(let attempt=0;attempt<40;attempt++) {if(spawnError)throw spawnError;try {response=await fetch(base+'/api/forms.php?action=token');break;}catch{await new Promise(r=>setTimeout(r,100));}}
  assert.ok(response,'PHP no inició');
  const cookie=response.headers.get('set-cookie').split(';')[0];
  let csrf=(await response.json()).token;assert.equal(csrf.length,64);
  const contact={kind:'contact',lang:'es',csrf,consent:'1',name:'Prueba local',email:'prueba@example.invalid',city:'Mérida',company:'Prueba local',product:'m1',material:'Cartón',message:'Consulta sintética de prueba.'};
  async function send(fields,file,origin=base) {
    const data=new FormData();for(const [k,v] of Object.entries(fields))data.set(k,v);
    if(file)data.set('resume',new Blob([file.body],{type:file.type}),file.name);
    return fetch(base+'/api/forms.php',{method:'POST',headers:{Accept:'application/json',Cookie:cookie,Origin:origin},body:data});
  }
  response=await send({...contact,csrf:'incorrecto'});assert.equal(response.status,403);
  response=await send(contact,undefined,'https://otro.example');assert.equal(response.status,403);
  response=await send(contact);assert.equal(response.status,200);assert.equal((await response.json()).ok,true);
  assert.equal(inbox.length,1);assert.match(inbox[0],/To: ventasmexico@rigelsa.com/);assert.match(inbox[0],/Reply-To: Prueba local <prueba@example.invalid>/);assert.match(inbox[0],/From: .*ventasmexico@rigelsa.com/);
  async function refresh(){const r=await fetch(base+'/api/forms.php?action=token',{headers:{Cookie:cookie}});csrf=(await r.json()).token;}
  await refresh();
  const career={kind:'careers',lang:'en',csrf,consent:'1',name:'Prueba candidato',email:'candidato@example.invalid',city:'Mérida',phone:'+52 999 000 0000',area:'service',message:'Synthetic local application test.'};
  response=await send(career,{body:'%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF\n',type:'application/pdf',name:'cv.pdf'});
  assert.equal(response.status,200);assert.equal((await response.json()).ok,true);assert.equal(inbox.length,2);assert.match(inbox[1],/To: rrhh@rigelsa.com/);assert.match(inbox[1],/CV-Rigel-Mexico.pdf/);
  await refresh();
  response=await send({...career,csrf},{body:'no es un PDF',type:'application/pdf',name:'cv.pdf'});assert.equal(response.status,422);
  response=await send({...contact,csrf,product:'otro'});assert.equal(response.status,422);
  response=await send({...contact,csrf,website:'spam'});assert.equal(response.status,400);
  response=await send({...contact,csrf});assert.equal(response.status,429);assert.equal(inbox.length,2);
  console.log('OK: HTTP, sesión/CSRF, origen, contacto, empleo con PDF, destinatarios, rechazo de archivos y límite de intentos. 2 mensajes capturados únicamente en SMTP local.');
} finally {
  if(php && !php.killed){php.kill();await new Promise(r=>php.once('exit',r));}
  if(server)await new Promise(r=>server.close(r));
  const checked=resolve(temp);
  if(!checked.startsWith(work+sep))throw new Error('Ruta de limpieza fuera de work');
  await rm(checked,{recursive:true,force:true});
}
