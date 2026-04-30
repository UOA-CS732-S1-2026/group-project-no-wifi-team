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

1. Happly endings
2. Bad endings
3. Open endings
4. Best Ending

# 4. Ending List

## Ending 1: Perfect All-Rounder

**Chinese Name:** 全能留学生  
**Ending Type:** Best Ending

### Trigger Condition

| Intelligence | Health | Wealth |
|---:|---:|---:|
| ≥ 85 | ≥ 85 | ≥ 85 |

### Description

You managed to balance study, health, and money throughout the year.  
You did not just survive international student life — you mastered it.

### Chinese Explanation

你学习优秀，身体状态好，钱也管理得不错。  
这是最理想的结局，代表玩家在学习、健康和财富三个方面都发展得很好。

### Unlock Text

You became the ideal international student: capable, healthy, and financially stable.

---

## Ending 2: Academic Star

**Chinese Name:** 学术之星  
**Ending Type:** Study Ending

### Trigger Condition

| Intelligence | Health | Wealth |
|---:|---:|---:|
| ≥ 85 | ≥ 45 | Any |

### Description

Your hard work paid off.  
You achieved excellent academic results and became a reliable student in your course.

### Chinese Explanation

你的智力很高，而且健康没有崩溃。  
这代表玩家成功走出了学霸路线。

### Unlock Text

You became known as a hardworking student. Your academic performance opened more opportunities for your future.

---

## Ending 3: Burnout Student

**Chinese Name:** 过劳留学生  
**Ending Type:** Warning Ending

### Trigger Condition

| Intelligence | Health |
|---:|---:|
| ≥ 85 | < 45 |

### Description

You pushed yourself too hard.  
Your grades were strong, but your body and mind could not keep up with the pressure.

### Chinese Explanation

你学习很好，但是健康太差。  
这个结局体现了“成绩高但身体崩了”的风险。

### Unlock Text

You achieved strong results, but the cost was too high. The year ended with exhaustion instead of celebration.

---

## Ending 4: Part-Time Hustler


## 5. Ending Gallery Design

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
