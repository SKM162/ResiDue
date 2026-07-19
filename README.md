# ResiDue
Track your dues and residues, financially.

App structure:
```
residue/
├── public/
│   └── workers/
│       └── pdf.worker.js         # The background extraction thread
├── src/
│   ├── core/
│   │   ├── crypto.js             # AES-GCM encryption/decryption engine
│   │   ├── storage.js            # IndexedDB + Local Backup orchestration
│   │   └── parser.js             # Row processing & validation logic
│   ├── components/
│   │   ├── atoms/                # Input, Button, SecureField, Typography
│   │   ├── molecules/            # FileDropZone, PasswordPrompt, MetricCard
│   │   └── organisms/            # TransactionTable, SidebarNav
│   ├── views/
│   │   ├── UploadView.jsx        # File ingestion & key derivation screen
│   │   └── DashboardView.jsx     # Analytics & historical ledger screen
│   └── App.jsx                   # Main shell, CSP implementation, & state
```
