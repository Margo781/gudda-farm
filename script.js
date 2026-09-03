
const menu=document.querySelector('.menu'), links=document.querySelector('.links');
if(menu) menu.addEventListener('click',()=>links.classList.toggle('open'));
document.querySelectorAll('form[data-whatsapp]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(form);
    const lines=[
      "GUDDA FARM — Buyer Enquiry",
      `Name: ${fd.get('name')||''}`,
      `Company: ${fd.get('company')||''}`,
      `Buyer type: ${fd.get('buyer')||''}`,
      `Product: ${fd.get('product')||''}`,
      `Quantity: ${fd.get('quantity')||''}`,
      `Destination: ${fd.get('destination')||''}`,
      `Requirements: ${fd.get('requirements')||''}`
    ];
    window.open('https://wa.me/918073094121?text='+encodeURIComponent(lines.join('\n')),'_blank');
  });
});
