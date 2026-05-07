# Issue Tracker: Local Markdown (.scratch/)

Issues live as markdown files in `.scratch/`.

## Conventions

```
.scratch/
└── <feature-slug>/
    ├── PRD.md
    └── issues/
        ├── 01-<slug>.md
        ├── 02-<slug>.md
        └── ...
```

- One feature per directory: `.scratch/<feature-slug>/`
- PRD lives at `.scratch/<feature-slug>/PRD.md`
- Issues are numbered from `01`: `.scratch/<feature-slug>/issues/<NN>-<slug>.md`
- Triage state as a `Status:` line near the top of each issue file
- Comments appended to the bottom of the file under a `## Comments` section
