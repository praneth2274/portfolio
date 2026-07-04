# 🌐 Praneth S - Personal Portfolio

A modern, responsive, and interactive personal portfolio website built using **HTML, CSS, JavaScript**, and a **Node.js + Express backend**. The portfolio showcases my education, technical skills, certifications, projects, and provides a fully functional contact form with email notifications.

---

## 🚀 Live Features

- 🎨 Modern UI with Dark Theme
- 📱 Fully Responsive Design
- ✨ Smooth Animations & Scroll Effects
- ⌨️ Typing Animation
- 📖 About Me Section
- 🎓 Education Timeline
- 💻 Technical Skills
- 🚀 Projects Showcase
- 🏆 Certifications
- 📬 Contact Form
- 📧 Automatic Email Notification
- 📩 Auto Reply Email to Visitors
- 💾 SQLite Database Integration
- ⚡ REST API Backend
- ❤️ Clean and Organized Code

---

# 🛠️ Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Responsive Design
- CSS Animations

## Backend

- Node.js
- Express.js
- SQLite3
- Nodemailer
- CORS
- Dotenv

---

# 📂 Project Structure

```
Portfolio/
│
├── frontend/
│   ├── praneth_portfolio.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── messages.db
│   ├── .env
│   └── node_modules/
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/praneth-portfolio.git
```

```bash
cd praneth-portfolio
```

---

## Install Dependencies

```bash
npm install
```

---

## Create Environment File

Create a `.env` file.

Example:

```env
PORT=3001

GMAIL_USER=yourgmail@gmail.com

GMAIL_PASS=YourAppPassword
```

> **Note:** Use a Gmail App Password instead of your Gmail account password.

---

## Run Backend

```bash
node server.js
```

or

```bash
npm start
```

Backend will run at

```
http://localhost:3001
```

---

## Open Frontend

Open

```
praneth_portfolio.html
```

in your browser.

---

# 📬 Contact API

## POST

```
POST /api/contact
```

Stores visitor messages in SQLite and sends email notifications.

### Example JSON

```json
{
  "name":"John",
  "email":"john@gmail.com",
  "subject":"Portfolio",
  "message":"Nice portfolio!"
}
```

---

## GET

```
GET /api/messages
```

Returns all saved messages.

---

## Health Check

```
GET /api/health
```

Returns

```json
{
   "status":"ok"
}
```

---

# 💾 Database

SQLite database automatically stores:

- Name
- Email
- Subject
- Message
- Timestamp

---

# 📧 Email Features

When someone submits the contact form:

✅ Message saved to SQLite

✅ Email notification sent to Portfolio Owner

✅ Automatic Thank You email sent to Visitor

---

# 📸 Screenshots

Add screenshots here

```
Home Page

About Section

Projects

Contact Form

Mobile View
```

---

# 🎯 Future Improvements

- Admin Dashboard
- Authentication
- Blog Section
- Resume Download Analytics
- GitHub API Integration
- Project Filtering
- Dark/Light Mode Toggle
- Visitor Analytics
- Deployment on Vercel/Render
- AI Chat Assistant

---

# 👨‍💻 Author

**Praneth S**

B.Tech Information Technology Student

📧 Email: spraneth38@gmail.com

🌍 Tamil Nadu, India

---

# ⭐ Support

If you like this project,

⭐ Star this repository

🍴 Fork it

📢 Share it with others

---

# 📜 License

This project is licensed under the MIT License.

---

## 💡 Made with ❤️ by Praneth S
