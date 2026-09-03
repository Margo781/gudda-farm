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

  // Lightweight analytics hooks: ready for GA4/GTM without inventing an account ID.
  window.guddaTrack=(event,details={})=>{try{console.info('[GUDDA FARM]',event,details)}catch(e){}};
  document.querySelectorAll('a[href*="wa.me"]').forEach(a=>a.addEventListener('click',()=>window.guddaTrack('whatsapp_click',{page:location.pathname})));
  document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.addEventListener('click',()=>window.guddaTrack('phone_click',{page:location.pathname})));
})();
