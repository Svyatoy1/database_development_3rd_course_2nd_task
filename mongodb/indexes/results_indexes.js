const results = [];
for (let i = 1; i <= 20000; i++) {
  results.push({
    result_id: i,
    athlete_id: Math.floor(Math.random() * 10000) + 1,
    event_id: Math.floor(Math.random() * 5000) + 1,
    points: Math.floor(Math.random() * 100),
    position: Math.floor(Math.random() * 10) + 1,
    timestamp: new Date()
  });
}

db.results.insertMany(results);