const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3001;

// Supabase setup
const supabase = createClient(
  'https://tjmfpjskvvkqubdllrhu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqbWZwanNrdnZrcXViZGxscmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1Mjc2MTcsImV4cCI6MjA2MzEwMzYxN30.wZve6Ul3iAWCIWaKd3YKpbUTbzsuwJyP6I65sEMc5C4' 
);


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/feedback', async (req, res) => {
  const { data, error } = await supabase.from('feedback').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


app.post('/api/feedback', async (req, res) => {
  const { translation, rating, comments } = req.body;
  const { data, error } = await supabase.from('feedback').insert([{ translation, rating, comments }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
//to check if it works
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});


