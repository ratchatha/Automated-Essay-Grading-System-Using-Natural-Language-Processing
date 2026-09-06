# Anonymized demo data

The JSON exports in this directory contain demonstration data only.

`anonymize-database.ps1` replaces student IDs, names, plaintext passwords, and
submission timestamps in `Students.json` and `mydb.studentAnswers.json` with
deterministic synthetic values. It preserves departments, scores, answers,
exam content, and MongoDB reference fields so the existing data shape remains
usable by the application.

The script does not create a mapping back to the original identities. Run it
from the repository root with:

```powershell
./Database/anonymize-database.ps1
```
