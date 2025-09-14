

# PitchPro - Personalized Website Pitches

PitchPro is a client-side web application that helps you create personalized website pitches for potential clients. Import your contacts, customize portfolio mockups, and prepare personalized email pitches all in one place.

## Features

- **Contact Management**: Import CSV files containing prospect information (firstName, lastName, email, industry, linkedinUrl, bio)
- **Search & Filter**: Quickly find contacts by name or industry
- **Portfolio Preview**: Live preview of a personalized portfolio website that updates as you edit contact information
- **Email Templates**: Generate personalized email pitches with editable subject and body
- **Screenshot Capture**: Capture portfolio previews as PNG images for email attachments
- **Email Sending**: Send pitch emails via your default email client
- **Local Storage**: All data is stored locally in your browser

## How to Use

### 1. Import Contacts
- Click "Import CSV" to upload your contact list
- Use the sample CSV format below to structure your data
- Contacts will be displayed in a table with their status (Sent/Ready)

### 2. Select and Edit a Contact
- Click on any contact in the table to select them
- Edit their information in the form on the left
- The portfolio preview will update in real-time
- Use "Reset to Original" to revert changes

### 3. Customize the Portfolio
- The portfolio preview updates automatically as you edit contact details
- The hero section displays the contact's name and industry
- The about section uses the bio field
- Contact information is linked throughout

### 4. Prepare Your Email
- Switch to the "Email Preview" tab
- Customize the subject and body of your pitch
- The email template automatically includes personalized content
- A placeholder indicates where the portfolio screenshot will be attached

### 5. Send Your Pitch
- Click "Send Pitch Email" to open your default email client
- The portfolio screenshot will be automatically downloaded for manual attachment
- The contact's status will be updated to "Sent"

## Sample CSV Format

```csv
firstName,lastName,email,industry,linkedinUrl,bio
John,Smith,john.smith@techcorp.com,Technology,https://linkedin.com/in/johnsmith,"Senior Software Engineer with 10 years experience"
Sarah,Johnson,sarah.j@marketing.co,Marketing,https://linkedin.com/in/sarahjohnson,"Digital marketing specialist focusing on B2B growth"
Michael,Brown,m.brown@consulting.biz,Consulting,https://linkedin.com/in/michaelbrown,"Business consultant helping startups scale"
```

## File Structure

```
├── index.html          # Main application HTML
├── style.css          # Stylesheet for the application
├── script.js          # JavaScript functionality
└── README.md          # This file
```

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with animations and responsive design
- **Vanilla JavaScript**: No external libraries or frameworks
- **Web APIs**: LocalStorage, FileReader, Canvas
- **Google Fonts**: Urbanist font family for the portfolio template

## Setup Instructions

1. **Download the Files**
   - Save all files (index.html, style.css, script.js) in the same directory

2. **Open the Application**
   - Open `index.html` in your web browser
   - No server or installation required - runs entirely client-side

3. **Import Your Contacts**
   - Click "Download Sample" to get the CSV template
   - Fill in your contact information
   - Click "Import CSV" to upload your contacts

## Portfolio Template Integration

The portfolio template has been seamlessly integrated into PitchPro:

- **Hero Section**: Displays the contact's name and industry
- **About Section**: Uses the bio field from the contact form
- **Services Section**: Fixed services that showcase web development offerings
- **Contact Section**: Displays the contact's email with a mailto link
- **Responsive Design**: Adapts to different screen sizes
- **Color Themes**: Includes multiple color themes (green, red, blue, purple)

The portfolio preview updates in real-time as you edit contact information, providing an immediate visual representation of the personalized website you're pitching.

## Browser Compatibility

PitchPro works in all modern browsers that support:
- LocalStorage
- FileReader API
- Canvas API
- CSS Grid and Flexbox

## Limitations

- **Screenshot Capture**: The screenshot functionality is simplified. For production use, consider integrating a library like html2canvas for more reliable screenshot generation.
- **Email Sending**: Uses the mailto protocol which requires manual attachment of screenshots. For automated email sending, consider integrating with an email service like EmailJS.

## Contributing

Feel free to submit issues or enhancement requests. This is a client-side application, so contributions should focus on improving the user experience, adding new features, or fixing bugs.

## License

This project is open source and available under the MIT License.
