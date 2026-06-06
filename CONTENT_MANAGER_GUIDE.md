# Content Manager Feature Guide

## Overview

The Content Manager is a secure, feature-rich question management system for Marksprint that allows authorized users to create, edit, and manage quiz questions with full CRUD operations, persistent storage, and CSV import/export capabilities.

## Features

### 1. Security & Access Control

#### Password Protection
- **Password:** Configured by the site administrator via environment variables. Do NOT commit passwords or secrets to the repository.
- **Character-by-character input**: Each character has its own box for precise input
- **Real-time validation**: 
  - Green boxes = Correct character in correct position
  - Red boxes = Incorrect character
- **Auto-navigation**: Automatically moves to the next box when you type
- **Backspace support**: Backspace moves to the previous box
- **Arrow key navigation**: Left/Right arrows move between boxes

#### Attempt Limiting & Lockout
- **Maximum attempts**: 3 incorrect password attempts
- **Lockout duration**: 30 minutes after 3 failed attempts
- **Lockout timer**: Displays countdown in minutes and seconds
- **Persistent lockout**: Lockout state is saved in browser localStorage
- **Desktop-only access**: Content Manager is blocked on mobile/tablet devices

### 2. Content Manager Interface

#### Layout
The Content Manager has a three-panel layout:

1. **Left Panel - Subjects**
   - List of all available subjects
   - Click to select a subject
   - Add new subjects with "+ADD SUBJECT" button
   - Delete subjects (removes all associated questions)
   - Default subjects: Physics, Chemistry, Maths, Computer Science, Biology, English, Tamil

2. **Middle Panel - Lessons**
   - Shows lessons available for the selected subject
   - Click to select a lesson
   - Add new lessons with "+ADD LESSON" button
   - Lessons are created on-demand when adding questions

3. **Main Panel - Questions**
   - Displays all questions for the selected subject, lesson, and volume
   - Shows question text, options, and correct answer
   - Edit and Delete buttons for each question
   - "+ADD QUESTION" button at the bottom

#### Volume Selector
- Located at the top of the main panel
- Choose between Volume 1 and Volume 2
- Questions are organized by volume for better management

#### CSV Operations
- **Export CSV**: Downloads questions as a CSV file
- **Import CSV**: Uploads questions from a CSV file
- CSV format supports: question, options (1-4), answer, lesson, volume, and images

### 3. Question Management

#### Adding Questions
1. Select a subject from the left panel
2. Select or create a lesson in the middle panel
3. Choose the volume (1 or 2)
4. Click "+ADD QUESTION"
5. Fill in the question editor form

#### Question Editor Features
- **Question Text**: Main question content (required)
- **Question Image**: Optional image for the question
- **Options A-D**: 
  - Text for each option
  - Optional images for each option
  - At least one option must be provided
- **Correct Answer**: Select which option is correct (required)
- **Image Upload**: Click "Upload Image" to add images
- **Save/Update**: Saves the question to localStorage
- **Cancel**: Discards changes and returns to the list

#### Editing Questions
1. Click the Edit button (pencil icon) on any question
2. Modify the question, options, or answer
3. Click "Update Question" to save changes
4. Changes are automatically saved to localStorage

#### Deleting Questions
1. Click the Delete button (trash icon) on any question
2. Confirm the deletion
3. Question is immediately removed

### 4. Data Persistence

#### localStorage Storage
- All questions are stored in browser localStorage
- Storage key: `contentManagerData`
- Includes: subjects, questions, and last updated timestamp
- Survives browser refresh and closing

#### Cross-Device Sync
- **Important**: LocalStorage is device-specific
- To sync across devices, use CSV export/import:
  1. Export questions as CSV from one device
  2. Import the CSV on another device
  3. Questions will be merged with existing data

#### Data Structure
```javascript
{
  subjects: ["Physics", "Chemistry", ...],
  questions: [
    {
      id: "unique_id",
      subject: "Physics",
      lesson: "1",
      volume: "1",
      question: "Question text",
      option_1: "Option A",
      option_2: "Option B",
      option_3: "Option C",
      option_4: "Option D",
      answer: "Option A",
      question_image: "data:image/...",
      option_1_image: "data:image/...",
      createdAt: "2024-06-02T...",
      updatedAt: "2024-06-02T..."
    }
  ],
  lastUpdated: "2024-06-02T..."
}
```

### 5. CSV Import/Export

#### Export Format
- Exports questions for the selected subject, lesson, and volume
- Columns: question, option_1, option_2, option_3, option_4, answer, lesson, vol, question_image, option_1_image, option_2_image, option_3_image, option_4_image
- Images are stored as base64 data URLs

#### Import Format
- CSV file must have the same column structure as exports
- Supports partial data (not all columns required)
- Images can be included as base64 data URLs or omitted
- Imported questions are merged with existing data

#### Example CSV Row
```
"What is 2+2?","3","4","5","6","4","1","1","","","","",""
```

### 6. Workflow Examples

#### Example 1: Adding Physics Questions
1. Click "Content Manager" button on About page
2. Enter password: `.Sreeh@r!462`
3. Select "Physics" from left panel
4. Create new lesson "1" in middle panel
5. Select "Volume 1" from top dropdown
6. Click "+ADD QUESTION"
7. Enter question details and click "Save Question"
8. Repeat for more questions

#### Example 2: Editing Existing Questions
1. Navigate to Content Manager
2. Select subject, lesson, and volume
3. Click Edit (pencil icon) on the question
4. Modify the content
5. Click "Update Question"

#### Example 3: Exporting to CSV
1. Select subject, lesson, and volume
2. Click "Export CSV"
3. File downloads as `{Subject}_{Lesson}_{Volume}.csv`
4. Open in Excel or text editor to verify

#### Example 4: Importing from CSV
1. Select subject, lesson, and volume
2. Click "Import CSV"
3. Choose a CSV file from your computer
4. Questions are imported and merged with existing data

## Technical Details

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Blocked (desktop-only)

### Storage Limits
- localStorage typically has 5-10MB limit per domain
- Each image stored as base64 increases data size
- Monitor browser console for storage quota warnings

### Performance Notes
- Large numbers of questions (1000+) may cause slight UI lag
- Consider splitting into multiple lessons for better performance
- CSV import/export is fast even for large datasets

## Troubleshooting

### Locked Out
- Wait 30 minutes for automatic unlock
- Or clear browser localStorage for the domain
- Or use private/incognito window for fresh access

### Questions Not Saving
- Check browser console for errors (F12)
- Verify localStorage is enabled
- Check available storage space

### Images Not Displaying
- Ensure images are uploaded correctly
- Check browser console for errors
- Try re-uploading the image

### CSV Import Issues
- Verify CSV format matches export structure
- Check for encoding issues (use UTF-8)
- Ensure all required columns are present

## Security Notes

⚠️ **Important**: 
- Password is stored in client-side code (visible in source)
- This is suitable for internal/educational use only
- For production, implement server-side authentication
- Do not use for sensitive data

## Future Enhancements

Potential improvements for future versions:
- Server-side storage for cross-device sync
- User authentication system
- Question versioning and history
- Bulk operations (edit multiple questions)
- Advanced search and filtering
- Question analytics and usage tracking
- Backup and restore functionality
- Collaborative editing

## Support

For issues or questions:
1. Check this guide first
2. Review browser console for error messages
3. Try clearing localStorage and starting fresh
4. Contact the development team with error details

---

**Last Updated**: June 2, 2024
**Version**: 1.0
**Status**: Production Ready
