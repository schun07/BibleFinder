const apiKey = "API_KEY";
    const bibleId = "de4e12af7f28f599-02"; // ASV
    const books = [
      "GEN", "EXO", "LEV", "NUM", "DEU", "JOS", "JDG", "RUT", "1SA", "2SA",
      "1KI", "2KI", "1CH", "2CH", "EZR", "NEH", "EST", "JOB", "PSA", "PRO",
      "ECC", "SNG", "ISA", "JER", "LAM", "EZK", "DAN", "HOS", "JOL", "AMO",
      "OBA", "JON", "MIC", "NAM", "HAB", "ZEP", "HAG", "ZEC", "MAL", "MAT",
      "MRK", "LUK", "JHN", "ACT", "ROM", "1CO", "2CO", "GAL", "EPH", "PHP",
      "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM", "HEB", "JAS", "1PE",
      "2PE", "1JN", "2JN", "3JN", "JUD", "REV"
    ];

async function getRandomVerse() {
  books = ["john", "romans", "psalms", "proverbs", "genesis"];
  chapter = Math.floor(Math.random() * 5) + 1;
  verse = Math.floor(Math.random() * 20) + 1;
  const book = books[Math.floor(Math.random() * books.length)];
  passage = `${book}.${chapter}.${verse}`;
  bibleId = '06125adad2d5898a-01'; // NIV
  apiKey = 'f76136b950ef9800eccee35888358c8a';

  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passage}?content-type=text`;

  try {
    const res = await fetch(url, {
      headers: { "api-key": apiKey }
    });
    if (!res.ok) throw new Error("Verse not found");
    const data = await res.json();
    document.getElementById("verseBox").innerHTML =
      `<strong>${data.data.reference}:</strong><br>${data.data.content}`;
  } catch (error) {
    console.error(error);
    document.getElementById("verseBox").innerText = "Could not fetch verse. Try again!";
  }
}
