# UI Design Document

## 1. UI Design Overview

The visual style of **International Student Simulator** uses a hand-drawn notebook theme.  
The interface is designed to look like a student's diary, planner, and study desk. This fits the game concept because the player is managing an international student's academic year through planning, choices, tasks, and endings.

The main UI direction includes:

- Notebook and paper textures
- Warm brown and beige colours
- Handwritten-style typography
- Sticker-like buttons and cards
- Student-life objects such as notebooks, pens, calendars, coffee cups, books, and photos
- A soft illustrated style that feels personal and calm

The UI is designed to make the game feel like the player is recording and managing their own student life.

---

## 2. Start Screen

### Purpose

The start screen is the first page the player sees.  
It introduces the game title and gives the player access to the main actions.

### Layout Description

The screen uses a large notebook background placed on a study desk.  
The title is placed in the centre on a brown banner, making it look like a label stuck onto a notebook page.
<img width="1680" height="950" alt="042a11d61d3bfbe58a03b47bbf5a847e" src="https://github.com/user-attachments/assets/0b5c84bf-183e-4349-adf5-63b68dd61d45" />

Main elements:

| UI Element | Description |
|---|---|
| Game Title | Displays `International Student Simulator` in the centre |
| Start Button | Main button used to begin the game |
| About Us Button | Opens information about the team or game background |
| Sign In Button | Allows user login or account access |
| Settings Icon | Placed in the bottom-right corner for game settings |

### Design Notes

The start screen is intentionally simple.  
The large empty notebook space gives a clean and calm first impression.  
The brown buttons match the paper theme and keep the UI visually consistent.

### Suggested Interaction

- Clicking **Start** enters the character selection or task planning flow.
- Clicking **About Us** opens a short introduction page.
- Clicking **Sign In** allows the player to log into their account.
- Clicking the gear icon opens settings.

---

## 3. Quarter Task Planning Screen

### Purpose

This screen allows the player to plan tasks for the current quarter.  
The player can select planned events from different categories, such as Study, Entertainment, and Social.

### Layout Description
<img width="1536" height="1024" alt="0893e982a69b27fdb6d3faa16a4cfe88" src="https://github.com/user-attachments/assets/9a9703bc-6820-4035-a825-e32ede7e5ef1" />

The screen is divided into two main areas:

| Area | Description |
|---|---|
| Left Panel | Shows event categories and available tasks |
| Right Panel | Shows the tasks selected by the player |
| Top Status Bar | Shows current attributes, current month, and distance to graduation |

The left side contains category buttons:

- Entertainment
- Study
- Social

When the player chooses a category, the task list updates to show events from that category.

The middle area shows available tasks.  
Each task card contains:

- A small illustration
- Task name
- Card border and paper texture

The right side shows selected tasks.  
The player can select up to 3 planned events, and 1 random event will be added later.

### Design Notes

The task planning screen is designed like a physical planner.  
This supports the idea that the player is arranging their student life for the quarter.

The selected task area makes the player's choices clear.  
The empty slots show how many tasks still need to be selected.

### Suggested Interaction

- Player clicks a category on the left.
- Player chooses a task from the middle list.
- The selected task appears in the right panel.
- The selected counter updates, for example `0/4`, `1/4`, etc.
- The last slot can be used for the random event.

---

## 4. Attribute Status Bar

### Purpose

The attribute status bar shows the player's current condition at the top of the game interface.

### Layout Description
<img width="1104" height="77" alt="5bbc6571edb7be8d3280c7e27b2a96be" src="https://github.com/user-attachments/assets/a9db5a81-0984-4c4c-acc3-ffdd3401421e" />

The status bar displays three attributes:

| Attribute | Icon | Example Display |
|---|---|---|
| Intelligence | Brain icon | intelligence: good |
| Health | Heart icon | health: good |
| Wealth | Money icon | wealth: good |

### Design Notes

The use of icons helps the player understand the attributes quickly.  
The handwritten style makes the status bar feel like notes written in a planner.

The attributes are displayed as levels instead of exact numbers.  
This keeps the game more immersive and avoids making the UI look too technical.

Suggested level display:

| Hidden Value Range | Display Level |
|---:|---|
| 0–44 | Poor |
| 45–84 | Good / Average |
| 85–100 | Excellent |

---

## 5. Task Story Screen

### Purpose

The task story screen shows the result or story of a selected event.  
This is where the player experiences the event and makes a choice.

### Layout Description
<img width="1536" height="1024" alt="c846f9775312c9dfcc233d04e5cc21be" src="https://github.com/user-attachments/assets/2377c4d7-076d-4ed1-8484-406ac592dcfa" />

The screen uses the same notebook background.  
The task story is displayed on the left, while the event illustration is shown on the right.

Main elements:

| UI Element | Description |
|---|---|
| Task Title | Shows that the task is currently in progress |
| Story Text | Describes what is happening in the event |
| Character Illustration | Shows the activity visually |
| Choice Buttons | Allows the player to choose between two options |
| Attribute Bar | Shows current Intelligence, Health, and Wealth |

### Choice Design

Each event only has two choices:

| Choice | Meaning |
|---|---|
| Participate | The player takes part in the event |
| Skip | The player does not take part in the event |

The design example shows a gym event.  
The player can either go home directly or continue exercising.

### Design Notes

The task story screen should feel like a diary page.  
The player reads a short story and then chooses what to do.

The illustration on the right makes the event feel more concrete and memorable.

### Suggested Interaction

- Player reads the event description.
- Player chooses one of the two options.
- Attribute changes are applied.
- The game moves to the next task or the quarter summary screen.

---

## 6. Quarter Summary Screen

### Purpose

The quarter summary screen appears after the player completes all tasks in a quarter.  
It shows the player's progress and attribute changes.

### Layout Description
<img width="1536" height="1024" alt="6902ebf1ac495b03277c7a1d87b30eab" src="https://github.com/user-attachments/assets/f505da05-90bc-4415-8a73-0962bf31fce0" />

The screen is designed like a summary page in a planner.

Main elements:

| UI Element | Description |
|---|---|
| Quarter Summary Title | Shows this is the end of the current quarter |
| Calendar Icon | Shows the current month |
| Current Month | Displays the month number |
| Distance to Graduation | Shows how many months remain |
| Completed Tasks | Shows how many tasks were completed |
| Attribute Changes | Shows whether Intelligence, Health, and Wealth increased or decreased |
| Next Quarter Button | Allows the player to continue |

### Attribute Change Display

The screen uses arrows to show attribute changes:

| Icon | Meaning |
|---|---|
| Green up arrow | Attribute increased |
| Red down arrow | Attribute decreased |
| No arrow or flat symbol | Attribute did not change |

### Design Notes

This page helps the player understand the consequences of their choices.  
It works as feedback before the next quarter starts.

The summary should be clear and quick to read because the player will see this page multiple times.

---

## 7. Ending Result Screen

### Purpose

The ending result screen appears after the player completes all four quarters.  
It shows the final ending the player has achieved.

### Layout Description
<img width="1676" height="944" alt="512e48172fcfb4902b1cc851cac1905d" src="https://github.com/user-attachments/assets/2921b658-cc0d-4f83-9720-6acde17095f2" />

The ending screen uses a large paper panel placed on the notebook background.  
The left side contains the ending title and ending description.  
The lower area shows achievements unlocked during this playthrough.

Main elements:

| UI Element | Description |
|---|---|
| Ending Title | Displays the ending name |
| Ending Description | Explains the player's final result |
| Ranking List Button | Leads to ranking or collection information |
| Achievement Cards | Shows achievements unlocked in the playthrough |

### Design Notes

The ending page should feel like a final report or certificate.  
The player should clearly understand what kind of student life they created.

The achievement cards give extra reward feedback and encourage replay.

### Suggested Interaction

- Player views the ending.
- Player checks unlocked achievements.
- Player can enter the ending collection page.
- Player can replay to unlock different endings.

---

## 8. Ending Collection Screen
<img width="1672" height="941" alt="ending_result" src="https://github.com/user-attachments/assets/f918ec34-9097-45ac-8329-5bb0a4a34c12" />


### Purpose

The ending collection screen shows all endings in the game.  
Unlocked endings are visible, while locked endings are shown as hidden cards.

### Layout Description

The screen displays ending cards in a grid layout.

Each card contains:

| UI Element | Description |
|---|---|
| Ending Image | Illustration for the ending |
| Rank Badge | Shows the ending grade, such as S, A, or B |
| Ending Name | Shows the ending title |
| Lock Icon | Used for endings not yet unlocked |

### Collection Design

Unlocked endings show:

- Ending artwork
- Ending name
- Rank badge
- Visual highlight

Locked endings show:

- Grey or darkened card
- Lock icon
- Question mark
- Hidden ending name

### Design Notes

The collection page gives players a reason to replay the game.  
The locked cards make the player curious about other possible outcomes.

The design also supports the game's achievement and collection system.

### Suggested Display

```text
Endings Collected: 3 / 8
Achievements Unlocked: 7 / 20
```

This makes progress easy to understand.

---

## 9. Visual Style Guide

### Colour Palette

| Colour Type | Usage |
|---|---|
| Beige / Cream | Main notebook background |
| Brown | Buttons, banners, title panels |
| Dark Brown | Main text |
| Green | Positive changes or unlocked success |
| Red | Negative changes or health warning |
| Grey | Locked or unavailable content |

### Typography

The UI uses handwriting-style or soft rounded fonts.  
This supports the notebook and diary theme.

Recommended font feeling:

- Friendly
- Handwritten
- Easy to read
- Not too formal

### Components

Important reusable components include:

| Component | Usage |
|---|---|
| Paper Card | Used for task cards, ending cards, and panels |
| Brown Button | Used for main actions |
| Attribute Bar | Shows player status |
| Category Tabs | Used for Study, Entertainment, and Social categories |
| Selected Task Slot | Shows chosen events |
| Lock Card | Used for locked endings |
| Summary Panel | Used for quarter summary and ending result |

---

## 10. UI Flow

The full UI flow is:

```text
Start Screen
↓
Character Selection
↓
Quarter Task Planning
↓
Task Story Screen
↓
Quarter Summary
↓
Next Quarter Planning
↓
Repeat for 4 quarters
↓
Ending Result Screen
↓
Ending Collection Screen
```

The flow is designed to make the player feel like they are moving through one academic year.

---

## 11. Design Strengths

This UI design has several strengths:

1. The notebook theme matches the student-life topic.
2. The warm colours make the game feel friendly and personal.
3. The task planning page clearly supports the core gameplay.
4. The attribute bar is easy to understand.
5. The ending collection page gives players replay motivation.
6. The visual style is consistent across planning, story, summary, and ending screens.

---

## 12. Future Improvements

Possible future improvements include:

- Add hover effects for task cards
- Add small animation when a task is selected
- Add clearer selected-task feedback
- Add progress indicators for the four quarters
- Add tooltips for attribute levels
- Add locked ending hints in the ending collection
- Add mobile responsive layouts
- Add different illustrations for different event categories
