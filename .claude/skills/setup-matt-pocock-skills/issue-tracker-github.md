# Issue Tracker: GitHub Issues

Issues live as GitHub Issues. Use the `gh` CLI.

## Conventions

```bash
# Create
gh issue create --title "..." --body "..."

# Read
gh issue view <number> --comments

# List (open issues as JSON)
gh issue list --state open --json number,title,body,labels,comments

# Comment
gh issue comment <number> --body "..."

# Add label
gh issue edit <number> --add-label "label-name"

# Remove label
gh issue edit <number> --remove-label "label-name"

# Close with comment
gh issue close <number> --comment "..."
```
