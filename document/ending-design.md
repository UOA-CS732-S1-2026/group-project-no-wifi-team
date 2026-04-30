# Ending Design

## 1. Purpose

The ending system is used to show the final result of the player's international student life.  
After four quarters, the game checks the player's final attributes and unlocks one ending.

The three core attributes are:

| Attribute | Meaning |
|---|---|
| Intelligence | Study ability, academic preparation, planning skills, and career readiness |
| Health | Physical condition, mental state, lifestyle balance, and stress level |
| Wealth | Money management, savings, part-time work, and future financial opportunity |

Although the game can display attribute levels as `Poor`, `Average`, and `Excellent`, the internal values can still use hidden numbers from 0 to 100.

## 2. Attribute Level Range

| Hidden Value Range | Display Level |
|---:|---|
| 0–44 | Poor |
| 45–84 | Average |
| 85–100 | Excellent |

The exact value does not need to be shown to the player.  
The player only sees the level, while the game logic uses the hidden value to decide the ending.

## 3. Ending Priority Rules

Some endings should have higher priority than others.  
For example, if Health is extremely low, the player should receive a health-related ending even if Intelligence is high.

Recommended priority order:

1. Critical failure endings
2. Special high-achievement endings
3. Single-attribute dominant endings
4. Balanced endings
5. Normal ending

## 4. Ending List

### Ending 1: Academic Star

**Theme:** Excellent academic outcome.

| Requirement |
|---|
| Intelligence ≥ 85 |
| Health ≥ 45 |

**Story Description:**  
You worked hard throughout the year and managed to achieve strong academic results.  
Even though the year was stressful, you kept enough balance to complete your study successfully.

**Player Feeling:**  
This is a positive study-focused ending.

**Suggested Unlock Text:**  
You became known as a reliable and hardworking student. Your academic performance opened more opportunities for your future.

---

### Ending 2: Burnout Student

**Theme:** High academic pressure but poor health.

| Requirement |
|---|
| Intelligence ≥ 85 |
| Health < 45 |

**Story Description:**  
You pushed yourself too hard. Your grades improved, but your body and mental state could not keep up with the pressure.

**Player Feeling:**  
This is a warning ending. It shows that academic success without health balance can be risky.

**Suggested Unlock Text:**  
You achieved strong results, but the cost was too high. The year ended with exhaustion instead of celebration.

---

### Ending 3: Healthy Lifestyle Master

**Theme:** Strong health and stable lifestyle.

| Requirement |
|---|
| Health ≥ 85 |
| Intelligence ≥ 45 |

**Story Description:**  
You built a healthy routine, managed stress well, and kept a positive lifestyle during your international student life.

**Player Feeling:**  
This is a positive life-balance ending.

**Suggested Unlock Text:**  
You learned that studying abroad is not only about grades. A healthy routine helped you survive and grow.

---

### Ending 4: Broke but Survived

**Theme:** Low wealth but still able to continue.

| Requirement |
|---|
| Wealth < 45 |
| Health ≥ 45 |

**Story Description:**  
Money was always tight. You had to save carefully, avoid unnecessary spending, and make difficult choices.

**Player Feeling:**  
This ending is realistic and slightly bittersweet.

**Suggested Unlock Text:**  
You did not have much money left, but you learned how to survive with limited resources.

---

### Ending 5: Part-time Hustler

**Theme:** Strong wealth from work and money management.

| Requirement |
|---|
| Wealth ≥ 85 |
| Health ≥ 45 |

**Story Description:**  
You made strong financial progress through part-time work, budgeting, or career opportunities.  
However, balancing money, study, and rest was not always easy.

**Player Feeling:**  
This is a positive money-focused ending.

**Suggested Unlock Text:**  
You became good at managing your living costs. Your financial situation became one of your biggest strengths.

---

### Ending 6: Social Butterfly

**Theme:** Good health and moderate overall progress.

| Requirement |
|---|
| Health ≥ 75 |
| Intelligence ≥ 45 |
| Wealth ≥ 45 |

**Story Description:**  
You built friendships, joined activities, and slowly became more comfortable in the new environment.

**Player Feeling:**  
This is a warm and positive social-life ending.

**Suggested Unlock Text:**  
Your international student life was not perfect, but the people you met made the journey meaningful.

---

### Ending 7: Balanced Graduate

**Theme:** Stable and balanced development.

| Requirement |
|---|
| Intelligence ≥ 65 |
| Health ≥ 65 |
| Wealth ≥ 65 |

**Story Description:**  
You did not focus only on one area. You managed study, health, and money carefully throughout the year.

**Player Feeling:**  
This is one of the best general endings.

**Suggested Unlock Text:**  
You completed the year with a balanced lifestyle. It was not always easy, but you made steady progress in every area.

---

### Ending 8: Ordinary International Student

**Theme:** Normal completion.

| Requirement |
|---|
| No special ending condition is met |

**Story Description:**  
Your year was ordinary but real. You had some good moments, some stressful moments, and many small lessons.

**Player Feeling:**  
This is the default ending.

**Suggested Unlock Text:**  
You finished the year as a normal international student. It was not legendary, but it was your own story.

---

### Ending 9: Crisis Year

**Theme:** Multiple attributes are low.

| Requirement |
|---|
| At least two attributes < 45 |

**Story Description:**  
This year became difficult in many ways. Study, health, and money problems started to affect each other.

**Player Feeling:**  
This is a failure or bad ending.

**Suggested Unlock Text:**  
The year became overwhelming. You survived, but many problems were left unresolved.

---

### Ending 10: Perfect All-Rounder

**Theme:** Very strong overall performance.

| Requirement |
|---|
| Intelligence ≥ 85 |
| Health ≥ 85 |
| Wealth ≥ 85 |

**Story Description:**  
You achieved a rare balance of academic success, strong health, and financial stability.

**Player Feeling:**  
This is the highest achievement ending.

**Suggested Unlock Text:**  
You became the ideal international student: capable, healthy, and financially stable.

## 5. Achievement Design

The game can also unlock achievements separately from endings.

| Achievement | Unlock Condition |
|---|---|
| Study Machine | Choose many Study events across the year |
| Life Balance | Keep all three attributes at Average or above |
| Money Saver | Reach Wealth ≥ 85 |
| Health First | Reach Health ≥ 85 |
| Academic Focus | Reach Intelligence ≥ 85 |
| Risky Lifestyle | Let Health drop below 30 |
| Social Explorer | Choose several Social events |
| Random Survivor | Complete all four random events |
| First Ending | Unlock any ending |
| Ending Collector | Unlock multiple endings in the ending gallery |

## 6. Ending Gallery Design

The ending gallery should show:

- Total number of endings obtained
- Total number of achievements obtained
- Locked and unlocked ending cards
- Ending title
- Ending image or icon
- Ending description after unlocked
- Locked placeholder before unlocked

Suggested display:

| Status | Display |
|---|---|
| Unlocked | Ending title, artwork, description, unlock condition or story summary |
| Locked | Question mark icon, hidden title, short hint |

Example locked hint:

> This ending is connected to high Intelligence and poor Health.

## 7. Design Notes

The ending system should make the player feel that their choices matter.  
If the player chooses too many Study events, Intelligence should rise but Health may drop.  
If the player chooses too many Entertainment events, Health may improve but Intelligence or Wealth may suffer.  
If the player chooses Social events, the result should be more mixed, improving adaptation, career chances, or emotional state.

The final ending should feel like a natural result of the player's quarterly planning.
