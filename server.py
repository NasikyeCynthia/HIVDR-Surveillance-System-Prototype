from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

DIST = (Path(__file__).parent / "dist").resolve()
app = FastAPI()

# Future backend routes go here, before the catch-all, e.g. @app.get("/api/patients")

app.mount("/assets", StaticFiles(directory=DIST / "assets"), name="assets")

@app.get("/{path:path}")
def spa(path: str):
    f = (DIST / path).resolve()
    if path and f.is_file() and DIST in f.parents:
        return FileResponse(f)
    return FileResponse(DIST / "index.html")  # lets React Router handle /patients, /review, etc.