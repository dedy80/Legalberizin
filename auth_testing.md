# Auth Testing Playbook (Legalberizin.id)

Step 1 — MongoDB:
```
mongosh
use test_database
db.users.findOne({email:"admin@legalberizin.id"},{password_hash:1})
```
Hash harus diawali `$2b$`. Index: users.email (unique), login_attempts.identifier.

Step 2 — API:
```
API=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d= -f2)
curl -X POST $API/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@legalberizin.id","password":"Legal2026!Berizin"}'
# ambil token dari response
curl $API/api/auth/me -H "Authorization: Bearer <token>"
curl $API/api/consultations -H "Authorization: Bearer <token>"
```
Login salah harus 401; 5x salah → 429 lockout 15 menit; tanpa token → 401.
