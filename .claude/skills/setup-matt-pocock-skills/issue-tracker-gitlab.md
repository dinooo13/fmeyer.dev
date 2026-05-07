# Issue Tracker: GitLab Issues

Issues live as GitLab Issues. Use the `glab` CLI.

## Conventions

```bash
# Create
glab issue create --title "..." --description "..."

# Read
glab issue view <number> --comments

# List
glab issue list -F json

# Comment (GitLab calls comments "notes")
glab issue note <number> --message "..."

# Add label
glab issue update <number> --label "label-name"

# Remove label
glab issue update <number> --unlabel "label-name"

# Close (post note first, then close)
glab issue note <number> --message "..."
glab issue close <number>
```

## Merge requests

```bash
glab mr create
glab mr view <number>
glab mr note <number> --message "..."
```
