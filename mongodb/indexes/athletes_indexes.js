const docs = [];
for (let i = 1; i <= 10000; i++) {
  docs.push({
    athlete_id: i,
    first_name: "Name" + i,
    last_name: "Last" + i,
    birth_date: new Date(1990, 0, (i % 28) + 1),
    gender: i % 2 === 0 ? "M" : "F"
  });
}

db.athletes.insertMany(docs);