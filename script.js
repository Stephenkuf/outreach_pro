// Global Variables
let contactsData = []
let selectedContact = null
let originalContact = null
let sentEmails = []
let updateTimeout = null
// Initialize App
document.addEventListener('DOMContentLoaded', function () {
	loadFromStorage()
	updatePreviews()
})
// Local Storage Functions
function saveToStorage() {
	localStorage.setItem('pitchpro_contacts', JSON.stringify(contactsData))
	localStorage.setItem('pitchpro_sent', JSON.stringify(sentEmails))
}
function loadFromStorage() {
	const savedContacts = localStorage.getItem('pitchpro_contacts')
	const savedSent = localStorage.getItem('pitchpro_sent')
	if (savedContacts) {
		contactsData = JSON.parse(savedContacts)
		populateContactsTable()
	}
	if (savedSent) {
		sentEmails = JSON.parse(savedSent)
	}
}
// Toast Notifications
function showToast(message, type = 'success') {
	const toast = document.getElementById('toast')
	toast.textContent = message
	toast.className = `toast ${type}`
	toast.classList.add('show')
	setTimeout(() => {
		toast.classList.remove('show')
	}, 3000)
}
// CSV Import Functions
function importCSV() {
	document.getElementById('csvFileInput').click()
}
function handleCSVFile(event) {
	const file = event.target.files[0]
	if (!file) return
	const reader = new FileReader()
	reader.onload = function (e) {
		try {
			parseCSV(e.target.result)
		} catch (error) {
			showToast('Error reading CSV file. Please check the format.', 'error')
		}
	}
	reader.readAsText(file)
}
function parseCSV(csvText) {
	const lines = csvText.trim().split('\n')
	if (lines.length < 2) {
		showToast('CSV file must contain headers and at least one row of data.', 'error')
		return
	}
	const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''))
	const data = []
	for (let i = 1; i < lines.length; i++) {
		const values = parseCSVLine(lines[i])
		if (values.length >= 3) {
			// At minimum need firstName, lastName, email
			const contact = {}
			headers.forEach((header, index) => {
				contact[header] = values[index] || ''
			})
			// Validate required fields
			if (contact.firstName && contact.lastName && contact.email) {
				data.push(contact)
			}
		}
	}
	if (data.length === 0) {
		showToast('No valid contacts found in CSV. Check required fields: firstName, lastName, email.', 'error')
		return
	}
	contactsData = data
	populateContactsTable()
	saveToStorage()
	showToast(`Successfully imported ${data.length} contacts!`)
}
function parseCSVLine(line) {
	const values = []
	let current = ''
	let inQuotes = false
	for (let i = 0; i < line.length; i++) {
		const char = line[i]
		if (char === '"') {
			inQuotes = !inQuotes
		} else if (char === ',' && !inQuotes) {
			values.push(current.trim())
			current = ''
		} else {
			current += char
		}
	}
	values.push(current.trim())
	return values.map((v) => v.replace(/"/g, ''))
}
function downloadSampleCSV() {
	const sampleData = [
		'firstName,lastName,email,industry,linkedinUrl,bio',
		'John,Smith,john.smith@techcorp.com,Technology,https://linkedin.com/in/johnsmith,Senior Software Engineer with 10 years experience',
		'Sarah,Johnson,sarah.j@marketing.co,Marketing,https://linkedin.com/in/sarahjohnson,Digital marketing specialist focusing on B2B growth',
		'Michael,Brown,m.brown@consulting.biz,Consulting,https://linkedin.com/in/michaelbrown,Business consultant helping startups scale',
	].join('\n')
	const blob = new Blob([sampleData], { type: 'text/csv' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = 'sample_contacts.csv'
	a.click()
	URL.revokeObjectURL(url)
}
// Contact Table Functions
function populateContactsTable() {
	const tbody = document.getElementById('contactsTableBody')
	tbody.innerHTML = ''
	contactsData.forEach((contact, index) => {
		const row = tbody.insertRow()
		row.onclick = () => selectContact(index)
		row.className = selectedContact === index ? 'selected' : ''
		const fullName = `${contact.firstName} ${contact.lastName}`
		const isSent = sentEmails.some((sent) => sent.email === contact.email)
		row.innerHTML = `
                    <td>${fullName}</td>
                    <td>${contact.industry || 'N/A'}</td>
                    <td>${contact.email}</td>
                    <td>${isSent ? '<span class="sent-badge">Sent</span>' : ''}</td>
                `
	})
}
function filterContacts() {
	const searchTerm = document.getElementById('searchInput').value.toLowerCase()
	const rows = document.querySelectorAll('#contactsTableBody tr')
	rows.forEach((row) => {
		const text = row.textContent.toLowerCase()
		row.style.display = text.includes(searchTerm) ? '' : 'none'
	})
}
function selectContact(index) {
	selectedContact = index
	originalContact = { ...contactsData[index] }
	populateForm(contactsData[index])
	populateContactsTable()
	document.getElementById('sendEmailBtn').disabled = false
}
// Form Functions
function populateForm(contact) {
	document.getElementById('firstName').value = contact.firstName || ''
	document.getElementById('lastName').value = contact.lastName || ''
	document.getElementById('email').value = contact.email || ''
	document.getElementById('industry').value = contact.industry || ''
	document.getElementById('bio').value = contact.bio || ''
	document.getElementById('customMessage').value = contact.customMessage || ''
	updatePreviews()
}
function resetForm() {
	if (originalContact) {
		populateForm(originalContact)
		showToast('Form reset to original data.')
	}
}
// Update Functions (with debouncing)
function updatePreviews() {
	clearTimeout(updateTimeout)
	updateTimeout = setTimeout(() => {
		updateDomainPitch()
		updatePortfolioPreview()
		updateEmailPreview()
	}, 300)
}
function updateDomainPitch() {
	const firstName = document.getElementById('firstName').value.toLowerCase()
	const lastName = document.getElementById('lastName').value.toLowerCase()
	const domain = firstName && lastName ? `${firstName}${lastName}.dev` : ''
	document.getElementById('domainPitch').value = domain
}
function updatePortfolioPreview() {
	const firstName = document.getElementById('firstName').value
	const lastName = document.getElementById('lastName').value
	const email = document.getElementById('email').value
	const industry = document.getElementById('industry').value
	const bio = document.getElementById('bio').value
	const domain = document.getElementById('domainPitch').value

	// Update portfolio elements
	document.getElementById('heroName').textContent = firstName && lastName ? `${firstName.toUpperCase()} ${lastName.toUpperCase()}` : 'YOUR NAME'
	document.getElementById('heroRole').textContent = industry ? `${industry.toUpperCase()} PROFESSIONAL` : 'PROFESSIONAL'

	// Update about section
	const aboutDescription = document.getElementById('aboutDescription')
	if (aboutDescription) {
		const firstParagraph = aboutDescription.querySelector('p:first-child')
		if (firstParagraph) {
			firstParagraph.textContent =
				bio || `I'm a passionate ${industry || 'professional'} who specializes in creating unique digital experiences that push the boundaries of what's possible on the web.`
		}
	}

	// Update contact section
	const contactEmail = document.getElementById('contactEmail')
	if (contactEmail) {
		contactEmail.textContent = email || 'CONTACT@EXAMPLE.COM'
		contactEmail.href = `mailto:${email || 'contact@example.com'}`
	}

	const ctaButton = document.getElementById('ctaButton')
	if (ctaButton) {
		ctaButton.href = `mailto:${email || 'contact@example.com'}`
	}
}
function updateEmailPreview() {
	const firstName = document.getElementById('firstName').value
	const industry = document.getElementById('industry').value
	const customMessage = document.getElementById('customMessage').value
	const domain = document.getElementById('domainPitch').value
	// Update email subject
	document.getElementById('email-subject').textContent = `Custom Website Proposal for ${firstName || '[Name]'}`
	// Update email body
	const defaultMessage = "I'd love to build a custom portfolio for you: modern design, integrated with your industry needs."
	const emailBody = `Hi ${firstName || '[Name]'},
As a ${industry || '[Industry]'} expert, your LinkedIn profile caught my eye—imagine showcasing it on a sleek personal site like ${domain || '[domain]'}!
${customMessage || defaultMessage}
Check out this quick mockup: [Screenshot Placeholder]
Let's chat—reply or book here: [your calendar link].
Best,
Your Name
Web Dev Pro`
	document.getElementById('email-body').textContent = emailBody
}
// Tab Functions
function switchTab(tabName) {
	// Remove active class from all tabs and content
	document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'))
	document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'))
	// Add active class to selected tab and content
	event.target.classList.add('active')
	document.getElementById(`${tabName}-tab`).classList.add('active')
}
// Email Functions
function sendPitchEmail() {
	if (selectedContact === null) {
		showToast('Please select a contact first.', 'error')
		return
	}
	const firstName = document.getElementById('firstName').value
	const lastName = document.getElementById('lastName').value
	const email = document.getElementById('email').value
	if (!firstName || !lastName || !email) {
		showToast('Please fill in all required fields.', 'error')
		return
	}
	// Email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email)) {
		showToast('Please enter a valid email address.', 'error')
		return
	}
	// Confirmation dialog
	if (!confirm(`Send pitch email to ${firstName} ${lastName} at ${email}?`)) {
		return
	}
	try {
		// Capture screenshot (simplified approach)
		capturePortfolioScreenshot()
			.then(() => {
				// Create mailto link
				const subject = encodeURIComponent(`Custom Website Proposal for ${firstName}`)
				const body = encodeURIComponent(document.getElementById('email-body').textContent + '\n\n[Portfolio mockup would be attached - setup email service for auto-attachment]')
				const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`
				// Open email client
				window.open(mailtoLink)
				// Mark as sent
				markAsSent(email)
				showToast(`Email opened for ${firstName} ${lastName}!`)
			})
			.catch((error) => {
				console.error('Screenshot capture failed:', error)
				showToast('Email client opened (screenshot capture not available)', 'error')
				// Fallback - still open email client
				const subject = encodeURIComponent(`Custom Website Proposal for ${firstName}`)
				const body = encodeURIComponent(document.getElementById('email-body').textContent)
				window.open(`mailto:${email}?subject=${subject}&body=${body}`)
				markAsSent(email)
			})
	} catch (error) {
		console.error('Send email error:', error)
		showToast('Error sending email. Please try again.', 'error')
	}
}
function capturePortfolioScreenshot() {
	return new Promise((resolve, reject) => {
		try {
			// Simple canvas-based screenshot alternative
			// Note: This is a simplified version. For production, consider html2canvas library
			const portfolioElement = document.querySelector('.portfolio-preview-container')
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			// Set canvas size
			canvas.width = portfolioElement.offsetWidth * 2 // 2x for quality
			canvas.height = portfolioElement.offsetHeight * 2
			// This is a placeholder - real screenshot would require html2canvas
			// For now, we'll just resolve to indicate the attempt was made
			setTimeout(() => resolve(), 100)
		} catch (error) {
			reject(error)
		}
	})
}
function markAsSent(email) {
	const sentRecord = {
		email: email,
		date: new Date().toISOString(),
	}
	// Remove existing record for this email
	sentEmails = sentEmails.filter((sent) => sent.email !== email)
	// Add new record
	sentEmails.push(sentRecord)
	saveToStorage()
	populateContactsTable()
}
// Utility Functions
function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}
