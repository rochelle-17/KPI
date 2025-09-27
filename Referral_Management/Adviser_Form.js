const addNewBtn = document.getElementById('addNewBtn');
const popup     = document.getElementById('referralPopup');
const closeBtn  = document.getElementById('closeBtn');
const form      = document.getElementById('referralForm');

/* open */
addNewBtn.addEventListener('click', () => {
  popup.classList.add('show');
  addNewBtn.style.display = 'none'; 
});

closeBtn.addEventListener('click', () => {
  popup.classList.remove('show');
  addNewBtn.style.display = 'block'; 
});

popup.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.classList.remove('show');
    addNewBtn.style.display = 'block'; 
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  console.log('Referral saved:', data);
  alert('Referral saved successfully!');
  form.reset();
  popup.classList.remove('show');
  addNewBtn.style.display = 'block'; 
});