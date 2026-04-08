# Add Your Photos Here!

To add your own photos that appear when you hover your cursor:

1. **Add your photos** to this `images` folder
2. **Name them** as: `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, etc. (up to `photo10.jpg`)
3. The photos will automatically appear with a popup message "moments from my journey"

## Supported Formats
- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`

## Tips
- Use square or portrait photos for best results
- Recommended size: 400x400px to 800x800px
- Keep file sizes reasonable (under 500KB each) for faster loading
- Photos are automatically dimmed (70% brightness) for a subtle, professional look

## Current Setup
The website is configured to use 10 photos:
- `photo1.jpg` through `photo10.jpg`

## Customizing the Popup Message
To change the popup message, edit `script.js` and find:
```javascript
const popupMessage = "moments from my journey";
```

Change it to whatever you'd like! Some suggestions:
- "snapshots of my story"
- "glimpses into my world"
- "captured moments"
