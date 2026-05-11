# Global-Gate: Enterprise AI Agriculture Trade Hub 🌍🌾

**Global-Gate** is a state-of-the-art SaaS platform designed to revolutionize international agricultural trade. By combining **Gemini 2.5/3.1 Multimodal AI** with **Post-Quantum Cryptography (PQC)**, we provide a secure, automated pipeline for product grading, regulatory compliance, and market intelligence.

---

## ✨ Key Features

### 1. AI Vision Lab (Multimodal Inspection) 📸
- **Instant Grading**: Upload product photos (Ginger, Capsicum, Coffee, etc.) for instant quality assessment.
- **Defect Detection**: Automated identification of physical defects or substandard batches.
- **Documentation Engine**: Automatically generates a checklist of mandatory paperwork (Phytosanitary certificates, MRL reports) based on the product and target destination.

### 2. Intelligent Trade Corridors 🗺️
- **Dynamic Route Management**: Add, edit, and delete international trade routes.
- **Regulatory Mapping**: Real-time insights into tariffs, standards, and border alerts for specific countries (e.g., UAE, Germany, USA).
- **Market Intelligence**: Get AI-driven suggestions on high-demand markets and global production leaders.

### 3. Sovereign Audit Trail (Quantum-Safe) 🛡️
- **PQC Digital Signatures**: Every human approval is signed using Post-Quantum Cryptography (ML-KEM/Dilithium) to ensure long-term integrity against future quantum attacks.
- **Immutable Logging**: A transparent, cryptographically-backed history of every AI analysis and manager decision.

### 4. Layman-Friendly Onboarding 💡
- **Concept Explorer**: Easy-to-understand explanations of complex trade concepts like "PQC Security" and "AI Grading" for non-technical stakeholders.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **AI Engine**: Google Gemini (Flash & Pro series)
- **Security**: Post-Quantum Cryptography (via `jose` & Custom PQC Service)
- **Styling**: Vanilla CSS (Premium Dark/Light Glassmorphism)

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 20+ 
- PostgreSQL database (Local or Cloud)
- Google AI Studio API Key (Gemini)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Global-gate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgres://user:password@localhost:5432/globalgate"
   JWT_SECRET="your-secure-secret"
   GEMINI_API_KEY="your-gemini-api-key"
   PQC_SECRET="your-pqc-signing-secret"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏗️ Project Structure

- `/src/app`: Next.js routes and layouts.
- `/src/actions`: Server Actions for CRUD and logic.
- `/src/services`: Core logic for AI (Gemini) and PQC Signing.
- `/src/components`: Premium UI components and design system.
- `/prisma`: Database schema and seeding scripts.

---

## 🛡️ Security Note
Global-Gate uses **Hybrid Post-Quantum Cryptography**. All sensitive approval tokens are signed using algorithms resilient to "Harvest Now, Decrypt Later" attacks.

---

## 📄 License
Enterprise Edition - Global-Gate 2024.
