# 📦 SupplyChain: Enterprise Supply Chain Traceability Ledger

**HerbChain** is a professional MERN-stack solution designed to solve the "Trust Gap" in herbal logistics. By implementing a secure, role-based ledger, we provide 100% end-to-end visibility from the **Point of Collection** to **Warehouse Distribution**.

---

## ⛓️ The Traceability Flow
Our architecture mirrors the physical supply chain to ensure data integrity at every checkpoint:

1. **Extraction (Collector):** Digital logging of raw material origin (e.g., Premium Basmati Rice).
2. **Validation (Auditor):** Quality assurance checkpoints to verify botanical standards.
3. **Logistics (Warehouse):** Batching and inventory management for global distribution.

---

## 🏗️ Technical Architecture
We have deployed a **Decoupled Cloud Infrastructure** to ensure 99.9% uptime for the supply chain:

- **Frontend Interface:** React.js (High-performance UI deployed on **Vercel**).
- **Backend Processor:** Node.js & Express (Scalable API logic hosted on **Render**).
- **Cloud Vault:** MongoDB Atlas (Non-relational document storage for flexible SKU management).
- **Security Protocol:** JSON Web Tokens (JWT) for encrypted Role-Based Access Control (RBAC).

---

## 🌐 Live Logistics Dashboard
- **Production URL:** herbchain-gtn1.vercel.app
- **API Gateway:** https://herbchain-bf88.onrender.com

---

## 📂 Data Inventory Management
The system utilizes a dedicated production cluster to separate development logs from live supply chain data:

- **Cluster:** `Cluster0`
- **Primary Namespace:** `herbchain`
- **Core Data Collections:**
  - `📦 users`: Encrypted authentication for authorized personnel.
  - `📦 collections`: Raw material ledger (Origins and Collectors).
  - `📦 batches`: Processed batch logs for warehouse traceability.

---

## 🛠️ Installation & Field Setup
To initialize the ledger locally, configure your environment variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://.../herbchain
JWT_SECRET=your_secure_secret_key
