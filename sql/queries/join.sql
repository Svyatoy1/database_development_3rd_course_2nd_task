SELECT r.result_id, a.first_name, e.name, r.points
FROM results_sql r
JOIN athletes_sql a ON a.athlete_id = r.athlete_id
JOIN events_sql e ON e.event_id = r.event_id
WHERE r.event_id = 100;