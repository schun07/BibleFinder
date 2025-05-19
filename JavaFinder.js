/// quizLogic.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase
const supabase = createClient(
  'https://tjmfpjskvvkqubdllrhu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqbWZwanNrdnZrcXViZGxscmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1Mjc2MTcsImV4cCI6MjA2MzEwMzYxN30.wZve6Ul3iAWCIWaKd3YKpbUTbzsuwJyP6I65sEMc5C4'
);

const apiKey = 'f76136b950ef9800eccee35888358c8a';
const apiBase = 'https://api.scripture.api.bible/v1';

let userPreferences = {
  readability: '',
  tradition: '',
  language: ''
};

let finalTranslations = [];

// Predefined categorization of versions by readability and tradition
const versionCategories = {
  literal: [
    'de4e12af7f28f599-01', // KJV
    '1e846b22c85e4c26-01', // ESV
    'fa157335b3d08483-01',  // NASB
    '592420522e16049f-01', //1909 Reina Valera Spanish Versions
    'a6e06d2c5b90ad89-01' // Traditional Chinese
  ],
  readable: [
    '06125adad2d5898a-01', // NIV
    '65eec8e0b60e656b-01', // NLT
    'bba9f40183526463-01',  // GNT
    'b32b9d1b64b4ef29-01', //Holy Bible in Simple Spanish
    'b32b9d1b64b4ef29-01',  //New Testament Spanish
    '48acedcf8595c754-01', //new spanish bible
    '04fb2bec0d582d1f-01', //Easy to Read Chinese
    '7ea794434e9ea7ee-01' //Simplified contemporary Version
  ],
  traditional: [
    'de4e12af7f28f599-01', // KJV
    '592420522e16049f-01', //1909 Reina Valera Spanish Versions
    'a6e06d2c5b90ad89-01' // Traditional Chinese

  ],
  modern: [
    '06125adad2d5898a-01', // NIV
    '65eec8e0b60e656b-01',  // NLT
    '48acedcf8595c754-01', //new spanish bible
    '7ea794434e9ea7ee-01' //simplified contemporary Version
  ]
};

function startQuiz() {
  document.getElementById('app').innerHTML = `
    <p>What would you prefer to read daily?</p>
    <button class="button-31" role="button" id="readableBtn">Modern and easy to read</button>
    <button class="button-31" role="button" id="literalBtn">Literal and word-for-word</button>
  `;
  document.getElementById('readableBtn').addEventListener('click', () => setReadability('readable'));
  document.getElementById('literalBtn').addEventListener('click', () => setReadability('literal'));
}

function setReadability(choice) {
  userPreferences.readability = choice;
  document.getElementById('app').innerHTML = `
    <p>Do you prefer traditional Christian wording or a contemporary voice?</p>
    <button class="button-31" role="button" id="tradBtn">Traditional</button>
    <button class="button-31" role="button" id="modBtn">Contemporary</button>
  `;
  document.getElementById('tradBtn').addEventListener('click', () => setTradition('traditional'));
  document.getElementById('modBtn').addEventListener('click', () => setTradition('modern'));
}

function setTradition(choice) {
  userPreferences.tradition = choice;
  showLanguageQuestion();
}

function showLanguageQuestion() {
  document.getElementById('app').innerHTML = `
    <p>Select your preferred language:</p>
    <button class="button-31" role="button" id="langEng">English</button>
    <button class="button-31" role="button" id="langSpa">Spanish</button>
    <button class="button-31" role="button" id="langChi">Chinese</button>
    <button class="button-31" role="button" id="langDeu">German</button>
  `;
  document.getElementById('langEng').addEventListener('click', () => setLanguage('eng'));
  document.getElementById('langSpa').addEventListener('click', () => setLanguage('spa'));
  document.getElementById('langFra').addEventListener('click', () => setLanguage('fra'));
  document.getElementById('langDeu').addEventListener('click', () => setLanguage('deu'));
}

function setLanguage(code) {
  userPreferences.language = code;
  fetchVersions();
}

async function fetchVersions() {
  document.getElementById('app').innerHTML = `<p>Finding translations for you...</p>`;
  const res = await fetch(`${apiBase}/bibles`, {
    headers: { 'api-key': apiKey }
  });

  const data = await res.json();
  let versions = data.data;

  // Filter by selected language
  versions = versions.filter(v => v.language.id === userPreferences.language);

  // Match against predefined category
  const readabilityMatch = versionCategories[userPreferences.readability] || [];
  const traditionMatch = versionCategories[userPreferences.tradition] || [];

  const matchedIds = [...new Set([...readabilityMatch, ...traditionMatch])];

  const recommended = versions.filter(v => matchedIds.includes(v.id));

  finalTranslations = recommended.map(r => r.name);
  showResult(recommended);
}

function showResult(recommendations) {
  const app = document.getElementById('app');
  const result = document.getElementById('result');

  if (recommendations && recommendations.length > 0) {
    const html = recommendations.map(r => `
      <div class="recommendation">
        <h3>${r.name}</h3>
        <p>Language: ${r.language.name}</p>
        <p>Version ID: ${r.id}</p>
        <p>Summary: ${r.description}
      </div>
    `).join('');

    app.innerHTML = `
      <h2>We recommend these translations:</h2>
      ${html}
      <button id="feedbackBtn">Leave Feedback</button>
    `;

    document.getElementById('feedbackBtn').addEventListener('click', showFeedbackForm);
    result.innerHTML = '';
  } else {
    app.innerHTML = `<p>No recommendations found.</p>`;
  }
}

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
window.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  if (startBtn) startBtn.addEventListener('click', startQuiz);
});

feather.replace();
//https://twitter.com/One_div

