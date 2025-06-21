# Database Schema Design for Atomic Gym Tracker

## Table of Contents

1. Entity-Relationship Diagram (ERD)
2. Table Structures
3. Key Management
4. Indexing Strategy
5. Database Normalization
6. Query Patterns
7. Migration Strategy
8. Data Integrity Rules
9. Performance Optimization
10. Database Security
11. ORM Integration

---

## 1. Entity-Relationship Diagram (ERD)

### Entity Relationship Map

- **User**
  - One-to-Many with `WorkoutPlan`
  - One-to-Many with `WorkoutSession`
  
- **WorkoutPlan**
  - Many-to-One with `User`
  - One-to-Many with `WorkoutTemplate`
  
- **WorkoutTemplate**
  - Many-to-One with `WorkoutPlan`
  - One-to-Many with `WorkoutSet`
  
- **WorkoutSession**
  - Many-to-One with `User`
  - One-to-Many with `WorkoutSet`
  
- **WorkoutSet**
  - Many-to-One with `WorkoutTemplate`
  - Many-to-One with `WorkoutSession`

### Cardinality Notations

- User to WorkoutPlan: 1:N
- WorkoutPlan to WorkoutTemplate: 1:N
- User to WorkoutSession: 1:N
- WorkoutSession to WorkoutSet: 1:N
- WorkoutTemplate to WorkoutSet: 1:N

### Domain Boundaries

- **User Domain**: Manages user accounts and preferences.
- **Workout Domain**: Manages workout plans, templates, and sessions.

---

## 2. Table Structures

### User Table

| Column Name | Data Type | Constraints           | Default           | Comment                    |
| ----------- | --------- | --------------------- | ----------------- | -------------------------- |
| id          | UUID      | PRIMARY KEY, NOT NULL | gen_random_uuid() | User identifier            |
| username    | TEXT      | UNIQUE, NOT NULL      |                   | User's unique username     |
| email       | TEXT      | UNIQUE, NOT NULL      |                   | User's email address       |
| created_at  | TIMESTAMP | NOT NULL              | now()             | Account creation timestamp |

### WorkoutPlan Table

| Column Name | Data Type | Constraints           | Default           | Comment                  |
| ----------- | --------- | --------------------- | ----------------- | ------------------------ |
| id          | UUID      | PRIMARY KEY, NOT NULL | gen_random_uuid() | Plan identifier          |
| user_id     | UUID      | NOT NULL, FOREIGN KEY |                   | Reference to User        |
| name        | TEXT      | NOT NULL              |                   | Name of the workout plan |
| description | TEXT      |                       |                   | Detailed description     |
| created_at  | TIMESTAMP | NOT NULL              | now()             | Plan creation timestamp  |

### WorkoutTemplate Table

| Column Name     | Data Type | Constraints             | Default           | Comment                  |
| --------------- | --------- | ----------------------- | ----------------- | ------------------------ |
| id              | UUID      | PRIMARY KEY, NOT NULL   | gen_random_uuid() | Template identifier      |
| workout_plan_id | UUID      | NOT NULL, FOREIGN KEY   |                   | Reference to WorkoutPlan |
| exercise_name   | TEXT      | NOT NULL                |                   | Name of the exercise     |
| sets            | INTEGER   | CHECK (sets > 0)        | 3                 | Number of sets           |
| repetitions     | INTEGER   | CHECK (repetitions > 0) | 10                | Number of repetitions    |

### WorkoutSession Table

| Column Name | Data Type | Constraints           | Default           | Comment                   |
| ----------- | --------- | --------------------- | ----------------- | ------------------------- |
| id          | UUID      | PRIMARY KEY, NOT NULL | gen_random_uuid() | Session identifier        |
| user_id     | UUID      | NOT NULL, FOREIGN KEY |                   | Reference to User         |
| date        | DATE      | NOT NULL              |                   | Date of workout session   |
| notes       | TEXT      |                       |                   | Session notes or comments |

### WorkoutSet Table

| Column Name         | Data Type | Constraints              | Default           | Comment                      |
| ------------------- | --------- | ------------------------ | ----------------- | ---------------------------- |
| id                  | UUID      | PRIMARY KEY, NOT NULL    | gen_random_uuid() | Set identifier               |
| workout_session_id  | UUID      | NOT NULL, FOREIGN KEY    |                   | Reference to WorkoutSession  |
| workout_template_id | UUID      | NOT NULL, FOREIGN KEY    |                   | Reference to WorkoutTemplate |
| actual_reps         | INTEGER   | CHECK (actual_reps >= 0) | 0                 | Actual repetitions performed |

---

## 3. Key Management

### Primary Key Selection

- **Surrogate Keys**: UUIDs are used for all primary keys to provide unique identification and avoid composite keys where possible.

### Foreign Key Behaviors

- **ON DELETE CASCADE**: For all foreign key relationships to ensure referential integrity upon deletion.
- **ON UPDATE CASCADE**: To ensure changes propagate correctly.

### Junction Table Design

- **WorkoutSet**: Acts as a junction table to relate `WorkoutSession` and `WorkoutTemplate`.

---

## 4. Indexing Strategy

### Index Recommendations

- **B-tree Index**: On `username` and `email` in the `User` table for fast lookup.
- **Partial Index**: On `WorkoutSession.date` for recent sessions.
- **Multi-column Index**: On `WorkoutSet` for `(workout_session_id, workout_template_id)` to speed up session-template queries.

### Index Maintenance

- Regularly analyze and vacuum to maintain index efficiency and reduce bloat.

---

## 5. Database Normalization

- **1NF**: Ensured by having atomic values in tables.
- **2NF**: Achieved by making all non-key attributes fully functionally dependent on primary keys.
- **3NF**: No transitive dependencies exist within tables.
- **BCNF**: All determinants are candidate keys.

### Denormalization

- Consider denormalizing frequently accessed data for performance gains, e.g., storing aggregate workout statistics in a separate table to reduce complex joins.

---

## 6. Query Patterns

### Complex Join Operations

```sql
SELECT u.username, wp.name, wt.exercise_name
FROM users u
JOIN workout_plans wp ON u.id = wp.user_id
JOIN workout_templates wt ON wp.id = wt.workout_plan_id;
```

### Recursive Query Patterns

- Not applicable currently due to the non-hierarchical nature of the data.

### Materialized Views

- Consider creating materialized views for common and complex analytic queries to enhance performance.

### Common Table Expressions (CTEs)

```sql
WITH recent_sessions AS (
  SELECT * FROM workout_sessions
  WHERE date > CURRENT_DATE - INTERVAL '30 days'
)
SELECT * FROM recent_sessions;
```

### Window Functions

```sql
SELECT user_id, date, 
       RANK() OVER (PARTITION BY user_id ORDER BY date DESC) AS session_rank
FROM workout_sessions;
```

### Full-Text Search Implementation

- Use PostgreSQL's `tsvector` for full-text search capabilities on `notes`.

---

## 7. Migration Strategy

### Schema Evolution

- Follow an iterative and incremental approach for schema changes.
- Use a migration tool like Prisma Migrate for schema management.

### Zero-Downtime Migration

- Apply non-blocking schema changes, use feature toggles for application-level updates.

### Version Control

- Integrate database migrations with version control systems (e.g., Git) to track schema changes.

### Rollback Mechanisms

- Implement rollback strategies using reverse migrations.

---

## 8. Data Integrity Rules

### Domain Constraints

- Use CHECK constraints to enforce valid data ranges (e.g., positive integers for sets and reps).

### Referential Integrity

- Enforced via foreign keys, with ON DELETE and ON UPDATE CASCADE actions.

### Business Rules

- Implement stored procedures for complex business logic, such as calculating workout statistics.

### Triggers

- Use triggers cautiously for logging or derived attribute calculations.

---

## 9. Performance Optimization

### Table Partitioning

- Consider partitioning `WorkoutSession` by date for performance optimization on historical data.

### Connection Pooling

- Configure connection pooling to handle concurrent user access efficiently.

### Query Plan Analysis

- Regularly review and optimize query plans using PostgreSQL's EXPLAIN ANALYZE.

### Caching Layer Integration

- Use Redis for caching frequently accessed data to reduce database load.

---

## 10. Database Security

### Role-Based Access Control (RBAC)

- Implement RBAC to segregate user permissions (e.g., admin vs. regular user).

### Row-Level Security (RLS)

- Apply RLS policies to ensure users can only access their own data.

### Data Encryption

- Use SSL/TLS for data in transit and consider column-level encryption for sensitive data.

### Audit Logging

- Implement audit logs for critical actions and changes to sensitive data.

---

## 11. ORM Integration

### Prisma Schema Declarations

- Use Prisma's schema file to define models and relationships.

### Middleware Integration

- Implement middleware for logging and error handling at the ORM level.

### Type-Safe Query Building

- Leverage Prisma's type-safe query mechanism to reduce runtime errors.

### Transaction Management

- Use Prisma's transaction API to ensure data consistency during multi-step operations.

### Soft Delete Implementation

- Implement soft deletes using a `deleted_at` timestamp column.

### Optimistic Locking

- Utilize version fields to handle concurrent updates gracefully.

---

This comprehensive design document outlines the intricacies of the Atomic Gym Tracker's database design, ensuring robust, scalable, and efficient data management for the application.
```