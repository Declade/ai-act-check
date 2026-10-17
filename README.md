# EU AI Act risk-class check (GitHub Action)

Put a short description of your AI system in your repo. On every push this action maps it to the EU AI Act (Regulation (EU) 2024/1689): Article 5 prohibited practices, Annex III high-risk areas, Article 50 transparency duties and Articles 53 / 55 for general-purpose AI models. It writes a summary card into the job, sets outputs you can use in later steps, and writes a badge file.

It runs the open-source [`@lucairn/ai-act-classifier`](https://github.com/Declade/lucairn-ai-act-classifier) engine, bundled into this action. There is no install step.

**Informational tool — not legal advice.** It is a keyword rules engine, not a lawyer. Read [What it is and is not](#what-it-is-and-is-not) before you rely on a result.

Try it in the browser first: [lucairn.eu/en/tools/ai-act-classifier](https://lucairn.eu/en/tools/ai-act-classifier).

## Usage

1. Add `ai-system.md` to the root of your repo: a few plain sentences on what the system does, who uses it and what it decides.
2. Add `.github/workflows/ai-act.yml`:

```yaml
name: EU AI Act check
on: [push, pull_request]
permissions:
  contents: read
jobs:
  ai-act:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: Declade/ai-act-check@v1
```

The result shows up as a card on the run's summary page.

For production workflows, pin the action to a full commit SHA instead of the movable `v1` tag (GitHub's own hardening advice), e.g. `uses: Declade/ai-act-check@<40-character commit SHA> # v1.0.0`; the SHA of each release is listed on the [releases page](https://github.com/Declade/ai-act-check/releases).

Prefer YAML? Use `ai-act.yml` instead of `ai-system.md`; the action picks it up automatically:

```yaml
description: |
  TalentSift screens CVs and ranks job applicants for open positions.
```

## Inputs

| Input | Default | What it does |
|---|---|---|
| `path` | `ai-system.md` | The description file: Markdown, or YAML with a top-level `description:` field. When left at the default and `ai-system.md` is missing, `ai-act.yml` (then `ai-act.yaml`) is used. HTML comments in Markdown are ignored. Limit 64 KiB. Must be a regular file inside the workspace, given as a relative path; symlinks are refused. |
| `lang` | `en` | `en` or `de`. The engine matches against that language's lexicon only. If the text looks like the other language, the action prints a warning. |
| `fail-on` | `none` | `none`, `prohibited`, or `high-risk`. Fails the step when that class is found. `high-risk` also fails on `prohibited`. |
| `badge-path` | `.github/ai-act-badge.json` | Where to write the badge JSON, relative to the workspace. Set to `''` to skip. The action never commits it. The path must stay inside the workspace; symlinks, `.git` paths and an existing file that is not a badge written by this action are refused. |

## Outputs

| Output | Example |
|---|---|
| `risk-class` | `prohibited`, `high-risk`, `transparency`, `gpai`, or `no-trigger` (machine values; `prohibited`, `high-risk` and `transparency` mean a keyword match, shown to people as "possible …") |
| `triggered` | `{"article_5":[],"annex_iii":["Annex III point 4(a)"],"article_50":[],"gpai":[]}` |
| `badge-path` | absolute path of the badge JSON, empty when skipped |
| `engine-version` | the bundled engine version, e.g. `0.4.0` |

When more than one class fires, this tool reports Article 5 first, then Annex III, then Article 50, then Articles 53 / 55. `triggered` lists everything that fired.

The summary card shows the class, each Article 5 letter / Annex III point / Article 50 paragraph that fired with the matched phrases and an EUR-Lex link, a note under a finding when the text appears to deny it ("Found, but the text appears to deny it — please check"; the class does not change), the obligations the engine lists for a possible high-risk result (Articles 10, 12–15, Article 11 / Annex IV), the caveats below, a "Share this result" link to the browser tool, and the engine version.

```yaml
      - id: aiact
        uses: Declade/ai-act-check@v1
        with:
          fail-on: prohibited
      - run: echo "Class is ${{ steps.aiact.outputs.risk-class }}"
```

## Badge

The action writes a [shields.io endpoint](https://shields.io/badges/endpoint-badge) file, for example:

```json
{ "schemaVersion": 1, "label": "EU AI Act", "message": "possible high-risk", "color": "orange" }
```

The message is the risk class only: `possible prohibited practice`, `possible high-risk`, `possible transparency obligation`, `GPAI`, or `no trigger found` (grey).

shields.io needs to fetch that file from a public URL, so you publish it yourself. The simplest way is to commit it on pushes to your default branch:

```yaml
name: EU AI Act badge
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  badge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: Declade/ai-act-check@v1
      - name: Commit the badge file if it changed
        run: |
          git add .github/ai-act-badge.json
          if git diff --cached --quiet; then exit 0; fi
          git -c user.name="github-actions[bot]" -c user.email="41898282+github-actions[bot]@users.noreply.github.com" \
            commit -m "chore: update EU AI Act badge"
          git push
```

Then add this to your README (replace `OWNER/REPO` and `main`):

```markdown
![EU AI Act](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/OWNER/REPO/main/.github/ai-act-badge.json)
```

For a private repo, write the file to a public gist or another public location instead; shields.io cannot read private files.

## What it is and is not

- **A deterministic keyword rules engine.** It matches your wording against a curated lexicon. A description that avoids the lexicon's vocabulary can miss a trigger, and negated or unusual wording can be misread. Write the description in plain words about what the system does.
- **98.8% on 71 test cases** measures consistency with the curated lexicon, not real-world accuracy.
- **Not legal advice.** Use it as a starting point; verify with your DPO and qualified counsel before acting on any classification.
- **A keyword match is not a final classification:** Article 6(3) and Article 5 exceptions are not assessed. That is why the card and badge say "possible high-risk" and "possible prohibited practice".
- **"No trigger found" is not a clean bill of health.** It means no lexicon phrase matched. It never says that no obligation applies, and this action never calls a system "compliant" or "minimal risk".
- **EUR-Lex links** open the full regulation; the article is named next to each link.
- **The classification itself makes no network requests and reads no tokens.** Its results, the file path and the matched phrases appear in the job summary and logs, which GitHub stores as usual. The action only uses the engine's deterministic path; the engine's optional LLM mode is left out of the bundle, and `dist/index.js` contains no network code. The bundle is run with the main Node network APIs blocked in tests, and the tests check that none was attempted.
- **Negated wording is flagged, not hidden.** When the text appears to deny a matched phrase ("does not use social scoring"), the card says so under that finding; the class stays the same, so a real trigger is never dropped.

## How it is built

- `src/` is the action; `dist/index.js` is the bundle GitHub runs (built with esbuild, committed, checked in CI against a fresh build).
- **Engine pin:** one line, `"@lucairn/ai-act-classifier"` in `package.json` `dependencies`, an exact version. To bump it: `npm install --save-exact @lucairn/ai-act-classifier@<version> && npm run build && npm test`, then commit `package.json`, `package-lock.json` and `dist/`.
- The engine's citation table and rule data are not in its package exports. The build takes them from the published npm package (MIT) — the citation table is inlined into `dist/index.js`, the rule data is copied to `dist/engine/` with the engine's licence. `dist/licenses.txt` lists every bundled package with its licence.
- CI runs the action on three synthetic descriptions in `samples/` and checks the classes, compares them with the published CLI, and checks that no output contains "compliant" or "konform".

## Deutsch

Legen Sie eine kurze Beschreibung Ihres KI-Systems als `ai-system.md` (oder `ai-act.yml` mit einem Feld `description:`) ins Repository und binden Sie die Action ein:

```yaml
      - uses: actions/checkout@v7
      - uses: Declade/ai-act-check@v1
        with:
          lang: de
```

Die Action ordnet die Beschreibung der KI-Verordnung (EU) 2024/1689 zu (Artikel 5, Anhang III, Artikel 50, Artikel 53 / 55), schreibt eine Ergebniskarte in den Job, setzt die Ausgaben `risk-class` und `triggered` und schreibt eine Badge-Datei. Die Einordnung selbst stellt keine Netzwerkanfragen und liest keine Tokens. Ergebnis, Dateipfad und gefundene Phrasen erscheinen in der Job-Zusammenfassung und im Log, die GitHub wie üblich speichert.

**Informationswerkzeug — keine Rechtsberatung.** Deterministische Schlüsselwort-Regel-Engine: Eine Beschreibung, die das Vokabular des Lexikons vermeidet, kann einen Auslöser verfehlen. Die 98,8 % auf 71 Testfällen messen die Konsistenz mit dem kuratierten Lexikon, nicht die Genauigkeit in der realen Welt. Ein Stichwort-Treffer ist keine abschließende Einstufung: Ausnahmen nach Artikel 6 Absatz 3 und Artikel 5 werden nicht geprüft. „Kein Auslöser gefunden“ heißt nur, dass kein Begriff aus dem Lexikon gefunden wurde. Scheint der Text einen Treffer zu verneinen, steht unter dem Treffer „Gefunden, aber der Text scheint es zu verneinen — bitte prüfen“; die Einordnung ändert sich dadurch nicht.

Im Browser ausprobieren: [lucairn.eu/de/tools/ai-act-classifier](https://lucairn.eu/de/tools/ai-act-classifier).

## Licence

MIT — see [LICENSE](LICENSE). Engine: [`@lucairn/ai-act-classifier`](https://github.com/Declade/lucairn-ai-act-classifier) (MIT).
