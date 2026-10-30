const http = require('http');
const WebSocket = require('ws');

const SITE_KEY = '6LdLvswtAAAAAPscdvooAkP_xxfRN6rHMIT2wsdD';
const BACKEND = 'http://localhost:5000/api';

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

async function createTab(url){
  const res = await fetch('http://127.0.0.1:9222/json/new?'+encodeURIComponent(url), {method:'PUT'});
  return res.json();
}

async function closeTab(tabId){
  return new Promise((resolve)=>{
    http.get('http://127.0.0.1:9222/json/close/'+tabId,()=>resolve()).on('error',()=>resolve());
  });
}

async function runInPage(url, expression){
  const tab = await createTab(url);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
  let id=0;
  const send=(method,params={})=>new Promise((resolve,reject)=>{
    const mid=++id;
    const handler=(data)=>{
      const msg=JSON.parse(typeof data === 'string' ? data : data.toString());
      if(msg.id===mid){ws.off('message',handler); if(msg.error) reject(new Error(JSON.stringify(msg.error))); else resolve(msg.result);}
    };
    ws.on('message',handler);
    ws.send(JSON.stringify({id:mid,method,params}));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  // wait for load
  await new Promise((resolve)=>{
    const handler=(data)=>{const msg=JSON.parse(typeof data === 'string' ? data : data.toString()); if(msg.method==='Page.loadEventFired'){ws.off('message',handler);resolve();}};
    ws.on('message',handler);
    setTimeout(resolve,15000);
  });
  // poll for grecaptcha
  await send('Runtime.evaluate',{expression:`(async()=>{const deadline=Date.now()+15000;while(!(window.grecaptcha&&typeof window.grecaptcha.execute==='function')){if(Date.now()>=deadline) throw new Error('grecaptcha not ready'); await new Promise(r=>setTimeout(r,200));} return true;})()`, awaitPromise:true, returnByValue:true});
  const result = await send('Runtime.evaluate',{expression, awaitPromise:true, returnByValue:true});
  ws.close();
  await closeTab(tab.id);
  return result.result.value;
}

(async()=>{
  const contactPayload = {
    firstName:'LocalTest',
    lastName:'Hero',
    email:'local.hero@example.com',
    companyName:'Test Co',
    helpWith:'Consulting / Project work',
    country:'Canada',
    message:'Local Hero form verification',
    hearAbout:'Google Search',
    agreeToContact:true,
    source:'hero'
  };
  const contactExpr = `(async()=>{const token=await grecaptcha.execute('${SITE_KEY}',{action:'contact_form'});const res=await fetch('${BACKEND}/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(${JSON.stringify(contactPayload)})});const text=await res.text();return JSON.stringify({status:res.status,body:text,token:token?token.slice(0,24)+'...':null});})()`;
  console.log('CONTACT:', await runInPage('http://localhost:3000', contactExpr));

  const contactPagePayload = {...contactPayload, email:'local.contactpage@example.com', source:'contact-page', message:'Local Contact page verification'};
  const contactPageExpr = `(async()=>{const token=await grecaptcha.execute('${SITE_KEY}',{action:'contact_form'});const res=await fetch('${BACKEND}/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(${JSON.stringify(contactPagePayload)})});const text=await res.text();return JSON.stringify({status:res.status,body:text});})()`;
  console.log('CONTACT_PAGE:', await runInPage('http://localhost:3000', contactPageExpr));

  const subPayload = {email:'local.subscribe@example.com', agreeToSubscribe:true};
  const subExpr = `(async()=>{const token=await grecaptcha.execute('${SITE_KEY}',{action:'subscribe'});const res=await fetch('${BACKEND}/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(${JSON.stringify(subPayload)})});const text=await res.text();return JSON.stringify({status:res.status,body:text});})()`;
  console.log('SUBSCRIBE:', await runInPage('http://localhost:3000', subExpr));
})();