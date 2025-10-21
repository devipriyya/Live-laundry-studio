# 🎨 Rate Card Page - Visual Design Guide

## Page Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    🌈 HERO HEADER SECTION                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ✨ Premium Pricing Badge                            │   │
│  │  RATE CARD (Large Title)                            │   │
│  │  Transparent pricing for all your laundry needs     │   │
│  │                                    [Download PDF] →  │   │
│  └─────────────────────────────────────────────────────┘   │
│  Gradient: Blue → Purple → Indigo with animated blurs      │
└─────────────────────────────────────────────────────────────┘

┌───────────┬───────────┬───────────┬───────────┐
│ 🚚 FREE   │ ⏰ EXPRESS│ ⭐ QUALITY│ 🏷️ BULK  │
│ PICKUP &  │ SERVICE   │ GUARANTEE │ DISCOUNTS │
│ DELIVERY  │ Available │ 100%      │ 10% off   │
│ On ₹500+  │ +50%      │ satisfied │ 10+ items │
└───────────┴───────────┴───────────┴───────────┘
        4 Feature Cards (hover: lift effect)

┌─────────────────────────────────────────────────────┐
│ 🎯 SERVICE FILTER TABS (Interactive)                │
│ ┌────────┬────────┬────────┬────────┐             │
│ │ ✨ ALL │ 💧 WASH│ 🛡️ DRY │ 🔥 STEAM│             │
│ │ ACTIVE │  PRESS │  CLEAN │  PRESS │             │
│ └────────┴────────┴────────┴────────┘             │
└─────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────┐
│  CLOTHING (Blue Theme)   │  FORMAL WEAR (Purple)    │
│  ┌────────────────────┐  │  ┌────────────────────┐  │
│  │ 👔 Clothing        │  │  │ 🤵 Formal Wear     │  │
│  │ 6 items available  │  │  │ 4 items available  │  │
│  └────────────────────┘  │  └────────────────────┘  │
│  ┌─────────────────────────────────────┐            │
│  │ Item      │ Wash  │ Dry   │ Steam  │            │
│  ├─────────────────────────────────────┤            │
│  │ Shirt     │ ₹80   │ ₹150  │ ₹50    │            │
│  │ T-Shirt   │ ₹60   │ ₹120  │ ₹40    │            │
│  │ Trousers  │ ₹100  │ ₹180  │ ₹60    │            │
│  │ ...       │ ...   │ ...   │ ...    │            │
│  └─────────────────────────────────────┘            │
└──────────────────────────┴──────────────────────────┘

┌──────────────────────────┬──────────────────────────┐
│  BEDDING (Green Theme)   │  ETHNIC WEAR (Pink)      │
│  ┌────────────────────┐  │  ┌────────────────────┐  │
│  │ 🛏️ Bedding         │  │  │ 🥻 Ethnic Wear     │  │
│  │ 4 items available  │  │  │ 4 items available  │  │
│  └────────────────────┘  │  └────────────────────┘  │
│  (Similar table format)  │  (Similar table format)  │
└──────────────────────────┴──────────────────────────┘

┌──────────────────────────┬──────────────────────────┐
│  🏷️ SPECIAL OFFERS       │  ⭐ WHY CHOOSE FABRICSPA │
│  (Orange gradient)       │  (Blue gradient)         │
│  ✓ Express service +50%  │  ✓ Eco-friendly products │
│  ✓ Stain protection      │  ✓ Stain removal experts │
│  ✓ Bulk discount 10%     │  ✓ 24/7 support          │
│  ✓ Free delivery ₹500+   │  ✓ 100% guarantee        │
└──────────────────────────┴──────────────────────────┘

┌─────────────────────────────────────────────────────┐
│        🎯 CALL TO ACTION SECTION                    │
│  ┌─────────────────────────────────────────────┐   │
│  │  Ready to Get Started?                      │   │
│  │  Experience premium laundry care...         │   │
│  │                                             │   │
│  │  [Schedule Pickup]  [Contact Us]           │   │
│  └─────────────────────────────────────────────┘   │
│  Gradient: Blue → Purple → Indigo               │
└─────────────────────────────────────────────────────┘
```

## 🎨 Color Schemes by Section

### Hero Header
```
Background: linear-gradient(to right, #2563EB, #9333EA, #4F46E5)
Text: White (#FFFFFF)
Badge: White/20% opacity with backdrop blur
Accent: Yellow (#FBBF24) for sparkle icon
```

### Feature Cards
```
Background: White (#FFFFFF)
Icon Container: Blue-50 to Purple-50 gradient
Icon: Blue-600 (#2563EB)
Text: Gray-900 (#111827)
Hover: Shadow-xl + translate-y(-4px)
```

### Service Filter Tabs
```
Active Tab: Blue-600 to Purple-600 gradient, White text
Inactive: Gray-600 text, hover Gray-50 background
Border Radius: 12px (rounded-xl)
```

### Rate Cards - Color Themes

#### Clothing (Blue)
```
Header: Blue-500 (#3B82F6) to Cyan-500 (#06B6D4)
Pricing Badge (Wash): Green-100 bg, Green-700 text
Pricing Badge (Dry): Blue-100 bg, Blue-700 text
Pricing Badge (Steam): Purple-100 bg, Purple-700 text
```

#### Formal Wear (Purple)
```
Header: Purple-500 (#A855F7) to Pink-500 (#EC4899)
Same pricing badge pattern
```

#### Bedding (Green)
```
Header: Green-500 (#22C55E) to Emerald-500 (#10B981)
Same pricing badge pattern
```

#### Ethnic Wear (Pink)
```
Header: Pink-500 (#EC4899) to Rose-500 (#F43F5E)
Same pricing badge pattern
```

### Information Cards

#### Special Offers
```
Background: Yellow-50 via Orange-50 to Red-50
Icon Container: Yellow-400 to Orange-500 gradient
Title: Orange-600 to Red-600 gradient (text)
Checkmarks: Orange-600 (#EA580C)
```

#### Why Choose FabricSpa
```
Background: Blue-50 via Indigo-50 to Purple-50
Icon Container: Blue-500 to Purple-600 gradient
Title: Blue-600 to Purple-600 gradient (text)
Checkmarks: Blue-600 (#2563EB)
```

### Call to Action
```
Background: Blue-600 to Purple-600 to Indigo-600
Text: White with Blue-100 subtitle
Primary Button: White bg, Blue-600 text
Secondary Button: Transparent bg, White border & text
```

## 📐 Spacing & Sizing

### Typography Scale
```
Page Title: text-5xl (48px)
Section Headers: text-2xl (24px)
Card Titles: text-xl (20px)
Body Text: text-base (16px)
Small Text: text-sm (14px)
```

### Padding Scale
```
Hero Section: py-12 px-8 (48px vertical, 32px horizontal)
Cards: p-6 to p-8 (24px to 32px)
Buttons: px-8 py-4 (32px horizontal, 16px vertical)
Tables: py-4 px-4 (16px all around)
```

### Border Radius
```
Large Cards: rounded-3xl (24px)
Medium Cards: rounded-2xl (16px)
Buttons: rounded-2xl (16px)
Small Elements: rounded-xl (12px)
Badges: rounded-lg (8px)
```

### Shadow Elevations
```
Default: shadow-lg (medium elevation)
Hover: shadow-xl (high elevation)
Hero/CTA: shadow-2xl (dramatic elevation)
```

## 🎭 Animation Effects

### Hover States
```css
Cards: hover:-translate-y-1 (lift 4px)
Icons: hover:scale-110 (grow 10%)
Buttons: hover:scale-105 (grow 5%)
Shadows: transition from shadow-lg to shadow-xl
```

### Transition Timing
```
All transitions: 300ms duration
Easing: ease-in-out (default)
```

### Background Animations
```
Blur circles: Positioned absolute
Sizes: w-64 to w-96 (256px to 384px)
Blur intensity: blur-2xl to blur-3xl
Opacity: 10% to 20%
```

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Stacked filter tabs
- Full-width cards
- Buttons stack vertically
- Reduced padding
- Smaller typography

### Tablet (768px - 1024px)
- 2-column grid for features
- 1-column for rate cards
- Horizontal filter tabs
- Side-by-side buttons

### Desktop (> 1024px)
- 4-column grid for features
- 2-column grid for rate cards
- All tabs horizontal
- Maximum width container
- Full padding and spacing

## 🎯 Interactive Elements

### Clickable Elements
1. **Service Filter Tabs**: Change pricing display
2. **Download PDF Button**: Export rate card
3. **Schedule Pickup Button**: Navigate to booking
4. **Contact Us Button**: Open contact form

### Hover Effects
- All cards lift on hover
- Icons scale up
- Buttons show shadow increase
- Table rows highlight with gradient

## 📊 Data Display

### Pricing Format
```
Currency: Indian Rupee (₹)
Range: ₹40 - ₹600
Display: Color-coded badges
Format: ₹[amount]
```

### Table Structure
```
4 Columns (when all filters active):
- Item Name (left-aligned, bold)
- Wash & Press (green badge)
- Dry Clean (blue badge)
- Steam Press (purple badge)

Rows: Hover effect with gradient background
```

## 🎨 Visual Hierarchy

### Priority Levels
1. **Hero Title**: Largest, white, gradient bg
2. **Section Headers**: Large, bold, gradient text
3. **Card Titles**: Medium, white on colored bg
4. **Pricing**: Color badges for emphasis
5. **Body Text**: Regular, gray tones

### Emphasis Techniques
- Gradient backgrounds for importance
- Color coding for categorization
- Badges for pricing visibility
- Icons for quick recognition
- Whitespace for breathing room

---

This design creates a premium, professional, and user-friendly experience that encourages conversion while maintaining brand consistency with FabricSpa's high-end positioning.
