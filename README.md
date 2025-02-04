# Realtime Feedback

Realtime Feedback is a web-based application that allows users to receive anonymous feedback securely. It provides authentication, email verification, AI-assisted feedback suggestions, and real-time dashboard updates.

## 🚀 Features
- 🔑 **User Registration & Authentication**  
  - Sign up using an email or a unique username (checked in real-time).  
  - Secure authentication via NextAuth (Google & username-based login).  

- 📧 **Email OTP Verification**  
  - OTP is sent via **Resend** for user verification.  

- 📊 **Dashboard**  
  - Displays received feedback messages in real-time.  
  - Users can **delete** feedback messages.  

- 📮 **Public URL for Feedback**  
  - Each user gets a **unique shareable link** to receive feedback anonymously.  

- 🤖 **AI-Assisted Suggestions**  
  - OpenAI generates feedback message templates on the public feedback page.  

- ⚙️ **Feedback Management**  
  - Users can **disable message acceptance** at any time.  

- 🔒 **Security**  
  - Only authenticated users can access & modify their feedback messages.  

---

## 🛠️ Tech Stack
- **Frontend:** Next.js (TypeScript), Tailwind CSS, shadcn UI  
- **Backend:** Node.js, Express  
- **Database:** MongoDB (Aggregation Pipeline)  
- **Authentication:** NextAuth/Auth.js (Google & username-based login)  
- **Email Service:** Resend (OTP verification)  
- **AI Integration:** OpenAI API (feedback message suggestions)  
- **Real-time Updates:** WebSockets or polling  

---

## 📜 System Flowchart  
_(Flowchart will be Posted Soon)_  

---

## 📸 Screenshots  

1. **Login Page**  
   ![Login Page](path/to/image1.png)  

2. **Dashboard**  
   ![Dashboard](path/to/image2.png)  

3. **Feedback Submission Page**  
   ![Feedback Submission Page](path/to/image3.png)  

4. **Settings Page**  
   ![Settings Page](path/to/image4.png)  

_(Image will be updated very soon.)_  

---

## 📦 Installation & Setup

### 🔧 Prerequisites
- **Node.js** (>= 16.x)  
- **MongoDB Database**  

### 🚀 Steps to Run Locally

1️⃣ **Clone the repository:**  
   ```bash
   git clone <repo-url>
   cd realtime-feedback
   ```

2️⃣ **Install dependencies:**  
   ```bash
   npm install
   ```

3️⃣ **Set up environment variables (`.env` file):**  
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   MONGODB_URI=your-mongodb-uri
   RESEND_API_KEY=your-resend-key
   OPENAI_API_KEY=your-openai-key
   ```

4️⃣ **Run the development server:**  
   ```bash
   npm run dev
   ```

5️⃣ **Visit the application:**  
   ```
   http://localhost:3000
   ```

---

## 📜 API Endpoints

| Method | Endpoint                  | Description |
|--------|---------------------------|-------------|
| `POST` | `/api/auth/signup`       | Register a new user |
| `POST` | `/api/auth/signin`          | User login |
| `POST` | `/api/verify`     | OTP verification via Resend |
| `GET`  | `/api/dashboard`            | Fetch all feedback messages |
| `POST` | `/api/publicUrl*`            | Submit feedback message |
| `DELETE` | `/api/dashboard/:id`      | Delete a feedback message |

---

## 🔒 Security & Authentication  
- Authentication is handled using **NextAuth.js**.  
- The backend is protected, ensuring only authenticated users can access their feedback.  
- Username uniqueness is checked in **real-time**.    

---

## ⭐ Contributing  
Feel free to contribute to the project by submitting issues or pull requests!  

---

## 🙌 Acknowledgements  
- **Next.js** for the frontend framework  
- **MongoDB** for the database  
- **Resend** for email-based OTP verification  
- **OpenAI API** for AI-suggested feedback messages  
- **shadcn UI & Tailwind CSS** for styling  
