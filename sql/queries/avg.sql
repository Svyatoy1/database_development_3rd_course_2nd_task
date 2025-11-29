SELECT event_id, AVG(points)
FROM results_sql
GROUP BY event_id;