# Lab Work 2

**Topic:** Comparing SQL, document-oriented NoSQL (MongoDB) and key-value NoSQL (Redis)  
**Domain:** Sports events management system

---

## 1. Technologies used

- **PostgreSQL + pgAdmin** – main relational DBMS; existing database **SportsEventsDB** from Lab 1 is reused.
- **MongoDB Community Server + MongoDB Compass / mongosh** – document-oriented NoSQL database.
- **Redis (server + redis-cli)** – key-value NoSQL database, used as an additional store / cache.
- **WSL / Ubuntu** – environment for MongoDB and Redis under Windows.
- **VS Code + git + GitHub** – development and version control tools.

---

## 2. Repository structure

    .
    ├── mongodb/
    │   ├── collections/
    │   │   ├── athletes.json        # data for MongoDB collection "athletes"
    │   │   ├── events.json          # data for collection "events"
    │   │   └── results.json         # data for collection "results"
    │   ├── indexes/
    │   │   ├── athletes_indexes.js  # create indexes for "athletes"
    │   │   ├── events_indexes.js    # create indexes for "events"
    │   │   └── results_indexes.js   # create indexes for "results"
    │   └── queries/
    │       ├── get_athlete.js       # Operation A – lookup by PK
    │       ├── filter_male.js       # Operation B – filter by gender
    │       ├── lookup.js            # Operation C – lookup / “join”
    │       └── group.js             # Operation D – aggregation
    │
    ├── redis/
    │   ├── data/
    │   │   ├── athletes.redis       # Redis commands to load athletes
    │   │   ├── events.redis         # Redis commands to load events
    │   │   └── results.redis        # Redis commands to load results
    │   └── operations/
    │       ├── get_athlete.redis    # Operation A in Redis
    │       ├── filter_male.redis    # Operation B in Redis
    │       ├── join.redis         # Operation C in Redis
    │       └── avg.redis          # Operation D in Redis
    │
    ├── sql/
    │   ├── schema.sql               # test tables + data generation
    │   └── queries/
    │       ├── get_athlete.sql      # Operation A – lookup by PK
    │       ├── filter_male.sql      # Operation B – filter by gender
    │       ├── join.sql             # Operation C – join results with athlete & event
    │       └── avg.sql              # Operation D – AVG(points) GROUP BY event
    │
    └── README.md

---

## 3. Data preparation

### 3.1. SQL (PostgreSQL)

1. Start **pgAdmin** and connect to the PostgreSQL server.
2. Open database **SportsEventsDB** (from Lab 1).
3. Open `sql/schema.sql` and execute it in this database.

Script tasks:

- Create denormalised test tables  

      athletes_sql
      events_sql
      results_sql

- Fill them with synthetic data using `generate_series`:
  - `athletes_sql` – 10 000 athletes;
  - `events_sql`  – 5 000 events;
  - `results_sql` – link table with `athlete_id`, `event_id`, `points`, `position`.

4. Use SQL scripts from `sql/queries` for performance tests.

#### Operation A – lookup by primary key

File: `sql/queries/get_athlete.sql`

Execution time is taken from pgAdmin “Total query runtime”.

#### Operation B – filter by gender

File: `sql/queries/filter_male.sql`

#### Operation C – JOIN results with athlete and event

File: `sql/queries/join.sql`

#### Operation D – aggregation (AVG points per event)

File: `sql/queries/avg.sql`

---

### 3.2. MongoDB

#### 3.2.1. Importing collections

1. Start **MongoDB Compass** and connect to `mongodb://localhost:27017`.
2. Create database **SportsEventsNoSql**.
3. Create collections: `athletes`, `events`, `results`.
4. For each collection use **ADD DATA → Import File** and import:

   - `mongodb/collections/athletes.json`
   - `mongodb/collections/events.json`
   - `mongodb/collections/results.json`

#### 3.2.2. Creating indexes

In **mongosh**, select the database and run scripts from `mongodb/indexes`:

`athletes_indexes.js`
`events_indexes.js`
`results_indexes.js`

These indexes correspond to filters and “joins” used in our test operations.

#### 3.2.3. Queries and timing (Operations A–D)

Each Mongo query is wrapped with a simple timer using `Date.now()`.

**Operation A – lookup by ID**  
File: `mongodb/queries/get_athlete.js`

**Operation B – filter by gender**  
File: `mongodb/queries/filter_male.js`

**Operation C – lookup with two $lookup stages**  
File: `mongodb/queries/lookup.js`

**Operation D – aggregation: average points per event**  
File: `mongodb/queries/group.js`

---

### 3.3. Redis

Redis is used to model the same domain in a key-value form and to demonstrate commands for the same four operations.

#### 3.3.1. Running Redis

In WSL / Ubuntu:

    sudo service redis-server start      # or: sudo systemctl start redis-server
    redis-cli ping                       # should respond with PONG

#### 3.3.2. Loading data

From the repository root:

    cd redis
    redis-cli < data/athletes.redis
    redis-cli < data/events.redis
    redis-cli < data/results.redis

Key design:

- `athlete:<id>` – hash with athlete fields.
- `event:<id>` – hash with event fields.
- `result:<id>` – hash with `athlete_id`, `event_id`, `points`, `position`.
- Additional sets for secondary access (for example `gender:M` contains IDs of male athletes).

#### 3.3.3. Operations A–D in Redis

Scripts in `redis/operations` show how the same operations can be implemented in Redis.

- **Operation A – get athlete by ID**  
  `redis/operations/get_athlete.redis`

- **Operation B – all male athletes**  
  `redis/operations/filter_male.redis`

- **Operation C – “join” result with athlete & event**  
  `redis/operations/lookup.redis`

- **Operation D – aggregated data (average points per event)**  
  `redis/operations/group.redis`

---

## 4. Operations summary

The same four logical operations were implemented in all three technologies.

1. **Operation A – simple lookup by ID**
   - SQL: `get_athlete.sql`
   - MongoDB: `get_athlete.js`
   - Redis: `get_athlete.redis`

2. **Operation B – filtering by gender**
   - SQL: `filter_male.sql`
   - MongoDB: `filter_male.js`
   - Redis: `filter_male.redis`

3. **Operation C – join / lookup (result + athlete + event)**
   - SQL: `join.sql` with `EXPLAIN ANALYZE`
   - MongoDB: `lookup.js` (`$lookup` + `$unwind`)
   - Redis: `join.redis` 

4. **Operation D – aggregation (average points per event)**
   - SQL: `avg.sql` (`GROUP BY event_id`)
   - MongoDB: `group.js` (`$group` + `$avg`)
   - Redis: `avg.redis`

---

## 5. Performance results

### 5.1. PostgreSQL (pgAdmin measurements)

| Operation | Description                             | Time, ms |
|----------|-----------------------------------------|---------:|
| A        | Lookup athlete by `athlete_id = 5555`   |     479  |
| B        | All male athletes (`gender = 'M'`)      |     132  |
| C        | JOIN results + athletes + events        |     292  |
| D        | AVG(points) `GROUP BY event_id`         |     285  |

### 5.2. MongoDB (`Date.now()` in scripts)

| Operation | Description                             | Time, ms |
|----------|-----------------------------------------|---------:|
| A        | Lookup athlete by `athlete_id = 5555`   |      20  |
| B        | All male athletes (`gender = "M"`)      |     105  |
| C        | Aggregate with two `$lookup` stages     |     105  |
| D        | `$group` with AVG(points) per event     |      86  |

### 5.3. Redis

Redis operations A–D work correctly and are expected to be very fast for
simple lookups, but exact timings were not recorded.  
The main goal was to show key-value modelling and commands that correspond
to the same logical operations as in SQL and MongoDB.

---

## 6. Conclusions

1. **Relational model (PostgreSQL)**  
   - Naturally supports joins and aggregations with declarative SQL.  
   - Performance on large denormalised tables is decent but depends on indexes
     and query plans.  
   - For our dataset, JOINs and aggregations (operations C, D) are slower than
     simple lookups but remain acceptable.

2. **Document-oriented NoSQL (MongoDB)**  
   - Works efficiently with indexed fields and denormalised documents.  
   - `$lookup` and `$group` allow us to reproduce joins and aggregations.  
   - For the tested operations MongoDB showed better times than PostgreSQL,
     especially for read-heavy queries.

3. **Key-value NoSQL (Redis)**  
   - Ideal for extremely fast lookups by key (operation A) and simple set logic
     (operation B).  
   - Joins and aggregations (C, D) are not native and require additional
     application-level logic or pre-aggregation.  
   - For this domain Redis is best used as a **cache** or secondary store,
     not as the primary system of record.

4. **Overall**  
   - For a full-featured sports events management system with complex reports,
     **PostgreSQL** (or another relational DBMS) is the primary choice.  
   - **MongoDB** is suitable for read-intensive subsystems, flexible document
     storage and horizontal scaling.  
   - **Redis** is a great complementary technology for caching frequently
     accessed data and storing counters or pre-computed aggregates.

This lab demonstrates how the same subject domain can be modelled and queried
using three different database paradigms, and how the choice of technology
affects data model, query style and performance.