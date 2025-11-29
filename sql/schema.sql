CREATE TABLE athletes_sql (
    athlete_id INT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    gender CHAR(1),
    birth_date DATE
);

CREATE TABLE events_sql (
    event_id INT PRIMARY KEY,
    name VARCHAR(200),
    sport_id INT,
    event_type_id INT,
    location_id INT,
    start_date DATE,
    end_date DATE
);

CREATE TABLE results_sql (
    result_id INT PRIMARY KEY,
    athlete_id INT REFERENCES athletes_sql(athlete_id),
    event_id INT REFERENCES events_sql(event_id),
    points INT
);