
const menu=document.querySelector('.menu'), links=document.querySelector('.links');
if(menu) menu.addEventListener('click',()=>links.classList.toggle('open'));

const params=new URLSearchParams(location.search);
const buyerField=document.querySelector('select[name="buyer"]');
const productField=document.querySelector('select[name="product"]');
if(buyerField && params.get('buyer')){
  const wanted=params.get('buyer');
  [...buyerField.options].forEach(o=>{if(o.text.toLowerCase()===wanted.toLowerCase()) buyerField.value=o.value});
}
if(productField && params.get('product')){
  const wanted=params.get('product');
  [...productField.options].forEach(o=>{if(o.text.toLowerCase()===wanted.toLowerCase()) productField.value=o.value});
}

document.querySelectorAll('form[data-whatsapp]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const required=[...form.querySelectorAll('[required]')];
    let ok=true;
    required.forEach(el=>{el.classList.remove('field-error'); if(!el.value.trim()){el.classList.add('field-error');ok=false}});
    if(!ok){required.find(el=>!el.value.trim())?.focus();return;}
    const fd=new FormData(form);
    const lines=[
      "GUDDA FARM — B2B Buyer Enquiry",
      `Name: ${fd.get('name')||''}`,
      `Company: ${fd.get('company')||''}`,
      `Buyer type: ${fd.get('buyer')||''}`,
      `Product: ${fd.get('product')||''}`,
      `Quantity: ${fd.get('quantity')||''}`,
      `Destination: ${fd.get('destination')||''}`,
      `Requirements: ${fd.get('requirements')||''}`
    ];
    const url='https://wa.me/918073094121?text='+encodeURIComponent(lines.join('\n'));
    const panel=document.querySelector('#successPanel'); if(panel) panel.style.display='block';
    window.open(url,'_blank','noopener');
  });
});
