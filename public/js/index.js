console.log('Desde Fronend')

function openModal() {
    console.log('Desde open modal')
    document.getElementById('modal-wrapper').classList.remove('hidden');
}
      
function closeModal() {
  document.getElementById('modal-wrapper').classList.add('hidden');
}