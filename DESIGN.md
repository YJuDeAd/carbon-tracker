# Design System & UI Specifications: Carbon Footprint Tracker

## 1. Core Principles

- **Positive Framing:** Focus on progress, potential, and achievements. Avoid guilt-based messaging (e.g., reframe "You emitted 50kg too much" to "You have an opportunity to save 50kg this week!").
- **Simplicity & Speed:** Logging workflows must be completed in under 3 interactions. The UI should feel lightweight and frictionless.
- **Mobile-First:** Ensure all layouts are optimized for touch interactions (minimum 44x44px hit areas) and smaller viewports.
- **Engaging & Dynamic:** Use micro-interactions, subtle animations (like progress bar fills and badge unlocking), and vibrant colors to make sustainability feel rewarding.

---

## 2. Design Tokens

### Color Palette (Green-Focused, Accessible)
- **Primary:**
  - `primary-500`: `#22c55e` (Emerald Green) — Primary actions, progress, positive reinforcement.
  - `primary-600`: `#16a34a` — Hover states and pressed states.
  - `primary-100`: `#dcfce7` — Subtle backgrounds, active tabs, highlighting.
- **Neutral:**
  - `neutral-900`: `#171717` — Primary text, headings.
  - `neutral-600`: `#525252` — Secondary text, descriptions, placeholders.
  - `neutral-100`: `#f5f5f5` — Page backgrounds (for apps that use off-white backgrounds to let white cards pop).
  - `white`: `#ffffff` — Card backgrounds, modals, dropdowns.
- **Accent:**
  - `accent-blue`: `#3b82f6` — Informational badges, travel/transport themes.
  - `accent-yellow`: `#eab308` — Streaks, goals, achievements, and energy themes.
- **Destructive (Use sparingly!):**
  - `destructive-500`: `#ef4444` — Only for critical actions like account deletion. Do *not* use to denote high emissions or "bad" habits.

### Typography
- **Primary Font:** `Inter` or `Geist` (clean, modern sans-serif).
- **Headings:** Bold, tight tracking. `h1` (32px), `h2` (24px), `h3` (20px).
- **Body:** Readable, standard line-height (1.5). `body` (16px), `small` (14px).

### Spacing & Sizing
- **Spacing Scale:** 4px (`1`), 8px (`2`), 16px (`4`), 24px (`6`), 32px (`8`), 48px (`12`).
- **Radii:** Use rounded corners heavily for a friendly, approachable feel. `rounded-xl` (12px) for cards, `rounded-2xl` (16px) for modals, `rounded-full` for buttons.

---

## 3. Global Component Inventory

- **Buttons:** 
  - *Solid (Primary):* Green background, white text.
  - *Outline (Secondary):* Green border, transparent background, green text.
  - *Ghost (Tertiary):* Transparent, text only.
- **Cards:** White background, `rounded-xl`, subtle drop shadow (`shadow-sm` or `shadow-md`), no harsh borders.
- **Bottom Navigation Bar:** Mobile-first sticky navigation featuring icons for Dashboard, Log, Insights, and Profile.
- **Progress Bars:** Thick, rounded bars. Used for daily targets and long-term goals.
- **Category Badges:** Small pill-shaped tags with icons (🥗 Food, 🚗 Transport, ⚡ Energy, 🛍️ Shopping, ✈️ Travel).

---

## 4. Screen Specifications

### 4.1. Onboarding / Baseline Calculator
- **Purpose:** Gather initial user data to set a baseline footprint without overwhelming them.
- **Layout Specs:** Single-column, stepped wizard layout. Full height with a sticky bottom action bar ("Next" / "Finish").
- **Component Inventory:**
  - `StepIndicator`: Visual dots or a top progress bar showing remaining steps.
  - `ImageCardSelect`: Large, tap-friendly visual cards for selecting typical habits (e.g., "Meat Lover" vs. "Plant-Based").
  - `SliderInput`: For selecting estimated weekly commute distances.
- **Interaction Notes:** Smooth slide transitions between steps. Instant positive reinforcement upon completion ("You're all set! Let's start making an impact.").

### 4.2. Home Dashboard
- **Purpose:** Provide an at-a-glance view of current progress, recent activity, and quick actions.
- **Layout Specs:** Scrollable vertical layout with a padded container.
- **Component Inventory:**
  - `HeroMetric`: Big, bold number showing the current week's footprint vs. baseline, framed positively (e.g., "You're 15% below your baseline!").
  - `QuickLogGrid`: A prominent 2x2 grid or horizontal row of buttons to log common activities fast (e.g., "Add Meal", "Add Trip").
  - `WeeklyTrendChart`: Recharts Area chart (soft green fill) showing daily progress over the week.
  - `RecentActivityList`: A compact list of the last 3 logged items with icons.
- **Interaction Notes:** Pull-to-refresh capability. Tapping a quick log button instantly opens a Bottom Sheet (Drawer) to keep the user in context.

### 4.3. Log Activity
- **Purpose:** Quick and seamless data entry for the 5 emission categories.
- **Layout Specs:** If accessed via primary navigation, a tabbed view or grid selector. If accessed via Dashboard Quick Log, rendered as a Bottom Sheet (`Drawer`).
- **Component Inventory:**
  - `CategoryTabs`: Swipeable or clickable horizontal tabs to switch between Food, Transport, Energy, Shopping, and Travel.
  - `SmartInput`: Auto-suggesting text input (e.g., searching for "Chicken Salad") or a large numeric keypad for entering distance/amounts.
  - `UnitToggle`: Segmented control for toggling units (miles vs km).
- **Interaction Notes:** The primary input should auto-focus. A successful log triggers a subtle confetti animation or success toast, and immediately returns the user to the Dashboard (meeting the <3 interactions rule).

### 4.4. Insights & Recommendations
- **Purpose:** Display Groq AI-generated tips and deep dives into user data.
- **Layout Specs:** Feed-style vertical layout.
- **Component Inventory:**
  - `InsightCard`: Distinct visual style (e.g., a subtle gradient border or a sparkle ✨ icon) to denote AI-generated content. Contains a title, 2-3 concise/actionable tips, and a "Try this" button.
  - `CategoryBreakdownChart`: Recharts Donut chart showing the proportion of emissions by category.
- **Interaction Notes:** Tips can be swiped away to "dismiss" or saved. The donut chart supports tap-to-highlight for specific categories.

### 4.5. Goals & Challenges
- **Purpose:** Drive long-term engagement through gamification.
- **Layout Specs:** Two main sections or tabs: "My Goals" and "Challenges".
- **Component Inventory:**
  - `StreakWidget`: Prominent top widget displaying the current daily logging streak with a flame 🔥 or leaf 🌿 icon.
  - `GoalCard`: Shows the goal title, deadline, and a thick progress bar.
  - `BadgeGrid`: A grid of locked (greyscale) and unlocked (colorful, glowing) achievement badges.
- **Interaction Notes:** Unlocking a badge or completing a goal triggers a full-screen, celebratory overlay.

### 4.6. Profile & Settings
- **Purpose:** Manage account details, preferences, and view all-time statistics.
- **Layout Specs:** Standard list/menu view with grouping.
- **Component Inventory:**
  - `UserAvatar`: Circular profile picture placeholder with user's name and join date.
  - `SettingsList`: Grouped rows with toggle switches (`Switch` component) and standard chevron links (Theme, Units, Notifications).
  - `AllTimeStats`: A grid of lifetime metrics (e.g., "Total Logs", "Best Streak").
- **Interaction Notes:** Simple, native-feeling slide transitions. Toggles provide immediate haptic/visual feedback.
