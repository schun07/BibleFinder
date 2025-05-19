/// quizLogic.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase
const supabase = createClient(
  'https://tjmfpjskvvkqubdllrhu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqbWZwanNrdnZrcXViZGxscmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1Mjc2MTcsImV4cCI6MjA2MzEwMzYxN30.wZve6Ul3iAWCIWaKd3YKpbUTbzsuwJyP6I65sEMc5C4'
);

function showFeedbackForm() {
  const options = finalTranslations.map(name => `<option value="${name}">${name}</option>`).join('');
  document.getElementById('result').innerHTML = `
    <h3>Leave Feedback</h3>
    <label>Which version?: 
      <select id="selectedTranslation">${options}</select>
    </label><br />
    <label>Rating (1-5): <input type="number" id="rating" min="1" max="5"></label><br />
    <label>Comments: <input type="text" id="comments"></label><br />
    <button id="submitFeedbackBtn">Submit</button>
  `;

  document.getElementById('submitFeedbackBtn').addEventListener('click', submitFeedback);
}

async function submitFeedback() {
  const selectedTranslation = document.getElementById('selectedTranslation').value;
  const rating = document.getElementById('rating').value;
  const comments = document.getElementById('comments').value;

  const { data, error } = await supabase.from('feedback').insert([
    { translation: selectedTranslation, rating: parseInt(rating), comments }
  ]);

  if (error) {
    alert('Something went wrong saving your feedback.');
  } else {
    alert('Thank you for your feedback!');
    document.getElementById('result').innerHTML = '';
  }
}