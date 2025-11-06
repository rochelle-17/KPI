// ✅ Auto-generate Document Number
document.addEventListener('DOMContentLoaded', () => {
  const docNumberField = document.getElementById('docNumber');
  const storedCount = localStorage.getItem('complaintCount') || 0;
  const newCount = parseInt(storedCount) + 1;
  const formattedNum = String(newCount).padStart(4, '0');
  docNumberField.value = `DOC-${formattedNum}`;
  localStorage.setItem('complaintCount', newCount);
});

// ✅ Handle form submission (ready for backend connection)
document.getElementById('complaintForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    docNumber: document.getElementById('docNumber').value,
    name: document.getElementById('name').value,
    level: document.getElementById('level').value,
    type: document.getElementById('type').value,
    time: document.getElementById('time').value,
    date: document.getElementById('date').value,
    description: document.getElementById('description').value
  };

  console.log("Submitting Concern:", formData);

  // 🔌 Connect to backend (update URL when ready)
  try {
    const response = await fetch('/submit-concern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert('Concern submitted successfully!');
      e.target.reset();
    } else {
      alert('Error submitting concern.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server connection failed.');
  }
});
