(()=>{
  const menu=document.querySelector('.menu'), links=document.querySelector('.links');
  if(menu&&links) menu.addEventListener('click',()=>{
    const open=links.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(open));
  });

  const params=new URLSearchParams(location.search);
  const tracked=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','ref'];
  const attribution={};
  tracked.forEach(k=>{const v=params.get(k); if(v) attribution[k]=v.slice(0,120)});
  if(Object.keys(attribution).length){
    try{localStorage.setItem('gudda_attribution',JSON.stringify({...attribution,landing:location.pathname,attributed_at:new Date().toISOString()}));}catch(e){}
  }
  let saved={}; try{saved=JSON.parse(localStorage.getItem('gudda_attribution')||'{}')}catch(e){}
  const source=saved.utm_source||saved.ref||'';
  document.querySelectorAll('[data-attribution]').forEach(el=>{
    if(source){el.textContent=`Source: ${source}`;el.hidden=false;}
  });

  const buyerField=document.querySelector('select[name="buyer"]');
  const productField=document.querySelector('select[name="product"]');
  if(buyerField&&params.get('buyer')) [...buyerField.options].forEach(o=>{if(o.text.toLowerCase()===params.get('buyer').toLowerCase()) buyerField.value=o.value});
  if(productField&&params.get('product')) [...productField.options].forEach(o=>{if(o.text.toLowerCase()===params.get('product').toLowerCase()) productField.value=o.value});

  const buildMessage=(fd)=>{
    const lines=['GUDDA FARM — B2B Buyer Enquiry',`Name: ${fd.get('name')||''}`,`Company: ${fd.get('company')||''}`,`Buyer type: ${fd.get('buyer')||''}`,`Product: ${fd.get('product')||''}`,`Quantity: ${fd.get('quantity')||''}`,`Destination: ${fd.get('destination')||''}`,`Requirements: ${fd.get('requirements')||''}`];
    if(source) lines.push(`Source: ${source}`);
    if(saved.utm_campaign) lines.push(`Campaign: ${saved.utm_campaign}`);
    lines.push(`Page: ${location.pathname}`);
    return lines.join('\n');
  };
  document.querySelectorAll('form[data-whatsapp]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();
    const required=[...form.querySelectorAll('[required]')]; let ok=true;
    required.forEach(el=>{el.classList.remove('field-error');if(!String(el.value||'').trim()){el.classList.add('field-error');ok=false}});
    if(!ok){required.find(el=>!String(el.value||'').trim())?.focus();return;}
    const url='https://wa.me/918073094121?text='+encodeURIComponent(buildMessage(new FormData(form)));
    const panel=document.querySelector('#successPanel'); if(panel) panel.style.display='block';
    try{localStorage.setItem('gudda_last_enquiry',new Date().toISOString())}catch(e){}
    window.open(url,'_blank','noopener');
  }));

  document.querySelectorAll('[data-share]').forEach(btn=>btn.addEventListener('click',async()=>{
    const data={title:document.title,text:'GUDDA FARM — Since 2003 | Karnataka agricultural produce',url:location.href};
    try{if(navigator.share) await navigator.share(data); else await navigator.clipboard.writeText(location.href); btn.textContent=navigator.share?'Shared ✓':'Link copied ✓';}
    catch(e){}
    setTimeout(()=>btn.textContent='Share this page',1800);
  }));

  document.querySelectorAll('[data-copy-url]').forEach(btn=>btn.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(location.href);btn.textContent='Link copied ✓';setTimeout(()=>btn.textContent='Copy link',1600)}catch(e){window.prompt('Copy this link:',location.href)}
  }));

  // V14 + V15 fast RFQ wizard
  const rfq=document.querySelector('#fastRfq');
  if(rfq){
    const steps=[...rfq.querySelectorAll('.wizard-step')], next=document.querySelector('#rfqNext'), back=document.querySelector('#rfqBack'), send=document.querySelector('#rfqSend'), bar=document.querySelector('#rfqProgress'); let current=0;
    const show=()=>{steps.forEach((x,i)=>x.classList.toggle('active',i===current)); if(next) next.style.display=current===steps.length-1?'none':'inline-flex'; if(back) back.style.display=current?'inline-flex':'none'; if(send) send.style.display=current===steps.length-1?'inline-flex':'none'; if(bar) bar.style.width=((current+1)/steps.length*100)+'%';};
    const valid=()=>{const fields=[...steps[current].querySelectorAll('[required]')];let ok=true;fields.forEach(x=>{x.classList.toggle('field-error',!String(x.value||'').trim());if(!String(x.value||'').trim())ok=false});return ok};
    next?.addEventListener('click',()=>{if(valid()){current=Math.min(current+1,steps.length-1);show();window.guddaTrack?.('rfq_step',{step:current+1})}});
    back?.addEventListener('click',()=>{current=Math.max(0,current-1);show()}); show();
    rfq.addEventListener('input',()=>{const f=new FormData(rfq);let n=0;['name','product','quantity','destination','requirements'].forEach(k=>{if(String(f.get(k)||'').trim())n++});const dots=[...(document.querySelectorAll('#scoreDots i'))];dots.forEach((d,i)=>d.classList.toggle('on',i<n));const t=document.querySelector('#scoreText');if(t)t.textContent=n>=4?'Good: your enquiry has useful buying detail.':'Add quantity, destination and requirements for a stronger enquiry.'});
  }


  // Website ratings -> Google Sheets
  // Replace this placeholder with your deployed Google Apps Script Web App URL.
const RATING_ENDPOINT='https://script.google.com/macros/s/AKfycbym4IISmjpu8AYJ3PdPXQ13ZXp6PFjOx0Zh4JbDZSSrMtiQSf1NeEQN1Pfzfu5hX8ad/exec';  const ratingForm=document.querySelector('#guddaRatingForm');
  const ratingStatus=document.querySelector('#ratingStatus');
  const ratingLabel=document.querySelector('#ratingLabel');
  let selectedRating=0;
  const ratingLabels={1:'1 / 5 — Needs improvement',2:'2 / 5 — Could be better',3:'3 / 5 — Good',4:'4 / 5 — Very good',5:'5 / 5 — Excellent'};
  if(ratingForm){
    const stars=[...ratingForm.querySelectorAll('.rating-star')];
    stars.forEach(star=>star.addEventListener('click',()=>{
      selectedRating=Number(star.dataset.rating||0);
      stars.forEach(x=>x.classList.toggle('selected',Number(x.dataset.rating)<=selectedRating));
      if(ratingLabel) ratingLabel.textContent=ratingLabels[selectedRating]||'Select a rating';
    }));
    ratingForm.addEventListener('submit',e=>{
      e.preventDefault();
      if(!selectedRating){ if(ratingStatus) ratingStatus.textContent='Please select a star rating first.'; return; }
      if(!RATING_ENDPOINT || RATING_ENDPOINT.includes('PASTE_YOUR_')){
        if(ratingStatus) ratingStatus.textContent='Rating form is ready, but the Google Sheets connection URL still needs to be added.';
        return;
      }
      const fd=new FormData(ratingForm);
      const params=new URLSearchParams({rating:String(selectedRating),name:String(fd.get('name')||''),feedback:String(fd.get('feedback')||''),page:location.pathname,source:source||''});
      const iframe=document.querySelector('#ratingSubmitFrame');
      if(iframe){
        ratingForm.target='ratingSubmitFrame';
       if(iframe){
  ratingForm.target='ratingSubmitFrame';

  const oldAction=ratingForm.action;
  const oldMethod=ratingForm.method;

  ratingForm.action=RATING_ENDPOINT;
  ratingForm.method='POST';

  const hidden=document.createElement('input');
  hidden.type='hidden';
  hidden.name='rating';
  hidden.value=String(selectedRating);
  ratingForm.appendChild(hidden);

  const h2=document.createElement('input');
  h2.type='hidden';
  h2.name='page';
  h2.value=location.pathname;
  ratingForm.appendChild(h2);

  const h3=document.createElement('input');
  h3.type='hidden';
  h3.name='source';
  h3.value=source||'';
  ratingForm.appendChild(h3);

  ratingForm.submit();

  setTimeout(()=>{
    if(ratingStatus) ratingStatus.textContent='Thank you — your rating has been submitted.';

    ratingForm.reset();
    selectedRating=0;

    stars.forEach(x=>x.classList.remove('selected'));

    if(ratingLabel) ratingLabel.textContent='Select a rating';

    ratingForm.action=oldAction;
    ratingForm.method=oldMethod;

    [hidden,h2,h3].forEach(x=>x.remove());
  },1200);
}
      } else if(ratingStatus){ ratingStatus.textContent='Rating submission frame is missing.'; }
    });
  }

  // Lightweight analytics hooks: ready for GA4/GTM without inventing an account ID.
  window.guddaTrack=(event,details={})=>{try{console.info('[GUDDA FARM]',event,details)}catch(e){}};
  document.querySelectorAll('a[href*="wa.me"]').forEach(a=>a.addEventListener('click',()=>window.guddaTrack('whatsapp_click',{page:location.pathname})));
  document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.addEventListener('click',()=>window.guddaTrack('phone_click',{page:location.pathname})));
})();
