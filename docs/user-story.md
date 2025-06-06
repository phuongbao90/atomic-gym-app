# 🏋️‍♀️ Fitness App – Full User Story Spec

## 🎯 Summary

This user story captures the end-to-end user experience of a **fitness enthusiast** managing their workouts through structured plans, live session execution, performance tracking, and post-session history. The app supports complete customization, flexibility, and persistent performance tracking.

---

## 👤 User Role

**Fitness Enthusiast**

---

## 🧩 Functional Goals

- Create or select structured workout plans
- Execute and log workout sessions
- Modify exercises during active sessions
- Track past performance at multiple levels
- Add new exercises with rich metadata
- View calendar-based workout history
- Edit or delete session logs

---

## 📚 User Stories & Acceptance Criteria

### 1. Create or Select Workout Plan

**As a** fitness enthusiast  
**I want to** create or select a workout plan  
**So that** I can follow a structured routine based on my goals

#### Acceptance Criteria:
- See list of predefined plans by category (strength, endurance, flexibility, loose-weight)
- Create custom plan by adding workout sessions which includes exercises
- Save custom plans for reuse
- User should be able to edit their own workout plan , not others
- User should be able to clone / duplicate plans that are not theirs

---

### 2. Start a Workout by Choosing a Session

**As a** user  
**I want to** start a session from a selected plan  
**So that** I can perform workouts with structure

#### Acceptance Criteria:
- A workout plan consists of multiple sessions
- A session includes multiple exercises
- User must first choose a plan, then a session

---

### 3. Log Exercise Performance

**As a** user  
**I want to** log reps, sets, weight, duration  
**So that** I can track performance metrics accurately

#### Acceptance Criteria:
- Mark exercises as completed
- Add notes per session
- Default targets are zero if session is first-time
- If previously performed, show data from last session

---

### 4. Modify Workout During Session

**As a** user  
**I want to** adapt the workout in real-time  
**So that** I can tailor the session to my condition

#### Acceptance Criteria:
- Remove, replace, or add new exercises during session
- Drag and reorder exercises within the session

---

### 5. Persist Session Modifications

**As a** user  
**I want to** decide if session changes should be saved  
**So that** I can keep or discard structural changes

#### Acceptance Criteria:
- At session end, prompt: “Persist these changes to the plan?”
  - Confirm → update original session template
  - Decline → log only reflects temporary structure

---

### 6. Add New Exercise

**As a** user  
**I want to** create new exercises  
**So that** I can include personalized movements

#### Exercise Fields:
- Name (required)
- Image (optional)
- YouTube URL (optional)
- Notes (optional)

---

### 7. Track Past Performance

**As a** user  
**I want to** view my performance history  
**So that** I can see my progress over time

#### Acceptance Criteria:
- View performance by:
  - Workout Plan
  - Exercise
  - Overall (all sessions)
- Metrics:
  - Total sessions, sets, duration, weight lifted
  - Graphs for weight/reps/duration
  - Filterable by week, month, year, all-time

---

### 8. Performance Views (3 Screens)

#### A. Workout Plan Detail View
- Tab with:
  - Total sessions, duration, sets
  - Graphs of reps/weight/duration

#### B. Exercise Detail View
- List of logs:
  - Each log shows weight × reps
  - Grouped by workout session

#### C. Global Performance Tab
- Aggregated stats across all plans
- Filters: Week, Month, Year, All
- Graphs and stats (same as above)

---

### 9. History Tab (Calendar)

**As a** user  
**I want to** view past workouts in a calendar  
**So that** I can quickly find and revisit past sessions

#### Acceptance Criteria:
- Monthly calendar with marked days (with session)
- Tap on a day:
  - Multiple sessions → show modal list
  - One session → open log directly
- Below calendar:
  - List of all sessions in descending order

---

### 10. Session Log Detail View

**As a** user  
**I want to** view and manage individual session logs  
**So that** I can correct or analyze them in depth

#### Log Details:
- Session name
- Date performed
- Duration
- Total sets and weight
- List of exercises:
  - Each with sets (completed and uncompleted)
  - Set format: `weight × reps`

#### Actions:
- Delete session log (with confirmation)
- Edit session log:
  - Opens same UI as workout session:
    - Remove/replace exercises
    - Reorder exercises
    - Edit sets

---