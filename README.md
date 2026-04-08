# Personal Website - Tech + Finance

A quirky, modern personal website with interactive cursor effects and smooth animations.

## Features

- **Interactive Landing Page**: 4 clickable icons leading to different sections
- **Cursor Effects**: Colorful gradient images appear as you move your mouse across the screen
- **Smooth Animations**: Modern transitions and hover effects throughout
- **Dark Theme**: Sleek dark design with vibrant accent colors
- **Responsive Design**: Works beautifully on all devices

## Sections

1. **About** - Learn about your background and interests
2. **Experience** - Timeline of your professional journey
3. **Goals** - Your aspirations and philosophy
4. **Projects** - Showcase your work

## Customization

### Update Your Information

Edit `index.html` to customize:
- Your name in the landing section
- About me content
- Experience timeline items
- Goals and aspirations
- Project cards

### Change Colors

Edit the CSS variables in `styles.css`:
```css
:root {
    --accent: #ff6b9d;           /* Main accent color */
    --accent-secondary: #4ecdc4; /* Secondary accent */
    --accent-tertiary: #ffe66d;  /* Tertiary accent */
}
```

### Adjust Cursor Effects

In `script.js`, you can modify:
- `imageSpawnInterval`: How often images appear (lower = more frequent)
- Image colors in `createAdditionalImages()` function
- Animation durations and effects

## Getting Started

1. Open `index.html` in your browser
2. Move your mouse around to see the cursor effects!
3. Click on the numbered icons to explore different sections

## Browser Support

Works best in modern browsers (Chrome, Firefox, Safari, Edge).

## Tips

- The cursor effects work best when you move your mouse around the page
- Hover over interactive elements for enhanced effects
- Use the back button to return to the landing page from any section

Enjoy your new website! 🚀
