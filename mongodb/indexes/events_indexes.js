const events = [];
for (let i = 1; i <= 5000; i++) {
  events.push({
    event_id: i,
    name: "Event " + i,
    sport_id: (i % 10) + 1,
    event_type_id: (i % 5) + 1,
    location_id: (i % 30) + 1,
    start_date: new Date(2024, 0, (i % 28) + 1),
    end_date: new Date(2024, 0, (i % 28) + 2)
  });
}

db.events.insertMany(events);